"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MapPin, Clock, AlertCircle, Phone, X, Camera, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { getLostFoundItems, reportItem } from "@/actions/dbActions";

const INITIAL_DATA = {
  lost: [
    {
      id: "1",
      title: "Keys with Red Lanyard",
      description: "Lost a set of 3 keys on a bright red campus lanyard.",
      location: "Near CS Block Entry",
      time: "2 hours ago",
      image: "/artifacts/keys_lost_1780654867355.png",
      status: "lost",
      reporter: "Yug Pathak",
    },
    {
      id: "2",
      title: "Black Leather Notebook",
      description: "Contains all my Operating Systems notes! Very urgent.",
      location: "Library 2nd Floor",
      time: "Yesterday, 4:30 PM",
      image: "/artifacts/notebook_lost_1780654900684.png",
      status: "lost",
      reporter: "Aarav Sharma",
    }
  ],
  found: [
    {
      id: "3",
      title: "AirPods Pro Case",
      description: "Found an open AirPods case on the reading tables.",
      location: "Central Library",
      time: "30 mins ago",
      image: "/artifacts/airpods_found_1780654879538.png",
      status: "found",
      reporter: "Security Desk",
    }
  ]
};

export default function LostAndFoundPage() {
  const { user: authUser } = useAuth();
  const { profileImage } = useUser();
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [items, setItems] = useState<{ lost: any[]; found: any[] }>({ lost: [], found: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [itemImage, setItemImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedItems = items[activeTab] || [];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [lostItems, foundItems] = await Promise.all([
          getLostFoundItems('lost', authUser?.isAnonymous),
          getLostFoundItems('found', authUser?.isAnonymous)
        ]);
        setItems({ lost: lostItems, found: foundItems });
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [authUser?.isAnonymous]);

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
    if (!title || !location) return;
    setIsSubmitting(true);

    try {
      const newItem = await reportItem({
        title,
        description,
        location,
        image: itemImage || "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=600&auto=format&fit=crop",
        status: reportType,
        reporter: "Yug Pathak",
      });

      setItems((prev) => ({
        ...prev,
        [reportType]: [newItem, ...prev[reportType]]
      }));

      setActiveTab(reportType);
      setTitle("");
      setDescription("");
      setLocation("");
      setItemImage(null);
      setIsReporting(false);
    } catch (error) {
      console.error("Failed to report item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-3 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Lost & Found</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Campus Hub</p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform border border-slate-100">
              <Search className="w-4 h-4" />
            </button>
            {!authUser?.isAnonymous && (
              <button 
                onClick={() => setIsReporting(true)}
                className="h-8 px-3 rounded-full bg-indigo-600 flex items-center justify-center gap-1.5 text-white active:scale-95 transition-transform shadow-sm shadow-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Report</span>
              </button>
            )}
          </div>
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

      {/* Content Feed (Ultra Compact Horizontal Cards) */}
      <div className="p-3 flex flex-col gap-3 min-h-[50vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50 mt-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syncing Database...</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayedItems.map((item, idx) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex gap-3 overflow-hidden"
            >
              {/* Image Container */}
              <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/50 flex items-center justify-center">
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
                  <h3 className="text-sm font-bold text-slate-900 leading-tight mb-0.5 truncate">{item.title}</h3>
                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mb-2">{item.description}</p>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-[9px] font-bold text-slate-500 truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-[9px] font-bold text-slate-500 truncate">{item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Ultra Compact Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 truncate pr-2">By {item.reporter}</span>
                  <button className={`h-6 px-2.5 rounded-md flex items-center gap-1 text-[9px] font-bold active:scale-95 transition-transform shrink-0 ${
                    item.status === "lost" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    <Phone className="w-2.5 h-2.5" />
                    Contact
                  </button>
                </div>
              </div>
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
            className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setIsReporting(false)} />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[2rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Report an Item</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Help keep the campus safe</p>
                </div>
                <button 
                  onClick={() => setIsReporting(false)}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="p-5 overflow-y-auto flex-1">
                <form id="report-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Type Toggle */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Item Type</label>
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Item Photo</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${itemImage ? 'border-transparent' : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50'}`}
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
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change Photo</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-2 text-indigo-500">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">Tap to upload photo</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">JPEG, PNG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Item Title *</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. AirPods Pro Case"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Central Library 2nd Floor"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Description</label>
                      <textarea 
                        placeholder="Any distinct features? Scratches, stickers, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
                      />
                    </div>
                  </div>

                </form>
              </div>

              {/* Sticky Footer */}
              <div className="p-5 border-t border-slate-100 bg-white">
                <button 
                  type="submit"
                  form="report-form"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Report"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
