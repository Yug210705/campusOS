"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_NOTES,
  DEFAULT_STATS,
  DEFAULT_SESSION,
  getConfidenceBadgeColor,
  formatRelativeTime,
  parseConceptsFromNote
} from "@/lib/revision";

export default function RevisePage() {
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [lastSession, setLastSession] = useState<any | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const router = useRouter();

  const handleCardClick = (noteId: string) => {
    setSelectedCardId(noteId);
    setTimeout(() => {
      router.push(`/revise/${noteId}`);
    }, 250);
  };

  // ==========================================
  // INITIAL DATA SEEDING AND LOADING
  // ==========================================
  useEffect(() => {
    // 1. Seed defaults on first run if not done already
    const seeded = localStorage.getItem("campusOS_revision_seeded");
    if (!seeded) {
      const existingNotes = JSON.parse(localStorage.getItem("campusOS_saved_notes") || "[]");
      const newNotes = [...existingNotes];
      DEFAULT_NOTES.forEach(dn => {
        if (!newNotes.some(n => n.subject.toLowerCase() === dn.subject.toLowerCase())) {
          newNotes.push(dn);
        }
      });
      localStorage.setItem("campusOS_saved_notes", JSON.stringify(newNotes));
      localStorage.setItem("campusOS_revision_stats", JSON.stringify(DEFAULT_STATS));
      localStorage.setItem("campusOS_last_session", JSON.stringify(DEFAULT_SESSION));
      localStorage.setItem("campusOS_revision_seeded", "true");
    }

    // 2. Load data from local storage
    loadFromLocalStorage();
  }, []);

  const loadFromLocalStorage = () => {
    const notes = JSON.parse(localStorage.getItem("campusOS_saved_notes") || "[]");
    notes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedNotes(notes);

    const loadedStats = JSON.parse(localStorage.getItem("campusOS_revision_stats") || "{}");
    const updatedStats = { ...loadedStats };
    let statsChanged = false;

    // Build fallback stats if notes have no stats yet
    notes.forEach((note: any) => {
      if (!updatedStats[note.subject]) {
        const concepts = parseConceptsFromNote(note.content);
        const total = concepts.length || 1;
        updatedStats[note.subject] = {
          mastered: Math.round(total * 0.5),
          total: total,
          confidence: 3.2,
          weak: Math.round(total * 0.3),
          conceptStates: {}
        };
        statsChanged = true;
      }
    });

    if (statsChanged) {
      localStorage.setItem("campusOS_revision_stats", JSON.stringify(updatedStats));
    }
    setStats(updatedStats);

    const session = JSON.parse(localStorage.getItem("campusOS_last_session") || "null");
    setLastSession(session);
  };

  // Find dynamic link target for the "Continue Last Revision" button
  const resumeHref = (() => {
    if (!lastSession) return "/revise";
    if (lastSession.lastRevisedNoteId) {
      return `/revise/${lastSession.lastRevisedNoteId}`;
    }
    // Backward compatibility for old format session storage: look up note ID by subject
    const foundNote = savedNotes.find(
      (n: any) => n.subject.toLowerCase() === lastSession.lastRevisedSubject.toLowerCase()
    );
    return foundNote ? `/revise/${foundNote.id}` : "/revise";
  })();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 px-4 pt-12 pb-28 max-w-md mx-auto relative overflow-hidden">
      
      {/* ==========================================
          HEADER SYSTEM
          ========================================== */}
      <header className="flex items-center gap-4 mb-6">
        <Link href="/">
          <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Choose Note to Revise</h1>
          <p className="text-xs font-semibold text-slate-450 mt-0.5 leading-snug">
            Choose notes to review and strengthen concepts
          </p>
        </div>
      </header>

      {/* ==========================================
          MAIN LIST VIEW
          ========================================== */}
      <div className="space-y-6">
        
        {/* SECTION 1: CONTINUE LAST REVISION */}
        {lastSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden"
          >
            {/* Background glow design */}
            <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
            
            <span className="text-[10px] font-black text-indigo-200 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Continue Learning
            </span>
            
            <h3 className="text-xl font-black mt-3">{lastSession.lastRevisedSubject}</h3>
            
            <p className="text-xs text-indigo-200 font-bold mt-1">
              {formatRelativeTime(lastSession.lastRevisionDate)}
            </p>

            <div className="flex justify-between items-center mt-6 pt-5 border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">Progress</span>
                <span className="text-sm font-black mt-1 block">
                  {lastSession.masteredConcepts} concepts mastered
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">Confidence</span>
                <span className="text-sm font-black mt-1 block">
                  {lastSession.confidenceScore.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            <Link href={resumeHref} className="block mt-5">
              <button
                className="w-full bg-white hover:bg-slate-100 text-indigo-600 font-bold text-xs py-3.5 rounded-2xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Resume Session <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        )}

        {/* SECTION 2: YOUR NOTES */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Your Notes</h2>
          
          {savedNotes.length > 0 ? (
            <div className="space-y-3">
              {savedNotes.map((note) => {
                const subjectStat = stats[note.subject] || { mastered: 0, total: 1, confidence: 3.2, weak: 0 };
                const masteredPercent = Math.min(100, Math.round((subjectStat.mastered / subjectStat.total) * 100));
                const reviewedCount = subjectStat.conceptStates 
                  ? Object.keys(subjectStat.conceptStates).length 
                  : subjectStat.mastered;
                const isSelected = selectedCardId === note.id;
                
                return (
                  <div key={note.id} onClick={() => handleCardClick(note.id)} className="block">
                    <motion.div
                      animate={isSelected ? { scale: 0.96, borderColor: "#5B3DF5", backgroundColor: "#F5F3FF" } : { scale: 1 }}
                      whileHover={isSelected ? {} : { scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className={`p-5 rounded-[2rem] border transition-all duration-200 cursor-pointer relative shadow-sm group ${
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/20" 
                          : "bg-white border-slate-200/80 hover:border-indigo-400"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                            {note.subject}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 block pt-0.5">
                            {reviewedCount} / {subjectStat.total} Reviewed • {masteredPercent}% Mastered
                          </span>
                        </div>
                        
                        <motion.span
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getConfidenceBadgeColor(subjectStat.confidence)}`}
                        >
                          Conf {subjectStat.confidence.toFixed(1)}/5
                        </motion.span>
                      </div>

                      {/* Progress Bar (Animated) */}
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${masteredPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                        />
                      </div>

                      {/* Note Card Footer Pills */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {subjectStat.mastered} Mastered
                          </span>
                          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                            subjectStat.weak > 0 
                              ? "bg-rose-50 text-rose-700 border-rose-100" 
                              : "bg-slate-50 text-slate-500 border-slate-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${subjectStat.weak > 0 ? "bg-rose-500" : "bg-slate-400"}`} />
                            {subjectStat.weak} Weak {subjectStat.weak === 1 ? "Topic" : "Topics"}
                          </span>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 p-8 rounded-[2rem] text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Notes Available</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-[240px] mx-auto leading-normal">
                Capture a whiteboard or upload lecture notes to start revision.
              </p>
              
              <Link href="/">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl mt-6 transition-transform active:scale-[0.98] cursor-pointer shadow-md shadow-indigo-600/10">
                  Go To Learn
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}
