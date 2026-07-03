import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Activity,
  Droplets,
  Thermometer,
  Scale,
  Battery,
  AlertTriangle,
  MapPin,
  Search,
  Grid,
  List,
  ChevronRight,
  User,
  Sparkles,
  Sun,
  CloudRain,
  CloudSun,
  Wind,
  Plus,
  RefreshCw,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Trash2,
  Database,
  Bell,
  Heart,
  FileText,
  Workflow,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Download,
  Flame,
  Gauge,
  HelpCircle,
  TrendingUp,
  Wifi,
  MoreHorizontal
} from "lucide-react";
import { Hive, Alert, ViewType } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

// ============================================================================
// DUMMY OR REPLICATED LIVE DATA FOR PERFECT RECONCILIATION WITH SCREENSHOT
// ============================================================================

const HEALTH_COLORS = {
  healthy: "#22C55E",
  warning: "#F59E0B",
  critical: "#EF4444"
};

// ==========================================
// 1. DASHBOARD VIEW
// ==========================================
interface DashboardProps {
  hives: Hive[];
  onSelectHive: (id: string) => void;
  onNavigateTab: (tab: ViewType) => void;
  onOpenAddHive: () => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  hives,
  onSelectHive,
  onNavigateTab,
  onOpenAddHive,
}) => {
  // Line chart temperature data replicated perfectly from image
  const temperatureData = [
    { name: "00:00", A01: 30, A02: 32, A03: 33, A04: 26, A05: 24 },
    { name: "04:00", A01: 28, A02: 31, A03: 34, A04: 25, A05: 23 },
    { name: "08:00", A01: 33, A02: 35, A03: 37, A04: 31, A05: 29 },
    { name: "12:00", A01: 34.2, A02: 37.8, A03: 38.9, A04: 33.5, A05: 34.0 },
    { name: "16:00", A01: 36, A02: 39.5, A03: 38.0, A04: 35.2, A05: 35.8 },
    { name: "20:00", A01: 32, A02: 36.0, A03: 35.1, A04: 30.5, A05: 31.2 },
    { name: "24:00", A01: 30, A02: 33.0, A03: 34.5, A04: 27.2, A05: 26.5 }
  ];

  // Donut chart health data
  const healthPieData = [
    { name: "Healthy", value: 18, color: "#22C55E" },
    { name: "Warning", value: 4, color: "#F59E0B" },
    { name: "Critical", value: 2, color: "#EF4444" }
  ];

  return (
    <div className="space-y-6" id="dashboard-tab-panel">
      
      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Hives */}
        <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Total des ruches</span>
            <div className="text-[28px] font-bold text-gray-900 leading-none">24</div>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5">
              +2 ce mois-ci
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-xl">
            🐝
          </div>
        </div>

        {/* Healthy Hives */}
        <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Ruches saines</span>
            <div className="text-[28px] font-bold text-gray-900 leading-none">18</div>
            <span className="text-[11px] font-semibold text-gray-400">
              75% du total
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl text-emerald-500">
            ❤️
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Alertes actives</span>
            <div className="text-[28px] font-bold text-gray-900 leading-none">12</div>
            <button 
              onClick={() => onNavigateTab("alerts")}
              className="text-[11px] font-semibold text-amber-600 hover:underline text-left block"
            >
              Voir les alertes →
            </button>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl text-red-500">
            ⚠️
          </div>
        </div>

        {/* Total Weight */}
        <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Poids total</span>
            <div className="text-[28px] font-bold text-gray-900 leading-none">1 248 kg</div>
            <span className="text-[11px] font-semibold text-emerald-500">
              +48,3 kg cette semaine
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-xl text-purple-500">
            ⚖️
          </div>
        </div>

        {/* Honey Production */}
        <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Production de miel</span>
            <div className="text-[28px] font-bold text-gray-900 leading-none">86,4 kg</div>
            <span className="text-[11px] font-semibold text-emerald-500">
              +12,5% ce mois-ci
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-xl text-amber-500">
            💧
          </div>
        </div>

      </div>

      {/* Row 1: Hive Overview & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hive Overview Table */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">Aperçu des ruches</h3>
              <button 
                onClick={() => onNavigateTab("hives")}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
              >
                Voir toutes les ruches →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500">
                <thead className="text-[11px] text-gray-400 font-medium uppercase border-b border-gray-50 pb-2">
                  <tr>
                    <th className="py-2.5 font-medium">Nom de la ruche</th>
                    <th className="py-2.5 font-medium">Statut</th>
                    <th className="py-2.5 font-medium">Température</th>
                    <th className="py-2.5 font-medium">Humidité</th>
                    <th className="py-2.5 font-medium">Poids</th>
                    <th className="py-2.5 font-medium">Batterie</th>
                    <th className="py-2.5 font-medium">Dernière synchro</th>
                    <th className="py-2.5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-sans text-gray-700">
                  
                  {/* Hive A01 */}
                  <tr className="hover:bg-gray-50/40 transition cursor-pointer" onClick={() => onSelectHive("hive-alpha")}>
                    <td className="py-3.5 font-semibold flex items-center gap-2 text-gray-900">
                      <span className="text-lg">🪵</span> Ruche A01
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Saine
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">34.2°C</td>
                    <td className="py-3.5 font-mono">61%</td>
                    <td className="py-3.5 font-mono">42.3 kg</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-mono">
                        <Battery className="w-4 h-4 text-emerald-500 rotate-0" /> 91%
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400">il y a 2 min</td>
                    <td className="py-3.5 text-right text-gray-400"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                  </tr>

                  {/* Hive A02 */}
                  <tr className="hover:bg-gray-50/40 transition cursor-pointer" onClick={() => onSelectHive("hive-beta")}>
                    <td className="py-3.5 font-semibold flex items-center gap-2 text-gray-900">
                      <span className="text-lg">🪵</span> Ruche A02
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Attention
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">37.8°C</td>
                    <td className="py-3.5 font-mono">58%</td>
                    <td className="py-3.5 font-mono">38.7 kg</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-amber-600 font-mono">
                        <Battery className="w-4 h-4 text-amber-500" /> 18%
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400">il y a 5 min</td>
                    <td className="py-3.5 text-right text-gray-400"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                  </tr>

                  {/* Hive A03 */}
                  <tr className="hover:bg-gray-50/40 transition cursor-pointer" onClick={() => onSelectHive("hive-gamma")}>
                    <td className="py-3.5 font-semibold flex items-center gap-2 text-gray-900">
                      <span className="text-lg">🪵</span> Ruche A03
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-red-600">
                        <span className="w-2 h-2 rounded-full bg-red-500" /> Critique
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">38.9°C</td>
                    <td className="py-3.5 font-mono">62%</td>
                    <td className="py-3.5 font-mono">30.1 kg</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-red-600 font-mono">
                        <Battery className="w-4 h-4 text-red-500" /> 5%
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400">il y a 12 min</td>
                    <td className="py-3.5 text-right text-gray-400"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                  </tr>

                  {/* Hive A04 */}
                  <tr className="hover:bg-gray-50/40 transition cursor-pointer" onClick={() => onSelectHive("hive-alpha")}>
                    <td className="py-3.5 font-semibold flex items-center gap-2 text-gray-900">
                      <span className="text-lg">🪵</span> Ruche A04
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Saine
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">33.5°C</td>
                    <td className="py-3.5 font-mono">65%</td>
                    <td className="py-3.5 font-mono">41.8 kg</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-mono">
                        <Battery className="w-4 h-4 text-emerald-500" /> 76%
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400">il y a 3 min</td>
                    <td className="py-3.5 text-right text-gray-400"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                  </tr>

                  {/* Hive A05 */}
                  <tr className="hover:bg-gray-50/40 transition cursor-pointer" onClick={() => onSelectHive("hive-beta")}>
                    <td className="py-3.5 font-semibold flex items-center gap-2 text-gray-900">
                      <span className="text-lg">🪵</span> Ruche A05
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Saine
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">34.0°C</td>
                    <td className="py-3.5 font-mono">60%</td>
                    <td className="py-3.5 font-mono">39.5 kg</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-mono">
                        <Battery className="w-4 h-4 text-emerald-500" /> 82%
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400">il y a 1 min</td>
                    <td className="py-3.5 text-right text-gray-400"><MoreHorizontal className="w-4 h-4 ml-auto" /></td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Alerts Column */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">Alertes récentes</h3>
              <button 
                onClick={() => onNavigateTab("alerts")}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Tout voir →
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Alert 1 */}
              <div className="flex items-start gap-3.5 pb-3 border-b border-gray-50">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">Température Élevée</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">il y a 5 min</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Ruche A02 • 37.8°C</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600">
                    Haute
                  </span>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex items-start gap-3.5 pb-3 border-b border-gray-50">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Battery className="w-5 h-5 rotate-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">Batterie Faible</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">il y a 5 min</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Ruche A02 • 18%</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">
                    Moyenne
                  </span>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="flex items-start gap-3.5 pb-3 border-b border-gray-50">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">Risque d'Essaimage</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">il y a 1 h</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Ruche A03 • Modéré (32%)</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">
                    Moyenne
                  </span>
                </div>
              </div>

              {/* Alert 4 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <Wifi className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">Perte de signal</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">il y a 2 h</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Ruche A06</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600">
                    Haute
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Charts and Forecast (3 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Temperature Overview Line Chart */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">Aperçu de la température</h3>
              <div className="relative">
                <select className="bg-gray-50 border border-gray-150 text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none appearance-none pr-8 cursor-pointer text-gray-700">
                  <option>Aujourd'hui</option>
                  <option>Cette semaine</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#adb5bd" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[20, 45]} tick={{ fontSize: 10, fill: "#adb5bd" }} axisLine={false} tickLine={false} />
                  <Tooltip content={() => null} /> {/* Custom Tooltip HTML replica below */}
                  
                  <Line type="monotone" dataKey="A01" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="A02" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="A03" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="A04" stroke="#10b981" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="A05" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>

              {/* Stunning floating mockup interactive tooltip card exactly like screenshot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs border border-gray-150 rounded-xl p-3 shadow-lg pointer-events-none text-[10px] w-36 space-y-1.5 z-10">
                <div className="font-bold text-gray-800 border-b border-gray-100 pb-1 flex justify-between">
                  <span>12:00 PM</span>
                  <span className="text-gray-400 font-normal">En direct</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" /> Ruche A01
                    </span>
                    <span className="font-mono font-bold text-gray-800">34.2°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Ruche A02
                    </span>
                    <span className="font-mono font-bold text-gray-800">37.8°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" /> Ruche A03
                    </span>
                    <span className="font-mono font-bold text-gray-800">38.9°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Ruche A04
                    </span>
                    <span className="font-mono font-bold text-gray-800">33.5°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" /> Ruche A05
                    </span>
                    <span className="font-mono font-bold text-gray-800">34.0°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-[10px] text-gray-400 font-semibold font-sans">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Ruche A01</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Ruche A02</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> Ruche A03</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Ruche A04</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Ruche A05</span>
            </div>
          </div>
        </div>

        {/* Col 2: Hive Health Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Répartition de la santé</h3>
            
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {healthPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Donut Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-gray-900 leading-none">24</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Total Ruches</span>
              </div>
            </div>

            {/* Detailed list legend */}
            <div className="space-y-2 mt-4 text-xs font-sans text-gray-500 border-t border-gray-50 pt-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> Saines</span>
                <span className="font-mono font-bold text-gray-800">18 (75%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Attention</span>
                <span className="font-mono font-bold text-gray-800">4 (16,7%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Critiques</span>
                <span className="font-mono font-bold text-gray-800">2 (8,3%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Weather Forecast */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">Prévisions météo</h3>
              <button className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer">
                Prévisions complètes →
              </button>
            </div>

            {/* Central Weather Summary */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-50/70">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-3xl shrink-0">
                  ☀️
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">22°C</div>
                  <span className="text-[11px] text-gray-500 font-semibold mt-1 block">Plutôt ensoleillé</span>
                </div>
              </div>
              
              {/* Extra Stats */}
              <div className="text-[11px] space-y-1 text-gray-400 font-sans font-medium text-right">
                <div className="flex justify-between gap-4"><span>Humidité</span> <span className="text-gray-700 font-semibold font-mono">60%</span></div>
                <div className="flex justify-between gap-4"><span>Vent</span> <span className="text-gray-700 font-semibold font-mono">12 km/h</span></div>
                <div className="flex justify-between gap-4"><span>Pluie</span> <span className="text-gray-700 font-semibold font-mono">0 mm</span></div>
              </div>
            </div>

            {/* 5-Day Columns Grid */}
            <div className="grid grid-cols-5 gap-1 text-center mt-5">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Auj</span>
                <span className="text-lg block">☀️</span>
                <div className="text-[11px] font-bold text-gray-800 font-mono">22°C</div>
                <div className="text-[9px] text-gray-400 font-mono">12°C</div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Mar</span>
                <span className="text-lg block">🌧️</span>
                <div className="text-[11px] font-bold text-gray-800 font-mono">19°C</div>
                <div className="text-[9px] text-gray-400 font-mono">11°C</div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Mer</span>
                <span className="text-lg block">⛅</span>
                <div className="text-[11px] font-bold text-gray-800 font-mono">21°C</div>
                <div className="text-[9px] text-gray-400 font-mono">12°C</div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Jeu</span>
                <span className="text-lg block">☀️</span>
                <div className="text-[11px] font-bold text-gray-800 font-mono">23°C</div>
                <div className="text-[9px] text-gray-400 font-mono">13°C</div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Ven</span>
                <span className="text-lg block">🌧️</span>
                <div className="text-[11px] font-bold text-gray-800 font-mono">18°C</div>
                <div className="text-[9px] text-gray-400 font-mono">10°C</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row 3: AI Insight Banner spanning full width with Bee Image */}
      <div className="relative bg-[#FFFBF0] border border-amber-200/50 rounded-[24px] p-6 shadow-xs overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 z-0">
        
        {/* Decorative Honeycomb Faint Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="flex items-start gap-4 z-10 max-w-2xl">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">Analyse IA</span>
            <p className="text-sm text-amber-900 mt-1 font-medium leading-relaxed">
              <strong>Bonne nouvelle ! Vos ruches se portent bien.</strong> La production de miel a augmenté de 12,5 % ce mois-ci. Continuez ainsi !
            </p>
          </div>
        </div>

        {/* Bee Honeycomb Image Overlay on Right Side */}
        <img 
          src="/src/assets/images/honeybee_honeycomb_1783051521806.jpg" 
          alt="Honey bee on honeycomb"
          className="absolute right-36 top-0 bottom-0 w-64 h-full object-cover rounded-r-2xl opacity-40 mix-blend-multiply sm:opacity-95 pointer-events-none hidden md:block"
          referrerPolicy="no-referrer"
        />

        <div className="z-10 shrink-0 self-end md:self-center">
          <button 
            onClick={() => onNavigateTab("assistant")}
            className="bg-[#FCB813] hover:bg-[#e09f08] text-amber-950 font-bold text-xs py-3 px-5 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            Voir l'analyse complète →
          </button>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// 2. MY HIVES VIEW
// ==========================================
interface MyHivesProps {
  hives: Hive[];
  onSelectHive: (id: string) => void;
  onOpenAddHive: () => void;
}

export const MyHivesView: React.FC<MyHivesProps> = ({ hives, onSelectHive, onOpenAddHive }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "health" | "weight">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredHives = hives.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.apiary.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "weight") return b.telemetry.weight - a.telemetry.weight;
    
    const calcHealth = (h: Hive) => {
      let score = 100;
      if (h.telemetry.temperature < 32 || h.telemetry.temperature > 36.5) score -= 15;
      if (h.telemetry.humidity < 45 || h.telemetry.humidity > 65) score -= 10;
      return score;
    };
    return calcHealth(b) - calcHealth(a);
  });

  return (
    <div className="space-y-5 animate-fade-in" id="hives-tab-panel">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mes ruches connectées</h2>
          <p className="text-xs text-gray-400 mt-0.5">Statut en direct des nœuds IoT cellulaires et liaisons radio RF</p>
        </div>

        <button
          onClick={onOpenAddHive}
          className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Ajouter une ruche IoT
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une ruche ou un rucher..."
            className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-400">Trier par :</label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-150 rounded-lg text-xs py-2 px-3 focus:outline-none text-gray-700 font-semibold"
          >
            <option value="name">Nom de la colonie</option>
            <option value="health">Indice de santé</option>
            <option value="weight">Poids de miel</option>
          </select>

          <div className="h-6 w-[1px] bg-gray-200" />

          {/* View mode */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-150">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-white text-amber-600 shadow-xs" : "text-gray-400"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition ${viewMode === "list" ? "bg-white text-amber-600 shadow-xs" : "text-gray-400"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHives.map((hive) => {
            let score = 100;
            const { temperature, humidity, soundLevel, tilt, battery } = hive.telemetry;
            if (temperature < 32 || temperature > 36.5) score -= 15;
            if (humidity < 45 || humidity > 65) score -= 10;
            if (soundLevel > 70) score -= 15;
            if (battery < 40) score -= 10;
            if (tilt) score -= 30;
            const healthScore = Math.max(12, score);

            let scoreColor = "text-emerald-600 bg-emerald-50";
            if (healthScore < 60) scoreColor = "text-red-600 bg-red-50";
            else if (healthScore < 85) scoreColor = "text-amber-600 bg-amber-50";

            return (
              <div
                key={hive.id}
                onClick={() => onSelectHive(hive.id)}
                className="bg-white border border-gray-100 rounded-[22px] p-5 shadow-xs hover:shadow-md hover:border-gray-200 transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono tracking-wider font-semibold bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded uppercase">
                      {hive.apiary}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${scoreColor}`}>
                      Santé {healthScore}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mt-4 tracking-tight">🪵 {hive.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Reine : {hive.queenStatus}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 border-t border-gray-50 pt-4 mt-5">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <div>
                      <span className="text-[9px] text-gray-400 block font-sans">Temp. interne</span>
                      <span className="text-xs font-bold text-gray-700 font-mono">{hive.telemetry.temperature}°C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-[9px] text-gray-400 block font-sans">Poids de miel</span>
                      <span className="text-xs font-bold text-gray-700 font-mono">{hive.telemetry.weight} kg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-[9px] text-gray-400 block font-sans">Humidité</span>
                      <span className="text-xs font-bold text-gray-700 font-mono">{hive.telemetry.humidity}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-[9px] text-gray-400 block font-sans">Batterie</span>
                      <span className="text-xs font-bold text-gray-700 font-mono">{hive.telemetry.battery}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 font-sans border-t border-gray-50 pt-3 mt-4">
                  <span>Liaison RF : {hive.telemetry.signalStrength} dBm</span>
                  <span>Synchro : {new Date(hive.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[22px] overflow-hidden divide-y divide-gray-50 shadow-xs">
          {filteredHives.map((hive) => {
            let score = 100;
            const { temperature, humidity } = hive.telemetry;
            if (temperature < 32 || temperature > 36.5) score -= 15;
            if (humidity < 45 || humidity > 65) score -= 10;
            const healthScore = Math.max(12, score);

            let scoreColor = "text-emerald-600 bg-emerald-50";
            if (healthScore < 60) scoreColor = "text-red-600 bg-red-50";
            else if (healthScore < 85) scoreColor = "text-amber-600 bg-amber-50";

            return (
              <div
                key={hive.id}
                onClick={() => onSelectHive(hive.id)}
                className="p-4.5 hover:bg-gray-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl">
                    🪵
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{hive.name}</h4>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{hive.apiary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 font-mono text-[12px]">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-sans uppercase">Temp. interne</span>
                    {hive.telemetry.temperature}°C
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block font-sans uppercase">Poids</span>
                    {hive.telemetry.weight} kg
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block font-sans uppercase">Humidité</span>
                    {hive.telemetry.humidity}%
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block font-sans uppercase">Signal RF</span>
                    {hive.telemetry.signalStrength} dBm
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${scoreColor}`}>
                    Santé {healthScore}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. ALERTS VIEW
// ==========================================
interface AlertsProps {
  hives: Hive[];
  onResolveAlert: (hiveId: string, alertId: string) => Promise<void>;
  onSelectHive: (id: string) => void;
}

export const AlertsView: React.FC<AlertsProps> = ({ hives, onResolveAlert, onSelectHive }) => {
  const [filterMode, setFilterMode] = useState<"all" | "active" | "resolved">("active");

  const allAlerts: { hive: Hive; alert: Alert }[] = [];
  hives.forEach(h => {
    h.alerts.forEach(a => {
      allAlerts.push({ hive: h, alert: a });
    });
  });

  const filteredAlerts = allAlerts.filter(({ alert }) => {
    if (filterMode === "active") return !alert.resolved;
    if (filterMode === "resolved") return alert.resolved;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in" id="alerts-tab-panel">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Notifications push et alertes IoT</h2>
        <p className="text-xs text-gray-400 mt-0.5">Statut d'alerte en temps réel lié aux capteurs de la passerelle LoRa</p>
      </div>

      <div className="flex bg-white p-1 rounded-xl border border-gray-150 max-w-xs shadow-xs">
        {(["all", "active", "resolved"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg capitalize cursor-pointer transition ${
              filterMode === mode ? "bg-amber-500 text-amber-950 shadow-xs" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {mode === "all" ? "Toutes" : mode === "active" ? "Actives" : "Résolues"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-[22px] border border-gray-100 text-center flex flex-col items-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h3 className="text-base font-bold text-gray-700">Homéostasie parfaite</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Toutes les colonies d'abeilles ont des températures stables, des poids optimaux et des ruches parfaitement sécurisées. Aucune anomalie signalée.
            </p>
          </div>
        ) : (
          filteredAlerts.map(({ hive, alert }) => (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                alert.resolved ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl shrink-0 ${
                  alert.priority === "critical"
                    ? "bg-red-50 text-red-600"
                    : alert.priority === "medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">
                      {hive.apiary}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      alert.priority === "critical"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      Priorité {alert.priority === "critical" ? "Critique" : alert.priority === "medium" ? "Moyenne" : "Basse"}
                    </span>
                    <span className="text-[11px] text-gray-400 font-sans">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    {alert.title === "Temperature High" ? "Température élevée" :
                     alert.title === "Battery Low" ? "Batterie faible" :
                     alert.title === "Swarm Probability" ? "Risque d'essaimage" : alert.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xl">{alert.message}</p>
                  
                  <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-700 leading-relaxed">
                    <span className="font-bold text-amber-800 block mb-1">💡 Recommandation de l'expert :</span>
                    {alert.recommendation}
                  </div>

                  <span className="text-[11px] text-gray-400 font-semibold block mt-3 font-sans">
                    Lien de la ruche : <span className="text-amber-600 underline cursor-pointer" onClick={() => onSelectHive(hive.id)}>{hive.name}</span>
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                {!alert.resolved && (
                  <button
                    onClick={() => onResolveAlert(hive.id, alert.id)}
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition cursor-pointer"
                  >
                    Marquer résolue
                  </button>
                )}
                <button
                  onClick={() => onSelectHive(hive.id)}
                  className="flex-1 sm:flex-initial bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs py-2 px-3.5 rounded-xl transition cursor-pointer"
                >
                  Inspecter le nœud
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. GENERAL ANALYTICS VIEW
// ==========================================
interface AnalyticsProps {
  hives: Hive[];
}

export const AnalyticsView: React.FC<AnalyticsProps> = ({ hives }) => {
  const honeyTrend = [
    { month: "Janv", yield: 21, weight: 350 },
    { month: "Févr", yield: 24, weight: 380 },
    { month: "Mars", yield: 38, weight: 420 },
    { month: "Avril", yield: 55, weight: 510 },
    { month: "Mai", yield: 78, weight: 780 },
    { month: "Juin", yield: 86.4, weight: 1248 }
  ];

  const activityTrend = [
    { hour: "08:00", flight: 30, sound: 42 },
    { hour: "10:00", flight: 65, sound: 45 },
    { hour: "12:00", flight: 88, sound: 48 },
    { hour: "14:00", flight: 92, sound: 49 },
    { hour: "16:00", flight: 75, sound: 44 },
    { hour: "18:00", flight: 40, sound: 41 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Tableau de bord d'analyse avancée</h2>
        <p className="text-xs text-gray-400 mt-0.5">Analyses macro-écologiques et mesures de poids de haute précision</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Honey Yield Trend */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Poids total du rucher vs rendement de miel (tendance sur 6 mois)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={honeyTrend}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={() => null} />
                <Area type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flight & Foraging Activity */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Index de butinage en vol en direct et niveaux sonores (aujourd'hui)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={() => null} />
                <Bar dataKey="flight" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Activité de vol (Hz)" />
                <Bar dataKey="sound" fill="#10b981" radius={[4, 4, 0, 0]} name="Fréquence sonore (dB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 5. INSPECTION LOGS VIEW
// ==========================================
export const InspectionLogView: React.FC = () => {
  const mockInspections = [
    { id: "1", date: "28 juin 2026", hive: "Ruche A01", queen: "Repérée (marquée en jaune)", brood: "Excellent", honey: "5/5 cadres", notes: "Grande miellée de trèfle. Les abeilles sont extrêmement dociles et saines." },
    { id: "2", date: "25 juin 2026", hive: "Ruche A02", queen: "Non repérée (œufs frais présents)", brood: "Modéré", honey: "3/5 cadres", notes: "Traitement contre le varroa mineur. Installation d'une plaque collante." },
    { id: "3", date: "20 juin 2026", hive: "Ruche A03", queen: "Repérée (vierge)", brood: "Aucun", honey: "1/5 cadre", notes: "La colonie est nerveuse. Éclosion attendue d'une cellule de sauvetage d'urgence." }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Registre d'inspection physique</h2>
        <p className="text-xs text-gray-400 mt-0.5">Journaux manuels et inspections de couvain soumis par Jean Apiculteur</p>
      </div>

      <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-800">Historique des entrées d'inspection</span>
          <button className="bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Enregistrer une inspection physique
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {mockInspections.map((ins) => (
            <div key={ins.id} className="p-6 hover:bg-gray-50/30 transition">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Inspection {ins.hive}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">{ins.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Couvain : {ins.brood}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Miel : {ins.honey}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                <strong>Notes :</strong> {ins.notes}
              </p>
              <div className="text-[10px] text-gray-400 mt-2 font-mono">
                Statut de la reine : <span className="text-gray-700 font-semibold">{ins.queen}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. HONEY PRODUCTION VIEW
// ==========================================
export const HoneyProductionView: React.FC = () => {
  const honeyHarvests = [
    { date: "15 juin 2026", apiary: "Rucher de la Vallée Verte", amount: "42.5 kg", quality: "A+ Extra Light", color: "Blanc d'eau" },
    { date: "20 mai 2026", apiary: "Rucher de la Vallée Verte", amount: "28.3 kg", quality: "A Golden Honey", color: "Ambre extra clair" },
    { date: "10 avril 2026", apiary: "Rucher de la Prairie", amount: "15.6 kg", quality: "B Clover blend", color: "Ambre clair" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Registre d'extraction de miel</h2>
        <p className="text-xs text-gray-400 mt-0.5">Enregistrements de récolte, sources de nectar floral et taux de sucre au réfractomètre</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
          <span className="text-2xl">🍯</span>
          <h4 className="text-xs text-gray-400 uppercase font-semibold">Total récolté</h4>
          <p className="text-2xl font-extrabold text-gray-900">86.4 kg</p>
          <span className="text-[10px] text-emerald-500 font-bold block">+12.5% cette saison</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
          <span className="text-2xl">🧪</span>
          <h4 className="text-xs text-gray-400 uppercase font-semibold">Humidité moyenne</h4>
          <p className="text-2xl font-extrabold text-gray-900">17.2%</p>
          <span className="text-[10px] text-emerald-500 font-bold block">Gamme de conservation parfaite</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
          <span className="text-2xl">🌺</span>
          <h4 className="text-xs text-gray-400 uppercase font-semibold">Nectar dominant</h4>
          <p className="text-2xl font-extrabold text-gray-900">Trèfle blanc</p>
          <span className="text-[10px] text-gray-400 font-bold block">Qualité monoflorale supérieure</span>
        </div>
      </div>

      <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/40">
          <span className="text-xs font-bold text-gray-800">Registre des sessions d'extraction</span>
          <button className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Exporter le registre
          </button>
        </div>
        <table className="w-full text-left text-xs text-gray-500">
          <thead className="bg-gray-50/20 text-[10px] uppercase text-gray-400 border-b border-gray-50 font-bold">
            <tr>
              <th className="p-4">Date de récolte</th>
              <th className="p-4">Rucher d'origine</th>
              <th className="p-4">Rendement net</th>
              <th className="p-4">Pureté du sucre</th>
              <th className="p-4">Échelle de couleur Pfund</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-sans text-gray-700">
            {honeyHarvests.map((har, i) => (
              <tr key={i} className="hover:bg-gray-50/30">
                <td className="p-4 font-semibold">{har.date}</td>
                <td className="p-4">{har.apiary}</td>
                <td className="p-4 font-mono font-bold text-emerald-600">{har.amount}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">{har.quality}</span></td>
                <td className="p-4 text-amber-700 font-medium">{har.color}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 7. DEVICES VIEW
// ==========================================
export const DevicesView: React.FC = () => {
  const meshDevices = [
    { name: "Passerelle IoT #01", status: "En ligne", type: "Hub Maître LTE-M", battery: "100% (Solaire)", signal: "Excellent (-54 dBm)", firmware: "v2.5.1-OTA" },
    { name: "Nœud de ruche A01", status: "En ligne", type: "Sous-capteur LoRa", battery: "91% (Solaire)", signal: "Bon (-65 dBm)", firmware: "v2.5.0" },
    { name: "Nœud de ruche A02", status: "En ligne", type: "Sous-capteur LoRa", battery: "18% (Attention)", signal: "Moyen (-78 dBm)", firmware: "v2.5.0" },
    { name: "Nœud de ruche A03", status: "En ligne", type: "Sous-capteur LoRa", battery: "5% (Critique)", signal: "Faible (-92 dBm)", firmware: "v2.4.9" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Registre du matériel réseau IoT</h2>
        <p className="text-xs text-gray-400 mt-0.5">Passerelles cellulaires, points d'accès LoRa et diagnostics de chargeurs solaires</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {meshDevices.map((dev, i) => (
          <div key={i} className="bg-white p-5 rounded-[22px] border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📟</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{dev.name}</h4>
                  <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">{dev.type}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {dev.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-50 py-3 mt-4 text-[11px] font-sans">
              <div>
                <span className="text-gray-400 block">Alimentation batterie</span>
                <span className="font-bold text-gray-700 font-mono">{dev.battery}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Liaison RF LoRa</span>
                <span className="font-bold text-gray-700 font-mono">{dev.signal}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Firmware de l'OS</span>
                <span className="font-bold text-gray-700 font-mono">{dev.firmware}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3">
              <span>Protocole de synchro : LoRaWAN 1.0.4</span>
              <button className="text-amber-600 hover:text-amber-700 font-bold">Mettre à jour le firmware →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. PROFILE / RESET / SETTINGS COMPONENT
// ==========================================
interface ProfileProps {
  onReset: () => Promise<void>;
}

export const ProfileView: React.FC<ProfileProps> = ({ onReset }) => {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    await onReset();
    setTimeout(() => setResetting(false), 1000);
  };

  return (
    <div className="bg-white rounded-[22px] border border-gray-100 p-6 shadow-sm space-y-6" id="profile-tab-panel">
      
      {/* Profile Info */}
      <div className="flex items-center gap-4 pb-5 border-b border-gray-50">
        <div className="w-16 h-16 rounded-[20px] bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
          JA
        </div>
        <div>
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded uppercase font-sans">
            Apiculteur en chef
          </span>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight mt-1">Jean Apiculteur</h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">jean.apiculteur@greenvalley.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/40">
          <Award className="w-5 h-5 text-amber-500 mb-2" />
          <span className="text-[10px] text-gray-400 block">Niveau d'abonnement</span>
          <span className="text-sm font-bold text-gray-800 tracking-tight mt-1">Enterprise Apiary Pro</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/40">
          <BookOpen className="w-5 h-5 text-emerald-500 mb-2" />
          <span className="text-[10px] text-gray-400 block">Passerelles LoRa enregistrées</span>
          <span className="text-sm font-bold text-gray-800 tracking-tight mt-1">5 hubs maîtres actifs</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-2">
          <Database className="w-4 h-4 text-amber-600" />
          Bac à sable de simulation IoT
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          Effacez instantanément les données factices en mémoire, réinitialisez le poids simulé et les chutes de batterie à leurs états par défaut d'origine.
        </p>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {resetting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Réinitialisation des capteurs...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" /> Réinitialiser les données de démo IoT
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 9. MAP / USERS / SETTINGS / REPORTS PLACEHOLDERS
// ==========================================

export const UsersView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Annuaire de l'équipe d'apiculture</h2>
        <p className="text-xs text-gray-400 mt-0.5">Gérer les autorisations, les apiculteurs et les listes d'accès aux ruchers</p>
      </div>
      <div className="bg-white rounded-[22px] border border-gray-100 p-6 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-xl shrink-0">🧑‍🌾</div>
        <div>
          <h4 className="font-bold text-gray-900">Jean Apiculteur (Administrateur)</h4>
          <p className="text-xs text-gray-500">Accès accordé : Contrôle total • Rucher de la Vallée Verte & Rucher de la Prairie</p>
        </div>
      </div>
    </div>
  );
};

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Rapports de synthèse PDF</h2>
        <p className="text-xs text-gray-400 mt-0.5">Générer des synthèses hebdomadaires de santé écologique et de rendement de miel</p>
      </div>
      <div className="bg-white rounded-[22px] border border-gray-100 p-6 shadow-xs space-y-4">
        <p className="text-xs text-gray-500">Sélectionnez la période de rapport pour générer des certificats de rendement de miel cryptographiques complets.</p>
        <button className="bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold py-2 px-4 rounded-xl transition">
          Générer le rapport hebdomadaire PDF
        </button>
      </div>
    </div>
  );
};
