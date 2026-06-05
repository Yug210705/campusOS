"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
// @ts-ignore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { registerUser, getUserProfile } from "@/actions/dbActions";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Hash, Loader2, Sparkles, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Handle Login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Handle Signup
        if (!name || !rollNumber) {
          throw new Error("Name and Roll Number are required.");
        }
        
        // 1. Create in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Register in MongoDB
        await registerUser(userCredential.user.uid, email, name, rollNumber);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Email is already registered. Please login.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in MongoDB
      const profile = await getUserProfile(result.user.uid);
      
      // If profile is missing (first time Google login), create it automatically
      if (!profile) {
        const randomRoll = "G-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        await registerUser(
          result.user.uid, 
          result.user.email || "", 
          result.user.displayName || "Google User", 
          randomRoll
        );
      }
      
      // AuthContext handles the redirect
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInAnonymously(auth);
      // AuthContext handles the redirect
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Guest sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden max-w-md mx-auto">
      
      {/* Decorative Top Graphic */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-indigo-50 to-slate-50/0 z-0" />
      <div className="absolute top-[-5%] right-[-10%] w-48 h-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[60px] opacity-20 animate-pulse" />

      <div className="flex-1 flex flex-col justify-center px-4 relative z-10 py-6">
        
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">CampusOS</h1>
          <p className="text-xs text-slate-500 font-medium">Your entire campus, in your pocket.</p>
        </div>

        {/* Main Card */}
        <motion.div 
          layout
          className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {isLogin ? "Sign in to continue" : "Join the community"}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                </div>
                <p className="text-[10px] font-medium text-rose-800 mt-1 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3 overflow-hidden"
                >
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 transition-colors">
                      <User className="w-3 h-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      required={!isLogin}
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 placeholder:font-medium"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 transition-colors">
                      <Hash className="w-3 h-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      required={!isLogin}
                      placeholder="Roll Number (e.g. 2023CS0142)"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 placeholder:font-medium uppercase"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 transition-colors">
                <Mail className="w-3 h-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input 
                type="email" 
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 placeholder:font-medium"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 transition-colors">
                <Lock className="w-3 h-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input 
                type="password" 
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 placeholder:font-medium"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full py-3.5 rounded-xl bg-indigo-600 text-white text-[13px] font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-indigo-600/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>

          {/* Google Auth Divider */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-full bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest shrink-0">Or continue with</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="mt-6 w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[13px] font-bold hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-70"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <button 
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="mt-3 w-full py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <User className="w-4 h-4" />
            Continue as Guest
          </button>
        </motion.div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-[11px] font-medium text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={toggleMode}
            className="mt-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors py-1.5 px-4 rounded-full bg-indigo-50 hover:bg-indigo-100"
          >
            {isLogin ? "Create an account" : "Sign in instead"}
          </button>
        </div>

      </div>
    </div>
  );
}
