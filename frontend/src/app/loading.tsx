"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, AlertCircle, X, Loader2 } from "lucide-react";

export default function Loading() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show toast after 20 seconds to explain Render sleep mode
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 20000);

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
        <div className="flex items-center gap-2 text-slate-500 mt-4 text-sm font-medium tracking-wide">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Loading application...</span>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-4 sm:right-6 sm:max-w-md bg-white border border-amber-200 rounded-xl shadow-2xl p-4 flex items-start gap-3 z-50 transform transition-all duration-500 ease-out translate-y-0 opacity-100">
          <div className="bg-amber-100 p-2 rounded-full flex-shrink-0 text-amber-600 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900 mb-1">Extended Loading Time</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Loading is taking longer than expected. This is typically due to the backend service waking up from sleep mode on Render. It should be ready momentarily.
            </p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="text-amber-400 hover:text-amber-600 transition-colors p-1.5 rounded-md hover:bg-amber-50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
