"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MapPin, Users, Coffee, Shirt, Radio, Bell, ChevronRight, Activity, 
  QrCode, Timer, CheckCircle2, X, Dumbbell, Loader2, ArrowRight,
  BookOpen, Calendar, Utensils, Megaphone, Trophy, Briefcase, Zap, Droplet, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Scanner } from '@yudiel/react-qr-scanner';

type BookingState = "idle" | "selecting" | "reserved" | "scanning" | "confirmed" | "reporting";

// Mock Library Map Data
const libraryTables = [
  {
    id: "T1",
    seats: [
      { id: "T1-A", isOccupied: true },
      { id: "T1-B", isOccupied: false },
      { id: "T1-C", isOccupied: true },
      { id: "T1-D", isOccupied: true },
    ]
  },
  {
    id: "T2",
    seats: [
      { id: "T2-A", isOccupied: false },
      { id: "T2-B", isOccupied: false },
      { id: "T2-C", isOccupied: true },
      { id: "T2-D", isOccupied: false },
    ]
  },
  {
    id: "T3",
    seats: [
      { id: "T3-A", isOccupied: true },
      { id: "T3-B", isOccupied: true },
      { id: "T3-C", isOccupied: true },
      { id: "T3-D", isOccupied: true },
    ]
  },
  {
    id: "T4",
    seats: [
      { id: "T4-A", isOccupied: false },
      { id: "T4-B", isOccupied: true },
      { id: "T4-C", isOccupied: false },
      { id: "T4-D", isOccupied: true },
    ]
  }
];

// Mock Announcements Data
const announcements = [
  {
    id: 1,
    category: "Placement",
    title: "Google Off-Campus Drive 2026",
    date: "June 8, 2026",
    tagColor: "text-blue-600 bg-blue-100",
    icon: <Briefcase className="w-6 h-6 text-blue-600" />,
    summary: "Registration for the upcoming Google recruitment drive is now open.",
    content: "Google is conducting an off-campus placement drive for the 2026 batch. Eligible students must have a minimum CGPA of 8.0. The first round will be an online coding assessment covering Data Structures, Algorithms, and System Design basics. Please check your college email for the registration link and syllabus details. Deadline to apply is June 10th."
  },
  {
    id: 2,
    category: "Club Activity",
    title: "Web3 Hackathon Kickoff",
    date: "June 6, 2026",
    tagColor: "text-purple-600 bg-purple-100",
    icon: <Radio className="w-6 h-6 text-purple-600" />,
    summary: "Join us at Auditorium 2 for the 48-hour Web3 Hackathon.",
    content: "The Campus Web3 Club is hosting a 48-hour continuous hackathon this weekend! Build innovative decentralized applications (dApps) on Solana or Ethereum. Free food, energy drinks, and exclusive swags will be provided for all participants. Top 3 teams win cash prizes up to ₹50,000. Registration is on-the-spot at Auditorium 2."
  },
  {
    id: 3,
    category: "Sports",
    title: "Inter-Hostel Football Final",
    date: "June 7, 2026",
    tagColor: "text-rose-600 bg-rose-100",
    icon: <Trophy className="w-6 h-6 text-rose-600" />,
    summary: "Hostel A vs Hostel C in the grand finale at the Main Ground.",
    content: "The highly anticipated football final between Hostel A and Hostel C will take place tomorrow at 5:00 PM at the Main Sports Ground. All students are encouraged to come and support their respective hostels. A live DJ and refreshments will be available post-match."
  },
  {
    id: 4,
    category: "Utility",
    title: "Scheduled Power Outage",
    date: "June 9, 2026",
    tagColor: "text-amber-600 bg-amber-100",
    icon: <Zap className="w-6 h-6 text-amber-600" />,
    summary: "Power will be cut in the Academic Block for maintenance.",
    content: "Due to high-tension line maintenance, there will be a scheduled power outage in the Main Academic Block and Library from 10:00 AM to 2:00 PM on June 9th. Please ensure your laptops are fully charged. WiFi will remain active via backup generators in the common areas."
  }
];

export default function LiveHome() {
  const { user: authUser } = useAuth();
  
  // Library Booking State
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  
  // Modal State
  const [activeModal, setActiveModal] = useState<"none" | "library" | "mess" | "timetable" | "announcement">("none");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const handleQRScan = () => {
    setBookingState("scanning");
  };

  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (bookingState === "reserved" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (bookingState === "reserved" && timeLeft === 0) {
      setBookingState("idle"); // Auto-vacate if timer runs out
      setSelectedSeat(null);
    }
    return () => clearInterval(interval);
  }, [bookingState, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startSelection = () => {
    setBookingState("selecting");
    setSelectedSeat(null);
  };

  const startReporting = () => {
    setBookingState("reporting");
    setSelectedSeat(null);
  };

  const confirmSelection = () => {
    if (bookingState === "reporting") {
      alert("Report submitted! The student has 5 minutes to verify their presence, or this seat will be vacated.");
      setBookingState("idle");
    } else {
      setBookingState("reserved");
      setTimeLeft(15 * 60); // 15 mins
    }
  };

  const cancelBooking = () => {
    setBookingState("idle");
    setSelectedSeat(null);
    setTimeLeft(15 * 60);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden overflow-y-auto pb-32">
      
      {/* Real QR Scanner Full Screen Overlay */}
      <AnimatePresence>
        {bookingState === "scanning" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute top-12 right-6 z-10">
              <button onClick={() => setBookingState("reserved")} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white active:scale-95 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative w-[80%] max-w-sm aspect-square border-2 border-emerald-500/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-slate-900 mx-4">
              <Scanner
                onScan={(result) => {
                  if (result && result.length > 0) {
                    setBookingState("confirmed");
                  }
                }}
                components={{
                  torch: false,
                  finder: false,
                }}
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-emerald-400 rounded-3xl opacity-50" />
            </div>
            <p className="text-white mt-8 font-bold animate-pulse tracking-wide text-lg">Point at Seat {selectedSeat} QR Code</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pt-8 max-w-md mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className="mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Campus Live</h1>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Updates
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:scale-105 transition-transform relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </button>
          </div>
        </header>


        {/* 1. Library Hub (Hero Card) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Library Hub
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModal("library")}
            className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md shadow-slate-950/15 border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[140px] cursor-pointer group"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/15 blur-2xl rounded-full" />
            <div className="flex justify-between items-start z-10 relative">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-4 z-10 relative">
              <h2 className="text-xl font-bold tracking-tight">Central Library</h2>
              <p className="text-xs font-semibold text-slate-300 mt-1 leading-normal flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> 142 Seats Available (8% Free)
              </p>
            </div>
          </motion.div>
        </section>

        {/* 2. Announcements Feed (Immediately below Library) */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Megaphone className="w-4 h-4 text-slate-500" />
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Recent Announcements
            </h2>
          </div>
          
          <div className="bg-white rounded-3xl p-2 border border-slate-200/80 shadow-sm flex flex-col">
            {announcements.map((announcement, idx) => (
              <div key={announcement.id}>
                <div 
                  className="flex gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors rounded-2xl"
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setActiveModal("announcement");
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {announcement.icon}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${announcement.tagColor}`}>
                        {announcement.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{announcement.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 truncate">{announcement.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{announcement.summary}</p>
                  </div>
                </div>
                {idx < announcements.length - 1 && <div className="h-px bg-slate-100 mx-4" />}
              </div>
            ))}
          </div>
        </section>

        {/* 3 & 4. Timetable & Mess Menu (Grid Layout, non-giant cards) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Schedules & Menus
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Timetable Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal("timetable")}
              className="bg-white border border-slate-200/80 p-5 rounded-[2rem] hover:border-indigo-400 transition-all cursor-pointer shadow-sm group flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex justify-between items-start w-full">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100/50 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-650" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">Timetable</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 block">Slot-wise schedule</p>
              </div>
            </motion.div>

            {/* Mess Menu Card */}
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal("mess")}
              className="bg-white border border-slate-200/80 p-5 rounded-[2rem] hover:border-amber-400 transition-all cursor-pointer shadow-sm group flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex justify-between items-start w-full">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100/50">
                  <Utensils className="w-4 h-4 text-amber-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100/50 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">Mess Menu</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 block">Check daily meals</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Library Drawer Modal */}
      <AnimatePresence>
        {activeModal === "library" && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 h-[85vh] bg-slate-900 rounded-t-3xl z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-slate-800"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Central Library</h3>
              </div>
              <button onClick={() => setActiveModal("none")} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              <div className="relative z-10">
                {/* Status Pill */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                    <Activity className={`w-3.5 h-3.5 ${
                      bookingState === "reserved" ? "text-yellow-400" : "text-emerald-400"
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      bookingState === "reserved" ? "text-yellow-400" : 
                      bookingState === "reporting" ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {bookingState === "confirmed" ? "Seat Booked" : 
                       bookingState === "selecting" ? "Select a Seat" :
                       bookingState === "reporting" ? "Report Empty Seat" : "High Traffic"}
                    </span>
                  </div>
                  
                  {bookingState !== "idle" && bookingState !== "confirmed" && (
                    <button onClick={cancelBooking} className="text-white/50 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Dynamic Content */}
                {bookingState === "idle" && (
                  <>
                    <h2 className="text-2xl font-bold text-white leading-tight mb-2">Central Library is 92% Full</h2>
                    <p className="text-sm font-medium text-slate-400 mb-6">Quiet reading hall has 4 seats left. Main floor is completely occupied.</p>
                    <div className="flex gap-3">
                      <button onClick={startReporting} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold py-3.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Report Empty
                      </button>
                      <button onClick={startSelection} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" /> Book Seat
                      </button>
                    </div>
                  </>
                )}

                {(bookingState === "selecting" || bookingState === "reporting") && (
                  <>
                    <h2 className="text-lg font-bold text-white leading-tight mb-1">Quiet Reading Hall</h2>
                    <p className="text-xs text-slate-400 mb-4">
                      {bookingState === "reporting" ? "Select a reserved seat that is physically empty." : "Select an available seat to book."}
                    </p>
                    
                    {bookingState === "reporting" && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-rose-200 font-medium leading-relaxed">
                          Reporting an empty seat starts a 5-minute eviction timer. If the owner doesn't verify their presence, the seat becomes yours.
                        </p>
                      </div>
                    )}
                    
                    {/* Visual Seat Map */}
                    <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                      <div className="grid grid-cols-2 gap-6">
                        {libraryTables.map((table) => (
                          <div key={table.id} className="flex flex-col items-center">
                            <div className="text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Table {table.id}</div>
                            <div className="grid grid-cols-2 gap-2 relative">
                              {/* Table Center Graphic */}
                              <div className="absolute inset-0 m-auto w-8 h-8 bg-white/10 rounded-full border border-white/5" />
                              
                              {table.seats.map((seat) => {
                                const isSelected = selectedSeat === seat.id;
                                const isReporting = bookingState === "reporting";
                                const isDisabled = isReporting ? !seat.isOccupied : seat.isOccupied;

                                return (
                                  <button
                                    key={seat.id}
                                    disabled={isDisabled}
                                    onClick={() => setSelectedSeat(seat.id)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all relative z-10 ${
                                      isDisabled 
                                        ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50" 
                                        : isSelected
                                          ? isReporting 
                                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/50 scale-110"
                                            : "bg-emerald-500 text-white shadow-md shadow-emerald-500/50 scale-110"
                                          : "bg-white/10 text-white/80 hover:bg-white/20 active:scale-95 border border-white/20"
                                    }`}
                                  >
                                    {seat.id.split('-')[1]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        disabled={!selectedSeat}
                        onClick={confirmSelection} 
                        className={`flex-1 font-bold py-3.5 px-4 text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                          selectedSeat 
                            ? bookingState === "reporting" 
                              ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-400"
                              : "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-400" 
                            : "bg-white/10 text-white/40 cursor-not-allowed"
                        }`}
                      >
                        {selectedSeat ? (bookingState === "reporting" ? `Report ${selectedSeat}` : `Confirm ${selectedSeat}`) : "Select a Seat"}
                      </button>
                    </div>
                  </>
                )}

                {bookingState === "reserved" && (
                  <>
                    <h2 className="text-2xl font-bold text-white leading-tight mb-2">Seat {selectedSeat} Reserved!</h2>
                    <p className="text-sm font-medium text-slate-400 mb-4">Reach the library and scan the seat QR code within 15 minutes.</p>
                    
                    <div className="bg-black/40 rounded-xl p-4 flex items-center justify-between mb-4 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Timer className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Remaining</p>
                          <p className="text-xl font-bold text-yellow-400 font-mono">{formatTime(timeLeft)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setBookingState("idle")} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center">
                        Cancel
                      </button>
                      <button 
                        onClick={handleQRScan}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <QrCode className="w-5 h-5" />
                        <span>Scan QR</span>
                      </button>
                    </div>
                  </>
                )}

                {bookingState === "confirmed" && (
                  <>
                    <h2 className="text-2xl font-bold text-white leading-tight mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" /> Confirmed
                    </h2>
                    <p className="text-sm font-medium text-emerald-200/70 mb-4">You are actively occupying Seat {selectedSeat} in the Quiet Reading Hall.</p>
                    
                    <div className="flex gap-3">
                      <button onClick={cancelBooking} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20">
                        Vacate Seat
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Viewer Modals (Mess / Timetable) */}
      <AnimatePresence>
        {(activeModal === "mess" || activeModal === "timetable") && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md p-4 flex items-center justify-center"
          >
            <button 
              onClick={() => setActiveModal("none")} 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full max-w-lg h-[60vh] sm:h-[80vh] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-700 flex flex-col mt-10">
              <div className="absolute inset-0 overflow-auto flex items-center justify-center p-2">
                {activeModal === "mess" ? (
                  <img src="/mess.png" alt="Mess Menu" className="w-full h-auto object-contain rounded-xl" />
                ) : (
                  <img src="/tt.png" alt="Class Timetable" className="w-full h-auto object-contain rounded-xl" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Details Drawer */}
      <AnimatePresence>
        {activeModal === "announcement" && selectedAnnouncement && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] max-w-md mx-auto"
              onClick={() => setActiveModal("none")}
            />

            {/* Drawer */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-3xl z-[100] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.2)] max-w-md mx-auto"
            >
              {/* Drag Handle & Top-Right Close Button Header */}
              <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-slate-100 shrink-0 relative">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full absolute left-1/2 -translate-x-1/2 top-3" />
                <div>
                  <h3 className="text-xs font-bold text-[#5B3DF5] tracking-widest uppercase">Notice Details</h3>
                </div>
                <button 
                  onClick={() => setActiveModal("none")} 
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors pointer-events-auto cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                  {selectedAnnouncement.icon}
                </div>
                
                <div className="mb-6">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md mb-4 inline-block ${selectedAnnouncement.tagColor}`}>
                    {selectedAnnouncement.category}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{selectedAnnouncement.title}</h2>
                  <p className="text-sm font-bold text-slate-400">{selectedAnnouncement.date}</p>
                </div>
                
                <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed">
                  <p className="text-base font-medium text-slate-800 mb-4">{selectedAnnouncement.summary}</p>
                  <p>{selectedAnnouncement.content}</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10 pb-safe">
                <button 
                  onClick={() => setActiveModal("none")}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform text-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
