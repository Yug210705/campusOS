"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Zap, BookMarked, Briefcase, ChevronRight, Check, X, RotateCw, FileText, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const revisionModes = [
  { id: "2min", title: "2 Min Review", desc: "Quick memory anchors", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
  { id: "5min", title: "5 Min Recap", desc: "Core concepts & facts", icon: Clock, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
  { id: "exam", title: "Exam Night", desc: "Likely questions & mistakes", icon: BookMarked, color: "text-red-500", bg: "bg-red-50 border-red-100" },
  { id: "placement", title: "Placement", desc: "Interview style drill", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-100" },
];

export default function RevisePage() {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('campusOS_saved_notes') || '[]');
    // Sort newest first
    notes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedNotes(notes);
  }, []);

  const downloadPDF = async (note: any) => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('saved-notes-pdf-container');
      if (!element) throw new Error("PDF container not found");
      
      const opt = {
        margin:       0.5,
        filename:     `${note.subject}-SavedNotes.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF");
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
          className="space-y-8"
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
            <div className="flex justify-between items-end mb-3 px-1">
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

          {/* Saved AI Notes Section */}
          <div>
            <div className="flex justify-between items-end mb-3 px-1">
              <h2 className="text-lg font-bold text-slate-800">Saved AI Notes</h2>
            </div>
            
            {savedNotes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {savedNotes.map((note) => (
                  <button 
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-left hover:border-indigo-200 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{note.subject} Notes</h3>
                      <p className="text-xs text-slate-500 mt-1">{new Date(note.date).toLocaleDateString()} • Extracted via AI</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-700">No Notes Yet</h3>
                <p className="text-sm text-slate-500 mt-1">Use the Capture Board to scan whiteboards and extract notes.</p>
              </div>
            )}
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

      {/* Full Screen Note Viewer Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-slate-100">
              <button 
                onClick={() => setSelectedNote(null)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-50 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-slate-800 truncate flex-1 text-center mx-4">{selectedNote.subject} Notes</h2>
              <button 
                onClick={() => deleteNote(selectedNote.id)}
                className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
              <div 
                id="saved-notes-pdf-container" 
                className="bg-white mx-auto shadow-sm border border-slate-200 p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm]"
              >
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h1 className="text-3xl font-black text-slate-900">{selectedNote.subject} Notes</h1>
                  <p className="text-slate-500 font-medium mt-1 text-sm">Extracted via CampusOS AI • {new Date(selectedNote.date).toLocaleDateString()}</p>
                </div>
                
                <article className="text-slate-800 text-sm sm:text-base leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>p]:mb-4 [&>pre]:bg-slate-900 [&>pre]:text-slate-50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-slate-100 [&>code]:text-pink-600 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600">
                  <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                </article>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
              <button 
                onClick={() => downloadPDF(selectedNote)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-200"
              >
                <Download className="w-6 h-6" /> Download as PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
