"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, Plus, MapPin, Tag, User, Phone, ArrowRight, Loader2, Heart } from "lucide-react";
import Link from "next/link";
import { getExchangeItems } from "@/actions/dbActions";
import { useAuth } from "@/context/AuthContext";

const categories = ["All", "Academic", "Hostel", "Cycles"];

export default function CampusExchangePage() {
  const { user: authUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load items on filter changes
  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const isGuest = authUser?.isAnonymous ?? true;
        const fetchedItems = await getExchangeItems(selectedCategory, searchQuery, isGuest);
        setItems(fetchedItems);
      } catch (err) {
        console.error("Failed to load exchange items:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadItems();
    }, 200); // Debounce search

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, authUser]);

  return (
    <div className="min-h-screen bg-slate-50 pb-32 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 border-b border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/connect">
              <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">Campus Exchange</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Buy & Sell Essentials
              </p>
            </div>
          </div>

          <Link href="/connect/exchange/create">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="h-8 px-3 rounded-full bg-indigo-600 flex items-center justify-center gap-1.5 text-white active:scale-95 transition-transform shadow-sm shadow-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Sell Item</span>
            </motion.button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items for sale..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Grid (No Slider Required) */}
        <div className="grid grid-cols-4 gap-2 pb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 rounded-full text-[10px] font-bold border transition-all text-center ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Listing Grid */}
      <main className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2.5" />
            <h3 className="font-bold text-slate-800 text-sm">No Listings Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto leading-normal">
              Be the first to list an item in this category!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-3xl p-3 shadow-sm border border-slate-200/80 flex gap-4 overflow-hidden ${
                    item.isAvailable === false ? "opacity-85" : ""
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="w-28 h-28 rounded-2xl bg-slate-100 border border-slate-200/50 overflow-hidden shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[8px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.isAvailable === false && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[10px] font-black text-white bg-rose-600 px-2 py-0.5 rounded uppercase tracking-wider leading-none">
                          Sold
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Price tag and status */}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-sm font-black text-indigo-600 block">
                          ₹{item.price}
                        </span>
                        {item.isAvailable === false && (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Not Available
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Seller: {item.sellerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-slate-100 pt-2.5 mt-2.5">
                      <Link href={`/connect/exchange/${item._id}`} className="flex-1">
                        <button className="w-full h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-700 active:scale-[0.98] transition-transform">
                          View Details
                        </button>
                      </Link>
                      {item.isAvailable === false ? (
                        <button disabled className="flex-1 h-7 rounded-lg bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-400 cursor-not-allowed">
                          Unavailable
                        </button>
                      ) : (
                        <a href={`tel:${item.contactNumber}`} className="flex-1">
                          <button className="w-full h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-[9px] font-bold text-indigo-700 flex items-center justify-center gap-1 active:scale-[0.98] transition-transform">
                            <Phone className="w-2.5 h-2.5" />
                            Contact
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
