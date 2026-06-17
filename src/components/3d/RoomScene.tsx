"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useHavenStore } from "@/lib/store";
import { RoomGeometry } from "./RoomGeometry";
import { RoomLighting } from "./RoomLighting";
import { Hotspot } from "./Hotspot";

const HOTSPOTS = [
  { id: "sofa" as const, position: [0, 1.35, 1.5] as [number, number, number], label: "The Meridian Chaise" },
  { id: "desk" as const, position: [3.0, 1.5, 0.5] as [number, number, number], label: "The Obsidian Bureau" },
  { id: "bar" as const, position: [3.2, 1.8, -3.2] as [number, number, number], label: "The Founders Bar" },
  { id: "library" as const, position: [0, 2.6, -4.4] as [number, number, number], label: "The Grand Library Wall" },
];

function SceneReady() {
  const { setRoomReady, setLoading, setLoadProgress } = useHavenStore();

  useEffect(() => {
    setLoadProgress(100);
    const t = setTimeout(() => {
      setLoading(false);
      setRoomReady(true);
    }, 600);
    return () => clearTimeout(t);
  }, [setLoading, setLoadProgress, setRoomReady]);

  return null;
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.8, 6);
    camera.lookAt(0, 1.5, 0);
  }, [camera]);
  return null;
}

interface RoomSceneProps {
  onHotspotSelect: (id: string) => void;
}

export function RoomScene({ onHotspotSelect }: RoomSceneProps) {
  const { selectedHotspot, setSelectedHotspot } = useHavenStore();

  const handleSelect = (id: typeof selectedHotspot) => {
    setSelectedHotspot(id);
    if (id) onHotspotSelect(id);
  };

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: 5 /* ACESFilmicToneMapping */, toneMappingExposure: 0.75 }}
      style={{ background: "#0d0b09" }}
    >
      <CameraSetup />

      <Suspense fallback={null}>
        <SceneReady />

        <fog attach="fog" args={["#0d0b09", 8, 18]} />
        <Environment preset="night" environmentIntensity={0.08} />

        <RoomLighting />
        <RoomGeometry />

        {HOTSPOTS.map((h) => (
          <Hotspot
            key={h.id}
            id={h.id}
            position={h.position}
            label={h.label}
            onSelect={handleSelect}
            isSelected={selectedHotspot === h.id}
          />
        ))}
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.6}
        dampingFactor={0.04}
        enableDamping
        target={[0, 1.5, 0]}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
