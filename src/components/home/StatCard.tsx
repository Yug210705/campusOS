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
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl text-white shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black">{value}</h3>
            {subtitle && <span className="text-xs font-medium text-indigo-200">{subtitle}</span>}
          </div>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{value}</h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        {subtitle && <p className="text-[10px] font-medium text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
