"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  ShieldCheck, 
  QrCode, 
  Home, 
  Utensils, 
  GraduationCap, 
  BookOpen, 
  Wifi, 
  ChevronRight,
  LogOut,
  CreditCard,
  Sparkles,
  Camera,
  X,
  Loader2
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRef, useState, useEffect } from "react";
import { getUserProfile } from "@/actions/dbActions";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { profileImage, setProfileImage } = useUser();
  const { user: authUser, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVirtualId, setShowVirtualId] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!authUser) return;
      setIsLoading(true);
      try {
        const data = await getUserProfile(authUser.uid, authUser.isAnonymous);
        if (!data) {
          setUser({
            name: "Profile Missing", rollNumber: "N/A", major: "N/A", classYear: "N/A",
            cgpa: "N/A", totalCredits: 0, maxCredits: 160,
            accommodation: { hostel: "Profile Missing", dietaryPreference: "Profile Missing" }
          });
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 overflow-hidden relative selection:bg-indigo-500/20">
      
      {/* Eye-catching Animated Background Blobs */}
      <div className="absolute top-0 -left-10 w-[30rem] h-[30rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
      <div className="absolute top-20 -right-20 w-[20rem] h-[20rem] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
      <div className="absolute top-60 left-20 w-[25rem] h-[25rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

      <div className="relative z-10 flex flex-col gap-5 max-w-md mx-auto px-4 pt-8">
        
        {/* Header Title */}
        <header className="flex justify-between items-end mb-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Profile</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Manage your CampusOS</p>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors active:scale-95">
            <span className="text-[9px] font-bold uppercase tracking-wider">Sign Out</span>
            <LogOut className="w-3 h-3" />
          </button>
        </header>

        {/* Premium Digital ID Card (Hero) */}
        {isLoading ? (
          <div className="h-64 rounded-[2rem] bg-slate-200 animate-pulse flex items-center justify-center border border-white/10 shadow-[0_15px_30px_rgb(0,0,0,0.15)]">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : user ? (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="relative rounded-[2rem] p-5 shadow-[0_15px_30px_rgb(0,0,0,0.15)] overflow-hidden bg-slate-950 border border-white/10 group"
          >
          {/* Stunning Glassmorphic Glows inside the Card */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[50px] opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[50px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
          
          {/* Noise Texture Overlay for Premium Feel */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

          <div className="relative z-10 flex flex-col h-full">
            
            {/* Top Row: Avatar & QR */}
            <div className="flex justify-between items-start mb-5">
              {/* Massive Premium Avatar */}
              <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-950 overflow-hidden relative">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-white">YP</span>
                    )}
                    {/* Hover Edit Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <button 
                onClick={() => setShowVirtualId(true)}
                className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Row: Identity */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h2 className="text-xl font-bold text-white leading-none tracking-tight">{user.name}</h2>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-[11px] font-medium text-indigo-200/80 tracking-wide">{user.major}</p>
              <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/5 backdrop-blur-md">
                <GraduationCap className="w-3 h-3 text-indigo-300" />
                <span className="text-[8px] font-bold text-indigo-200 uppercase tracking-widest">{user.classYear}</span>
              </div>
            </div>

            {/* Bottom Row: Stats */}
            <div className="flex items-center gap-6 pt-4 mt-4 border-t border-white/10">
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current CGPA</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-white leading-none">{user.cgpa}</p>
                </div>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Credits</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-white leading-none">{user.totalCredits}</p>
                  <p className="text-[10px] font-bold text-slate-500">/{user.maxCredits}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        ) : null}

        {/* Sleek Quick Actions (Vertical Stack Style) */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col gap-2"
        >
          <button 
            onClick={() => setShowVirtualId(true)}
            className="w-full bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-slate-100 hover:border-indigo-100 group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Virtual ID Card</p>
                <p className="text-[10px] font-medium text-slate-400">Tap to show QR for scanning</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </button>
          
          <button 
            onClick={logout}
            className="w-full bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-slate-100 hover:border-rose-100 group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Sign Out</p>
                <p className="text-[10px] font-medium text-slate-400">Securely end session</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-400 transition-colors" />
          </button>
        </motion.section>

        {/* Structured Data Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Accommodation & Dining */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accommodation & Dining</h2>
              {!authUser?.isAnonymous && <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">Edit <ChevronRight className="w-3 h-3" /></button>}
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 shadow-sm border border-orange-100/50">
                  <Home className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Hostel & Room</p>
                  <p className="text-sm font-bold text-slate-800">{user?.accommodation?.hostel || "Loading..."}</p>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-100" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100/50">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Dietary Preference</p>
                  <p className="text-sm font-bold text-slate-800">{user?.accommodation?.dietaryPreference || "Loading..."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Profile</h2>
              {!authUser?.isAnonymous && <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">Edit <ChevronRight className="w-3 h-3" /></button>}
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/50">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Roll Number</p>
                  <p className="text-sm font-bold text-slate-800 font-mono tracking-tight">{user?.rollNumber || "Loading..."}</p>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-100" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 shadow-sm border border-purple-100/50">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Semester</p>
                  <p className="text-sm font-bold text-slate-800">{user?.currentSemester || "Loading..."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Connectivity */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group mb-8 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-full mix-blend-multiply filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campus Connectivity</h3>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0 shadow-sm border border-cyan-100/50">
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Wi-Fi Devices</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">{user?.wifiDevicesRegistered || 0} <span className="text-slate-400 font-medium">/ {user?.wifiDevicesMax || 0} Registered</span></p>
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </motion.div>
      </div>

      {/* Virtual ID Modal */}
      <AnimatePresence>
        {showVirtualId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-[320px] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowVirtualId(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white z-20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="bg-slate-950 p-5 pt-8 pb-10 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2" />
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/30 mb-3 z-10">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-950 overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-white">YP</span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight z-10">{user?.name}</h2>
                <p className="text-xs font-medium text-indigo-200/80 tracking-wide mt-0.5 z-10">{user?.major}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 border border-white/5 backdrop-blur-md z-10">
                  <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">ID: {user?.rollNumber}</span>
                </div>
              </div>

              <div className="bg-white p-5 flex flex-col items-center relative -mt-4 rounded-t-3xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Scan at Checkpoint</p>
                
                {/* Mock QR/Barcode visualization - FIXED SIZE */}
                <div className="w-40 h-40 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center mb-4">
                  <QrCode className="w-24 h-24 text-indigo-600" />
                </div>
                
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Valid until May 2027</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
