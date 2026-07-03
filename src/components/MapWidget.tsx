import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation, Compass, Plus, Minus, Maximize2, MapPin, Eye, Info, Calendar } from "lucide-react";
import { Hive } from "../types";

interface MapWidgetProps {
  hives: Hive[];
  onSelectHive: (hiveId: string) => void;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ hives, onSelectHive }) => {
  const [selectedPin, setSelectedPin] = useState<Hive | null>(null);
  const [zoomLevel, setZoomLevel] = useState(13);

  // Normalize map coordinates within our visual vector canvas bounds
  // We'll map San Francisco coordinate averages to visual positions on the custom vector layout
  const mapWidth = 800;
  const mapHeight = 500;

  // Render a simulated visual terrain layout with rich topographical contours
  return (
    <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full" id="map-widget-panel">
      {/* Top Map Action Bar */}
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-emerald-600 animate-spin" style={{ animationDuration: "10s" }} />
            Cartographie de précision du rucher
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">GPS RTK double canal précis à 2,5 cm</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(18, prev + 1))}
            className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(10, prev - 1))}
            className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-6 w-[1px] bg-gray-200 mx-1" />
          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
            VERROU GPS : RTK
          </span>
        </div>
      </div>

      {/* Main Map Stage */}
      <div className="relative flex-1 bg-slate-900/95 overflow-hidden min-h-[400px]">
        {/* Animated Vector Topography Background */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 800 500">
            {/* Contours */}
            <path d="M-100 200 C150 180 300 350 500 280 C650 230 750 380 900 320" fill="none" stroke="#22C55E" strokeWidth="2" />
            <path d="M-100 250 C200 230 350 390 550 320 C700 270 800 420 950 360" fill="none" stroke="#22C55E" strokeWidth="1" />
            <path d="M-100 150 C100 130 250 310 450 240 C600 190 700 340 850 280" fill="none" stroke="#22C55E" strokeWidth="1" />
            <path d="M-100 100 C50 80 200 270 400 200 C550 150 650 300 800 240" fill="none" stroke="#22C55E" strokeWidth="0.5" />
            
            {/* Forest patches */}
            <circle cx="200" cy="120" r="80" fill="#22C55E" opacity="0.1" />
            <circle cx="650" cy="380" r="100" fill="#22C55E" opacity="0.1" />
            <circle cx="450" cy="220" r="60" fill="#22C55E" opacity="0.05" />

            {/* Gridlines */}
            <line x1="100" y1="0" x2="100" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="200" y1="0" x2="200" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="300" y1="0" x2="300" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="400" y1="0" x2="400" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="600" y1="0" x2="600" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="700" y1="0" x2="700" y2="500" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="0" y1="300" x2="800" y2="300" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="#FFFFFF" strokeWidth="0.2" opacity="0.2" />
          </svg>
        </div>

        {/* Dynamic Flight Radar Line */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black pointer-events-none" />

        {/* Visual Apiary Boundary Rings */}
        <div className="absolute top-[28%] left-[45%] w-72 h-72 border border-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[28%] left-[45%] w-72 h-72 border border-emerald-500/20 rounded-full flex items-center justify-center">
          <span className="text-[9px] font-mono tracking-widest text-emerald-500/40 uppercase">Zone centrale du rucher</span>
        </div>

        {/* Render Hives as GPS Pins */}
        {hives.map((hive, idx) => {
          // Map index or lat/lng fraction to beautiful visual spots
          let leftPercent = "40%";
          let topPercent = "40%";
          if (hive.id === "hive-alpha") { leftPercent = "48%"; topPercent = "38%"; }
          else if (hive.id === "hive-beta") { leftPercent = "58%"; topPercent = "54%"; }
          else if (hive.id === "hive-gamma") { leftPercent = "32%"; topPercent = "62%"; }
          else {
            leftPercent = `${25 + (idx * 15) % 60}%`;
            topPercent = `${25 + (idx * 20) % 55}%`;
          }

          const hasCriticalAlert = hive.alerts.some(a => !a.resolved && a.priority === "critical");
          const hasMediumAlert = hive.alerts.some(a => !a.resolved && a.priority === "medium");
          
          let color = "bg-emerald-500";
          let shadowColor = "rgba(16, 185, 129, 0.5)";
          if (hasCriticalAlert) {
            color = "bg-red-500";
            shadowColor = "rgba(239, 68, 68, 0.8)";
          } else if (hasMediumAlert) {
            color = "bg-amber-500";
            shadowColor = "rgba(245, 158, 11, 0.7)";
          }

          return (
            <div
              key={hive.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{ left: leftPercent, top: topPercent }}
              onClick={() => setSelectedPin(hive)}
            >
              {/* Ping Ring */}
              <span className={`absolute -inset-2.5 rounded-full opacity-60 animate-ping`} style={{ backgroundColor: shadowColor, animationDuration: "3s" }} />
              
              {/* Marker pin */}
              <div className={`relative h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg transition-transform duration-300 group-hover:scale-125 ${color}`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Minimal tooltip */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700/60 text-white text-[10px] py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap font-sans shadow-md">
                {hive.name}
              </div>
            </div>
          );
        })}

        {/* Selected Hive Overlay Dialog */}
        <AnimatePresence>
          {selectedPin && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white border border-gray-100 rounded-[20px] shadow-2xl z-30 p-4.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono tracking-wider font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">
                    {selectedPin.apiary}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1.5">{selectedPin.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                  <span className="text-[10px] text-gray-400 font-sans">Nid à couvain</span>
                  <div className="text-xs font-bold text-gray-800 font-mono mt-0.5">
                    {selectedPin.telemetry.temperature}°C
                  </div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                  <span className="text-[10px] text-gray-400 font-sans">Gain de poids</span>
                  <div className="text-xs font-bold text-gray-800 font-mono mt-0.5">
                    {selectedPin.telemetry.weight} kg
                  </div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                  <span className="text-[10px] text-gray-400 font-sans">Niveau sonore</span>
                  <div className="text-xs font-bold text-gray-800 font-mono mt-0.5">
                    {selectedPin.telemetry.soundLevel} dB
                  </div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                  <span className="text-[10px] text-gray-400 font-sans">Signal RSSI</span>
                  <div className="text-xs font-bold text-gray-800 font-mono mt-0.5">
                    {selectedPin.telemetry.signalStrength} dBm
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    onSelectHive(selectedPin.id);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Télémétrie
                </button>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="bg-gray-50 border border-gray-200 text-gray-600 text-xs py-2 px-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal compass overlay */}
        <div className="absolute top-4 right-4 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 flex flex-col items-center shadow">
          <Navigation className="w-4 h-4 text-emerald-400 transform -rotate-45" />
          <span className="text-[8px] font-mono text-slate-400 mt-1">N</span>
        </div>
      </div>
    </div>
  );
};
