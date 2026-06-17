"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RoomLighting() {
  const fireLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (fireLightRef.current) {
      // Subtle fireplace flicker
      const t = state.clock.elapsedTime;
      fireLightRef.current.intensity = 1.8 + Math.sin(t * 7.3) * 0.3 + Math.sin(t * 11.7) * 0.15;
    }
  });

  return (
    <>
      {/* Warm ambient */}
      <ambientLight intensity={0.18} color="#ffe8c0" />

      {/* Main overhead — warm tungsten */}
      <pointLight position={[0, 3.8, 0]} intensity={2.5} color="#ffd4a0" decay={2} castShadow />

      {/* Side fill from windows (cool blue-white) */}
      <directionalLight
        position={[-8, 4, 2]}
        intensity={0.4}
        color="#c0d4ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fireplace glow — ember orange */}
      <pointLight
        ref={fireLightRef}
        position={[-2.8, 0.5, -3.5]}
        intensity={2.0}
        color="#ff6820"
        decay={2}
        distance={5}
      />

      {/* Desk lamp warm pool */}
      <pointLight position={[3.2, 1.4, 0.5]} intensity={1.2} color="#ffe0a0" decay={2} distance={3} />

      {/* Bar back-light (cool amber) */}
      <pointLight position={[3.8, 1.8, -2.8]} intensity={0.9} color="#ffc060" decay={2} distance={4} />

      {/* Library wall accent */}
      <rectAreaLight
        position={[0, 2.5, -4.9]}
        rotation={[0, 0, 0]}
        width={7}
        height={2}
        intensity={0.6}
        color="#ffe4b0"
      />

      {/* Ceiling recessed spots */}
      <spotLight position={[-2, 4, 1]} angle={0.35} penumbra={0.5} intensity={1.5} color="#fff5e0" castShadow />
      <spotLight position={[2, 4, 1]} angle={0.35} penumbra={0.5} intensity={1.5} color="#fff5e0" castShadow />
      <spotLight position={[0, 4, -2]} angle={0.35} penumbra={0.5} intensity={1.2} color="#fff5e0" />
    </>
  );
}
