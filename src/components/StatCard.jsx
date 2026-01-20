import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color = "blue", trend, trendDirection = "up" }) => {
  
  // Color Mapping System
  // This allows you to just pass 'blue', 'emerald', etc., and it handles all shades automatically.
  const themes = {
    blue:    { bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-600",    icon: "bg-blue-100" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", icon: "bg-emerald-100" },
    purple:  { bg: "bg-purple-50",  border: "border-purple-100",  text: "text-purple-600",  icon: "bg-purple-100" },
    amber:   { bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-600",   icon: "bg-amber-100" },
    red:     { bg: "bg-red-50",     border: "border-red-100",     text: "text-red-600",     icon: "bg-red-100" },
    indigo:  { bg: "bg-indigo-50",  border: "border-indigo-100",  text: "text-indigo-600",  icon: "bg-indigo-100" },
  };

  const theme = themes[color] || themes.blue;

  return (
    <div className={`
      ${theme.bg} ${theme.border} 
      border rounded-2xl p-6 
      shadow-sm hover:shadow-md 
      transition-all duration-300 ease-in-out 
      hover:-translate-y-1
    `}>
      <div className="flex justify-between items-start mb-4">
        {/* Icon Box */}
        <div className={`p-3 rounded-xl ${theme.icon} ${theme.text} bg-opacity-50`}>
          {icon}
        </div>

        {/* Trend Indicator (Optional) */}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trendDirection === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trendDirection === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>

      {/* Main Data */}
      <div>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;