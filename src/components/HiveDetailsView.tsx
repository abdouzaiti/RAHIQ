import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Thermometer,
  Droplets,
  Scale,
  Battery,
  Activity,
  Volume2,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  QrCode,
  FileText,
  ChevronLeft,
  Settings,
  AlertTriangle,
  Plus,
  Compass,
  Database,
  RefreshCw,
  Sun,
  Shield,
  Heart,
  ChevronRight,
  Download,
  FileDown
} from "lucide-react";
import { Hive, InspectionLog } from "../types";
import { SemiCircleGauge, RadialCircularGauge } from "./Gauges";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface HiveDetailsViewProps {
  hive: Hive;
  onBack: () => void;
  onAddInspection: (inspection: Partial<InspectionLog>) => Promise<void>;
  onTriggerSimulation: (type: string) => Promise<void>;
}

export const HiveDetailsView: React.FC<HiveDetailsViewProps> = ({
  hive,
  onBack,
  onAddInspection,
  onTriggerSimulation,
}) => {
  const [activeTab, setActiveTab] = useState<"live" | "analytics" | "inspections" | "settings">("live");
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState<string | null>(null);

  // New inspection form states
  const [queenSeen, setQueenSeen] = useState(true);
  const [broodStatus, setBroodStatus] = useState<"excellent" | "moderate" | "poor" | "none">("excellent");
  const [eggsSeen, setEggsSeen] = useState(true);
  const [honeyRating, setHoneyRating] = useState(4);
  const [framesCount, setFramesCount] = useState(8);
  const [diseasesSeen, setDiseasesSeen] = "Aucun";
  const [treatmentApplied, setTreatmentApplied] = "Aucun";
  const [notes, setNotes] = useState("");

  // Simulated chart data
  const generateChartData = () => {
    const data = [];
    let count = timeframe === "day" ? 24 : timeframe === "week" ? 7 : 30;
    
    // Base parameters to build realistic trend curves
    let baseTemp = hive.telemetry.temperature;
    let baseWeight = hive.telemetry.weight;
    let baseHumidity = hive.telemetry.humidity;
    let baseActivity = hive.telemetry.beeActivity;

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      if (timeframe === "day") {
        date.setHours(date.getHours() - i);
      } else if (timeframe === "week") {
        date.setDate(date.getDate() - i);
      } else {
        date.setDate(date.getDate() - i * 1);
      }

      const label = timeframe === "day" 
        ? `${date.getHours()}:00` 
        : date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });

      // Build simulated curves with nice organic trends
      data.push({
        name: label,
        temperature: parseFloat((baseTemp + Math.sin(i / 2) * 1.5 + (Math.random() - 0.5) * 0.4).toFixed(2)),
        humidity: parseFloat((baseHumidity + Math.cos(i / 2) * 4 + (Math.random() - 0.5) * 1.5).toFixed(1)),
        weight: parseFloat((baseWeight - i * 0.15 + Math.sin(i / 4) * 0.5).toFixed(2)),
        activity: Math.round(Math.max(10, baseActivity + Math.sin(i / 1.5) * 15 + (Math.random() - 0.5) * 5)),
        honeyYield: parseFloat((Math.max(0, (baseWeight - i * 0.12) - 15) * 0.65).toFixed(1)) // honey estimate
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Local state for temporary inputs
  const [localDiseasesSeen, setLocalDiseasesSeen] = useState("Aucun");
  const [localTreatmentApplied, setLocalTreatmentApplied] = useState("Aucun");

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddInspection({
      queenSeen,
      broodStatus,
      eggsSeen,
      honeyRating,
      framesCount,
      diseasesSeen: localDiseasesSeen,
      treatmentApplied: localTreatmentApplied,
      notes
    });
    setShowInspectionModal(false);
    // Reset fields
    setNotes("");
    setLocalDiseasesSeen("Aucun");
    setLocalTreatmentApplied("Aucun");
  };

  const triggerSim = async (type: string) => {
    setIsSimulating(type);
    await onTriggerSimulation(type);
    setTimeout(() => setIsSimulating(null), 1000);
  };

  // Health Rating derivation logic
  const getHealthStatus = (score: number) => {
    if (score >= 85) return { text: "Excellente santé", color: "text-emerald-500 bg-emerald-50 border-emerald-100" };
    if (score >= 60) return { text: "Alerte modérée", color: "text-amber-500 bg-amber-50 border-amber-100" };
    return { text: "Danger critique", color: "text-red-500 bg-red-50 border-red-100" };
  };

  // Derive Health Score
  const calculateHealthScore = () => {
    let score = 100;
    const { temperature, humidity, battery, soundLevel, tilt, opened } = hive.telemetry;
    
    if (temperature < 32 || temperature > 36.5) score -= 15;
    if (humidity < 45 || humidity > 65) score -= 10;
    if (soundLevel > 70) score -= 15; // Swarm or queenless alert
    if (battery < 40) score -= 10;
    if (tilt) score -= 30;
    if (opened) score -= 15;

    return Math.max(12, score);
  };

  const healthScore = calculateHealthScore();
  const healthStatus = getHealthStatus(healthScore);

  // Simulated exports
  const handleExport = (format: "pdf" | "csv" | "excel") => {
    // Elegant simulated file generation & browser trigger
    const filename = `${hive.name.replace(/\s+/g, "_")}_Rapport_Telemetrie.${format}`;
    const element = document.createElement("a");
    let content = "";
    let mime = "";

    if (format === "csv") {
      mime = "text/csv";
      content = "Date,Temperature(C),Humidite(%),Poids(kg),Activite(%),NiveauSonore(dB),Batterie(%)\n" + 
                chartData.map(d => `${d.name},${d.temperature},${d.humidity},${d.weight},${d.activity},44,${hive.telemetry.battery}`).join("\n");
    } else {
      mime = "text/plain";
      content = `--- RAPPORT DE TÉLÉMÉTRIE BEEGUARD IA ---\n\nNom de la ruche : ${hive.name}\nEmplacement du rucher : ${hive.apiary}\nGénéré le : ${new Date().toLocaleString("fr-FR")}\nIndex de santé : ${healthScore}/100\nStatut de la reine : ${hive.queenStatus}\n\nStatistiques récentes :\n` +
                chartData.map(d => `- [${d.name}]: Temp ${d.temperature}°C | Humidité ${d.humidity}% | Poids ${d.weight}kg | Activité ${d.activity}%`).join("\n");
    }

    const file = new Blob([content], { type: mime });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]" id="hive-details-panel">
      {/* Detail View Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100/80 rounded-t-[22px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition text-gray-500 cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">
                {hive.apiary}
              </span>
              <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border ${healthStatus.color}`}>
                {healthScore} - {healthStatus.text}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">{hive.name}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInspectionModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nouvelle inspection
          </button>

          <div className="relative group">
            <button className="bg-white border border-gray-200 text-gray-600 font-semibold text-xs py-2.5 px-3.5 rounded-xl hover:bg-gray-50 transition flex items-center gap-1.5 cursor-pointer">
              <Download className="w-4 h-4" />
              Exporter
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-30 py-1">
              <button onClick={() => handleExport("csv")} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" /> Format CSV Excel
              </button>
              <button onClick={() => handleExport("pdf")} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FileDown className="w-3.5 h-3.5 text-red-500" /> Rapport d'audit PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="px-6 bg-white border-b border-gray-100 flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab("live")}
          className={`py-4 text-xs font-bold tracking-wide uppercase border-b-2 transition duration-200 cursor-pointer ${
            activeTab === "live"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Suivi en direct
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`py-4 text-xs font-bold tracking-wide uppercase border-b-2 transition duration-200 cursor-pointer ${
            activeTab === "analytics"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Analyses détaillées
        </button>
        <button
          onClick={() => setActiveTab("inspections")}
          className={`py-4 text-xs font-bold tracking-wide uppercase border-b-2 transition duration-200 cursor-pointer ${
            activeTab === "inspections"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Rapports d'inspection ({hive.inspections.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-4 text-xs font-bold tracking-wide uppercase border-b-2 transition duration-200 cursor-pointer ${
            activeTab === "settings"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Paramètres du boîtier
        </button>
      </div>

      {/* Inner Panels */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "live" && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Alert Warning if any */}
              {hive.alerts.some(a => !a.resolved) && (
                <div className="bg-red-50/70 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">Alerte de télémétrie active</h3>
                    {hive.alerts.filter(a => !a.resolved).slice(0, 1).map((a) => (
                      <div key={a.id} className="mt-1">
                        <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{a.message}</p>
                        <p className="text-xs text-emerald-700 font-semibold mt-2 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
                          💡 Recommandation : {a.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Big Gauges Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <SemiCircleGauge
                  value={hive.telemetry.temperature}
                  min={15}
                  max={45}
                  label="Température du couvain"
                  unit="°C"
                  colorClass={hive.telemetry.temperature < 32 ? "text-blue-500" : hive.telemetry.temperature > 36.5 ? "text-red-500" : "text-emerald-500"}
                  icon={<Thermometer className="w-4 h-4" />}
                />
                <SemiCircleGauge
                  value={hive.telemetry.humidity}
                  min={20}
                  max={100}
                  label="Humidité du nid"
                  unit="%"
                  colorClass={hive.telemetry.humidity > 65 ? "text-amber-500" : "text-emerald-500"}
                  icon={<Droplets className="w-4 h-4" />}
                />
                <SemiCircleGauge
                  value={hive.telemetry.weight}
                  min={0}
                  max={120}
                  label="Poids total de la ruche"
                  unit="kg"
                  colorClass="text-emerald-600"
                  icon={<Scale className="w-4 h-4" />}
                />
              </div>

              {/* Secondary circular gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <RadialCircularGauge
                  value={hive.telemetry.battery}
                  max={100}
                  label="Batterie de la passerelle"
                  unit="%"
                  color="#22C55E"
                  icon={<Battery className="w-5 h-5 text-emerald-500" />}
                />
                <RadialCircularGauge
                  value={hive.telemetry.beeActivity}
                  max={100}
                  label="Activité de butinage"
                  unit="/100"
                  color="#FACC15"
                  icon={<Activity className="w-5 h-5 text-amber-500" />}
                />
                <RadialCircularGauge
                  value={hive.telemetry.soundLevel}
                  max={100}
                  label="Acoustique du nid"
                  unit="dB"
                  color="#EF4444"
                  icon={<Volume2 className="w-5 h-5 text-red-500" />}
                />
                <RadialCircularGauge
                  value={hive.telemetry.solarVoltage}
                  max={6}
                  label="Panneau solaire"
                  unit="V"
                  color="#3B82F6"
                  icon={<Sun className="w-5 h-5 text-blue-500 animate-spin" style={{ animationDuration: "12s" }} />}
                />
              </div>

              {/* Status Checklist and metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-[22px] border border-gray-100 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                    <Shield className="w-4.5 h-4.5 text-emerald-600" />
                    État de santé de la passerelle IoT
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                      <span className="text-gray-500">Statut de la reine</span>
                      <span className="font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded">{hive.queenStatus}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                      <span className="text-gray-500">Force du signal RSSI</span>
                      <span className="font-semibold text-gray-800 font-mono">{hive.telemetry.signalStrength} dBm (Bon)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                      <span className="text-gray-500">Inclinaison de l'accéléromètre</span>
                      <span className={`font-semibold ${hive.telemetry.tilt ? "text-red-600 bg-red-50 px-2 rounded animate-pulse" : "text-emerald-600"}`}>
                        {hive.telemetry.tilt ? "ATTENTION (INCLINÉE)" : "OK (VERTICALE)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                      <span className="text-gray-500">Contact d'ouverture anti-sabotage</span>
                      <span className={`font-semibold ${hive.telemetry.opened ? "text-red-600 bg-red-50 px-2 rounded animate-pulse" : "text-emerald-600"}`}>
                        {hive.telemetry.opened ? "COUVERCLE OUVERT" : "COUVERCLE VERROUILLÉ"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-gray-500">Version du firmware</span>
                      <span className="font-semibold text-gray-600 font-mono">{hive.firmwareVersion}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[22px] border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
                      <Heart className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      Diagnostic rapide de BeeGuard IA
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {healthScore >= 85 
                        ? "La ruche Alpha affiche une homéostasie thermique optimale et une activité de butinage élevée. Les gains de miel sont constants. Une inspection des cellules d'essaimage est recommandée sous 5 à 6 jours pour diviser la ruche de manière durable."
                        : healthScore >= 60
                        ? "La ruche Beta présente des niveaux de ponte légèrement inférieurs dans la chambre à couvain (33,1 °C). Maintenir le traitement d'apiguard comme prévu. Des œufs frais ont été vérifiés."
                        : "La ruche Gamma présente un stress thermique extrême (30,5 °C) et des indicateurs acoustiques de bourdonnement sans reine (78 dB). Inspectez immédiatement aujourd'hui pour éviter tout refroidissement du couvain."
                      }
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Dernière synchro : {new Date(hive.lastSync).toLocaleTimeString("fr-FR")}
                    </span>
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded">
                      LTE-M ACTIF
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Timeframe picker */}
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Période d'analyse</span>
                <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl">
                  {(["day", "week", "month"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize transition duration-150 cursor-pointer ${
                        timeframe === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {t === "day" ? "24 Heures" : t === "week" ? "7 Jours" : "30 Jours"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Temperature Chart */}
                <div className="bg-white p-5 rounded-[22px] border border-gray-100/80 shadow-sm">
                  <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 uppercase">Homéostasie thermique</span>
                  <h4 className="text-sm font-bold text-gray-800 mt-1 mb-4 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-emerald-500" />
                    Température au cœur du nid (°C)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} domain={["dataMin - 1", "dataMax + 1"]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#FFF", fontSize: "11px" }} />
                        <Area type="monotone" dataKey="temperature" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weight accumulation chart */}
                <div className="bg-white p-5 rounded-[22px] border border-gray-100/80 shadow-sm">
                  <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 uppercase">Rendement du butinage</span>
                  <h4 className="text-sm font-bold text-gray-800 mt-1 mb-4 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    Poids accumulé de la ruche (kg)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} domain={["dataMin - 5", "dataMax + 5"]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#FFF", fontSize: "11px" }} />
                        <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Humidity Nest levels */}
                <div className="bg-white p-5 rounded-[22px] border border-gray-100/80 shadow-sm">
                  <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 uppercase">Contrôle de l'humidité</span>
                  <h4 className="text-sm font-bold text-gray-800 mt-1 mb-4 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Humidité interne du nid (%)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} domain={["dataMin - 5", "dataMax + 5"]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#FFF", fontSize: "11px" }} />
                        <Area type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorHum)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Foraging Excitement activity bar */}
                <div className="bg-white p-5 rounded-[22px] border border-gray-100/80 shadow-sm">
                  <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 uppercase">Fréquence du capteur d'entrée</span>
                  <h4 className="text-sm font-bold text-gray-800 mt-1 mb-4 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-500" />
                    Fréquence de passage d'entrée des abeilles (Hz)
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "10px", color: "#FFF", fontSize: "11px" }} />
                        <Bar dataKey="activity" fill="#FACC15" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "inspections" && (
            <motion.div
              key="inspections"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {hive.inspections.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-sm font-bold text-gray-700">Aucune inspection enregistrée pour le moment</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm">Effectuez des inspections régulières pour maintenir le moteur de diagnostic de BeeGuard IA avec une précision extrême.</p>
                  <button
                    onClick={() => setShowInspectionModal(true)}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                  >
                    Créer un premier rapport
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {hive.inspections.map((insp) => (
                    <div key={insp.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3 mb-3.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-bold text-gray-800">
                            {new Date(insp.date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-gray-150 text-gray-600 px-2.5 py-0.5 rounded-full font-mono">
                          ID : {insp.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50/50 p-3 rounded-xl">
                          <span className="text-[10px] text-gray-400 font-sans">Reine aperçue</span>
                          <p className={`text-xs font-bold mt-0.5 ${insp.queenSeen ? "text-emerald-600" : "text-red-500"}`}>
                            {insp.queenSeen ? "Aperçue" : "Non aperçue"}
                          </p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl">
                          <span className="text-[10px] text-gray-400 font-sans">État du couvain</span>
                          <p className="text-xs font-bold text-gray-800 mt-0.5 capitalize">{insp.broodStatus === "excellent" ? "excellent" : insp.broodStatus === "moderate" ? "modéré" : insp.broodStatus === "poor" ? "médiocre" : "aucun"}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl">
                          <span className="text-[10px] text-gray-400 font-sans">Œufs visibles</span>
                          <p className={`text-xs font-bold mt-0.5 ${insp.eggsSeen ? "text-emerald-600" : "text-amber-500"}`}>
                            {insp.eggsSeen ? "Oui" : "Aucun aperçu"}
                          </p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl">
                          <span className="text-[10px] text-gray-400 font-sans">Cadres occupés</span>
                          <p className="text-xs font-bold text-gray-800 mt-0.5">{insp.framesCount} Cadres</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-400 font-sans font-medium">Parasites & Maladies :</span>{" "}
                          <span className="text-gray-800 font-semibold">{insp.diseasesSeen}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-sans font-medium">Traitement appliqué :</span>{" "}
                          <span className="text-gray-800 font-semibold">{insp.treatmentApplied}</span>
                        </div>
                        <div className="mt-3 bg-emerald-50/25 border border-emerald-100/50 rounded-xl p-3.5 text-gray-700 leading-relaxed font-sans">
                          <span className="font-bold text-emerald-800 block mb-1">Notes de l'apiculteur :</span>
                          {insp.notes || "Aucune note écrite détaillée enregistrée pour cette session."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* QR and Calibration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-sm flex flex-col items-center text-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-3">
                      {/* Premium SVG Mockup QR Code */}
                      <svg className="w-32 h-32 text-gray-800" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="transparent" />
                        <path d="M10 10h20v20H10zm5 5v10h10V15zm25-5h20v20H40zm5 5v10h10V15zm25-5h20v20H70zm5 5v10h10V15zM10 40h20v20H10zm5 5v10h10V45zm20-5h10v10H30zm20 0h10v10H50zm10 10h10v10H60zm10-10h20v20H70zm5 5v10h10V45zM10 70h20v20H10zm5 5v10h10V75zm20-10h10v10H30zm10 10h10v10H40zm10-10h10v10H50zm10 10h10v10H60zm10-10h20v20H70zm5 5v10h10V75z" fill="currentColor" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">Passeport QR de la ruche</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs">Scannez ce code directement au rucher pour associer instantanément la télémétrie Bluetooth ou ouvrir les rapports d'inspection.</p>
                  </div>
                  <button className="mt-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs py-2 px-4 rounded-xl transition w-full">
                    Imprimer les étiquettes QR
                  </button>
                </div>

                <div className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                      <Database className="w-4.5 h-4.5 text-blue-500" />
                      Calibration du firmware
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
                        <div>
                          <p className="font-semibold text-gray-800">Liaison passerelle maillée</p>
                          <p className="text-gray-400 mt-0.5">ESP32-S3 BLE Broadcast</p>
                        </div>
                        <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">CONNEXION</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
                        <div>
                          <p className="font-semibold text-gray-800">Passerelle LoraWAN</p>
                          <p className="text-gray-400 mt-0.5">868 MHz / 915 MHz US</p>
                        </div>
                        <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">EN LIGNE (92%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl transition w-full flex items-center justify-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Lancer la mise à jour OTA du firmware
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation Sandbox Control Deck */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-[22px] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                  <h4 className="text-sm font-bold text-emerald-900">Panneau de contrôle de simulation apicole</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  En tant que testeur IoT, vous pouvez déclencher des conditions environnementales simulées sur les capteurs de cette ruche. Cela mettra immédiatement à jour les jauges, ajustera l'index de santé et déclenchera des notifications d'alerte push personnalisées.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => triggerSim("swarm")}
                    disabled={isSimulating !== null}
                    className="bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-semibold py-2 px-3 rounded-xl text-gray-700 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45"
                  >
                    🐝 Simuler l'essaimage
                  </button>
                  <button
                    onClick={() => triggerSim("tilted")}
                    disabled={isSimulating !== null}
                    className="bg-white border border-gray-200 hover:border-red-400 hover:bg-red-50 text-xs font-semibold py-2 px-3 rounded-xl text-gray-700 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45"
                  >
                    🚨 Inclinaison / Tempête
                  </button>
                  <button
                    onClick={() => triggerSim("opened")}
                    disabled={isSimulating !== null}
                    className="bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs font-semibold py-2 px-3 rounded-xl text-gray-700 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45"
                  >
                    📦 Couvercle ouvert
                  </button>
                  <button
                    onClick={() => triggerSim("predator")}
                    disabled={isSimulating !== null}
                    className="bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-xs font-semibold py-2 px-3 rounded-xl text-gray-700 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45"
                  >
                    🐻 Attaque de prédateur
                  </button>
                  <button
                    onClick={() => triggerSim("freeze")}
                    disabled={isSimulating !== null}
                    className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold py-2 px-3 rounded-xl text-gray-700 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45"
                  >
                    ❄️ Baisse hivernale extrême
                  </button>
                  <button
                    onClick={() => triggerSim("good")}
                    disabled={isSimulating !== null}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45"
                  >
                    ✅ Restaurer l'état idéal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NEW INSPECTION MODAL */}
      <AnimatePresence>
        {showInspectionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] max-w-lg w-full p-6.5 shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3.5 mb-5">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Enregistrer une inspection de ruche</h3>
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateInspection} className="space-y-4 text-xs text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {/* Queen seen toggle */}
                  <div>
                    <label className="block text-gray-500 font-sans font-medium mb-1">Reine aperçue ?</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setQueenSeen(true)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          queenSeen ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        Oui, aperçue
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueenSeen(false)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          !queenSeen ? "bg-red-50 border-red-500 text-red-700" : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        Non
                      </button>
                    </div>
                  </div>

                  {/* Eggs seen toggle */}
                  <div>
                    <label className="block text-gray-500 font-sans font-medium mb-1">Œufs présents ?</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEggsSeen(true)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          eggsSeen ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        Oui (ponte active)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEggsSeen(false)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          !eggsSeen ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        Pas d'œufs
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Brood Status */}
                  <div>
                    <label className="block text-gray-500 font-sans font-medium mb-1">Type de couvain</label>
                    <select
                      value={broodStatus}
                      onChange={(e: any) => setBroodStatus(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none text-xs"
                    >
                      <option value="excellent">Excellent (solide et continu)</option>
                      <option value="moderate">Modéré (quelques lacunes)</option>
                      <option value="poor">Médiocre (très lacunaire)</option>
                      <option value="none">Aucun (cellules vides)</option>
                    </select>
                  </div>

                  {/* Honey rating */}
                  <div>
                    <label className="block text-gray-500 font-sans font-medium mb-1">Réserves de miel (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={honeyRating}
                      onChange={(e) => setHoneyRating(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Frames Count */}
                  <div>
                    <label className="block text-gray-500 font-sans font-medium mb-1">Cadres occupés par les abeilles</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={framesCount}
                      onChange={(e) => setFramesCount(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none"
                    />
                  </div>

                  {/* Diseases */}
                  <div>
                    <label className="block text-gray-500 font-sans font-medium mb-1">Maladies / Acariens détectés</label>
                    <input
                      type="text"
                      value={localDiseasesSeen}
                      onChange={(e) => setLocalDiseasesSeen(e.target.value)}
                      placeholder="ex. Aucun, Varroa, Loque"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-gray-500 font-sans font-medium mb-1">Traitements appliqués</label>
                  <input
                    type="text"
                    value={localTreatmentApplied}
                    onChange={(e) => setLocalTreatmentApplied(e.target.value)}
                    placeholder="ex. Gel de thymol, Acide oxalique, Sirop"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-500 font-sans font-medium mb-1">Observations écrites & Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Décrivez le stockage des hausses, le tempérament de la colonie ou l'activité de la reine..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-center"
                  >
                    Enregistrer le rapport sur Firestore
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInspectionModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
