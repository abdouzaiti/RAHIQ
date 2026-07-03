import React from "react";
import { motion } from "motion/react";

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  colorClass: string;
  icon?: React.ReactNode;
}

export const SemiCircleGauge: React.FC<GaugeProps> = ({
  value,
  min,
  max,
  label,
  unit,
  colorClass,
  icon,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const radius = 50;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center bg-white p-5 rounded-[22px] border border-gray-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200">
      <div className="flex items-center gap-2 mb-3 text-gray-500 font-sans font-medium text-xs tracking-wider uppercase">
        {icon}
        <span>{label}</span>
      </div>
      
      <div className="relative w-36 h-20 flex justify-center items-end overflow-hidden">
        <svg className="w-32 h-16 transform scale-y-100" viewBox="0 0 120 60">
          {/* Base track */}
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active arc */}
          <motion.path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={colorClass}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
        </svg>

        {/* Center reading */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <motion.span 
            className="text-2xl font-sans font-bold text-gray-800 tracking-tight"
            key={value}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {value.toFixed(1)}
          </motion.span>
          <span className="text-[10px] font-mono font-medium text-gray-400 mt-0.5">{unit}</span>
        </div>
      </div>
    </div>
  );
};

interface StandardGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  icon?: React.ReactNode;
}

export const RadialCircularGauge: React.FC<StandardGaugeProps> = ({
  value,
  max,
  label,
  unit,
  color,
  icon
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = 40;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-[22px] border border-gray-100/80 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
      <div className="relative w-20 h-20 flex justify-center items-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={stroke}
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-[10px] font-sans font-semibold tracking-wider uppercase mb-0.5">{label}</div>
        <div className="text-base font-bold text-gray-800 font-sans tracking-tight">
          {value.toFixed(1)} <span className="text-xs font-medium text-gray-400 font-mono">{unit}</span>
        </div>
      </div>
    </div>
  );
};
