"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share, Bookmark, BrainCircuit, Sparkles, HelpCircle, Check, RotateCw } from "lucide-react";
import Link from "next/link";
import { runInterviewPrepCheck, InterviewQuestion } from "@/lib/prepCheck";

const tabs = [
  { id: "prep-check", label: "What's Next?", icon: Sparkles },
  { id: "concepts", label: "Concepts", icon: BrainCircuit },
];

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("prep-check");
  const [subject, setSubject] = useState("Operating Systems");
  const [title, setTitle] = useState("CPU Scheduling");
  const [notesText, setNotesText] = useState("");
  const [dateStr, setDateStr] = useState("Today, 10:30 AM");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Simulated live analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    if (unwrappedParams.id === "captured") {
      const storedSubject = localStorage.getItem("capturedNoteSubject") || "Operating Systems";
      const storedText = localStorage.getItem("capturedNoteText") || "";
      setSubject(storedSubject);
      setTitle(storedSubject + " Lecture");
      setNotesText(storedText);
      setDateStr("Today, Live Capture");
      setActiveTab("prep-check");
    } else if (unwrappedParams.id === "normalization") {
      setSubject("DBMS");
      setTitle("Normalization");
      setNotesText(`Today we studied database Normalization.
We discussed anomalies (insertion, deletion, modification) and why redundancy is bad.
We covered functional dependencies and the first three normal forms: 1NF, 2NF, and 3NF.
We did some practice problems verifying 3NF decomposition.`);
      setDateStr("Yesterday, 2:15 PM");
    } else {
      // Default: cpu-scheduling or fallback
      setSubject("Operating Systems");
      setTitle("CPU Scheduling");
      setNotesText(`We covered CPU scheduling algorithms today. Focused on preemptive vs non-preemptive scheduling.
We went through FCFS (First Come First Served) and SJF (Shortest Job First). We also introduced Round Robin
with a time quantum of 4ms, showing how context switching occurs.
We also discussed process states (ready, running, and waiting).`);
      setDateStr("Today, 10:30 AM");
    }
  }, [unwrappedParams.id]);

  // Trigger analysis animation when the active tab is "prep-check" or when the note loads
  useEffect(() => {
    if (activeTab === "prep-check") {
      setIsAnalyzing(true);
      setAnalysisStep(0);

      const timer1 = setTimeout(() => {
        setAnalysisStep(1);
      }, 500);

      const timer2 = setTimeout(() => {
        setAnalysisStep(2);
      }, 1000);

      const timer3 = setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [activeTab, unwrappedParams.id]);

  const prepCheck = runInterviewPrepCheck(subject, notesText);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto relative pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-100 px-4 pt-12 pb-4">
        <div className="flex justify-between items-start mb-4">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 transition-colors rounded-full ${
                isBookmarked ? "text-indigo-600 bg-indigo-50" : "text-slate-500 bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <Bookmark className="w-5 h-5 fill-current" style={{ fillOpacity: isBookmarked ? 1 : 0 }} />
            </button>
            <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 rounded-full">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{subject} • {dateStr}</p>
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
                  isActive ? "text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
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
          
          {/* Interview Prep Check (What's Next?) Tab */}
          {activeTab === "prep-check" && (
            <motion.div
              key="prep-check"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {isAnalyzing ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[300px] shadow-sm text-center"
                >
                  <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-6" />
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Analyzing Lecture Notes</h3>
                  
                  <div className="space-y-2.5 text-left w-full max-w-[280px] mx-auto">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>Scanning whiteboard transcript...</span>
                    </div>
                    
                    {analysisStep >= 1 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2.5 text-xs font-bold text-emerald-600"
                      >
                        <span className="text-emerald-500">✓</span>
                        <span>Found {prepCheck.covered.length} topics covered today</span>
                      </motion.div>
                    )}
                    
                    {analysisStep >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2.5 text-xs font-bold text-amber-600"
                      >
                        <span className="text-amber-500">⚠</span>
                        <span>Detected {prepCheck.missing.length} interview topics not yet covered</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase mb-2.5">
                      What You Learned vs What Comes Next
                    </h2>
                    
                    {/* Key Takeaway Card */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-xs font-semibold text-indigo-950 mb-4 shadow-sm">
                      Today's lecture covered {prepCheck.covered.length} core concepts.
                      {prepCheck.missing.length > 0 && (
                        <div className="mt-1.5 font-black text-indigo-900 leading-normal">
                          To complete this interview topic cluster, focus next on:{" "}
                          <span className="underline decoration-indigo-300 decoration-2 underline-offset-2">
                            {prepCheck.missing.slice(0, 3).join(", ")}
                          </span>.
                        </div>
                      )}
                    </div>
                    
                    {/* Hero Table Grid (Side-by-Side) */}
                    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200">
                        <div className="p-3.5 text-xs font-black text-emerald-800 flex items-center gap-1.5 border-r border-slate-200">
                          <span className="text-emerald-500 font-bold">✓</span> Covered Today ({prepCheck.covered.length})
                        </div>
                        <div className="p-3.5 text-xs font-black text-amber-800 flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">⚠</span> Missing Topics ({prepCheck.missing.length})
                        </div>
                      </div>
                      
                      <div className="divide-y divide-slate-100">
                        {Array.from({ length: Math.max(prepCheck.covered.length, prepCheck.missing.length) }).map((_, idx) => {
                          const cov = prepCheck.covered[idx];
                          const mis = prepCheck.missing[idx];
                          
                          return (
                            <div key={idx} className="grid grid-cols-2 divide-x divide-slate-200 text-xs font-semibold text-slate-700">
                              <div className="p-3.5 bg-emerald-50/10 text-emerald-950 flex items-center gap-2">
                                {cov ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span className="truncate">{cov}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </div>
                              <div className="p-3.5 bg-amber-50/5 text-amber-950 flex items-center gap-2">
                                {mis ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span className="truncate">{mis}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Small Trust Anchor Line */}
                    <p className="text-[10px] font-bold text-slate-400 mt-2 px-1">
                      Compared against commonly asked {subject} interview topics.
                    </p>
                  </div>

                  {/* Recommended Next Learning Path */}
                  {prepCheck.missing.length > 0 && (
                    <div className="bg-indigo-950 p-5 rounded-[2.25rem] text-white shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-16 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
                      
                      <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
                        Recommended Next Learning Path
                      </h3>
                      <ol className="list-decimal list-inside text-sm font-black space-y-2 relative z-10">
                        {prepCheck.missing.slice(0, 3).map((topic, index) => (
                          <li key={index} className="pl-1">
                            <span className="text-white ml-2">{topic}</span>
                          </li>
                        ))}
                      </ol>
                      
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-indigo-200">
                        <span>Estimated Revision Time:</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded-md text-white">15–20 mins</span>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: Questions You May Face */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase px-1 leading-tight">
                      Questions you may face from missing topics
                    </h3>
                    
                    {prepCheck.questions.length > 0 ? (
                      prepCheck.questions.map((q, idx) => (
                        <QuestionRow key={idx} question={q} />
                      ))
                    ) : (
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center">
                        <p className="text-xs font-semibold text-slate-500">No questions generated. Check notes for accuracy.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Concepts Tab */}
          {activeTab === "concepts" && (
            <motion.div
              key="concepts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">Key Concepts Covered</h2>
              {prepCheck.covered.length > 0 ? (
                prepCheck.covered.map((concept, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{concept}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        This concept is key to your academic curriculum and has been correctly recognized in today's notes.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                  <p className="text-sm font-semibold text-slate-500">No major concepts recognized. Run the Prep Check tab to analyze notes.</p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// Subcomponent for Question Rows with expandable answers & adaptive confidence loop
function QuestionRow({ question }: { question: InterviewQuestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confidenceState, setConfidenceState] = useState<"got-it" | "review" | null>(null);

  const handleGotIt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfidenceState("got-it");
  };

  const handleReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfidenceState("review");
  };

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer select-none"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="text-sm shrink-0 mt-0.5">📝</span>
          <h4 className="font-bold text-slate-800 text-sm leading-snug">{question.question}</h4>
        </div>
        <button className="text-[10px] font-bold text-indigo-600 shrink-0 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors mt-0.5">
          {isOpen ? "Hide" : "Expand"}
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Bulleted Answers */}
            <div className="border-t border-slate-100 pt-3 mt-1 text-xs text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">
              {question.answer}
            </div>

            {/* Confidence Feedback Loop */}
            <div className="border-t border-slate-100/50 mt-4 pt-3.5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Did you know this?
              </span>
              
              <div className="flex items-center gap-2">
                {confidenceState === null ? (
                  <>
                    <button 
                      onClick={handleGotIt}
                      className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 text-xs font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Got It
                    </button>
                    <button 
                      onClick={handleReview}
                      className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-700 text-xs font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Review Again
                    </button>
                  </>
                ) : confidenceState === "got-it" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Saved to Mastered List!
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-2 bg-amber-50 border border-amber-100 text-amber-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Added to Active Review Queue
                  </motion.div>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
