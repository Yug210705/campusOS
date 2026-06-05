"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Zap, BookMarked, Briefcase, ChevronRight, Check, X, RotateCw } from "lucide-react";
import Link from "next/link";

const revisionModes = [
  { id: "2min", title: "2 Min Review", desc: "Quick memory anchors", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
  { id: "5min", title: "5 Min Recap", desc: "Core concepts & facts", icon: Clock, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
  { id: "exam", title: "Exam Night", desc: "Likely questions & mistakes", icon: BookMarked, color: "text-red-500", bg: "bg-red-50 border-red-100" },
  { id: "placement", title: "Placement", desc: "Interview style drill", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-100" },
];

export default function RevisePage() {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 px-4 pt-12 pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Link href="/">
          <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revision Assistant</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Operating Systems</p>
        </div>
      </header>

      {!activeMode ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Select Mode</h2>
            <div className="grid grid-cols-2 gap-3">
              {revisionModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex flex-col items-start p-4 rounded-3xl border text-left ${mode.bg}`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${mode.color}`} />
                    <span className="font-bold text-slate-800 text-sm mb-1">{mode.title}</span>
                    <span className="text-xs font-medium text-slate-500">{mode.desc}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-3 px-1 mt-8">
              <h2 className="text-lg font-bold text-slate-800">Due for Review</h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">14 Cards</span>
            </div>
            
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">3</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600">5</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">6</div>
              </div>
              <button 
                onClick={() => setActiveMode("flashcards")}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-200"
              >
                Start Drill <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {activeMode === "flashcards" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-400">1 of 14</span>
                <button onClick={() => setActiveMode(null)} className="text-sm font-bold text-slate-400 hover:text-slate-700">End Session</button>
              </div>

              {/* Flashcard */}
              <div 
                className="flex-1 relative perspective-1000 cursor-pointer mb-8"
                onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              >
                <motion.div
                  className="w-full h-full absolute inset-0 preserve-3d"
                  animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-sm">
                    <span className="absolute top-6 left-6 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">Question</span>
                    <h2 className="text-2xl font-bold text-slate-800 text-center leading-snug">What is Thrashing in Virtual Memory?</h2>
                    <p className="absolute bottom-8 text-sm font-medium text-slate-400 flex items-center gap-2">
                      <RotateCw className="w-4 h-4" /> Tap to flip
                    </p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-indigo-600 text-white border-2 border-indigo-500 rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-lg shadow-indigo-200" style={{ transform: "rotateY(180deg)" }}>
                    <span className="absolute top-6 left-6 text-xs font-bold text-indigo-200 bg-indigo-800/50 px-3 py-1 rounded-full">Answer</span>
                    <p className="text-lg font-medium text-center leading-relaxed">
                      Thrashing occurs when a computer's virtual memory subsystem is in a constant state of paging, rapidly exchanging data in memory for data on disk, to the exclusion of most application-level processing.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              {flashcardFlipped && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <button onClick={() => setFlashcardFlipped(false)} className="flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-lg hover:bg-red-100 transition-colors">
                    <X className="w-6 h-6" /> Forgot
                  </button>
                  <button onClick={() => setFlashcardFlipped(false)} className="flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-lg hover:bg-emerald-100 transition-colors">
                    <Check className="w-6 h-6" /> Mastered
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
