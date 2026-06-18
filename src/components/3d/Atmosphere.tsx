"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MOTE_COUNT = 140;
const _motePositions = new Float32Array(MOTE_COUNT * 3);
const _moteSpeeds = new Float32Array(MOTE_COUNT);
for (let i = 0; i < MOTE_COUNT; i++) {
  _motePositions[i * 3 + 0] = (Math.random() - 0.5) * 9;
  _motePositions[i * 3 + 1] = Math.random() * 3.4 + 0.3;
  _motePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  _moteSpeeds[i] = 0.02 + Math.random() * 0.05;
}

function DustMotes({ count = MOTE_COUNT }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = _motePositions;
  const speeds = _moteSpeeds;

  useFrame((state) => {
    const pts = points.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1;
      arr[iy] += speeds[i] * 0.004;
      if (arr[iy] > 3.8) arr[iy] = 0.3;
      arr[i * 3] += Math.sin(t * 0.3 + i) * 0.0006;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        color="#ffe6c0"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Subtle cinematic "breathing" layered on top of OrbitControls' auto-rotate.
 * We modulate the camera's FOV rather than its position — OrbitControls owns
 * position/orientation every frame, but never touches FOV, so a slow ±0.6°
 * sway gives a gentle dolly-breath with zero fight against the controls.
 */
function CameraBreath() {
  const { camera } = useThree();
  const baseFov = useRef<number | null>(null);

  // eslint-disable-next-line react-hooks/immutability
  useFrame((state) => {
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera !== true) return;
    if (baseFov.current === null) baseFov.current = cam.fov;
    const next = baseFov.current + Math.sin(state.clock.elapsedTime * 0.28) * 0.6;
    if (Math.abs(cam.fov - next) > 0.001) {
      // eslint-disable-next-line react-hooks/immutability
      cam.fov = next;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

export function Atmosphere() {
  return (
    <>
      <DustMotes />
      <CameraBreath />
    </>
  );
}
