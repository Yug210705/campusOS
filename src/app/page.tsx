"use client";

import { Flame, Target, Zap, Brain, Camera, BookOpen, Sparkles, MoreHorizontal, User, Settings, LogOut } from "lucide-react";
import StatCard from "@/components/home/StatCard";
import QuickAction from "@/components/home/QuickAction";
import Heatmap from "@/components/home/Heatmap";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LearnHome() {
  const { profileImage } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-8 pb-28 max-w-md mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden border border-slate-200">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              "YP"
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Good Morning</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Yug Pathak</h1>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50 active:scale-95 transition-transform"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 overflow-hidden"
                >
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    Digital Profile
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </button>
                  <div className="h-px w-full bg-slate-100 my-1" />
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Metric */}
      <section>
        <StatCard 
          title="Revision Streak" 
          value="12 Days" 
          subtitle="Top 5% of class"
          icon={Flame} 
          variant="hero"
        />
      </section>

      {/* Grid Metrics */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard title="Placement" value="68%" subtitle="Software Eng." icon={Target} />
        <StatCard title="Confidence" value="8.4" subtitle="Avg across 5 subjects" icon={Zap} />
        <StatCard title="Concepts" value="142" subtitle="Mastered this week" icon={Brain} />
        <StatCard title="Study Time" value="14h" subtitle="Past 7 days" icon={BookOpen} />
      </section>

      {/* Actions */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Magic Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction title="Capture Board" icon={Camera} href="/capture" primary />
          <QuickAction title="Revise Notes" icon={BookOpen} href="/revise" />
          <QuickAction title="Ask AI Tutor" icon={Sparkles} href="/ai" />
        </div>
      </section>

      {/* Recent Lectures */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Activity</h2>
          <button className="text-[11px] font-bold text-indigo-600">View All</button>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {[
            { id: 1, code: "OS", title: "CPU Scheduling", time: "10:30 AM", status: "Mastered", color: "text-emerald-600 bg-emerald-50" },
            { id: 2, code: "DB", title: "Normalization", time: "Yesterday", status: "Review", color: "text-orange-600 bg-orange-50" },
          ].map((item, idx, arr) => (
            <div 
              key={item.id}
              className={`flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors ${
                idx !== arr.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                {item.code}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{item.time}</p>
              </div>
              <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.color}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Heatmap */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Consistency</h2>
        </div>
        <Heatmap />
      </section>

    </div>
  );
}
