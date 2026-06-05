"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, FileText, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NoteItem {
  id: string;
  title: string;
  subject: string;
  time: string;
  color: string;
}

export default function NotesListPage() {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: "cpu-scheduling",
      title: "CPU Scheduling",
      subject: "Operating Systems",
      time: "Today, 10:30 AM",
      color: "from-emerald-400 to-teal-500",
    },
    {
      id: "normalization",
      title: "Normalization",
      subject: "DBMS",
      time: "Yesterday, 2:15 PM",
      color: "from-orange-400 to-amber-500",
    },
  ]);

  useEffect(() => {
    // Check if there's a dynamic captured note in localStorage
    const capturedText = localStorage.getItem("capturedNoteText");
    const capturedSubject = localStorage.getItem("capturedNoteSubject") || "Operating Systems";
    
    if (capturedText) {
      const capturedNote: NoteItem = {
        id: "captured",
        title: `${capturedSubject} Capture`,
        subject: capturedSubject,
        time: "Today, Live Capture",
        color: "from-indigo-400 to-purple-500",
      };
      
      setNotes(prev => {
        // Prevent duplication if captured note is already added
        if (prev.some(n => n.id === "captured")) return prev;
        return [capturedNote, ...prev];
      });
    }
  }, []);

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
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Interview Prep</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5">
            Select a lecture to find interview gaps
          </p>
        </div>
      </header>

      {/* Notes List */}
      <main className="flex-1 flex flex-col gap-3">
        {notes.map((note) => (
          <Link href={`/notes/${note.id}`} key={note.id}>
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${note.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                  {note.id === "captured" ? (
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {note.subject}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mt-1.5 leading-snug truncate">
                    {note.title}
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {note.time}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        ))}
      </main>
    </div>
  );
}
