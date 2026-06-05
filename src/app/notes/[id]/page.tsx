"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share, Bookmark, BrainCircuit, LayoutList, MessageSquare, Briefcase, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const tabs = [
  { id: "summary", label: "Summary", icon: LayoutList },
  { id: "detailed", label: "Detailed", icon: FileText },
  { id: "concepts", label: "Concepts", icon: BrainCircuit },
  { id: "exam", label: "Exam Qs", icon: MessageSquare },
  { id: "placement", label: "Placement", icon: Briefcase },
];

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-100 px-4 pt-12 pb-4">
        <div className="flex justify-between items-start mb-4">
          <Link href="/">
            <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 rounded-full">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 rounded-full">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CPU Scheduling</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Operating Systems • Today, 10:30 AM</p>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar mt-6 gap-2 pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
                  isActive ? "text-indigo-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="notetabs"
                    className="absolute inset-0 bg-indigo-100 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 p-4 pb-24 relative">
        <AnimatePresence mode="wait">
          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl">
                <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold">
                  <Sparkles className="w-5 h-5" />
                  <h2>AI Summary</h2>
                </div>
                <p className="text-sm leading-relaxed text-indigo-900/80">
                  CPU scheduling is the process of determining which process will own the CPU for execution while another process is on hold. The primary objective is to make the system efficient, fast, and fair. Key concepts discussed include Preemptive vs Non-Preemptive scheduling, and standard algorithms like FCFS, SJF, and Round Robin.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <span className="block text-2xl font-bold text-emerald-600">85%</span>
                  <span className="text-xs font-medium text-slate-500">Confidence Score</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <span className="block text-2xl font-bold text-orange-500">High</span>
                  <span className="text-xs font-medium text-slate-500">Placement Priority</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "concepts" && (
            <motion.div
              key="concepts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {['Preemptive Scheduling', 'Round Robin', 'Context Switch'].map((concept) => (
                <div key={concept} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{concept}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    AI generated explanation goes here. It provides a concise, easy-to-understand breakdown of the concept tailored to the student's current knowledge level.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-500 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors">I know this</button>
                    <button className="px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-500 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors">Needs review</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "placement" && (
            <motion.div
              key="placement"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {[
                { q: "Difference between Preemptive and Non-Preemptive scheduling?", tags: ["Amazon", "Microsoft"], difficulty: "Medium" },
                { q: "What is a Context Switch and why is it expensive?", tags: ["Google", "Atlassian"], difficulty: "Hard" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {item.difficulty}
                    </span>
                    <div className="flex gap-1">
                      {item.tags.map(t => <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{t}</span>)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{item.q}</h3>
                  <button className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-2xl hover:bg-indigo-100 transition-colors">View AI Answer</button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Add placeholders for other tabs if needed */}
        </AnimatePresence>
      </main>
    </div>
  );
}
