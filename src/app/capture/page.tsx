"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Sparkles, CheckCircle2, Zap, ZapOff, Settings2, Image as ImageIcon, ChevronDown, Save, FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  "Extracting whiteboard text...",
  "Formatting structure...",
  "Identifying key concepts...",
  "Appending to notes...",
];

const subjects = [
  "Operating Systems",
  "Computer Networks",
  "Database Systems",
  "Data Structures",
];

export default function CapturePage() {
  const router = useRouter();
  
  // OCR Workflow States
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [accumulatedNotes, setAccumulatedNotes] = useState("");
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  
  // Camera States
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [captureMode, setCaptureMode] = useState<"auto" | "manual">("auto");
  const [flashMode, setFlashMode] = useState<"on" | "off" | "auto">("auto");
  const [showToast, setShowToast] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live Camera Feed
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        handleToast("Camera API not supported on this browser.");
        return;
      }

      try {
        // Try to get the rear camera first
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
      } catch (err: any) {
        // If rear camera is missing, fallback to any available camera (e.g. desktop webcam)
        if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          } catch (fallbackErr) {
            console.error("No camera found at all", fallbackErr);
            handleToast("No camera detected on this device.");
            return;
          }
        } else {
          console.error("Camera access denied or unavailable", err);
          handleToast("Camera access required for live feed.");
          return;
        }
      }

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
    
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!isCapturing) {
        setIsCapturing(true);
        handleToast("Scanning whiteboard...");
      }
    }
  };

  // If they click the shutter button directly, we just simulate capturing from the live feed
  const handleShutterClick = () => {
    if (!isCapturing) {
      setIsCapturing(true);
      handleToast("Scanning whiteboard...");
    }
  };

  // Simulated OCR append logic
  useEffect(() => {
    if (isCapturing) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(interval);
          
          // Finish OCR: Append notes and show drawer
          setTimeout(() => {
            const dummyExtract = `\n\n### OCR Scan - ${new Date().toLocaleTimeString()}\n- Discussed Deadlock avoidance algorithms.\n- Covered Banker's Algorithm with example matrix.\n- Note: Max Need = Maximum - Allocation.`;
            setAccumulatedNotes(prevNotes => prevNotes + dummyExtract);
            setIsCapturing(false);
            setShowNotesDrawer(true);
          }, 500);
          
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isCapturing]);

  const handleToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 2000);
  };

  const toggleFlash = () => {
    setFlashMode(prev => prev === "auto" ? "on" : prev === "on" ? "off" : "auto");
    handleToast(`Flash set to ${flashMode === "auto" ? "On" : flashMode === "on" ? "Off" : "Auto"}`);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans overflow-hidden">
      
      {/* Live Camera Feed Background */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-28 left-1/2 z-50 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-white/10"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controls Bar */}
      <div className="absolute top-0 inset-x-0 px-6 pt-6 pb-4 flex justify-between items-start text-white z-40 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => router.push("/")}
          className="w-10 h-10 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all mt-1"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Subject Dropdown */}
        <div className="flex flex-col items-center relative">
          <button 
            onClick={() => setShowSubjectMenu(!showSubjectMenu)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold">{activeSubject}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </button>

          <AnimatePresence>
            {showSubjectMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-50"
              >
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => {
                      setActiveSubject(subject);
                      setShowSubjectMenu(false);
                      setAccumulatedNotes(""); // Reset notes when changing subject for demo purposes
                      handleToast(`Changed to ${subject}`);
                    }}
                    className={`text-left text-xs font-bold px-3 py-2.5 rounded-xl transition-colors ${
                      activeSubject === subject ? "bg-emerald-500/20 text-emerald-400" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auto/Manual Mode Toggle */}
          <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 mt-4">
            <button 
              onClick={() => setCaptureMode("auto")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                captureMode === "auto" ? "text-black bg-yellow-400" : "text-white/70 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto
            </button>
            <button 
              onClick={() => setCaptureMode("manual")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                captureMode === "manual" ? "text-black bg-white" : "text-white/70 hover:text-white"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        <button 
          onClick={toggleFlash}
          className="w-10 h-10 bg-white/10 rounded-full backdrop-blur-md flex flex-col items-center justify-center hover:bg-white/20 active:scale-95 transition-all mt-1"
        >
          {flashMode === "off" ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          {flashMode === "auto" && <span className="text-[7px] font-bold tracking-wide mt-0.5">AUTO</span>}
        </button>
      </div>

      {/* Camera Viewport & Scanner Overlay */}
      <div className="flex-1 relative flex items-center justify-center w-full h-full z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#111] opacity-50" />

        {!isCapturing && !showNotesDrawer && (
          <div className="relative w-[85%] aspect-[3/4] max-h-[70%] z-20 translate-y-8">
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]" />
            
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-yellow-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-yellow-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400 rounded-br-2xl" />
            
            {captureMode === "auto" && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <motion.div 
                  animate={{ y: ["-100%", "400%", "-100%"] }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-transparent via-yellow-400/20 to-yellow-400 border-b border-yellow-400 opacity-60"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center px-8 z-50"
          >
            <div className="w-24 h-24 mb-12 relative flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-indigo-400"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
            </div>

            <div className="w-full max-w-sm space-y-5">
              {steps.map((step, index) => {
                const isCompleted = currentStep > index;
                const isActive = currentStep === index;
                
                return (
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isCompleted || isActive ? 1 : 0.3, x: 0 }}
                    className="flex items-center gap-4"
                  >
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-white/10 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-600'}`}>
                      {step}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Editable Notes Drawer */}
      <AnimatePresence>
        {showNotesDrawer && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[65vh] bg-white rounded-t-3xl z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            
            <div className="px-6 pb-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800">{activeSubject} Notes</h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">AI Extracted Workspace</p>
              </div>
              <button 
                onClick={() => handleToast("Notes exported successfully")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-hidden">
              <textarea 
                value={accumulatedNotes.trim()}
                onChange={(e) => setAccumulatedNotes(e.target.value)}
                className="w-full h-full resize-none outline-none text-sm text-slate-700 leading-relaxed font-medium bg-transparent"
                placeholder="Start typing or scanning whiteboards..."
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowNotesDrawer(false)}
                className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" /> Keep Capturing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Shutter Controls */}
      <div className="h-40 bg-black flex items-center justify-around px-8 z-40 pb-safe relative">
        
        {/* Floating Instruction Text */}
        {!isCapturing && !showNotesDrawer && (
          <motion.p 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="absolute -top-6 inset-x-0 text-center text-white/80 text-sm font-medium tracking-wide drop-shadow-md"
          >
            {captureMode === "auto" ? "Position whiteboard in view" : "Tap shutter to extract notes"}
          </motion.p>
        )}

        {!isCapturing && (
          <>
            <button 
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all relative"
            >
              <FileText className="w-5 h-5 text-white" />
              {accumulatedNotes && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
              )}
            </button>

            <button 
              onClick={() => setIsCapturing(true)}
              className="relative w-20 h-20 rounded-full border-[3px] border-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <div className="w-[4.25rem] h-[4.25rem] bg-white rounded-full flex items-center justify-center shadow-inner">
                <span className="sr-only">Capture</span>
              </div>
            </button>

            <button 
              onClick={() => handleToast("Adjustments panel coming soon")}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
            >
              <Settings2 className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
