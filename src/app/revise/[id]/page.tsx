"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  Zap,
  BookMarked,
  ChevronRight,
  Check,
  X,
  RotateCw,
  FileText,
  Download,
  Trash2,
  BookOpen,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  DEFAULT_NOTES,
  getSubjectRevisionContent,
  parseConceptsFromNote,
  getConfidenceBadgeColor,
  formatRelativeTime
} from "@/lib/revision";

export default function RevisionAssistantPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const noteId = unwrappedParams.id;

  // Global States loaded from local storage
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [lastSession, setLastSession] = useState<any | null>(null);

  // Active Note & Mode
  const [activeNote, setActiveNote] = useState<any | null>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  // Modal note preview state
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  // Flashcards Drill State
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [drillScore, setDrillScore] = useState({ gotIt: 0, review: 0 });
  const [conceptStates, setConceptStates] = useState<any>({});

  // ==========================================
  // INITIAL DATA LOADING
  // ==========================================
  useEffect(() => {
    loadFromLocalStorage();
  }, [noteId]);

  const loadFromLocalStorage = () => {
    const notes = JSON.parse(localStorage.getItem("campusOS_saved_notes") || "[]");
    setSavedNotes(notes);

    // Find note by ID
    let foundNote = notes.find((n: any) => n.id === noteId);
    if (!foundNote) {
      // Check seeded defaults
      foundNote = DEFAULT_NOTES.find((dn: any) => dn.id === noteId);
    }
    setActiveNote(foundNote);

    const loadedStats = JSON.parse(localStorage.getItem("campusOS_revision_stats") || "{}");
    setStats(loadedStats);

    const session = JSON.parse(localStorage.getItem("campusOS_last_session") || "null");
    
    if (foundNote) {
      const subjectStats = loadedStats[foundNote.subject] || { mastered: 0, total: 1, confidence: 3.2, weak: 0 };
      const newSession = {
        lastRevisedSubject: foundNote.subject,
        lastRevisedNoteId: foundNote.id,
        lastRevisionDate: new Date().toISOString(),
        lastRevisionMode: session?.lastRevisedNoteId === foundNote.id ? (session.lastRevisionMode || "dashboard") : "dashboard",
        masteredConcepts: subjectStats.mastered,
        confidenceScore: subjectStats.confidence
      };
      localStorage.setItem("campusOS_last_session", JSON.stringify(newSession));
      setLastSession(newSession);
    } else {
      setLastSession(session);
    }
  };

  const handleSelectMode = (mode: string) => {
    if (!activeNote) return;
    setActiveMode(mode);

    const subjectStats = stats[activeNote.subject] || { mastered: 0, total: 1, confidence: 3.0, weak: 0 };
    
    // Save session state immediately, storing both subject and note ID
    const session = {
      lastRevisedSubject: activeNote.subject,
      lastRevisedNoteId: noteId,
      lastRevisionDate: new Date().toISOString(),
      lastRevisionMode: mode,
      masteredConcepts: subjectStats.mastered,
      confidenceScore: subjectStats.confidence
    };
    setLastSession(session);
    localStorage.setItem("campusOS_last_session", JSON.stringify(session));

    // Reset drill states if flashcards mode
    if (mode === "flashcards") {
      setCurrentCardIdx(0);
      setFlashcardFlipped(false);
      setDrillCompleted(false);
      setDrillScore({ gotIt: 0, review: 0 });
      setConceptStates(subjectStats.conceptStates || {});
    }
  };

  const handleConfidenceClick = (isMastered: boolean) => {
    if (!activeNote || !revisionContent) return;
    
    const newConceptStates = { ...conceptStates };
    newConceptStates[currentCardIdx] = isMastered ? "strong" : "weak";
    setConceptStates(newConceptStates);

    setDrillScore(prev => ({
      gotIt: isMastered ? prev.gotIt + 1 : prev.gotIt,
      review: !isMastered ? prev.review + 1 : prev.review
    }));

    setFlashcardFlipped(false);
    
    // Wait for flip transition back to front before next card
    setTimeout(() => {
      const totalCards = revisionContent.flashcards.length;

      if (currentCardIdx < totalCards - 1) {
        setCurrentCardIdx(prev => prev + 1);
      } else {
        // Compute final statistics
        let weakCount = 0;
        let mediumCount = 0;
        let strongCount = 0;

        for (let i = 0; i < totalCards; i++) {
          const state = newConceptStates[i] || "medium";
          if (state === "weak") weakCount++;
          else if (state === "medium") mediumCount++;
          else if (state === "strong") strongCount++;
        }

        const mastered = mediumCount + strongCount;
        const confidence = Number(
          ((strongCount * 5.0 + mediumCount * 3.8 + weakCount * 2.0) / totalCards).toFixed(1)
        );

        const newStats = {
          ...stats,
          [activeNote.subject]: {
            mastered,
            total: totalCards,
            confidence: Math.max(1.0, Math.min(5.0, confidence)),
            weak: weakCount,
            conceptStates: newConceptStates
          }
        };

        setStats(newStats);
        localStorage.setItem("campusOS_revision_stats", JSON.stringify(newStats));

        // Update last session with completed score
        const session = {
          lastRevisedSubject: activeNote.subject,
          lastRevisedNoteId: noteId,
          lastRevisionDate: new Date().toISOString(),
          lastRevisionMode: "flashcards",
          masteredConcepts: mastered,
          confidenceScore: confidence
        };
        setLastSession(session);
        localStorage.setItem("campusOS_last_session", JSON.stringify(session));

        setDrillCompleted(true);
      }
    }, 250);
  };

  const deleteNote = (id: string, subject: string) => {
    // 1. Remove note from savedNotes list
    const newNotes = savedNotes.filter(n => n.id !== id);
    setSavedNotes(newNotes);
    localStorage.setItem("campusOS_saved_notes", JSON.stringify(newNotes));

    // 2. Remove stats associated with it
    const newStats = { ...stats };
    delete newStats[subject];
    setStats(newStats);
    localStorage.setItem("campusOS_revision_stats", JSON.stringify(newStats));

    // 3. Reset lastSession if it matches this subject
    if (lastSession?.lastRevisedSubject === subject) {
      localStorage.removeItem("campusOS_last_session");
    }

    // 4. Return to main Hub
    router.push("/revise");
  };

  const downloadPDF = (note: any) => {
    try {
      window.print();
    } catch (e) {
      console.error(e);
      alert("Failed to open print PDF preview");
    }
  };

  // Load content elements for current note
  const revisionContent = activeNote ? getSubjectRevisionContent(activeNote.subject, activeNote.content) : null;
  const activeSubjectStats = activeNote ? stats[activeNote.subject] || { mastered: 0, total: 1, confidence: 3.2, weak: 0 } : null;

  // Render Queue dynamic mapping:
  const queueWeak = activeSubjectStats?.weak ?? 0;
  const queueStrong = activeSubjectStats?.conceptStates 
    ? Object.values(activeSubjectStats.conceptStates).filter(s => s === "strong").length 
    : Math.round((activeSubjectStats?.mastered ?? 0) * 0.6);
  const queueMedium = (activeSubjectStats?.total ?? 1) - queueWeak - queueStrong;

  if (!activeNote) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-md mx-auto flex flex-col items-center justify-center gap-3">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Assistant...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col min-h-screen bg-slate-50 px-4 pt-12 pb-28 max-w-md mx-auto relative overflow-hidden"
    >
      
      {/* ==========================================
          DYNAMIC HEADER SYSTEM
          ========================================== */}
      <header className="flex items-center gap-4 mb-6 relative z-10">
        {activeMode ? (
          <button
            onClick={() => setActiveMode(null)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <Link href="/revise">
            <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
        )}
        
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
            Revision Assistant
          </h1>
          <p className="text-xs font-semibold text-slate-450 mt-0.5 leading-snug">
            {activeNote.subject}{activeMode ? ` • ${
              activeMode === "5min" 
                ? "5 Min Recap" 
                : activeMode === "exam" 
                  ? "Exam Night" 
                  : "Recall Drill"
            }` : ""}
          </p>
        </div>
      </header>

      {/* ==========================================
          FADE + SLIDE PAGE TRANSITION CONTAINER
          ========================================== */}
      <AnimatePresence mode="wait">
        
        {/* SUBJECT REVISION DASHBOARD VIEW */}
        {!activeMode && (
          <motion.div
            key="subject-dashboard"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6 flex-1 flex flex-col"
          >
            {/* Header statistics info */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-[2rem] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Subject Overview</span>
                  <h2 className="text-lg font-black text-slate-800 leading-tight mt-0.5">{activeNote.subject}</h2>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getConfidenceBadgeColor(activeSubjectStats.confidence)}`}>
                  Conf {activeSubjectStats.confidence.toFixed(1)}/5
                </span>
              </div>
              
              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedNote(activeNote)}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> View Full Notes
                </button>
                <button
                  onClick={() => deleteNote(activeNote.id, activeNote.subject)}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-bold text-xs px-4 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center cursor-pointer"
                  title="Delete notes and statistics"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* REVISION MODES SELECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Revision Methods</h3>
              
              {/* 5 Min Recap */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectMode("5min")}
                className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-200/80 text-left bg-white transition-all hover:border-indigo-400 cursor-pointer shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm block group-hover:text-indigo-600 transition-colors">
                    5 Min Recap
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Quick revision summary
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
              </motion.button>

              {/* Recall Drill */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectMode("flashcards")}
                className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-200/80 text-left bg-white transition-all hover:border-indigo-400 cursor-pointer shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm block group-hover:text-indigo-600 transition-colors">
                    Recall Drill
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Flashcards + confidence tracking
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
              </motion.button>

              {/* Exam Night */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectMode("exam")}
                className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-200/80 text-left bg-white transition-all hover:border-indigo-400 cursor-pointer shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-800 text-sm block group-hover:text-indigo-600 transition-colors">
                    Exam Night
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Likely questions + common mistakes
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
              </motion.button>
            </div>

            {/* REVIEW QUEUE CARD */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Review Queue</h3>
              
              <div className="bg-white border border-slate-200/80 p-5 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-850 text-sm">Active Queue Status</h4>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                      Confidence indicators updated dynamically
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/30 px-3 py-1 rounded-full">
                    {activeSubjectStats?.mastered} / {activeSubjectStats?.total} Mastered
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Weak Concepts</span>
                    </div>
                    <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-lg border border-rose-100 text-[10px]">
                      {queueWeak} {queueWeak === 1 ? "Card" : "Cards"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Medium Concepts</span>
                    </div>
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-lg border border-amber-100 text-[10px]">
                      {queueMedium} {queueMedium === 1 ? "Card" : "Cards"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Strong Concepts</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-100 text-[10px]">
                      {queueStrong} {queueStrong === 1 ? "Card" : "Cards"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(((activeSubjectStats?.mastered ?? 0) / (activeSubjectStats?.total ?? 1)) * 100)}%` }}
                    className="bg-indigo-600 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* REVISION MODE: 5 MIN RECAP */}
        {activeMode === "5min" && (
          <motion.div
            key="recap-screen"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-5 flex-1 flex flex-col"
          >
            <div className="bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm space-y-4 flex-1">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-md uppercase tracking-wider">
                  Summary Highlights
                </span>
                <button
                  onClick={() => setActiveMode(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Exit Mode
                </button>
              </div>

              <div className="space-y-4">
                {revisionContent?.recap.map((point: string, idx: number) => {
                  const cleanPoint = point.replace(/^[•\-\*\s]+/, "");
                  const hasBoldTitle = cleanPoint.includes(":");
                  let title = "";
                  let description = cleanPoint;

                  if (hasBoldTitle) {
                    const parts = cleanPoint.split(":");
                    title = parts[0].trim();
                    description = parts.slice(1).join(":").trim();
                  }

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 text-xs leading-relaxed"
                    >
                      <span>
                        {title && <strong className="font-bold text-slate-800">{title}: </strong>}
                        <span className="text-slate-600 font-medium">{description}</span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* REVISION MODE: EXAM NIGHT */}
        {activeMode === "exam" && (
          <motion.div
            key="exam-screen"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4 flex-1 flex flex-col"
          >
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-md uppercase tracking-wider">
                Exam Prep Checklist
              </span>
              <button
                onClick={() => setActiveMode(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Exit Mode
              </button>
            </div>

            <div className="space-y-3">
              {revisionContent?.exam.map((item: any, idx: number) => {
                const isPitfall = item.type === "Common Pitfall" || item.type.toLowerCase().includes("pitfall");
                const cleanDesc = item.desc
                  .split("\n")
                  .map((line: string) => line.replace(/^[•\-\*\s]+/, ""))
                  .join("\n");
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-200/80 p-5 rounded-[2rem] shadow-sm space-y-2.5"
                  >
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                      isPitfall 
                        ? "bg-rose-50 text-rose-600 border-rose-100" 
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                      {item.type}
                    </span>
                    
                    <h4 className="font-bold text-slate-850 text-xs mt-1">
                      {item.title}
                    </h4>
                    
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">
                      {cleanDesc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* REVISION MODE: RECALL DRILL (FLASHCARDS LOOP) */}
        {activeMode === "flashcards" && (
          <motion.div
            key="flashcard-drill-screen"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="flex-1 flex flex-col min-h-[360px]"
          >
            {drillCompleted ? (
              /* Completed screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm text-center flex flex-col items-center justify-center my-auto min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Drill Completed!</h3>
                <p className="text-xs font-semibold text-slate-500 mt-2 mb-6 max-w-[240px] mx-auto leading-normal">
                  Your confidence levels and stats have been updated in your profile.
                </p>

                <div className="w-full max-w-[220px] bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-6 flex justify-around text-xs font-bold text-slate-600">
                  <div>
                    <span className="block text-emerald-600 text-lg font-black">{drillScore.gotIt}</span>
                    <span className="text-[10px] text-slate-450 uppercase tracking-wider">Got It</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 self-center" />
                  <div>
                    <span className="block text-amber-600 text-lg font-black">{drillScore.review}</span>
                    <span className="text-[10px] text-slate-450 uppercase tracking-wider">Review</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveMode(null);
                    loadFromLocalStorage(); // refresh stats
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            ) : (
              /* Flashcard Active Loop */
              <>
                <div className="flex justify-between items-center mb-4 px-1">
                  <span className="text-xs font-bold text-slate-400">
                    Concept {currentCardIdx + 1} of {revisionContent?.flashcards.length}
                  </span>
                  <button
                    onClick={() => setActiveMode(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    End Session
                  </button>
                </div>

                {/* Perspective Flip Card Container */}
                <div
                  className="w-full h-[280px] relative cursor-pointer mb-6"
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className="w-full h-full absolute inset-0"
                    animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front side of Card */}
                    <div
                      className="absolute inset-0 bg-white border border-slate-200/80 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <span className="absolute top-6 left-6 text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Question
                      </span>
                      
                      <h3 className="text-lg font-black text-slate-800 text-center leading-snug px-3">
                        {revisionContent?.flashcards[currentCardIdx]?.question}
                      </h3>
                      
                      <p className="absolute bottom-6 text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 select-none">
                        <RotateCw className="w-3.5 h-3.5" /> Tap to reveal answer
                      </p>
                    </div>

                    {/* Back side of Card */}
                    <div
                      className="absolute inset-0 bg-slate-900 text-white border border-slate-950 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                      }}
                    >
                      <span className="absolute top-6 left-6 text-[9px] font-black text-indigo-300 bg-white/10 border border-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Answer Definition
                      </span>
                      
                      <div className="text-left w-full text-xs font-semibold leading-relaxed whitespace-pre-wrap px-3 text-slate-200 overflow-y-auto max-h-[160px] scrollbar-thin">
                        {revisionContent?.flashcards[currentCardIdx]?.answer
                          .split("\n")
                          .map((line: string) => line.replace(/^[•\-\*\s]+/, ""))
                          .join("\n")}
                      </div>
                      
                      <p className="absolute bottom-4 text-[9px] font-bold text-slate-500 select-none">
                        Tap card to flip back
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Adaptive confidence buttons */}
                <AnimatePresence>
                  {flashcardFlipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex flex-col gap-3 pt-2"
                    >
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Did you recall this concept?
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfidenceClick(true);
                          }}
                          className="flex items-center justify-center gap-2 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition-colors border border-emerald-100 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Got It
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfidenceClick(false);
                          }}
                          className="flex items-center justify-center gap-2 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold text-xs transition-colors border border-amber-100 cursor-pointer"
                        >
                          <RotateCw className="w-4 h-4" /> Review Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL: RAW NOTE VIEWER MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col max-w-md mx-auto"
          >
            {/* Grab Drag indicator handle */}
            <div
              className="flex justify-center pt-3 pb-2 bg-white cursor-pointer"
              onClick={() => setSelectedNote(null)}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header controls inside notes view */}
            <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-slate-100 relative z-50">
              <button
                onClick={() => setSelectedNote(null)}
                className="w-9 h-9 flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-slate-800 truncate flex-1 text-center mx-4 text-xs">
                {selectedNote.subject} Notes
              </h2>
              <button
                onClick={() => deleteNote(selectedNote.id, selectedNote.subject)}
                className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-full cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Markdown notes content container */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
              <div
                id="saved-notes-pdf-container"
                className="bg-white mx-auto shadow-sm border border-slate-200 p-6 rounded-[2rem] max-w-sm"
              >
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <h1 className="text-lg font-black text-slate-900 leading-tight">
                    {selectedNote.subject} Notes
                  </h1>
                  <p className="text-slate-400 font-bold mt-1 text-[9px]">
                    Scanned via CampusOS • {new Date(selectedNote.date).toLocaleDateString()}
                  </p>
                </div>

                <article className="text-slate-700 text-xs font-semibold leading-relaxed whitespace-pre-wrap prose prose-slate">
                  <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                </article>
              </div>
            </div>

            {/* Action footer button */}
            <div className="p-4 border-t border-slate-100 bg-white pb-8 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => downloadPDF(selectedNote)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-200 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Print / Download as PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// Helper Loader icon sub-component
function Loader(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
