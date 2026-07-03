export interface Telemetry {
  temperature: number;
  humidity: number;
  weight: number;
  battery: number;
  solarVoltage: number;
  batteryVoltage: number;
  beeActivity: number;
  soundLevel: number;
  tilt: boolean;
  opened: boolean;
  signalStrength: number;
}

export interface InspectionLog {
  id: string;
  date: string;
  queenSeen: boolean;
  broodStatus: "excellent" | "moderate" | "poor" | "none";
  eggsSeen: boolean;
  honeyRating: number;
  framesCount: number;
  diseasesSeen: string;
  treatmentApplied: string;
  notes: string;
  images: string[];
}

export interface Alert {
  id: string;
  timestamp: string;
  type: string;
  priority: "low" | "medium" | "critical";
  title: string;
  message: string;
  recommendation: string;
  resolved: boolean;
}

export interface Hive {
  id: string;
  name: string;
  apiary: string;
  gps: { lat: number; lng: number };
  firmwareVersion: string;
  queenStatus: string;
  lastSync: string;
  createdTime: string;
  telemetry: Telemetry;
  inspections: InspectionLog[];
  alerts: Alert[];
}

export type ViewType = "home" | "hives" | "analytics" | "alerts" | "profile" | "map" | "assistant";
