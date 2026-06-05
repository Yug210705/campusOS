"use client";

import { useState } from "react";
import { Home, Compass, MessageCircle, LayoutGrid, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Learn", href: "/", icon: Home },
  { name: "Live", href: "/live", icon: Compass },
  { name: "Connect", href: "/connect", icon: MessageCircle },
];

const quickActions = [
  { emoji: "📸", name: "Capture Board", desc: "Instantly capture whiteboard lecture notes", href: "/capture" },
  { emoji: "📝", name: "Start Revision", desc: "Quick revision, recall drills, or review flashcards", href: "/revise" },
  { emoji: "🎯", name: "Interview Prep", desc: "Master typical questions and common mistakes", href: "/notes" },
  { emoji: "📦", name: "Sell Item", desc: "List textbooks, electronics, or campus essentials", href: "/connect/exchange/create" },
  { emoji: "🔍", name: "Report Lost Item", desc: "Broadcast a lost or found report to campus", href: "/connect/lost-found?report=true" }
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  if (pathname === '/login') return null;

  return (
    <>
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
            {/* Global CampusOS Launcher FAB */}
            <button 
              onClick={() => setIsLauncherOpen(true)}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full shadow-lg shadow-indigo-600/25 flex items-center justify-center border-4 border-white active:scale-95 transition-transform group"
            >
              <LayoutGrid className="w-5.5 h-5.5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Right Side */}
          <div className="flex justify-around flex-1">
            {navItems.slice(2, 3).map((item) => {
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

      {/* Global Quick Actions Sheet */}
      <AnimatePresence>
        {isLauncherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm max-w-md mx-auto"
          >
            {/* Tap backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsLauncherOpen(false)} />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col gap-5 pb-12"
            >
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-2 mb-1 shrink-0" />

              {/* Header */}
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-none">CampusOS Launcher</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    Launch learning & community actions
                  </p>
                </div>
                <button
                  onClick={() => setIsLauncherOpen(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions List */}
              <div className="flex flex-col gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    onClick={() => setIsLauncherOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 rounded-2xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0 leading-none">{action.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-none">{action.name}</p>
                          <p className="text-[9px] font-semibold text-slate-450 mt-1">{action.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
