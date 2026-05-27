"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, AlertCircle, X, Loader2 } from "lucide-react";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Loading application...");
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    // Explain Render sleep mode after 5 seconds
    const timer = setTimeout(() => {
      setLoadingText("Waking up backend from sleep mode...");
      setIsDelayed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center justify-center animate-pulse">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-60 animate-pulse delay-150"></div>
          <LayoutDashboard className="w-20 h-20 text-indigo-600 relative z-10 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600">IssueManager</h1>
        <div className={`flex items-center gap-2 mt-4 text-sm font-medium tracking-wide transition-colors duration-500 ${isDelayed ? 'text-amber-600' : 'text-slate-500'}`}>
          <Loader2 className={`w-4 h-4 animate-spin ${isDelayed ? 'text-amber-500' : 'text-indigo-400'}`} />
          <span>{loadingText}</span>
        </div>
        {isDelayed && (
          <p className="mt-3 text-xs text-amber-700/80 max-w-xs text-center animate-fade-in">
            (Free Render instances spin down after inactivity. It usually takes ~40 seconds to wake up!)
          </p>
        )}
      </div>
    </div>
  );
}
