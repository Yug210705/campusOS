"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Share, Bookmark, Phone, MessageSquare, MapPin, Tag, User, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { getExchangeItemById } from "@/actions/dbActions";
import { useAuth } from "@/context/AuthContext";

export default function ExchangeItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user: authUser } = useAuth();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function loadItem() {
      try {
        const isGuest = authUser?.isAnonymous ?? true;
        const fetchedItem = await getExchangeItemById(unwrappedParams.id, isGuest);
        setItem(fetchedItem);
      } catch (err) {
        console.error("Failed to load exchange item:", err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [unwrappedParams.id, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-md mx-auto flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching listing...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
        <Tag className="w-10 h-10 text-slate-300 mb-3" />
        <h3 className="font-bold text-slate-800 text-sm">Listing Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px] mb-6">
          This item may have been sold or removed by the seller.
        </p>
        <Link href="/connect/exchange">
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform">
            Back to Exchange
          </button>
        </Link>
      </div>
    );
  }

  const formattedDate = item.createdAt 
    ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : "Just now";

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative pb-28">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-100 px-4 pt-12 pb-4 flex justify-between items-center shadow-sm">
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
      </header>

      {/* Listing Cover Photo */}
      <div className="w-full h-80 bg-slate-100 border-b border-slate-200 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badge */}
        <span className="absolute bottom-4 left-4 text-[10px] font-black text-indigo-700 bg-white border border-indigo-100/50 px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
          {item.category}
        </span>
      </div>

      {/* Details Container */}
      <main className="p-5 flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950 leading-tight">
            {item.title}
          </h1>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-indigo-600">
              ₹{item.price}
            </span>
            {item.isAvailable === false && (
              <span className="text-xs font-black text-white bg-rose-600 px-3 py-1 rounded-lg uppercase tracking-wider">
                Not Available
              </span>
            )}
          </div>
        </div>

        {/* Location & Seller Meta Info Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Seller</p>
              <p className="font-bold text-slate-800 leading-tight">{item.sellerName}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Location</p>
              <p className="font-bold text-slate-800 leading-tight">{item.location}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Listed On</p>
              <p className="font-bold text-slate-800 leading-tight">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase px-1">Description</h3>
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">
              {item.description || "No description provided by the seller."}
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Action Footer */}
      <footer className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-30 flex flex-col gap-3">
        {item.isAvailable === false ? (
          <div className="text-center py-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider">
            This item is currently unavailable
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 w-full">
            <a href={`tel:${item.contactNumber}`} className="col-span-1">
              <button className="w-full py-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Call Seller
              </button>
            </a>
            <a href={`sms:${item.contactNumber}`} className="col-span-1">
              <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10">
                <MessageSquare className="w-4 h-4" /> Message Seller
              </button>
            </a>
          </div>
        )}
      </footer>
    </div>
  );
}
