"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, Coffee, Shirt, Radio, Bell, ChevronRight, Activity, QrCode, Timer, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BookingState = "idle" | "selecting" | "reserved" | "scanning" | "confirmed";

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

export default function LiveHome() {
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

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

  // Simulate QR Scanning
  useEffect(() => {
    if (bookingState === "scanning") {
      const timer = setTimeout(() => {
        setBookingState("confirmed");
      }, 2500); // Fake 2.5s scan delay
      return () => clearTimeout(timer);
    }
  }, [bookingState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startSelection = () => {
    setBookingState("selecting");
    setSelectedSeat(null);
  };

  const confirmSelection = () => {
    if (!selectedSeat) return;
    setTimeLeft(900);
    setBookingState("reserved");
  };

  const cancelBooking = () => {
    setBookingState("idle");
    setSelectedSeat(null);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden selection:bg-indigo-500/20">
      
      {/* Fake QR Scanner Full Screen Overlay */}
      <AnimatePresence>
        {bookingState === "scanning" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <div className="relative w-64 h-64 border-2 border-white/20 rounded-3xl overflow-hidden">
              {/* Laser Animation */}
              <motion.div 
                animate={{ y: ["-100%", "400%", "-100%"] }}
                transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-emerald-500/50 border-b-2 border-emerald-400"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-white/20" />
              </div>
            </div>
            <p className="text-white mt-8 font-bold animate-pulse">Scanning Seat {selectedSeat} QR...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 flex flex-col px-4 pt-6 pb-32 gap-10 max-w-md mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 14 Online Updates
              </p>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Campus Live</h1>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm hover:scale-105 transition-transform relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </header>

        {/* Hero Pulse Widget - Dynamic State Machine */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2rem] p-5 shadow-xl relative overflow-hidden group transition-colors duration-500 ${
            bookingState === "confirmed" ? "bg-emerald-900" : "bg-slate-900"
          }`}
        >
          {/* Dynamic Background Glow */}
          <div className={`absolute top-0 right-0 p-32 rounded-full mix-blend-screen filter blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 ${
            bookingState === "reserved" || bookingState === "selecting" ? "bg-emerald-500" : 
            bookingState === "confirmed" ? "bg-emerald-400" : "bg-emerald-500"
          }`} />
          
          <div className="relative z-10">
            {/* Status Pill */}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${
                  bookingState === "reserved" ? "text-yellow-400" : "text-emerald-400"
                }`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  bookingState === "reserved" ? "text-yellow-400" : "text-emerald-400"
                }`}>
                  {bookingState === "confirmed" ? "Seat Booked" : 
                   bookingState === "selecting" ? "Select a Seat" : "High Traffic"}
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
                  <button onClick={startSelection} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" /> Book Seat
                  </button>
                </div>
              </>
            )}

            {bookingState === "selecting" && (
              <>
                <h2 className="text-lg font-bold text-white leading-tight mb-3">Quiet Reading Hall</h2>
                
                {/* Visual Seat Map */}
                <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    {libraryTables.map((table) => (
                      <div key={table.id} className="flex flex-col items-center">
                        <div className="text-[8px] font-bold text-white/50 mb-1 uppercase tracking-wider">Table {table.id}</div>
                        <div className="grid grid-cols-2 gap-1.5 relative">
                          {/* Table Center Graphic */}
                          <div className="absolute inset-0 m-auto w-6 h-6 bg-white/10 rounded-full border border-white/5" />
                          
                          {table.seats.map((seat) => {
                            const isSelected = selectedSeat === seat.id;
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.isOccupied}
                                onClick={() => setSelectedSeat(seat.id)}
                                className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold transition-all relative z-10 ${
                                  seat.isOccupied 
                                    ? "bg-slate-800 text-slate-600 cursor-not-allowed" 
                                    : isSelected
                                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/50 scale-110"
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
                    className={`flex-1 font-bold py-2.5 px-4 text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                      selectedSeat 
                        ? "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-400" 
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {selectedSeat ? `Confirm ${selectedSeat}` : "Select a Seat"}
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
                  <button onClick={() => setBookingState("scanning")} className="flex-1 bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" /> Scan QR to Confirm
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
                  <button onClick={cancelBooking} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20">
                    Vacate Seat
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* Facilities Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Mess Card */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col gap-2 active:scale-95 transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                Open
              </span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dinner Menu</p>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Paneer Tikka & Naan</h3>
            </div>
          </div>

          {/* Laundry Card */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col gap-2 active:scale-95 transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Shirt className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                3 Free
              </span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Hostel B Laundry</p>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Machines Available</h3>
            </div>
          </div>
        </motion.section>

        {/* Happening Now Feed */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Happening Now</h2>
            <button className="text-[11px] font-bold text-emerald-600">See Calendar</button>
          </div>
          
          <div className="space-y-3">
            {[
              { id: 1, tag: "Tech Club", title: "Web3 Hackathon Kickoff", location: "Auditorium 2", time: "Starts in 10 mins", color: "text-purple-600 bg-purple-50" },
              { id: 2, tag: "Sports", title: "Inter-Hostel Football Final", location: "Main Ground", time: "Ongoing", color: "text-rose-600 bg-rose-50" },
              { id: 3, tag: "Academic", title: "OS Extra Lab Session", location: "Lab Complex 4", time: "In 1 hour", color: "text-blue-600 bg-blue-50" },
            ].map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-lg border border-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${item.color}`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
