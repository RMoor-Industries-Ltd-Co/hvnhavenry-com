"use client";

import { useEffect, useRef } from "react";
import { useHavenStore } from "@/lib/store";

// Full-screen loader shown only when the visitor is *sent* to the showroom (via a
// "View Showroom" action) — it covers the whole viewport on black so no part of the S2
// parallax shows during the jump, then fades out once S3 is reached. Manual scrolling
// never triggers it, so the parallax stays experienceable.
export function LoaderOverlay() {
  const loaderActive = useHavenStore((s) => s.loaderActive);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restart the animation each time the loader is shown.
  useEffect(() => {
    if (loaderActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [loaderActive]);

  return (
    <div
      aria-hidden={!loaderActive}
      className={`fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-700 ease-out ${
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
        className="max-h-[70vh] max-w-[70vw] object-contain"
      />
    </div>
  );
}
