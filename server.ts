import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Initialize express app
const app = express();
const PORT = 3000;

// Enable JSON middleware with generous limits
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API client safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized.");
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini API client:", error);
}

// In-memory data store with disk persistence backup
const DATA_FILE_PATH = path.join(process.cwd(), "beeguard_data.json");

interface Telemetry {
  temperature: number;      // °C (Brood nest target is ~34.5°C)
  humidity: number;         // % (Target is ~50-60%)
  weight: number;           // kg (hive total weight)
  battery: number;          // % (0-100)
  solarVoltage: number;     // V (0-6)
  batteryVoltage: number;   // V (0-4.2)
  beeActivity: number;      // Hz or Index (0-100, where 70-80 is high foraging, 90+ is swarming excitement)
  soundLevel: number;       // dB (0-100, 40-50 normal, 75+ queenless roar or swarming buzz)
  tilt: boolean;            // true if tilted (accelerometer alert)
  opened: boolean;          // true if lid opened (light sensor/switch alert)
  signalStrength: number;   // dBm (-120 to -30, with -50 excellent, -95 poor)
}

interface InspectionLog {
  id: string;
  date: string;
  queenSeen: boolean;
  broodStatus: "excellent" | "moderate" | "poor" | "none";
  eggsSeen: boolean;
  honeyRating: number;      // 1-5 scale
  framesCount: number;      // 1-10 frames
  diseasesSeen: string;     // e.g. "None", "Varroa mites detected"
  treatmentApplied: string; // e.g. "Apivar", "Formic Pro", "None"
  notes: string;
  images: string[];         // base64 or placeholder URLs
}

interface Hive {
  id: string;
  name: string;
  apiary: string;           // Apiary name, e.g., "Meadow Apiary"
  gps: { lat: number; lng: number };
  firmwareVersion: string;
  queenStatus: string;      // "Marked Yellow", "Unmarked", "Virgin", "Not Seen", "None"
  lastSync: string;
  createdTime: string;
  telemetry: Telemetry;
  inspections: InspectionLog[];
  alerts: {
    id: string;
    timestamp: string;
    type: string;
    priority: "low" | "medium" | "critical";
    title: string;
    message: string;
    recommendation: string;
    resolved: boolean;
  }[];
}

interface AppState {
  hives: Hive[];
}

// Initial mockup data for premium showcase
const defaultState: AppState = {
  hives: [
    {
      id: "hive-alpha",
      name: "Ruche Alpha (Bois de chêne)",
      apiary: "Rucher de la Vallée d'Or",
      gps: { lat: 37.7749, lng: -122.4194 },
      firmwareVersion: "v2.5.1-OTA",
      queenStatus: "Marquée en Jaune (2025)",
      lastSync: new Date().toISOString(),
      createdTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      telemetry: {
        temperature: 34.6,
        humidity: 54.2,
        weight: 48.8,
        battery: 92,
        solarVoltage: 4.8,
        batteryVoltage: 3.9,
        beeActivity: 82,
        soundLevel: 44,
        tilt: false,
        opened: false,
        signalStrength: -65
      },
      inspections: [
        {
          id: "insp-1",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          queenSeen: true,
          broodStatus: "excellent",
          eggsSeen: true,
          honeyRating: 4,
          framesCount: 8,
          diseasesSeen: "Aucune",
          treatmentApplied: "Aucun",
          notes: "La chambre d'incubation est extrêmement pleine. Les abeilles sont actives et douces. Excellent flux de nectar provenant des ronces.",
          images: []
        }
      ],
      alerts: [
        {
          id: "alert-1",
          timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          type: "weather_warning",
          priority: "medium",
          title: "Alerte de vent fort",
          message: "Des rafales de vent de 45 km/h sont prévues au Rucher de la Vallée d'Or.",
          recommendation: "Assurez-vous que la Ruche Alpha est bien sanglée et que le couvercle supérieur est lesté de manière sécurisée.",
          resolved: false
        }
      ]
    },
    {
      id: "hive-beta",
      name: "Ruche Bêta (Bosquet de pins)",
      apiary: "Rucher de la Vallée d'Or",
      gps: { lat: 37.7833, lng: -122.4167 },
      firmwareVersion: "v2.5.1-OTA",
      queenStatus: "Carnolienne non marquée",
      lastSync: new Date().toISOString(),
      createdTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      telemetry: {
        temperature: 33.1,
        humidity: 62.1,
        weight: 32.4,
        battery: 78,
        solarVoltage: 4.1,
        batteryVoltage: 3.8,
        beeActivity: 45,
        soundLevel: 68,
        tilt: false,
        opened: false,
        signalStrength: -78
      },
      inspections: [
        {
          id: "insp-2",
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          queenSeen: false,
          broodStatus: "moderate",
          eggsSeen: true,
          honeyRating: 3,
          framesCount: 5,
          diseasesSeen: "Varroa mineur (estimé à 1%)",
          treatmentApplied: "Gel Apiguard appliqué",
          notes: "Reine non vue mais des œufs frais sont visibles. Le couvain semble régulier mais un peu plus petit que celui de la Ruche Alpha.",
          images: []
        }
      ],
      alerts: [
        {
          id: "alert-2",
          timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          type: "varroa_alert",
          priority: "low",
          title: "Traitement Varroa requis",
          message: "Le nombre d'acariens lors de la dernière inspection a atteint le seuil critique pour un traitement.",
          recommendation: "Envisagez d'appliquer un traitement à l'acide formique ou à base de thymol prochainement.",
          resolved: true
        }
      ]
    },
    {
      id: "hive-gamma",
      name: "Ruche Gamma (Prairie de fleurs sauvages)",
      apiary: "Ranch Côtier",
      gps: { lat: 37.7699, lng: -122.4468 },
      firmwareVersion: "v2.4.9",
      queenStatus: "Aucune (Indicateurs d'orphelinage)",
      lastSync: new Date().toISOString(),
      createdTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      telemetry: {
        temperature: 30.5,
        humidity: 68.4,
        weight: 18.2,
        battery: 32,
        solarVoltage: 2.1,
        batteryVoltage: 3.4,
        beeActivity: 18,
        soundLevel: 78,
        tilt: false,
        opened: false,
        signalStrength: -92
      },
      inspections: [
        {
          id: "insp-3",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          queenSeen: false,
          broodStatus: "none",
          eggsSeen: false,
          honeyRating: 1,
          framesCount: 2,
          diseasesSeen: "Aucune",
          treatmentApplied: "Aucun",
          notes: "Aucun œuf ni couvain visible. Bourdonnement aigu de détresse. La ruche est calme et apathique, probablement orpheline ou affamée.",
          images: []
        }
      ],
      alerts: [
        {
          id: "alert-3",
          timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          type: "queen_issue",
          priority: "critical",
          title: "Perte potentielle de la reine",
          message: "La télémétrie indique des températures basses (30.5°C), un niveau sonore aigu élevé (78dB) et une activité des abeilles extrêmement faible.",
          recommendation: "Inspectez immédiatement la Ruche Gamma. Recherchez des cellules royales d'urgence ou vérifiez si la reine est manquante. Envisagez de fusionner avec une colonie plus forte ou d'introduire une reine fécondée.",
          resolved: false
        },
        {
          id: "alert-4",
          timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          type: "battery_low",
          priority: "medium",
          title: "Batterie du capteur extrêmement faible",
          message: "Le niveau de batterie de la passerelle IoT de la Ruche Gamma est à 32% avec une faible charge solaire.",
          recommendation: "Inspectez l'alignement du panneau solaire. Assurez-vous qu'il n'est pas ombragé par des feuilles ou couvert de saleté.",
          resolved: false
        }
      ]
    }
  ]
};

// Load state helper
function loadState(): AppState {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading data file:", error);
  }
  return defaultState;
}

// Save state helper
function saveState(state: AppState) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(state, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data file:", error);
  }
}

// Initialize state
let appState = loadState();
// Save it immediately so the file exists
saveState(appState);

// Slight fluctuation simulator to give real-time IoT vibe
setInterval(() => {
  let changed = false;
  appState.hives = appState.hives.map((hive) => {
    // We only fluctuate non-critical hives to maintain test states
    if (hive.id === "hive-alpha" || hive.id === "hive-beta") {
      const tel = { ...hive.telemetry };
      
      // Fluctuating within realistic bounds
      tel.temperature = parseFloat((tel.temperature + (Math.random() - 0.5) * 0.15).toFixed(2));
      tel.humidity = parseFloat(Math.min(95, Math.max(20, tel.humidity + (Math.random() - 0.5) * 0.4)).toFixed(1));
      
      // Weight goes up gradually (simulating nectar foraging!) or fluctuates
      tel.weight = parseFloat(Math.max(5, tel.weight + (Math.random() - 0.4) * 0.05).toFixed(2));
      
      // Solar charging changes during simulated daytime
      const hours = new Date().getHours();
      if (hours >= 7 && hours <= 18) {
        tel.solarVoltage = parseFloat((3.5 + Math.random() * 2).toFixed(1));
        tel.battery = Math.min(100, tel.battery + 1);
      } else {
        tel.solarVoltage = parseFloat((0.1 + Math.random() * 0.2).toFixed(1));
        tel.battery = Math.max(10, tel.battery - 1);
      }
      
      hive.telemetry = tel;
      hive.lastSync = new Date().toISOString();
      changed = true;
    }
    return hive;
  });

  if (changed) {
    saveState(appState);
  }
}, 15000); // Fluctuate every 15 seconds

// API: Get Hives
app.get("/api/hives", (req, res) => {
  res.json(appState.hives);
});

// API: Get Specific Hive
app.get("/api/hives/:id", (req, res) => {
  const hive = appState.hives.find((h) => h.id === req.params.id);
  if (!hive) {
    return res.status(404).json({ error: "Hive not found" });
  }
  res.json(hive);
});

// API: Add Hive
app.post("/api/hives", (req, res) => {
  const { name, apiary, lat, lng, queenStatus } = req.body;
  if (!name || !apiary) {
    return res.status(400).json({ error: "Name and Apiary are required" });
  }

  const newHive: Hive = {
    id: `hive-${Date.now()}`,
    name,
    apiary,
    gps: {
      lat: Number(lat) || 37.7749,
      lng: Number(lng) || -122.4194
    },
    firmwareVersion: "v2.5.2-OTA",
    queenStatus: queenStatus || "Unmarked",
    lastSync: new Date().toISOString(),
    createdTime: new Date().toISOString(),
    telemetry: {
      temperature: 34.2,
      humidity: 55.0,
      weight: 25.0,
      battery: 100,
      solarVoltage: 5.0,
      batteryVoltage: 4.0,
      beeActivity: 60,
      soundLevel: 42,
      tilt: false,
      opened: false,
      signalStrength: -60
    },
    inspections: [],
    alerts: []
  };

  appState.hives.push(newHive);
  saveState(appState);
  res.status(201).json(newHive);
});

// API: Create Inspection Report
app.post("/api/hives/:id/inspection", (req, res) => {
  const hiveIndex = appState.hives.findIndex((h) => h.id === req.params.id);
  if (hiveIndex === -1) {
    return res.status(404).json({ error: "Hive not found" });
  }

  const {
    queenSeen,
    broodStatus,
    eggsSeen,
    honeyRating,
    framesCount,
    diseasesSeen,
    treatmentApplied,
    notes,
    images
  } = req.body;

  const newInspection: InspectionLog = {
    id: `insp-${Date.now()}`,
    date: new Date().toISOString(),
    queenSeen: Boolean(queenSeen),
    broodStatus: broodStatus || "moderate",
    eggsSeen: Boolean(eggsSeen),
    honeyRating: Number(honeyRating) || 3,
    framesCount: Number(framesCount) || 5,
    diseasesSeen: diseasesSeen || "None",
    treatmentApplied: treatmentApplied || "None",
    notes: notes || "",
    images: images || []
  };

  appState.hives[hiveIndex].inspections.unshift(newInspection);
  
  // If user says Queen was not seen, we might update queen status
  if (!queenSeen && eggsSeen) {
    appState.hives[hiveIndex].queenStatus = "Active (Œufs présents, reine insaisissable)";
  } else if (!queenSeen && !eggsSeen) {
    appState.hives[hiveIndex].queenStatus = "Orphelinage suspecté";
    
    // Auto-generate alert
    appState.hives[hiveIndex].alerts.unshift({
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "queen_issue",
      priority: "critical",
      title: "Défaut de reine constaté",
      message: "L'apiculteur a enregistré une inspection signalant l'absence de reine et d'œufs.",
      recommendation: "Surveillez de près pour détecter d'éventuelles cellules royales. Inspectez à nouveau dans 3 jours ou introduisez une nouvelle cellule royale fécondée.",
      resolved: false
    });
  } else if (queenSeen) {
    appState.hives[hiveIndex].queenStatus = "Présence de la reine confirmée";
  }

  saveState(appState);
  res.status(201).json(appState.hives[hiveIndex]);
});

// API: Reset / Reseed Demo Data
app.post("/api/reset", (req, res) => {
  appState = JSON.parse(JSON.stringify(defaultState));
  saveState(appState);
  res.json({ message: "Données réinitialisées avec succès à l'état de démonstration par défaut." });
});

// API: Simulate IoT trigger
app.post("/api/hives/:id/simulate", (req, res) => {
  const hiveIndex = appState.hives.findIndex((h) => h.id === req.params.id);
  if (hiveIndex === -1) {
    return res.status(404).json({ error: "Ruche non trouvée" });
  }

  const { type } = req.body; // 'swarm', 'tilted', 'opened', 'predator', 'freeze', 'good'
  const hive = appState.hives[hiveIndex];

  if (type === "swarm") {
    hive.telemetry.beeActivity = 98;
    hive.telemetry.soundLevel = 84;
    hive.telemetry.temperature = 36.8;
    hive.alerts.unshift({
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "swarm_prediction",
      priority: "critical",
      title: "Alerte de préparation d'essaimage",
      message: "Les signatures acoustiques suggèrent un essaimage immédiat. Pics de fréquence (84dB) couplés à une température interne très élevée (36,8°C).",
      recommendation: "Inspectez immédiatement la ruche. Recherchez des cellules d'essaimage operculées. Ajoutez une hausse ou divisez la colonie aujourd'hui pour éviter de perdre la moitié de vos abeilles.",
      resolved: false
    });
  } else if (type === "tilted") {
    hive.telemetry.tilt = true;
    hive.alerts.unshift({
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "hive_tilted",
      priority: "critical",
      title: "Inclinaison de la ruche détectée",
      message: "L'accéléromètre interne signale une forte inclinaison hors axe de >45 degrés. La ruche a peut-être chuté ou été renversée.",
      recommendation: "Rendez-vous immédiatement sur place pour redresser la ruche, sauver le couvain et la défendre contre les prédateurs.",
      resolved: false
    });
  } else if (type === "opened") {
    hive.telemetry.opened = true;
    hive.alerts.unshift({
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "hive_opened",
      priority: "medium",
      title: "Boîtier de la ruche ouvert",
      message: "Les capteurs de lumière et les déclencheurs mécaniques signalent que le couvercle supérieur a été retiré.",
      recommendation: "Vérifiez si une inspection est planifiée. Si ce n'est pas autorisé, cela indique une manipulation suspecte ou des vents violents soulevant le couvercle.",
      resolved: false
    });
  } else if (type === "predator") {
    hive.telemetry.soundLevel = 92;
    hive.telemetry.beeActivity = 95;
    hive.alerts.unshift({
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "predator_detected",
      priority: "critical",
      title: "Activité de prédateur détectée",
      message: "Des ondes de choc acoustiques et de violents pics de vibration indiquent la présence d'un prédateur (ex. ours, blaireau, frelons).",
      recommendation: "Inspectez physiquement. Activez la clôture du rucher et des répulsifs sonores puissants.",
      resolved: false
    });
  } else if (type === "freeze") {
    hive.telemetry.temperature = 12.5;
    hive.telemetry.beeActivity = 10;
    hive.alerts.unshift({
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "temperature_low",
      priority: "critical",
      title: "Chute thermique extrême",
      message: "Le capteur interne signale une chute à 12,5°C dans la chambre d'incubation. La grappe s'est peut-être brisée ou les abeilles meurent de froid.",
      recommendation: "Vérifiez l'isolation thermique. Nourrissez immédiatement avec du sirop de sucre liquide ou un pain de candi, réduisez la taille de l'entrée.",
      resolved: false
    });
  } else if (type === "good") {
    // Restore perfect values
    hive.telemetry.temperature = 34.5;
    hive.telemetry.humidity = 53.0;
    hive.telemetry.beeActivity = 75;
    hive.telemetry.soundLevel = 42;
    hive.telemetry.tilt = false;
    hive.telemetry.opened = false;
    hive.queenStatus = "Marquée en Jaune (2025)";
    hive.alerts = hive.alerts.map(a => ({ ...a, resolved: true }));
  }

  saveState(appState);
  res.json(hive);
});

// API: Resolve Alert
app.post("/api/hives/:id/alerts/:alertId/resolve", (req, res) => {
  const hiveIndex = appState.hives.findIndex((h) => h.id === req.params.id);
  if (hiveIndex === -1) {
    return res.status(404).json({ error: "Hive not found" });
  }

  const alertIndex = appState.hives[hiveIndex].alerts.findIndex(a => a.id === req.params.alertId);
  if (alertIndex === -1) {
    return res.status(404).json({ error: "Alert not found" });
  }

  appState.hives[hiveIndex].alerts[alertIndex].resolved = true;
  saveState(appState);
  res.json(appState.hives[hiveIndex]);
});

// Cache for AI Dashboard Summary to prevent 429 Rate Limit (Quota Exceeded) errors
let cachedSummary: { summary: string; timestamp: number; isDemo: boolean } | null = null;
const CACHE_DURATION_MS = 3 * 60 * 1000; // Cache for 3 minutes

// API: AI Dashboard Executive Summary ("Wow" widget)
app.get("/api/ai/dashboard-summary", async (req, res) => {
  // Check cache first
  if (cachedSummary && (Date.now() - cachedSummary.timestamp < CACHE_DURATION_MS)) {
    return res.json({
      summary: cachedSummary.summary,
      isDemo: cachedSummary.isDemo
    });
  }

  // Find current states of specific hives to enrich fallback & prompt
  const alphaHive = appState.hives.find(h => h.id === "hive-alpha");
  const betaHive = appState.hives.find(h => h.id === "hive-beta");
  const gammaHive = appState.hives.find(h => h.id === "hive-gamma");

  const fallbackSummary = `Bonjour John.

Aujourd'hui, **20** de vos **24** ruches connectées fonctionnent normalement.

• 🐝 **Ruche A03** présente des signes d'agitation acoustique (**${gammaHive?.telemetry.soundLevel || 78} dB**) et une température basse (**${gammaHive?.telemetry.temperature || 30.5} °C**). Suspicion de perte de reine ou d'essaimage imminent.
• 🔋 **Ruche A02** a un capteur en batterie critique (**${betaHive?.telemetry.battery || 18} %**). Pensez à dépoussiérer le petit panneau solaire.
• ☀️ **Météo & Visites** : Conditions idéales pour l'inspection aujourd'hui de **9:00 à 12:00** (22°C, vent calme).
• 🍯 **Production estimée** cette semaine : **+14.8 kg** de miel grâce au fort butinage sur la Vallée Verte.`;

  if (!ai) {
    return res.json({
      summary: fallbackSummary,
      isDemo: true
    });
  }

  try {
    const prompt = `
Vous êtes "RAHIQ AI", un assistant d'analyse d'apiculture connectée et de précision de niveau mondial.
Générez un résumé exécutif quotidien court, chaleureux et percutant pour l'apiculteur John (ou Jean).
Structurez le résumé sous forme de puces courtes, visuelles, extrêmement bien formatées en Markdown avec des emojis appropriés.
Le ton doit être ultra-premium, professionnel et axé sur des actions concrètes basées sur les données ci-dessous.

RÉPONDEZ EXCLUSIVEMENT EN FRANÇAIS.

Voici les statistiques de télémétrie actuelles :
- Ruches connectées totales suivies : 24 (dont 20 fonctionnent parfaitement aujourd'hui, 2 ont des alertes critiques)
- Statut de la Ruche A01 (Alpha) : Température=${alphaHive?.telemetry.temperature}°C (cible ~34.5°C), Poids=${alphaHive?.telemetry.weight}kg, Activité=${alphaHive?.telemetry.beeActivity}/100.
- Statut de la Ruche A02 (Bêta) : Température=${betaHive?.telemetry.temperature}°C, Batterie=${betaHive?.telemetry.battery}%, Poids=${betaHive?.telemetry.weight}kg, Alertes=Batterie Faible.
- Statut de la Ruche A03 (Gamma) : Température=${gammaHive?.telemetry.temperature}°C, Niveau Sonore=${gammaHive?.telemetry.soundLevel}dB (normal ~40-50dB, >70dB indique orphelinage ou essaimage), Batterie=${gammaHive?.telemetry.battery}%, Alertes=Problème de Reine.
- Météo du jour : 22°C, Ensoleillé, vents légers de 12 km/h.

Modèle de structure attendu (à adapter de manière fluide) :
Bonjour John.
Aujourd'hui, 20 de vos 24 ruches fonctionnent normalement.
• [Icône ou Emoji] Ruche A03... (analyse sonore ou thermique)
• [Icône ou Emoji] Ruche A02... (batterie ou panneau solaire)
• [Icône ou Emoji] Météo favorable ou conseils d'inspection...
• [Icône ou Emoji] Estimation de production de miel pour la semaine : +14.8 kg.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const text = response.text || fallbackSummary;
    
    // Save to cache
    cachedSummary = {
      summary: text,
      timestamp: Date.now(),
      isDemo: false
    };

    res.json({
      summary: text,
      isDemo: false
    });

  } catch (error: any) {
    console.error("Failed to generate AI Dashboard summary:", error);
    
    // If we have any cached summary, use it as fallback even if expired, instead of raw static fallback
    if (cachedSummary) {
      return res.json({
        summary: cachedSummary.summary,
        isDemo: cachedSummary.isDemo
      });
    }

    res.json({
      summary: fallbackSummary,
      isDemo: true
    });
  }
});

// API: AI Assistant Chat & Hive Analysis
app.post("/api/ai/analyze", async (req, res) => {
  const { hiveId, userMessage } = req.body;

  if (!ai) {
    return res.status(503).json({
      reply: "### ⚠️ Client BeeGuard AI en veille\n\nPour activer les diagnostics IA complets, veuillez sélectionner votre **clé API Gemini** dans le panneau **Paramètres > Secrets**. En attendant, voici une analyse générale :\n\n*   **Grappe thermique stable** : Le nid à couvain nécessite une température de 32-36°C.\n*   **Poids de la colonie** : Les gains de récolte standard fluctuent selon la saison.\n*   **Actions recommandées** : Assurez-vous d'installer des réducteurs d'entrée en cas de vents froids.",
      noKey: true
    });
  }

  try {
    const hive = appState.hives.find((h) => h.id === hiveId);
    let systemContext = "";

    if (hive) {
      systemContext = `
Vous êtes "BeeGuard AI", un assistant de diagnostic IA agricole de précision et ultra-premium conçu pour les apiculteurs. Vous disposez d'un accès complet à la télémétrie en direct des ruches connectées de l'utilisateur.

Diagnostics actuels de la ruche :
- Nom de la ruche : ${hive.name}
- Emplacement du rucher : ${hive.apiary}
- Température : ${hive.telemetry.temperature}°C (Le nid à couvain optimal est d'environ 34,5°C. Une température inférieure à 32°C suggère un couvain refroidi, des dommages à la grappe ou la perte de la reine. Une température supérieure à 36,5°C indique une surchauffe ou des préparatifs intensifs d'essaimage dus au stress thermique)
- Humidité : ${hive.telemetry.humidity}% (La plage idéale est de 50-60%. Une humidité excessive (>70%) favorise le couvain plâtré et le varroa, un nid sec (<45%) déshydrate les larves)
- Poids total de miel/ruche : ${hive.telemetry.weight} kg (Les gains de poids indiquent l'accumulation de miel ; une perte de poids soudaine indique un essaimage ou un pillage)
- Niveau sonore : ${hive.telemetry.soundLevel} dB (40-50dB est sain. 70-80dB indique une forte agitation, un bourdonnement d'essaimage ou le sifflement/cri de détresse classique d'une ruche orpheline)
- Niveau d'activité des abeilles : ${hive.telemetry.beeActivity}/100 (Basé sur les capteurs de lumière de l'entrée. Élevé signifie un butinage sain ; extrêmement bas indique une stagnation ou un effondrement ; une activité en pic avec perte de poids suggère un pillage ou un essaimage)
- État de la batterie : ${hive.telemetry.battery}% (Tension de charge solaire : ${hive.telemetry.solarVoltage}V)
- Statut de la reine : ${hive.queenStatus}
- Statut du matériel : Inclinaison=${hive.telemetry.tilt ? "ALERTE (INCLINÉE)" : "OK"}, Boîtier ouvert=${hive.telemetry.opened ? "ALERTE (OUVERT)" : "OK"}, Signal RF=${hive.telemetry.signalStrength}dBm

Notes des inspections récentes :
${hive.inspections.slice(0, 2).map(insp => `- Date : ${new Date(insp.date).toLocaleDateString()}, Couvain : ${insp.broodStatus}, Reine vue : ${insp.queenSeen ? "Oui" : "Non"}, Varroa : ${insp.diseasesSeen}, Notes : ${insp.notes}`).join("\n")}

Alertes actives :
${hive.alerts.filter(a => !a.resolved).map(a => `- [${a.priority.toUpperCase()}] ${a.title} : ${a.message} (Recommandation : ${a.recommendation})`).join("\n")}
`;
    } else {
      systemContext = `
Vous êtes "BeeGuard AI", un assistant de diagnostic IA agricole de précision et ultra-premium conçu pour les apiculteurs.
Vous n'avez pas de contexte de ruche spécifique sélectionné pour le moment, vous devez donc répondre aux questions générales sur l'apiculture et les capteurs IoT de manière professionnelle et minimaliste.
`;
    }

    const fullPrompt = `
System Instruction: Parlez comme un entomologiste hautement qualifié, un maître apiculteur chevronné et un expert en électronique de précision. Gardez vos réponses minimales, élégantes, structurellement propres et orientées vers l'action. Utilisez un beau formatage Markdown avec des puces et des en-têtes en gras. RÉPONDEZ EXCLUSIVEMENT EN FRANÇAIS.

Beekeeper User's Query: "${userMessage || "Donnez-moi un rapport de santé complet de cette ruche basé sur sa télémétrie actuelle."}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemContext },
        { text: fullPrompt }
      ],
      config: {
        temperature: 0.3,
      }
    });

    const text = response.text || "Aucune réponse reçue du modèle de diagnostic.";
    res.json({ reply: text });

  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: "Service de diagnostic temporairement indisponible", details: error.message });
  }
});

// Serve static assets in production & launch full-stack server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BeeGuard AI server running on port ${PORT}`);
  });
}

startServer();
