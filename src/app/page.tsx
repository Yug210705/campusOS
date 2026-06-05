"use client";

import { Flame, Target, Zap, Brain, Camera, BookOpen, Sparkles, MoreHorizontal, User, Settings, LogOut, Folder } from "lucide-react";
import StatCard from "@/components/home/StatCard";
import QuickAction from "@/components/home/QuickAction";
import Heatmap from "@/components/home/Heatmap";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile } from "@/actions/dbActions";
import { useAuth } from "@/context/AuthContext";

export default function LearnHome() {
  const { profileImage } = useUser();
  const { user: authUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [noteFolders, setNoteFolders] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const notes = JSON.parse(localStorage.getItem('campusOS_saved_notes') || '[]');
      const folders = notes.reduce((acc: any, note: any) => {
        acc[note.subject] = (acc[note.subject] || 0) + 1;
        return acc;
      }, {});
      setNoteFolders(folders);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!authUser) return;
      try {
        const data = await getUserProfile(authUser.uid, authUser.isAnonymous);
        if (!data) {
          // If profile is missing in DB, provide a fallback to prevent infinite loading
          setUser({
            name: "Profile Missing",
            learningStats: {
              revisionStreak: "N/A", streakSubtitle: "Please sign out",
              placementPercent: "N/A", placementTrack: "Profile missing",
              confidenceAvg: "N/A", confidenceSubtitle: "Please sign out",
              conceptsMastered: "N/A", conceptsSubtitle: "Profile missing",
              studyTime: "N/A", studyTimeSubtitle: "Please sign out"
            }
          });
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
    fetchData();
  }, [authUser]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-8 pb-36 max-w-md mx-auto flex flex-col gap-8">
      
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
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              {user ? user.name.split(' ')[0] : "Loading..."}
            </h1>
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
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
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
          value={user?.learningStats?.revisionStreak || "0 Days"} 
          subtitle={user?.learningStats?.streakSubtitle || "Just getting started"}
          variant="hero"
          icon={Flame}
        />
      </section>

      {/* Grid Metrics */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard 
          title="KNOWLEDGE COVERAGE" 
          value={user?.learningStats?.conceptsMastered || "0 Topics"} 
          subtitle={user?.learningStats?.conceptsSubtitle || "Start studying"}
          variant="dense"
          icon={Target}
        />
        <StatCard 
          title="CONFIDENCE" 
          value={user?.learningStats?.confidenceAvg || "0.0 / 5.0"} 
          subtitle={user?.learningStats?.confidenceSubtitle || "No data yet"}
          variant="dense"
          icon={Zap}
        />
        <StatCard 
          title="WEAK TOPICS" 
          value="3 Topics" 
          subtitle="Requires attention"
          variant="dense"
          icon={Brain}
        />
        <StatCard 
          title="STUDY TIME" 
          value={user?.learningStats?.studyTime || "0h"} 
          subtitle={user?.learningStats?.studyTimeSubtitle || "No time logged"}
          variant="dense"
          icon={BookOpen}
        />
      </section>

      {/* Actions */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Magic Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction title="Capture Board" icon={Camera} href="/capture" primary />
          <QuickAction title="Revise Notes" icon={BookOpen} href="/revise" />
          <QuickAction title="What's Next?" icon={Target} href="/notes" />
        </div>
      </section>

      {/* Notes Folders */}
      {Object.keys(noteFolders).length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-3 px-1 mt-8">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Notes</h2>
            <Link href="/revise" className="text-[11px] font-bold text-indigo-600">View Vault</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(noteFolders).map(([subject, count]) => (
              <Link 
                key={subject} 
                href="/revise"
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{subject}</h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{count} {count === 1 ? 'Note' : 'Notes'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Lectures */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Activity</h2>
          <button className="text-[11px] font-bold text-indigo-600">View All</button>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {[
            { id: 1, code: "OS", title: "CPU Scheduling", slug: "cpu-scheduling", time: "10:30 AM", status: "Mastered", color: "text-emerald-600 bg-emerald-50" },
            { id: 2, code: "DB", title: "Normalization", slug: "normalization", time: "Yesterday", status: "Review", color: "text-orange-600 bg-orange-50" },
          ].map((item, idx, arr) => (
            <Link 
              key={item.id}
              href={`/notes/${item.slug}`}
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
            </Link>
          ))}
        </div>
      </section>

      {/* Activity Heatmap */}
      <section>
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Consistency</h2>
        </div>
        <Heatmap streak={parseInt((user?.learningStats?.revisionStreak || "0").match(/\d+/)?.[0] || "0", 10)} />
      </section>

    </div>
  );
}
