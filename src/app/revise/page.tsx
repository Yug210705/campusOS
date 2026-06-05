"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Zap, BookMarked, ChevronRight, Check, X, RotateCw, FileText, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const revisionModes = [
  { id: "5min", title: "5 Min Recap", desc: "Quick revision", icon: Clock, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
  { id: "flashcards", title: "Recall Drill", desc: "Flashcards + confidence tracking", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
  { id: "exam", title: "Exam Night", desc: "Common mistakes + likely questions", icon: BookMarked, color: "text-red-500", bg: "bg-red-50 border-red-100" },
];

const mockFlashcards = [
  {
    question: "What is Thrashing in Virtual Memory?",
    answer: "• Swapping loop: OS spends more time loading/saving pages than running processes\n• Cause: Total active working sets exceed physical RAM size\n• Solution: Lower the degree of multiprogramming or add RAM"
  },
  {
    question: "What is a race condition in process synchronization?",
    answer: "• Concurrency error: Multiple processes write/read shared memory concurrently\n• Result: Final outcome is variable and depends on execution order\n• Prevention: Enforcing mutual exclusion locks (Mutex/Semaphore) in critical sections"
  },
  {
    question: "Why is context switching considered an overhead?",
    answer: "• Idle CPU: The CPU executes no useful user work during the swap\n• PCB Operations: Saving current register states and loading the next process state\n• Memory Cost: Cold cache lines read delays after transition"
  }
];

export default function RevisePage() {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  
  // Flashcards Drill State
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [drillScore, setDrillScore] = useState({ gotIt: 0, review: 0 });

  // Saved Notes State
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('campusOS_saved_notes') || '[]');
    // Sort newest first
    notes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedNotes(notes);
  }, []);

  const handleConfidenceClick = (isMastered: boolean) => {
    // Record score
    setDrillScore(prev => ({
      gotIt: isMastered ? prev.gotIt + 1 : prev.gotIt,
      review: !isMastered ? prev.review + 1 : prev.review
    }));

    // Next card
    setFlashcardFlipped(false);
    setTimeout(() => {
      if (currentCardIdx < mockFlashcards.length - 1) {
        setCurrentCardIdx(prev => prev + 1);
      } else {
        setDrillCompleted(true);
      }
    }, 200);
  };

  const resetDrill = () => {
    setCurrentCardIdx(0);
    setFlashcardFlipped(false);
    setDrillCompleted(false);
    setDrillScore({ gotIt: 0, review: 0 });
    setActiveMode(null);
  };

  const downloadPDF = async (note: any) => {
    try {
      // Use native browser print/PDF generation which is bulletproof on mobile
      window.print();
    } catch (e) {
      console.error(e);
      alert("Failed to open PDF dialog");
    }
  };

  const deleteNote = (id: string) => {
    const newNotes = savedNotes.filter(n => n.id !== id);
    setSavedNotes(newNotes);
    localStorage.setItem('campusOS_saved_notes', JSON.stringify(newNotes));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 px-4 pt-12 pb-24 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        {activeMode ? (
          <button 
            onClick={() => {
              if (activeMode === "flashcards") {
                resetDrill();
              } else {
                setActiveMode(null);
              }
            }} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <Link href="/">
            <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revision Assistant</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Operating Systems</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!activeMode && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Select Mode */}
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Select Mode</h2>
              <div className="flex flex-col gap-3">
                {revisionModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <motion.button
                      key={mode.id}
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveMode(mode.id)}
                      className={`flex items-center gap-4 p-4 rounded-3xl border text-left bg-white transition-all hover:border-indigo-400`}
                    >
                      <div className={`w-11 h-11 rounded-2xl ${mode.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${mode.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 text-sm block">{mode.title}</span>
                        <span className="text-[11px] font-medium text-slate-400 block mt-0.5">{mode.desc}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Credible Review Queue Layout */}
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Review Queue</h2>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-850 text-sm">Active Queue Status</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Confidence indicators updated dynamically</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">14 Concepts</span>
                </div>
                
                <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Weak Concepts</span>
                    </div>
                    <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-lg">3 Cards</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Medium Concepts</span>
                    </div>
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-lg">5 Cards</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Strong Concepts</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg">6 Cards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved AI Notes Section */}
            <div>
              <div className="flex justify-between items-end mb-3 px-1">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Saved AI Notes</h2>
              </div>
              
              {savedNotes.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {savedNotes.map((note) => (
                    <button 
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 text-left hover:border-indigo-400 transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate text-sm">{note.subject} Notes</h3>
                        <p className="text-[10px] text-slate-450 mt-1">{new Date(note.date).toLocaleDateString()} • Extracted via AI</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-indigo-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2.5" />
                  <h3 className="font-bold text-slate-700 text-sm">No Notes Yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto leading-normal">Use the Capture Board to scan whiteboards and extract notes.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 5 Min Recap Screen */}
        {activeMode === "5min" && (
          <motion.div
            key="recap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">OS Summary Recap</span>
              <button onClick={() => setActiveMode(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">Exit Mode</button>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-black text-slate-800 uppercase tracking-tight leading-none mb-1">Core lecture notes summary</h2>
              <ul className="text-xs font-semibold text-slate-600 space-y-4 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-indigo-500 mt-0.5 font-bold shrink-0">•</span>
                  <span><strong>CPU Scheduling:</strong> Essential mechanism to partition CPU resources dynamically among executable threads to maintain latency targets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-indigo-500 mt-0.5 font-bold shrink-0">•</span>
                  <span><strong>Preemptive vs Non-Preemptive:</strong> Preemptive algorithms interrupt processes forcibly via context switching (e.g. Round Robin), whereas non-preemptive algorithms execute in FCFS order.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-indigo-500 mt-0.5 font-bold shrink-0">•</span>
                  <span><strong>Paging:</strong> Memory virtualization technique that completely avoids external fragmentation by allocating logical pages to arbitrary frame locations in physical RAM.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Exam Night Screen */}
        {activeMode === "exam" && (
          <motion.div
            key="exam"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Exam Prep Guide</span>
              <button onClick={() => setActiveMode(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">Exit Mode</button>
            </div>
            
            <div className="space-y-3.5">
              <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
                <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Common Pitfall</span>
                <h3 className="font-bold text-slate-800 text-xs mt-2">Confusing Context Switching with Page Faults</h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  • Context switches save process register states in PCB.<br/>
                  • Page faults load physical memory blocks from secondary disk frames.
                </p>
              </div>

              <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Likely Exam Q</span>
                <h3 className="font-bold text-slate-800 text-xs mt-2">What causes thrashing and how is it resolved?</h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  • Thrashing is caused when active working sets exceed RAM size, leading to continuous swapping.<br/>
                  • Resolved by reducing active process counts (degree of multiprogramming) or adding RAM.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Flashcards Recall Loop Screen */}
        {activeMode === "flashcards" && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col"
          >
            {drillCompleted ? (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[320px] my-auto"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <Check className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-slate-800">Recall Drill Completed!</h2>
                <p className="text-xs font-semibold text-slate-500 mt-2 mb-6 max-w-[240px] mx-auto leading-normal">
                  Your confidence scores have been saved to update the active learning dashboard path.
                </p>
                
                <div className="w-full max-w-[220px] bg-slate-50 rounded-2xl p-3 mb-6 flex justify-around text-xs font-bold text-slate-600">
                  <div>
                    <span className="block text-emerald-600 text-lg">{drillScore.gotIt}</span>
                    <span>Got It</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <span className="block text-amber-600 text-lg">{drillScore.review}</span>
                    <span>Review</span>
                  </div>
                </div>

                <button 
                  onClick={resetDrill}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-transform active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-slate-400">
                    {currentCardIdx + 1} of {mockFlashcards.length}
                  </span>
                  <button onClick={resetDrill} className="text-xs font-bold text-slate-400 hover:text-slate-700">End Session</button>
                </div>

                {/* Flashcard Card */}
                <div 
                  className="flex-1 relative perspective-1000 cursor-pointer mb-8 min-h-[280px]"
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                >
                  <motion.div
                    className="w-full h-full absolute inset-0 preserve-3d"
                    animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm">
                      <span className="absolute top-6 left-6 text-[10px] font-black text-indigo-500 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-lg uppercase tracking-wider">Question</span>
                      <h2 className="text-xl font-bold text-slate-800 text-center leading-snug px-2">
                        {mockFlashcards[currentCardIdx].question}
                      </h2>
                      <p className="absolute bottom-6 text-xs font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                        <RotateCw className="w-3.5 h-3.5" /> Tap to reveal answer
                      </p>
                    </div>

                    {/* Back of Card */}
                    <div 
                      className="absolute inset-0 backface-hidden bg-indigo-950 text-white border border-indigo-900 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-lg shadow-indigo-950/20" 
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      <span className="absolute top-6 left-6 text-[10px] font-black text-indigo-300 bg-white/10 border border-white/5 px-3 py-1 rounded-lg uppercase tracking-wider">Answer</span>
                      <div className="text-left w-full text-xs font-semibold leading-relaxed whitespace-pre-wrap px-2">
                        {mockFlashcards[currentCardIdx].answer}
                      </div>
                      <p className="absolute bottom-6 text-[9px] font-bold text-indigo-300/70">
                        Tap card again to flip back
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Adaptive Confidence Loop controls */}
                <AnimatePresence>
                  {flashcardFlipped && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex flex-col gap-3"
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Did you know this?
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleConfidenceClick(true); }} 
                          className="flex items-center justify-center gap-2 py-3.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm transition-colors"
                        >
                          <Check className="w-4 h-4" /> Got It
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleConfidenceClick(false); }} 
                          className="flex items-center justify-center gap-2 py-3.5 bg-amber-50 border border-amber-100 hover:bg-amber-100 text-amber-700 rounded-xl font-bold text-sm transition-colors"
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

      {/* Full Screen Note Viewer Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col max-w-md mx-auto"
          >
            <div 
              className="flex justify-center pt-3 pb-2 bg-white cursor-pointer"
              onClick={() => setSelectedNote(null)}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            
            <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-slate-100 relative z-50">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNote(null);
                }}
                className="w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-slate-800 truncate flex-1 text-center mx-4 text-sm">{selectedNote.subject} Notes</h2>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(selectedNote.id);
                }}
                className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-full cursor-pointer pointer-events-auto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
              <div 
                id="saved-notes-pdf-container" 
                className="bg-white mx-auto shadow-sm border border-slate-200 p-6 rounded-3xl"
              >
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <h1 className="text-xl font-black text-slate-900 leading-tight">{selectedNote.subject} Notes</h1>
                  <p className="text-slate-450 font-bold mt-1 text-[10px]">Extracted via CampusOS AI • {new Date(selectedNote.date).toLocaleDateString()}</p>
                </div>
                
                <article className="text-slate-700 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                  <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                </article>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white pb-8 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
              <button 
                onClick={() => downloadPDF(selectedNote)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-200"
              >
                <Download className="w-5 h-5" /> Download as PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
