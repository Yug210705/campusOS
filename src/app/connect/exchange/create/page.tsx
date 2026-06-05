"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, UploadCloud, Loader2, X } from "lucide-react";
import Link from "next/link";
import { createExchangeItem } from "@/actions/dbActions";

const categories = ["Academic", "Electronics", "Hostel Essentials", "Cycles", "Books", "Miscellaneous"];

export default function CreateExchangeListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Academic");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [itemImage, setItemImage] = useState<string | null>(null);

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
    if (!title || !price || !location || !contactNumber) return;
    setIsSubmitting(true);

    try {
      // Create listing
      await createExchangeItem({
        title,
        price: Number(price),
        category,
        location,
        contactNumber,
        description,
        image: itemImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", // high quality fallback product image
        sellerName: "Yug Pathak", // mock default user name
      });

      router.push("/connect/exchange");
    } catch (error) {
      console.error("Failed to create exchange listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto relative flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-100 px-4 pt-12 pb-4 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/connect/exchange">
            <button className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">Create Listing</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Campus Exchange
            </p>
          </div>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Form Content */}
      <main className="flex-1 p-5 overflow-y-auto">
        <form id="create-listing-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Image Upload Box */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Item Photo *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${
                itemImage ? "border-transparent" : "border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
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
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-2 text-indigo-500 shadow-sm">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Tap to upload photo</p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">JPEG, PNG up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields Group */}
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Item Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Lab Coat, Scientific Calculator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Grid for Category & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Price (₹) *</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Hostel / Location *</label>
              <input
                required
                type="text"
                placeholder="e.g. Block B, Room 402 or Cycle Stand"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Contact Number *</label>
              <input
                required
                type="tel"
                placeholder="e.g. 9876543210"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea
                placeholder="Item condition, usage time, size details, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        </form>
      </main>

      {/* Submit Sticky Action Button */}
      <footer className="p-4 bg-white border-t border-slate-100 sticky bottom-0">
        <button
          type="submit"
          form="create-listing-form"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Post Listing...
            </>
          ) : (
            "Post Listing"
          )}
        </button>
      </footer>
    </div>
  );
}
