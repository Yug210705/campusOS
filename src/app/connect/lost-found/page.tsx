"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, Plus, MapPin, Clock, AlertCircle, Phone, X, Camera, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { getLostFoundItems, reportItem } from "@/actions/dbActions";

export default function LostAndFoundPage() {
  const { user: authUser } = useAuth();
  const { profileImage } = useUser();
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [items, setItems] = useState<{ lost: any[]; found: any[] }>({ lost: [], found: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [itemImage, setItemImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedItems = items[activeTab] || [];

  // Filter items based on client-side search query
  const filteredItems = displayedItems.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const isGuest = authUser?.isAnonymous ?? true;
        const [lostItems, foundItems] = await Promise.all([
          getLostFoundItems('lost', isGuest),
          getLostFoundItems('found', isGuest)
        ]);
        setItems({ lost: lostItems, found: foundItems });
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [authUser]);

  // Handle deep-linking from Launcher Quick Actions
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("report") === "true") {
        setIsReporting(true);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !contactNumber) return;
    setIsSubmitting(true);

    try {
      const isGuest = authUser?.isAnonymous ?? true;
      const newItem = await reportItem({
        title,
        description,
        location,
        contactNumber,
        image: itemImage || (reportType === "lost" 
          ? "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=600&auto=format&fit=crop" // fallback red box/bag
          : "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"), // fallback green drawer/shelf
        status: reportType,
        reporter: authUser?.displayName || "Yug Pathak",
      });

      setItems((prev) => ({
        ...prev,
        [reportType]: [newItem, ...prev[reportType]]
      }));

      setActiveTab(reportType);
      setTitle("");
      setDescription("");
      setLocation("");
      setContactNumber("");
      setItemImage(null);
      setIsReporting(false);
    } catch (error) {
      console.error("Failed to report item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 max-w-md mx-auto relative">
      
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-30 border-b border-slate-100 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/connect">
              <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">Lost & Found</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Campus Network</p>
            </div>
          </div>
          <button 
            onClick={() => setIsReporting(true)}
            className="h-8 px-3 rounded-full bg-indigo-600 flex items-center justify-center gap-1.5 text-white active:scale-95 transition-transform shadow-sm shadow-indigo-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Report</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'lost' ? 'lost' : 'found'} items...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Custom Segmented Control */}
        <div className="flex bg-slate-100 p-1 rounded-xl relative">
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
            animate={{ left: activeTab === "lost" ? "4px" : "calc(50%)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setActiveTab("lost")}
            className={`flex-1 relative z-10 py-2.5 text-xs font-bold transition-colors ${activeTab === "lost" ? "text-slate-900" : "text-slate-500"}`}
          >
            Lost Items
          </button>
          <button 
            onClick={() => setActiveTab("found")}
            className={`flex-1 relative z-10 py-2.5 text-xs font-bold transition-colors ${activeTab === "found" ? "text-slate-900" : "text-slate-500"}`}
          >
            Found Items
          </button>
        </div>
      </div>

      {/* Content Feed */}
      <div className="p-4 flex flex-col gap-4 min-h-[50vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing database...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2.5" />
            <h3 className="font-bold text-slate-800 text-sm">No Items Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto leading-normal">
              No reports match your current query or category.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200/80 flex gap-4 overflow-hidden"
              >
                {/* Clickable Card Link to Details */}
                <Link href={`/connect/lost-found/${item._id}`} className="flex gap-4 flex-1 min-w-0 cursor-pointer">
                  {/* Image Container */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/50 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                    
                    {/* Micro Badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-[4px] bg-white/90 backdrop-blur-md shadow-sm flex items-center gap-1">
                      {item.status === "lost" ? (
                        <AlertCircle className="w-2.5 h-2.5 text-rose-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      <span className={`text-[8px] font-black uppercase tracking-widest leading-none ${item.status === "lost" ? "text-rose-600" : "text-emerald-600"}`}>
                        {item.status === "lost" ? "Lost" : "Found"}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-1 py-0.5 justify-between min-w-0">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-medium text-slate-500 leading-snug line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.time || "Just now"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 truncate pr-2">By {item.reporter}</span>
                      <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 hover:underline shrink-0">
                        View Details <ChevronLeft className="w-3 h-3 rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Report Modal / Bottom Sheet */}
      <AnimatePresence>
        {isReporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm max-w-md mx-auto"
          >
            <div className="absolute inset-0" onClick={() => setIsReporting(false)} />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[2rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-none">Report an Item</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Help keep the campus network synchronized</p>
                </div>
                <button 
                  onClick={() => setIsReporting(false)}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="p-5 overflow-y-auto flex-1">
                <form id="report-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Type Toggle */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Item Type *</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl relative">
                      <motion.div
                        layoutId="reportTypeIndicator"
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-sm"
                        style={{ backgroundColor: reportType === "lost" ? "#F43F5E" : "#10B981" }} // rose-500 : emerald-500
                        animate={{ left: reportType === "lost" ? "4px" : "calc(50%)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <button 
                        type="button"
                        onClick={() => setReportType("lost")}
                        className={`flex-1 relative z-10 py-2.5 text-xs font-bold transition-colors ${reportType === "lost" ? "text-white" : "text-slate-500"}`}
                      >
                        I Lost This
                      </button>
                      <button 
                        type="button"
                        onClick={() => setReportType("found")}
                        className={`flex-1 relative z-10 py-2.5 text-xs font-bold transition-colors ${reportType === "found" ? "text-white" : "text-slate-500"}`}
                      >
                        I Found This
                      </button>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Item Photo {reportType === "found" && "*"}</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${itemImage ? 'border-transparent' : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50'}`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                      />
                      
                      {itemImage ? (
                        <>
                          <img src={itemImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                              <Camera className="w-4 h-4 text-white" />
                              <span className="text-[9px] font-black text-white uppercase tracking-wider">Change Photo</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-1.5 text-indigo-500">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">Tap to upload photo</p>
                          <p className="text-[9px] font-semibold text-slate-400 mt-0.5">JPEG, PNG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Item Name *</label>
                      <input 
                        required
                        type="text" 
                        placeholder={reportType === "lost" ? "e.g. Milton Water Bottle" : "e.g. AirPods Pro Case"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                        {reportType === "lost" ? "Last Seen Location *" : "Found Location *"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Central Library 2nd Floor"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Contact Number *</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="e.g. 9876543210"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Description</label>
                      <textarea 
                        placeholder="Any distinct features? Scratches, stickers, color, case description, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
                      />
                    </div>
                  </div>

                </form>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <button 
                  type="submit"
                  form="report-form"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Report ${reportType === "lost" ? "Lost" : "Found"} Item`}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
