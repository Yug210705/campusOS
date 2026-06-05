"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  title: string;
  icon: LucideIcon;
  href: string;
  primary?: boolean;
}

export default function QuickAction({ title, icon: Icon, href, primary }: QuickActionProps) {
  return (
    <Link href={href} className={primary ? "col-span-2" : "col-span-1"}>
      <div className={`h-20 rounded-2xl p-3 flex flex-col justify-between border shadow-sm transition-colors active:scale-[0.98] ${
        primary 
          ? "bg-slate-900 border-slate-800 text-white" 
          : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex justify-between items-start">
          <Icon className={`w-5 h-5 ${primary ? "text-indigo-400" : "text-slate-500"}`} />
        </div>
        <span className="text-xs font-bold leading-tight">{title}</span>
      </div>
    </Link>
  );
}
