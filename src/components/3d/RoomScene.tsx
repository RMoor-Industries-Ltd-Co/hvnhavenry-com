"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useHavenStore } from "@/lib/store";
import { RoomGeometry } from "./RoomGeometry";
import { RoomLighting } from "./RoomLighting";
import { Hotspot } from "./Hotspot";
import { PostFX } from "./PostFX";
import { Atmosphere } from "./Atmosphere";

const HOTSPOTS = [
  { id: "combRail" as const,      position: [-0.15, 0.95, -0.5]  as [number, number, number], label: "Comb Rail Diffuser" },
  { id: "shadowChamber" as const, position: [0.55,  0.95, -0.5]  as [number, number, number], label: "Shadow Chamber" },
  { id: "flask" as const,         position: [2.05,  1.15,  1.2]  as [number, number, number], label: "Framing Mist Flask" },
  { id: "atmosphereMist" as const,position: [-2.05, 1.15,  1.05] as [number, number, number], label: "Atmosphere Mist" },
  { id: "bolster" as const,       position: [1.1,   1.2,   0.9]  as [number, number, number], label: "Repose Bolster" },
  { id: "columnChamber" as const, position: [5.0,   2.1,  -2.5]  as [number, number, number], label: "Column Chamber" },
  { id: "emberLine" as const,     position: [3.5,   1.75, -4.0]  as [number, number, number], label: "Ember Line Incense" },
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
        <Atmosphere />

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

        <PostFX />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.6}
        dampingFactor={0.04}
        enableDamping
        target={[0, 1.5, 0]}
        autoRotate
        autoRotateSpeed={0.4}
        touches={{
          ONE: 2,   // ONE finger = ROTATE (THREE.TOUCH.ROTATE = 2)
          TWO: 1,   // TWO fingers = DOLLY/zoom (THREE.TOUCH.DOLLY_ROTATE = 1)
        }}
      />
    </Canvas>
  );
}
