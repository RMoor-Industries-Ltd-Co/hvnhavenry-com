"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HotspotId } from "@/lib/store";

interface HotspotProps {
  id: HotspotId;
  position: [number, number, number];
  label: string;
  onSelect: (id: HotspotId) => void;
  isSelected: boolean;
}

export function Hotspot({ id, position, label, onSelect, isSelected }: HotspotProps) {
  const orb = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orb.current) {
      orb.current.position.y = position[1] + Math.sin(t * 1.8 + position[0]) * 0.08;
      const glow = hovered || isSelected ? 1.0 : 0.6;
      (orb.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        glow + Math.sin(t * 3) * 0.1;
    }
    if (ring.current) {
      ring.current.rotation.y = t * 0.8;
      ring.current.scale.setScalar(1 + Math.sin(t * 2 + position[0]) * 0.08);
    }
  });

  return (
    <group position={position}>
      {/* Glowing orb */}
      <mesh
        ref={orb}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={() => {
          onSelect(id);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#c9a96e"
          emissive="#c9a96e"
          emissiveIntensity={0.7}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ring} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.18, 0.012, 8, 32]} />
        <meshStandardMaterial
          color="#c9a96e"
          emissive="#c9a96e"
          emissiveIntensity={0.4}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.5}
        />
      </mesh>

      {/* Label (HTML overlay) */}
      <Html
        position={[0, 0.32, 0]}
        center
        style={{
          pointerEvents: "none",
          opacity: hovered || isSelected ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            background: "rgba(13,11,9,0.85)",
            border: "1px solid rgba(201,169,110,0.6)",
            padding: "4px 10px",
            borderRadius: "2px",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "13px",
            letterSpacing: "0.1em",
            color: "#c9a96e",
            userSelect: "none",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}
