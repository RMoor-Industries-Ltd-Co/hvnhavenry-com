"use client";

import { useEffect, useRef, useState } from "react";
import { useHavenStore } from "@/lib/store";

// Full-screen loader shown only when the visitor is *sent* to the showroom (via a
// "View Showroom" action) — it covers the whole viewport on black so no part of the S2
// parallax shows during the jump, then fades out once S3 is reached. Manual scrolling
// never triggers it, so the parallax stays experienceable.
const PHRASES = ["Loading", "Please wait", "Thank you for your patience", "One moment please"];

export function LoaderOverlay() {
  const loaderActive = useHavenStore((s) => s.loaderActive);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phrase, setPhrase] = useState(PHRASES[0]);

  // Restart the animation each time the loader is shown.
  useEffect(() => {
    if (loaderActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [loaderActive]);

  // Rotate the caption to a random phrase while the loader is up. The first pick is
  // deferred (setTimeout) so state is never set synchronously inside the effect.
  useEffect(() => {
    if (!loaderActive) return;
    const pick = () => setPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    const first = setTimeout(pick, 0);
    const iv = setInterval(pick, 1600);
    return () => {
      clearTimeout(first);
      clearInterval(iv);
    };
  }, [loaderActive]);

  return (
    <div
      aria-hidden={!loaderActive}
      className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-6 transition-opacity duration-700 ease-out ${
        loaderActive ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <video
        ref={videoRef}
        src="/assets/mark/mark__aure__loading.mp4"
        muted
        loop
        playsInline
        preload="auto"
        className="max-h-[60vh] max-w-[70vw] object-contain"
      />
      <p className="font-display text-[#c9a96e] text-sm tracking-[0.4em] uppercase opacity-70">
        {phrase}
      </p>
    </div>
  );
}
