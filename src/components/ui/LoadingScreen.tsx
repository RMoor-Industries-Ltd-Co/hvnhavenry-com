"use client";

import { useEffect, useState } from "react";
import { useHavenStore } from "@/lib/store";

export function LoadingScreen() {
  const { isLoading, loadProgress } = useHavenStore();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0b09]"
      style={{
        opacity: isLoading ? 1 : 0,
        transition: "opacity 0.8s ease",
        pointerEvents: isLoading ? "all" : "none",
      }}
    >
      {/* Logo mark */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="text-[#c9a96e] font-display text-5xl font-light tracking-[0.3em]">HVN</div>
        <div className="h-px w-24 bg-[#c9a96e] opacity-40" />
        <div className="text-[#c9a96e] font-display text-sm tracking-[0.5em] font-light opacity-70">
          HAVENRY
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-px bg-[#2a2218] relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#c9a96e]"
          style={{
            width: `${loadProgress}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Subtitle */}
      <p className="mt-6 text-[#c9a96e] opacity-40 text-xs tracking-[0.4em] font-sans uppercase">
        Entering the great room
      </p>
    </div>
  );
}
