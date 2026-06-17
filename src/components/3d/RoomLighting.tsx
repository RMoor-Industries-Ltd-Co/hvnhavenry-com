"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RoomLighting() {
  const lampL = useRef<THREE.PointLight>(null);
  const lampR = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle floor lamp flicker
    if (lampL.current) lampL.current.intensity = 2.2 + Math.sin(t * 4.1) * 0.08;
    if (lampR.current) lampR.current.intensity = 2.2 + Math.sin(t * 3.7 + 1) * 0.08;
  });

  return (
    <>
      {/* Very dim cool ambient — night sky bleed through windows */}
      <ambientLight intensity={0.06} color="#8090c0" />

      {/* City window bounce light — cool blue from left */}
      <directionalLight
        position={[-8, 3, 0]}
        intensity={0.25}
        color="#6080c0"
      />

      {/* Dusk horizon glow from left */}
      <pointLight position={[-5.5, 1.0, 0]} intensity={0.8} color="#c04020" decay={2} distance={8} />

      {/* Floor lamp left */}
      <pointLight
        ref={lampL}
        position={[-2.2, 1.65, 0.8]}
        intensity={2.2}
        color="#ffd080"
        decay={2}
        distance={5}
        castShadow
      />

      {/* Floor lamp right */}
      <pointLight
        ref={lampR}
        position={[2.2, 1.65, 0.8]}
        intensity={2.2}
        color="#ffd080"
        decay={2}
        distance={5}
        castShadow
      />

      {/* Shelving LED warm strip */}
      <rectAreaLight
        position={[5.5, 2.0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={5}
        height={3}
        intensity={1.2}
        color="#ffd880"
      />

      {/* Ceiling recessed spots — dim, warm */}
      <spotLight position={[0, 4.2, -1]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff0d0" castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-2, 4.2, 1.5]} angle={0.4} penumbra={0.7} intensity={0.7} color="#fff0d0" />
      <spotLight position={[2, 4.2, 1.5]} angle={0.4} penumbra={0.7} intensity={0.7} color="#fff0d0" />

      {/* Art spotlight */}
      <spotLight
        position={[0, 4.0, -3.5]}
        target-position={[0, 2.8, -5.38]}
        angle={0.25}
        penumbra={0.4}
        intensity={2.0}
        color="#fff8e8"
      />
    </>
  );
}
