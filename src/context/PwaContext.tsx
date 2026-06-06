"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Sparkles, RefreshCw, X, Download } from "lucide-react";

interface PwaContextType {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
  installApp: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  notificationPermission: NotificationPermission | "unsupported";
}

const PwaContext = createContext<PwaContextType | null>(null);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showOfflineToast, setShowOfflineToast] = useState<boolean>(false);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");
  
  const deferredPrompt = useRef<any>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initial connection check & listeners
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      // Auto-hide offline toast after 3.5 seconds
      setTimeout(() => {
        setShowOfflineToast(false);
      }, 3500);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Initial installation check
    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia("(display-mode: standalone)").matches || 
        (navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };
    
    checkStandalone();
    window.matchMedia("(display-mode: standalone)").addEventListener("change", checkStandalone);

    // 3. Capture native install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      deferredPrompt.current = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 4. Register Custom Service Worker & check for updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => {
          registrationRef.current = reg;
          console.log("Service Worker registered successfully:", reg.scope);

          // Listen for new service worker installs
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // A new Service Worker is waiting, show update prompt
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Check if there is already a waiting service worker
          if (reg.waiting) {
            setUpdateAvailable(true);
          }
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });

      // Handle controller changes (reloads page when skipWaiting completes)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 5. Initial Notifications check
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
    } else {
      setNotificationPermission(Notification.permission);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Programmatic installation trigger function
  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt.current) return false;
    
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    
    if (outcome === "accepted") {
      deferredPrompt.current = null;
      setIsInstallable(false);
      setIsInstalled(true);
      return true;
    }
    return false;
  };

  // Push notifications permission request
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) return "denied";
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission;
  };

  // Skip waiting & Reload App to activate updates
  const handleRefreshApp = () => {
    const reg = registrationRef.current;
    if (reg && reg.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  return (
    <PwaContext.Provider
      value={{
        isOnline,
        isInstallable,
        isInstalled,
        updateAvailable,
        installApp,
        requestNotificationPermission,
        notificationPermission
      }}
    >
      {children}

      {/* Slide-Up Toast and Banners System */}
      <AnimatePresence>
        {/* 1. Offline Toast Alert (autohides after 3.5 seconds) */}
        {showOfflineToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[88px] left-4 right-4 max-w-sm mx-auto z-[9999] bg-slate-900/95 backdrop-blur-md text-white border border-slate-800/80 px-4 py-3.5 rounded-[1.5rem] flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-white leading-tight">Connection Lost</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Using cached offline data</p>
              </div>
            </div>
            <button 
              onClick={() => setShowOfflineToast(false)} 
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 2. New Version Update Toast (statically remains until dismissed or refreshed) */}
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[88px] left-4 right-4 max-w-sm mx-auto z-[9999] bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-[1.5rem] flex items-center justify-between shadow-2xl border border-indigo-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <RefreshCw className="w-4 h-4 text-white animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">CampusOS Updated</p>
                <p className="text-[10px] text-indigo-200 font-semibold mt-0.5">Tap refresh to load latest version</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshApp}
                className="bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all text-[11px] font-black px-3 py-2 rounded-xl shadow-sm"
              >
                Refresh
              </button>
              <button 
                onClick={() => setUpdateAvailable(false)}
                className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePwa must be used within a PwaProvider");
  }
  return context;
}
