"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, AlertCircle, X, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes showAfter5s {
          0%, 99% { opacity: 0; display: none; }
          100% { opacity: 1; display: block; }
        }
        @keyframes hideAfter5s {
          0%, 99% { opacity: 1; display: flex; }
          100% { opacity: 0; display: none; }
        }
        .show-on-delay {
          animation: showAfter5s 5s forwards;
          opacity: 0;
        }
        .hide-on-delay {
          animation: hideAfter5s 5s forwards;
        }
      `}} />

      <div className="flex flex-col items-center justify-center animate-pulse">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-60 animate-pulse delay-150"></div>
          <LayoutDashboard className="w-20 h-20 text-indigo-600 relative z-10 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600">IssueManager</h1>
        
        {/* Normal Loading Text (Hides after 5s) */}
        <div className="hide-on-delay items-center gap-2 mt-4 text-sm font-medium tracking-wide text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Loading application...</span>
        </div>

        {/* Delayed Render Sleep Text (Shows after 5s) */}
        <div className="show-on-delay">
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-amber-600">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Waking up backend from sleep mode...</span>
            </div>
            <p className="mt-2 text-xs text-amber-700/80 max-w-xs text-center">
              (Free Render instances spin down after inactivity. It usually takes ~40 seconds to wake up!)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
