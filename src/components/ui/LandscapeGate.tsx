"use client";

import { useEffect, useState } from "react";

export function LandscapeGate({ children }: { children: React.ReactNode }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const check = () => {
      const isMobile = window.innerWidth < 1024;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowPrompt(isMobile && isPortrait);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (showPrompt) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0d0b09] flex flex-col items-center justify-center gap-6 px-8">
        {/* Rotate icon */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          className="text-[#c9a96e] animate-[spin_3s_ease-in-out_infinite]"
          style={{ animationTimingFunction: "cubic-bezier(0.4,0,0.6,1)" }}
        >
          <rect x="12" y="8" width="32" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 20 C4 20 10 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 20 L4 14 M4 20 L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="text-center">
          <p className="font-display text-2xl text-[#e8dcc8] mb-2">
            Rotate to landscape
          </p>
          <p className="text-xs text-[#c9a96e] opacity-60 tracking-[0.3em] uppercase font-sans">
            for the full experience
          </p>
        </div>

        <div className="h-px w-16 bg-[#c9a96e] opacity-20" />

        <p className="text-xs text-[#e8dcc8] opacity-30 font-sans text-center max-w-xs leading-relaxed">
          HVN Havenry is designed to be explored in widescreen. Turn your device sideways to enter the great room.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
