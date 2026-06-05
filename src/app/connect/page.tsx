"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Package, AlertCircle, CheckCircle, User } from "lucide-react";
import Link from "next/link";

export default function ConnectDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-8 pb-36 max-w-md mx-auto flex flex-col gap-6">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Connect</h1>
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1.5">
          Student Marketplace & Lost Items
        </p>
      </header>

      {/* Main Module Cards */}
      <section className="flex flex-col gap-4">
        {/* Campus Exchange Card (Indigo Gradient) */}
        <Link href="/connect/exchange">
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md shadow-indigo-600/10 border border-indigo-500/25 relative overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer group"
          >
            {/* Soft Radial Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 blur-2xl rounded-full" />
            
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShoppingBag className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold tracking-tight">Campus Exchange</h2>
              <p className="text-xs font-semibold text-indigo-100 mt-1 leading-normal">
                Buy, sell and discover student essentials.
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Lost & Found Card (Slate Gradient - Visual Balance) */}
        <Link href="/connect/lost-found">
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md shadow-slate-950/15 border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer group"
          >
            {/* Soft Emerald Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/15 blur-2xl rounded-full" />
            
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold tracking-tight">Lost & Found</h2>
              <p className="text-xs font-semibold text-slate-200 mt-1 leading-normal">
                Recover lost belongings through the campus community.
              </p>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* Recent Community Activity Feed */}
      <section className="mt-2">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
          Recent Community Activity
        </h2>
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4">
          {/* Activity 1 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-850 leading-tight">Scientific Calculator listed for ₹700</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">Academic • Just now</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Activity 2 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-850 leading-tight">AirPods Pro found in Library</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">Central Library • 30 mins ago</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Activity 3 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-855 leading-tight">Blue Water Bottle reported lost</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">Sports Complex • 2 hours ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
