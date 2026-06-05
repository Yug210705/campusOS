"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "hero" | "dense";
}

export default function StatCard({ title, value, subtitle, icon: Icon, variant = "dense" }: StatCardProps) {
  if (variant === "hero") {
    // Split value for styling (e.g., "12" and "Days")
    const valueStr = value.toString();
    const splitIndex = valueStr.indexOf(' ');
    const mainValue = splitIndex > -1 ? valueStr.substring(0, splitIndex) : valueStr;
    const subValue = splitIndex > -1 ? valueStr.substring(splitIndex + 1) : "";

    return (
      <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-lg shadow-slate-900/10 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
        {/* Subtle top inner border for premium depth */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Soft radial glow for elegance */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="flex justify-between items-start relative z-10">
          <h2 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{title}</h2>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10">
            <Icon className="w-5 h-5 text-indigo-300" strokeWidth={2} />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight text-white">{mainValue}</span>
            {subValue && <span className="text-xl font-medium text-slate-400">{subValue}</span>}
          </div>
          {subtitle && (
            <div className="text-xs font-medium text-slate-400 pb-1.5">{subtitle}</div>
          )}
        </div>
      </div>
    );
  }

  // Premium, minimalist dense cards
  let iconBg = "bg-slate-50";
  let iconColor = "text-slate-600";
  let iconBorder = "border-slate-200/50";

  if (title === "PLACEMENT") {
    iconBg = "bg-emerald-50";
    iconColor = "text-emerald-600";
    iconBorder = "border-emerald-100";
  } else if (title === "CONFIDENCE") {
    iconBg = "bg-amber-50";
    iconColor = "text-amber-600";
    iconBorder = "border-amber-100";
  } else if (title === "CONCEPTS") {
    iconBg = "bg-blue-50";
    iconColor = "text-blue-600";
    iconBorder = "border-blue-100";
  } else if (title === "STUDY TIME") {
    iconBg = "bg-indigo-50";
    iconColor = "text-indigo-600";
    iconBorder = "border-indigo-100";
  }

  return (
    <div className="bg-white rounded-[16px] p-3.5 shadow-sm border border-slate-200/70 hover:border-slate-300 transition-colors flex flex-col gap-2.5 cursor-default">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${iconBg} ${iconBorder}`}>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} strokeWidth={2.5} />
        </div>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{title}</p>
      </div>
      
      <div className="pl-1">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 leading-none">{value}</h3>
        {subtitle && <p className="text-[10px] font-medium text-slate-400 mt-1.5">{subtitle}</p>}
      </div>
    </div>
  );
}
