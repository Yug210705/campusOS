"use client";

import { Home, Compass, MessageCircle, PackageSearch, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Learn", href: "/", icon: Home },
  { name: "Live", href: "/live", icon: Compass },
  { name: "Connect", href: "/connect", icon: MessageCircle },
  { name: "Find", href: "/lost-and-found", icon: PackageSearch },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-6 pt-2 px-2 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        
        {/* Left Side */}
        <div className="flex justify-around flex-1">
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-12 h-10"
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span className={`text-[9px] font-bold ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Center Spacer for FAB */}
        <div className="w-16 flex-shrink-0 relative">
          {/* Global AI FAB */}
          <button className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center border-4 border-white active:scale-95 transition-transform">
            <Sparkles className="w-7 h-7" />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex justify-around flex-1">
          {navItems.slice(2, 4).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-12 h-10"
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span className={`text-[9px] font-bold ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
