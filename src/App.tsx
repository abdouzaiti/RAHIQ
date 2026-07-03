import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Layers,
  Activity,
  Bell,
  User,
  Map,
  Bot,
  Plus,
  RefreshCw,
  Sliders,
  Sparkles,
  Wifi,
  MapPin,
  Clock,
  Award,
  FileText,
  Menu,
  X
} from "lucide-react";

import { Hive, InspectionLog, ViewType } from "./types";
import { Splash, Onboarding, Authentication } from "./components/IntroScreens";
import { 
  DashboardView, 
  MyHivesView, 
  AlertsView, 
  ProfileView,
  AnalyticsView,
  InspectionLogView,
  HoneyProductionView,
  DevicesView,
  UsersView,
  ReportsView
} from "./components/MainTabs";
import { HiveDetailsView } from "./components/HiveDetailsView";
import { AiAssistant } from "./components/AiAssistant";
import { MapWidget } from "./components/MapWidget";

export default function App() {
  // App view states - Authenticated by default for direct premium showcase of the exact dashboard
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showTestbed, setShowTestbed] = useState(false); // Collapsed by default to match screenshot perfectly

  // Active navigation states
  const [activeTab, setActiveTab] = useState<ViewType>("home");
  const [selectedHiveId, setSelectedHiveId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hive state list
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Hive modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHiveName, setNewHiveName] = useState("");
  const [newHiveApiary, setNewHiveApiary] = useState("Rucher de la Vallée Verte");
  const [newHiveQueen, setNewHiveQueen] = useState("Marquée Jaune (2025)");

  // Live simulation log states (right panel)
  const [simLogs, setSimLogs] = useState<{ id: string; time: string; msg: string; type: "info" | "success" | "warning" }[]>([
    { id: "initial", time: new Date().toLocaleTimeString(), msg: "Lancement de la surveillance de la passerelle BeeGuard.", type: "info" }
  ]);

  // Fetch Hives helper
  const fetchHives = async () => {
    try {
      const res = await fetch("/api/hives");
      if (res.ok) {
        const data = await res.json();
        // Convert to French equivalent labels
        const normalizedData = data.map((h: any) => {
          if (h.id === "hive-alpha") {
            return {
              ...h,
              name: "Ruche A01",
              apiary: "Rucher de la Vallée Verte",
              queenStatus: "Marquée Jaune (2025)"
            };
          }
          if (h.id === "hive-beta") {
            return {
              ...h,
              name: "Ruche A02",
              apiary: "Rucher de la Vallée Verte",
              queenStatus: "Carnolienne non marquée"
            };
          }
          if (h.id === "hive-gamma") {
            return {
              ...h,
              name: "Ruche A03",
              apiary: "Rucher de la Prairie",
              queenStatus: "Non repérée (Vierge)"
            };
          }
          return h;
        });
        setHives(normalizedData);
      }
    } catch (err) {
      console.error("Failed to load hives:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHives();
    // Poll telemetry updates
    const timer = setInterval(fetchHives, 5000);
    return () => clearInterval(timer);
  }, []);

  const addSimLog = (msg: string, type: "info" | "success" | "warning" = "info") => {
    setSimLogs(prev => [
      { id: `log-${Date.now()}`, time: new Date().toLocaleTimeString(), msg, type },
      ...prev.slice(0, 15)
    ]);
  };

  // Add Hive trigger
  const handleAddHive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiveName.trim()) return;

    try {
      const res = await fetch("/api/hives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newHiveName,
          apiary: newHiveApiary,
          queenStatus: newHiveQueen,
          lat: 37.7749 + (Math.random() - 0.5) * 0.05,
          lng: -122.4194 + (Math.random() - 0.5) * 0.05
        })
      });

      if (res.ok) {
        await fetchHives();
        setShowAddModal(false);
        setNewHiveName("");
        addSimLog(`Nouveau nœud de ruche IoT configuré : ${newHiveName}`, "success");
      }
    } catch (err) {
      console.error("Failed to create hive:", err);
    }
  };

  // Resolve Alert trigger
  const handleResolveAlert = async (hiveId: string, alertId: string) => {
    try {
      const res = await fetch(`/api/hives/${hiveId}/alerts/${alertId}/resolve`, {
        method: "POST"
      });
      if (res.ok) {
        await fetchHives();
        addSimLog(`Alerte résolue pour la ruche : ${hiveId}`, "success");
      }
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  // Create Inspection log
  const handleAddInspection = async (inspectionData: Partial<InspectionLog>) => {
    if (!selectedHiveId) return;
    try {
      const res = await fetch(`/api/hives/${selectedHiveId}/inspection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inspectionData)
      });
      if (res.ok) {
        await fetchHives();
        addSimLog(`Rapport d'inspection enregistré avec succès.`, "success");
      }
    } catch (err) {
      console.error("Failed to add inspection:", err);
    }
  };

  // Sensor IoT simulator triggers
  const handleTriggerSimulation = async (type: string, targetId?: string) => {
    const activeId = targetId || selectedHiveId || hives[0]?.id;
    if (!activeId) return;

    const targetHive = hives.find(h => h.id === activeId);
    const hiveLabel = targetHive ? targetHive.name : "Ruche active";

    try {
      const res = await fetch(`/api/hives/${activeId}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        await fetchHives();
        
        let logMsg = "";
        let logType: "success" | "warning" | "info" = "info";
        if (type === "swarm") {
          logMsg = `🚨 Anomalie d'essaimage simulée sur ${hiveLabel}. Pic de température et de son !`;
          logType = "warning";
        } else if (type === "tilted") {
          logMsg = `⚠️ Alerte accéléromètre déclenchée sur ${hiveLabel}. Capteur d'inclinaison actif.`;
          logType = "warning";
        } else if (type === "opened") {
          logMsg = `📦 Micro-anomalie d'ouverture de couvercle sur ${hiveLabel}.`;
          logType = "warning";
        } else if (type === "predator") {
          logMsg = `🐻 Menace acoustique de prédateur détectée sur ${hiveLabel}.`;
          logType = "warning";
        } else if (type === "freeze") {
          logMsg = `❄️ Chute thermique de gel du couvain sur ${hiveLabel}.`;
          logType = "warning";
        } else if (type === "good") {
          logMsg = `✅ Étalonnage terminé. Le statut de la ${hiveLabel} est de nouveau Normal.`;
          logType = "success";
        }

        addSimLog(logMsg, logType);
      }
    } catch (err) {
      console.error("Failed to trigger simulation:", err);
    }
  };

  // Reseed data state helper
  const handleReseedData = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        await fetchHives();
        setSelectedHiveId(null);
        setActiveTab("home");
        addSimLog("Bases de données IoT réinitialisées avec succès.", "success");
      }
    } catch (err) {
      console.error("Failed to reseed database:", err);
    }
  };

  // Splash completed
  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  // Onboarding completed
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowAuth(true);
  };

  // Auth completed
  const handleAuthComplete = () => {
    setShowAuth(false);
    setIsAuthenticated(true);
    addSimLog("Trousseau biométrique autorisé.", "success");
  };

  // Count active alerts
  const totalActiveAlerts = hives.reduce((acc, h) => {
    return acc + h.alerts.filter(a => !a.resolved).length;
  }, 0);

  // Render core views
  const renderCurrentTab = () => {
    if (selectedHiveId) {
      const activeHive = hives.find(h => h.id === selectedHiveId);
      if (activeHive) {
        return (
          <HiveDetailsView
            hive={activeHive}
            onBack={() => setSelectedHiveId(null)}
            onAddInspection={handleAddInspection}
            onTriggerSimulation={handleTriggerSimulation}
          />
        );
      }
    }

    switch (activeTab) {
      case "home":
        return (
          <DashboardView
            hives={hives}
            onSelectHive={(id) => setSelectedHiveId(id)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddHive={() => setShowAddModal(true)}
          />
        );
      case "hives":
        return (
          <MyHivesView
            hives={hives}
            onSelectHive={(id) => setSelectedHiveId(id)}
            onOpenAddHive={() => setShowAddModal(true)}
          />
        );
      case "analytics":
        return <AnalyticsView hives={hives} />;
      case "alerts":
        return (
          <AlertsView
            hives={hives}
            onResolveAlert={handleResolveAlert}
            onSelectHive={(id) => setSelectedHiveId(id)}
          />
        );
      case "map":
        return (
          <MapWidget
            hives={hives}
            onSelectHive={(id) => setSelectedHiveId(id)}
          />
        );
      case "inspection":
        return <InspectionLogView />;
      case "honey":
        return <HoneyProductionView />;
      case "assistant":
        return (
          <AiAssistant
            hives={hives}
            selectedHiveId={selectedHiveId || hives[0]?.id || ""}
          />
        );
      case "devices":
        return <DevicesView />;
      case "settings":
        return <ProfileView onReset={handleReseedData} />;
      case "users":
        return <UsersView />;
      case "reports":
        return <ReportsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-gray-800 font-sans flex h-screen overflow-hidden">
      
      {/* Intro sequence screens */}
      <AnimatePresence>
        {showSplash && <Splash onComplete={handleSplashComplete} />}
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        {showAuth && <Authentication onSuccess={handleAuthComplete} />}
      </AnimatePresence>

      {/* Mobile Sidebar backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (LEFT) - LIGHT THEMED AS SCREENSHOT   */}
      {/* ========================================================= */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white text-gray-700 flex flex-col justify-between shrink-0 border-r border-gray-100/80 z-40 font-sans transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div>
          {/* Logo Brand area */}
          <div className="py-3 px-4 border-b border-gray-50 flex flex-col items-center justify-center relative gap-2">
            {/* Real Logo Image */}
            <div className="w-28 h-28 shrink-0 flex items-center justify-center relative">
              <img 
                src="/logo.png" 
                alt="BeeGuard Logo" 
                className="w-full h-full object-contain z-10"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-emoji')) {
                    const span = document.createElement('span');
                    span.className = 'text-4xl fallback-emoji select-none';
                    span.innerText = '🐝';
                    parent.appendChild(span);
                  }
                }}
              />
            </div>

            {/* Close button for mobile menu */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-600 md:hidden cursor-pointer flex items-center justify-center animate-fade-in"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-none">
            {[
              { id: "home", label: "Tableau de bord", icon: <Home className="w-4 h-4" /> },
              { id: "hives", label: "Mes Ruches", icon: <Layers className="w-4 h-4" /> },
              { id: "analytics", label: "Analyses", icon: <Activity className="w-4 h-4" /> },
              { id: "alerts", label: "Alertes", icon: <Bell className="w-4 h-4" />, badge: totalActiveAlerts || 12 },
              { id: "map", label: "Carte GPS", icon: <Map className="w-4 h-4" /> },
              { id: "inspection", label: "Registre d'inspections", icon: <FileText className="w-4 h-4" /> },
              { id: "honey", label: "Production de miel", icon: <Award className="w-4 h-4" /> },
              { id: "assistant", label: "Assistant IA", icon: <Bot className="w-4 h-4" /> },
              { id: "devices", label: "Matériels IoT", icon: <Sliders className="w-4 h-4" /> },
              { id: "settings", label: "Mon Profil / Paramètres", icon: <Sliders className="w-4 h-4" /> },
              { id: "users", label: "Équipe", icon: <User className="w-4 h-4" /> },
              { id: "reports", label: "Rapports", icon: <FileText className="w-4 h-4" /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedHiveId(null);
                    setActiveTab(item.id as ViewType);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    isActive
                      ? "bg-[#FEF6E5] text-amber-900 border-l-4 border-amber-500 pl-2.5"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-[#FCB813] text-amber-950 text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>


      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT WORKSPACE AREA                               */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F9F9FB]">
        
        {/* Top Header Bar styled exactly like screenshot */}
        <header className="bg-transparent shrink-0 px-4 pt-6 pb-4 sm:px-8 sm:pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl border border-gray-150 bg-white text-gray-600 hover:bg-gray-50 md:hidden cursor-pointer flex items-center justify-center shrink-0"
              title="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-display leading-tight flex items-center gap-2">
                Ravi de vous revoir, Apiculteur ! 👋
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5 sm:mt-1">
                Voici le statut de vos colonies pour aujourd'hui.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-700">
            {/* Weather mini-widget */}
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">☀️</span>
              <div>
                <div className="text-sm font-extrabold text-gray-900 font-sans tracking-tight leading-none">22 °C</div>
                <span className="text-[10px] text-gray-400 font-bold block mt-0.5">Plutôt ensoleillé</span>
              </div>
            </div>

            {/* IoT Simulator Trigger (subtle tool icon next to notifications) */}
            <button
              onClick={() => setShowTestbed(!showTestbed)}
              title="Activer le simulateur IoT"
              className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                showTestbed
                  ? "bg-amber-500 border-amber-600 text-amber-950"
                  : "bg-white border-gray-150 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Notification bell with badge */}
            <div className="relative cursor-pointer p-1" onClick={() => setActiveTab("alerts")}>
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#FCB813] text-amber-950 text-[9px] font-mono font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                12
              </span>
            </div>

            {/* User profile card exactly like screenshot */}
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-gray-100 shadow-xs cursor-pointer hover:bg-gray-50/50 transition animate-fade-in" onClick={() => setActiveTab("settings")}>
              <img 
                src="/src/assets/images/john_beekeeper_1783051682866.jpg" 
                alt="John Beekeeper Profile"
                className="w-8 h-8 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-gray-900 leading-none">John Beekeeper</div>
                <span className="text-[9px] text-gray-400 font-semibold block mt-0.5">Rucher de la Vallée Verte</span>
              </div>
              <svg className="w-3 h-3 text-gray-400 ml-1 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel Canvas */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 pt-2">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-xs text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600 mb-2.5" />
              Synchronisation du réseau de capteurs...
            </div>
          ) : (
            renderCurrentTab()
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* COLLAPSIBLE RIGHT SIDEBAR: IoT SIMULATOR TESTBED          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showTestbed && (
          <>
            {/* Backdrop for testbed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTestbed(false)}
              className="fixed inset-0 bg-black/60 z-45"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-slate-900 border-l border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 overflow-y-auto h-full z-50 fixed right-0 top-0 bottom-0 w-full sm:w-[400px] shadow-2xl"
            >
              <div className="p-6 flex flex-col h-full justify-between min-h-[600px]">
                <div>
                  {/* Header */}
                  <div className="border-b border-slate-800 pb-4 mb-5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                        BANC DE TEST MATÉRIEL IoT v2.5
                      </span>
                      <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
                        <Sliders className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                        Simulateur de Capteurs Connectés
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowTestbed(false)}
                      className="text-slate-500 hover:text-slate-300 text-sm cursor-pointer p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Simulez des anomalies de télémétrie en temps réel pour déclencher instantanément des alertes.
                  </p>

                  {/* Simulated Triggers */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-slate-950/80 p-4.5 rounded-2xl border border-slate-800/80 text-xs">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Wifi className="w-4 h-4 text-amber-400" />
                        Sélectionner une anomalie à simuler :
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleTriggerSimulation("swarm")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition font-semibold text-left flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          🐝 Essaimage
                        </button>
                        <button
                          onClick={() => handleTriggerSimulation("tilted")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition font-semibold text-left flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          🚨 Renversée
                        </button>
                        <button
                          onClick={() => handleTriggerSimulation("opened")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition font-semibold text-left flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          📦 Ouverte
                        </button>
                        <button
                          onClick={() => handleTriggerSimulation("predator")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition font-semibold text-left flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          🐻 Prédateur
                        </button>
                        <button
                          onClick={() => handleTriggerSimulation("freeze")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition font-semibold text-left flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          ❄️ Gel couvain
                        </button>
                        <button
                          onClick={() => handleTriggerSimulation("good")}
                          className="bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-400 py-2.5 px-3 rounded-xl transition font-bold text-left flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          ✅ Normal
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* LTE-M Cellular logs */}
                  <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800/80">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Flux cellulaire LTE-M / LoRa
                    </h3>

                    <div className="space-y-2 h-[180px] overflow-y-auto text-[11px] font-mono scrollbar-none">
                      {simLogs.map((log) => (
                        <div key={log.id} className="flex gap-2.5 items-start">
                          <span className="text-slate-500 shrink-0">{log.time}</span>
                          <span className={`${
                             log.type === "success"
                               ? "text-emerald-400 font-bold"
                               : log.type === "warning"
                               ? "text-red-400 font-bold"
                               : "text-slate-400"
                           }`}>
                            {log.msg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-800 pt-4.5 mt-5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-amber-400" /> PROTOCOLE STABLE
                  </span>
                  <span>© BEEGUARD FRANCE</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ADD NEW HIVE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] max-w-sm w-full p-6 shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Ajouter une nouvelle ruche connectée</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddHive} className="space-y-4 text-xs text-gray-700 font-sans">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1.5">Identification de la ruche</label>
                  <input
                    type="text"
                    required
                    value={newHiveName}
                    onChange={(e) => setNewHiveName(e.target.value)}
                    placeholder="ex. Ruche A06 (Rucher des Plaines)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-semibold mb-1.5">Sélection du Rucher</label>
                  <select
                    value={newHiveApiary}
                    onChange={(e) => setNewHiveApiary(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Rucher de la Vallée Verte">Rucher de la Vallée Verte</option>
                    <option value="Rucher de la Prairie">Rucher de la Prairie</option>
                    <option value="Rucher de la Côte">Rucher de la Côte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 font-semibold mb-1.5">Statut de la reine (Marquage/Âge)</label>
                  <input
                    type="text"
                    required
                    value={newHiveQueen}
                    onChange={(e) => setNewHiveQueen(e.target.value)}
                    placeholder="ex. Marquée Jaune (2025)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-2.5 rounded-xl transition cursor-pointer text-center text-xs"
                  >
                    Créer la ruche
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition cursor-pointer text-xs"
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
}
