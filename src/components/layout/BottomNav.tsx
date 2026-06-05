"use client";

import { useState } from "react";
import { Home, Compass, MessageCircle, LayoutGrid, X, ChevronRight, Camera, BookOpen, Target, Package, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Learn", href: "/", icon: Home },
  { name: "Live", href: "/live", icon: Compass },
  { name: "Connect", href: "/connect", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
];

const quickActions = [
  { icon: Camera, name: "Capture Board", desc: "Instantly capture whiteboard lecture notes", href: "/capture" },
  { icon: BookOpen, name: "Start Revision", desc: "Quick revision, recall drills, or review flashcards", href: "/revise" },
  { icon: Target, name: "Interview Prep", desc: "Master typical questions and common mistakes", href: "/notes" },
  { icon: Package, name: "Sell Item", desc: "List textbooks, electronics, or campus essentials", href: "/connect/exchange/create" },
  { icon: Search, name: "Report Lost Item", desc: "Broadcast a lost or found report to campus", href: "/connect/lost-found?report=true" }
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  if (pathname === '/login') return null;

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAEAEA] z-50 h-[72px]"
        style={{ boxShadow: "0 -2px 20px rgba(15,23,42,0.04)" }}
      >
        <div className="relative w-full max-w-md mx-auto px-3 h-full">
          
          {/* Navigation Tabs (Distributed via 5-column grid for perfect centering) */}
          <div className="grid grid-cols-5 items-center h-[58px] w-full pt-1">
            
            {/* Slot 1: Learn */}
            <Link
              href="/"
              className="flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95 relative"
            >
              <Home className={`w-[20px] h-[20px] transition-colors duration-200 ${pathname === "/" ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`} />
              <span className={`text-[11px] font-semibold mt-1 transition-colors duration-200 ${pathname === "/" ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`}>
                Learn
              </span>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center h-1.5">
                {pathname === "/" && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-1.5 h-1.5 bg-[#5B3DF5] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>

            {/* Slot 2: Live */}
            <Link
              href="/live"
              className="flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95 relative"
            >
              <Compass className={`w-[20px] h-[20px] transition-colors duration-200 ${pathname === "/live" ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`} />
              <span className={`text-[11px] font-semibold mt-1 transition-colors duration-200 ${pathname === "/live" ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`}>
                Live
              </span>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center h-1.5">
                {pathname === "/live" && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-1.5 h-1.5 bg-[#5B3DF5] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>

            {/* Slot 3: Center FAB Placeholder (Ensures grid columns align perfectly) */}
            <div className="w-full h-full flex items-center justify-center shrink-0" />

            {/* Slot 4: Connect */}
            <Link
              href="/connect"
              className="flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95 relative"
            >
              <MessageCircle className={`w-[20px] h-[20px] transition-colors duration-200 ${pathname.startsWith("/connect") ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`} />
              <span className={`text-[11px] font-semibold mt-1 transition-colors duration-200 ${pathname.startsWith("/connect") ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`}>
                Connect
              </span>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center h-1.5">
                {pathname.startsWith("/connect") && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-1.5 h-1.5 bg-[#5B3DF5] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>

            {/* Slot 5: Profile */}
            <Link
              href="/profile"
              className="flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95 relative"
            >
              <User className={`w-[20px] h-[20px] transition-colors duration-200 ${pathname === "/profile" ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`} />
              <span className={`text-[11px] font-semibold mt-1 transition-colors duration-200 ${pathname === "/profile" ? "text-[#5B3DF5]" : "text-[#94A3B8]"}`}>
                Profile
              </span>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center h-1.5">
                {pathname === "/profile" && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="w-1.5 h-1.5 bg-[#5B3DF5] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>

          </div>

          {/* Floating center launcher button - perfectly centered horizontally, elevated above navigation bar */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[-14px] z-10 pointer-events-auto">
            <motion.button 
              onClick={() => setIsLauncherOpen(true)}
              animate={{
                boxShadow: [
                  "0 8px 20px rgba(91, 61, 245, 0.22)",
                  "0 8px 30px rgba(91, 61, 245, 0.42)",
                  "0 8px 20px rgba(91, 61, 245, 0.22)"
                ],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileTap={{ scale: 0.95 }}
              className="w-[64px] h-[64px] bg-gradient-to-tr from-[#6D4AFF] to-[#5B3DF5] text-white rounded-full flex items-center justify-center border-[4px] border-white transition-transform duration-200 group cursor-pointer"
            >
              <LayoutGrid className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
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
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
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
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/40 flex items-center justify-center text-indigo-500 shrink-0">
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#5B3DF5] leading-none">{action.name}</p>
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
