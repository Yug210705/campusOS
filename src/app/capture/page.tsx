"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Sparkles, CheckCircle2, Zap, ZapOff, Settings2, Image as ImageIcon, ChevronDown, Save, FileText, Upload, Download, Trash2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

const steps = [
  "Analyzing multiple frames...",
  "Synthesizing information...",
  "Structuring Markdown...",
  "Finalizing notes...",
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
  
  // Multi-Image States
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [flyingImage, setFlyingImage] = useState<string | null>(null);
  
  // Camera States
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [captureMode, setCaptureMode] = useState<"auto" | "manual">("auto");
  const [flashMode, setFlashMode] = useState<"on" | "off" | "auto">("auto");
  const [showToast, setShowToast] = useState<string | null>(null);
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
        // Fallback
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

  const handleCapture = async () => {
    if (isCapturing || isGenerating) return;
    
    // Quick visual shutter feedback
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 150);

    try {
      let base64Image = "";
      let rawDataUrl = "";

      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        let width = videoRef.current.videoWidth || 1080;
        let height = videoRef.current.videoHeight || 1920;
        
        // Downscale to 1200px max to drastically speed up upload and AI processing
        const MAX_SIZE = 1200;
        if (width > height && width > MAX_SIZE) {
          height = Math.round(height * (MAX_SIZE / width));
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = Math.round(width * (MAX_SIZE / height));
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, width, height);
          rawDataUrl = canvas.toDataURL("image/jpeg", 0.6); // Highly optimized payload
          base64Image = rawDataUrl.split(',')[1];
        }
      }

      if (!base64Image) throw new Error("Could not capture image from camera.");

      // Trigger flying animation
      setFlyingImage(rawDataUrl);
      setTimeout(() => setFlyingImage(null), 800);

      setCapturedImages(prev => [...prev, base64Image]);
      handleToast("Photo snapped! Added to batch.");
    } catch (error) {
      console.error("Capture Error:", error);
      handleToast("Failed to capture frame.");
    }
  };

  const handleGenerateNotes = async () => {
    if (capturedImages.length === 0) return;
    
    setIsGenerating(true);
    setShowGallery(false);
    handleToast("AI Processing Batch...");

    try {
      // UX animation loop
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);

      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: capturedImages }),
      });

      clearInterval(interval);
      setCurrentStep(steps.length - 1);

      const data = await response.json();
      
      if (response.ok && data.notes) {
        setAccumulatedNotes(data.notes);
        setShowNotesDrawer(true);
        setCapturedImages([]); // Clear gallery after successful generation
      } else {
        handleToast(data.error || "Failed to analyze image batch.");
      }
    } catch (error) {
      console.error("OCR Generation Error:", error);
      handleToast("An error occurred while generating notes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    if (capturedImages.length === 1) {
      setShowGallery(false);
    }
  };

  const handleSaveToNotes = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('campusOS_saved_notes') || '[]');
      existing.push({
        id: Date.now().toString(),
        subject: activeSubject,
        content: accumulatedNotes,
        date: new Date().toISOString()
      });
      localStorage.setItem('campusOS_saved_notes', JSON.stringify(existing));
      handleToast("Added to Notes successfully!");
      setTimeout(() => {
        setShowNotesDrawer(false);
        setAccumulatedNotes("");
      }, 500);
    } catch (e) {
      console.error("Failed to save to local storage", e);
      handleToast("Failed to save notes.");
    }
  };

  const downloadPDF = async () => {
    handleToast("Generating High Quality PDF...");
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('notes-pdf-container');
      if (!element) throw new Error("PDF container not found");
      
      const opt = {
        margin:       0.5,
        filename:     `${activeSubject}-Notes.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };
      
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeSubject}-Notes.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      handleToast("Failed to generate PDF");
    }
  };

  const handleToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 2500);
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
            className="absolute top-28 left-1/2 z-50 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-white/10 whitespace-nowrap"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying Image Animation */}
      <AnimatePresence>
        {flyingImage && (
          <motion.img 
            src={flyingImage}
            initial={{ opacity: 1, scale: 1, top: "50%", left: "50%", x: "-50%", y: "-50%", borderRadius: "16px" }}
            animate={{ opacity: 0, scale: 0.1, top: "32px", left: "90%", x: "-50%", y: "-50%", borderRadius: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="absolute z-50 object-cover shadow-2xl border-2 border-white pointer-events-none"
            style={{ width: "300px", height: "400px" }}
          />
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
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors shadow-sm"
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
                      setAccumulatedNotes(""); 
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

        {/* Right Icons: Flash & Gallery Bubble */}
        <div className="flex flex-col items-center gap-3">
          {capturedImages.length > 0 ? (
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setShowGallery(true)}
              className="relative w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-400 active:scale-95 transition-all mt-1 shadow-lg shadow-indigo-500/50 border border-indigo-400"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                {capturedImages.length}
              </span>
            </motion.button>
          ) : (
            <button 
              onClick={toggleFlash}
              className="w-10 h-10 bg-white/10 rounded-full backdrop-blur-md flex flex-col items-center justify-center hover:bg-white/20 active:scale-95 transition-all mt-1"
            >
              {flashMode === "off" ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {flashMode === "auto" && <span className="text-[7px] font-bold tracking-wide mt-0.5">AUTO</span>}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center w-full h-full z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#111] opacity-50" />

        {!isCapturing && !showNotesDrawer && !showGallery && !isGenerating && (
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

      {/* Generation Loader Overlay */}
      <AnimatePresence>
        {isGenerating && (
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

      {/* Gallery Drawer */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-slate-900 rounded-t-3xl z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t border-slate-800"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h3 className="text-white font-bold text-lg">Batch ({capturedImages.length})</h3>
              <button onClick={() => setShowGallery(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4">
              {capturedImages.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                  <img src={`data:image/jpeg;base64,${img}`} className="w-full h-full object-cover" alt={`Frame ${i}`} />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:bg-red-500/80 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white px-2 py-1 rounded-md">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 pt-4 pb-12">
              <button 
                onClick={handleGenerateNotes}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 text-lg"
              >
                <Wand2 className="w-6 h-6" /> Generate AI Notes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Markdown Viewer */}
      <AnimatePresence>
        {showNotesDrawer && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-3xl z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
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

            <div className="flex-1 overflow-y-auto bg-slate-100 p-4 pb-24 sm:p-8">
              <div 
                id="notes-pdf-container" 
                className="bg-white mx-auto shadow-sm border border-slate-200 p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm]"
              >
                <div className="border-b border-slate-200 pb-4 mb-6 flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900">{activeSubject} Notes</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">CampusOS Multi-Shot AI • {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <article className="text-slate-800 text-sm sm:text-base leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>p]:mb-4 [&>pre]:bg-slate-900 [&>pre]:text-slate-50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-slate-100 [&>code]:text-pink-600 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600">
                  <ReactMarkdown>{accumulatedNotes || "No notes extracted yet. Scan a whiteboard to begin!"}</ReactMarkdown>
                </article>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10 relative pb-safe">
              <button 
                onClick={handleSaveToNotes}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-200"
              >
                <Save className="w-6 h-6" /> Add to Notes
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={downloadPDF}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </button>
                <button 
                  onClick={() => {
                    setShowNotesDrawer(false);
                    setAccumulatedNotes("");
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" /> Discard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Shutter Controls */}
      <div className="h-40 bg-black flex items-center justify-around px-8 z-40 pb-safe relative">
        
        {/* Floating Instruction Text */}
        {!isGenerating && !showNotesDrawer && !showGallery && (
          <motion.p 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="absolute -top-6 inset-x-0 text-center text-white/80 text-sm font-medium tracking-wide drop-shadow-md"
          >
            {captureMode === "auto" ? "Position whiteboard in view" : "Tap shutter to add to batch"}
          </motion.p>
        )}

        {!isGenerating && !showGallery && (
          <>
            <button 
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all relative"
            >
              <FileText className="w-5 h-5 text-white" />
            </button>

            <button 
              onClick={handleCapture}
              disabled={isCapturing}
              className={`relative w-20 h-20 rounded-full border-[3px] border-white flex items-center justify-center transition-all ${isCapturing ? "scale-90 opacity-50 bg-white/50" : "active:scale-95"}`}
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
