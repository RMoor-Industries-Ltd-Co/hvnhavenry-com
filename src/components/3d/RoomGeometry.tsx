"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const M = {
  floor: new THREE.MeshStandardMaterial({ color: "#1a1a1c", roughness: 0.2, metalness: 0.08 }),
  wall: new THREE.MeshStandardMaterial({ color: "#2a2a2e", roughness: 0.88 }),
  ceiling: new THREE.MeshStandardMaterial({ color: "#1e1e22", roughness: 0.95 }),
  charcoal: new THREE.MeshStandardMaterial({ color: "#252528", roughness: 0.85 }),
  darkStone: new THREE.MeshStandardMaterial({ color: "#1c1c1f", roughness: 0.35, metalness: 0.05 }),
  brass: new THREE.MeshStandardMaterial({ color: "#b8922a", roughness: 0.28, metalness: 0.9 }),
  marble: new THREE.MeshStandardMaterial({ color: "#d8d4cc", roughness: 0.12, metalness: 0.08 }),
  darkMarble: new THREE.MeshStandardMaterial({ color: "#2a2828", roughness: 0.18, metalness: 0.1 }),
  velvet: new THREE.MeshStandardMaterial({ color: "#3a3a3e", roughness: 0.97 }),
  velvetDark: new THREE.MeshStandardMaterial({ color: "#252528", roughness: 0.97 }),
  leather: new THREE.MeshStandardMaterial({ color: "#1a1a1c", roughness: 0.72 }),
  glass: new THREE.MeshStandardMaterial({ color: "#202830", roughness: 0.03, metalness: 0.15, transparent: true, opacity: 0.35 }),
  molding: new THREE.MeshStandardMaterial({ color: "#303035", roughness: 0.55 }),
  shelfDark: new THREE.MeshStandardMaterial({ color: "#1e1e22", roughness: 0.45, metalness: 0.05 }),
  canvasWhite: new THREE.MeshStandardMaterial({ color: "#d0ccc4", roughness: 0.9 }),
  lampShade: new THREE.MeshStandardMaterial({ color: "#c8a060", roughness: 0.5, transparent: true, opacity: 0.85, side: THREE.BackSide }),
  rugGray: new THREE.MeshStandardMaterial({ color: "#2e2e32", roughness: 0.98 }),
};

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <primitive object={M.floor} />
    </mesh>
  );
}

function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
      <planeGeometry args={[14, 14]} />
      <primitive object={M.ceiling} />
    </mesh>
  );
}

function Walls() {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2.25, -5.5]} receiveShadow>
        <boxGeometry args={[14, 4.5, 0.12]} />
        <primitive object={M.wall} />
      </mesh>
      {/* Right wall */}
      <mesh position={[6, 2.25, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 4.5, 0.12]} />
        <primitive object={M.wall} />
      </mesh>
      {/* Crown molding */}
      {[
        { p: [0, 4.38, -5.5] as [number,number,number], r: [0,0,0] as [number,number,number], w: 14 },
        { p: [6, 4.38, 0] as [number,number,number], r: [0,Math.PI/2,0] as [number,number,number], w: 14 },
        { p: [-6, 4.38, 0] as [number,number,number], r: [0,Math.PI/2,0] as [number,number,number], w: 14 },
      ].map((m, i) => (
        <mesh key={i} position={m.p} rotation={m.r}>
          <boxGeometry args={[m.w, 0.1, 0.15]} />
          <primitive object={M.molding} />
        </mesh>
      ))}
    </>
  );
}

function CityWindows() {
  // Left wall floor-to-ceiling windows
  return (
    <group position={[-5.9, 0, 0]}>
      {/* Concrete window surround frame */}
      <mesh position={[0, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[14, 4.5, 0.15]} />
        <primitive object={M.charcoal} />
      </mesh>

      {/* Window panes — 3 panels */}
      {[-3.5, 0, 3.5].map((z, i) => (
        <group key={i} position={[0.08, 0, z]}>
          {/* Frame */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[4.2, 4.3, 0.05]} />
            <primitive object={M.charcoal} />
          </mesh>
          {/* Glass */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[3.8, 4.1]} />
            <primitive object={M.glass} />
          </mesh>
          {/* Thin mullions */}
          <mesh position={[0.06, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[3.8, 0.04, 0.04]} />
            <primitive object={M.brass} />
          </mesh>
        </group>
      ))}

      {/* City skyline glow plane behind glass */}
      <mesh position={[-0.3, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 4.5]} />
        <meshStandardMaterial
          color="#0a0f1a"
          emissive="#1a2540"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* City light dots — building windows simulation */}
      {Array.from({ length: 120 }, (_, i) => {
        const z = (Math.random() - 0.5) * 13;
        const y = Math.random() * 3.0 + 0.1;
        const brightness = 0.4 + Math.random() * 0.6;
        const color = Math.random() > 0.5 ? "#ffd080" : "#a0c0ff";
        return (
          <mesh key={i} position={[-0.25, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.04 + Math.random() * 0.06, 0.03 + Math.random() * 0.04]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={brightness} />
          </mesh>
        );
      })}

      {/* Horizon glow — sunset/dusk */}
      <mesh position={[-0.2, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 1.2]} />
        <meshStandardMaterial
          color="#1a0a05"
          emissive="#6b2510"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function AbstractArt() {
  // Large abstract canvas above sofa on back wall
  return (
    <group position={[0, 2.8, -5.38]}>
      {/* Canvas */}
      <mesh>
        <boxGeometry args={[3.2, 2.0, 0.04]} />
        <primitive object={M.canvasWhite} />
      </mesh>
      {/* Abstract dark shape — center block */}
      <mesh position={[0.1, -0.2, 0.025]}>
        <boxGeometry args={[1.4, 1.2, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Abstract stroke — horizontal */}
      <mesh position={[-0.4, 0.5, 0.025]}>
        <boxGeometry args={[2.2, 0.08, 0.01]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
      </mesh>
      {/* Spotlight glow on canvas */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[3.2, 2.0]} />
        <meshStandardMaterial
          color="#fff8f0"
          emissive="#fff8f0"
          emissiveIntensity={0.06}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Thin brass frame */}
      {[
        { p: [0, 1.02, 0] as [number,number,number], s: [3.28, 0.04, 0.05] },
        { p: [0, -1.02, 0] as [number,number,number], s: [3.28, 0.04, 0.05] },
        { p: [1.62, 0, 0] as [number,number,number], s: [0.04, 2.08, 0.05] },
        { p: [-1.62, 0, 0] as [number,number,number], s: [0.04, 2.08, 0.05] },
      ].map((f, i) => (
        <mesh key={i} position={f.p}>
          <boxGeometry args={f.s as [number,number,number]} />
          <primitive object={M.brass} />
        </mesh>
      ))}
    </group>
  );
}

function Sofa() {
  return (
    <group position={[0, 0, 1.2]}>
      {/* Base / seat platform */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[3.4, 0.42, 1.05]} />
        <primitive object={M.velvet} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.72, 0.44]} castShadow>
        <boxGeometry args={[3.4, 0.65, 0.16]} />
        <primitive object={M.velvet} />
      </mesh>
      {/* Seat cushions */}
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 0.52, -0.04]} castShadow>
          <boxGeometry args={[1.5, 0.18, 0.95]} />
          <primitive object={M.velvetDark} />
        </mesh>
      ))}
      {/* Back cushions */}
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0.34]} castShadow>
          <boxGeometry args={[1.4, 0.55, 0.12]} />
          <primitive object={M.velvetDark} />
        </mesh>
      ))}
      {/* Throw pillow */}
      <mesh position={[-1.1, 0.68, 0.1]} rotation={[0, 0.3, 0.1]} castShadow>
        <boxGeometry args={[0.45, 0.42, 0.1]} />
        <primitive object={M.velvet} />
      </mesh>
      {/* Arm rests */}
      {[-1.75, 1.75].map((x, i) => (
        <mesh key={i} position={[x, 0.52, 0.0]} castShadow>
          <boxGeometry args={[0.1, 0.56, 1.05]} />
          <primitive object={M.velvet} />
        </mesh>
      ))}
      {/* Brass legs */}
      {[[-1.55, -0.44], [1.55, -0.44], [-1.55, 0.44], [1.55, 0.44]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.14, 8]} />
          <primitive object={M.brass} />
        </mesh>
      ))}
      {/* Side tables */}
      {[-2.05, 2.05].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.58, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.03, 16]} />
            <primitive object={M.darkMarble} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.6, 8]} />
            <primitive object={M.brass} />
          </mesh>
          {/* Small candle on side table */}
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
            <meshStandardMaterial color="#f0ece4" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.67, 0]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshStandardMaterial color="#ffcc44" emissive="#ffaa00" emissiveIntensity={3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CoffeeTable() {
  return (
    <group position={[0, 0, -0.5]}>
      {/* Dark marble top */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[1.8, 0.06, 1.0]} />
        <primitive object={M.darkMarble} />
      </mesh>
      {/* Lower shelf */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[1.6, 0.04, 0.85]} />
        <primitive object={M.darkStone} />
      </mesh>
      {/* Legs */}
      {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} castShadow>
          <boxGeometry args={[0.04, 0.36, 0.04]} />
          <primitive object={M.brass} />
        </mesh>
      ))}
      {/* Candles */}
      {[[-0.15, 0], [0.12, 0.12], [0.0, -0.1]].map(([cx, cz], i) => (
        <group key={i} position={[cx, 0.39, cz]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045 - i * 0.008, 0.045 - i * 0.008, 0.09 + i * 0.04, 10]} />
            <meshStandardMaterial color="#f0ece4" roughness={0.85} />
          </mesh>
          {/* Flame */}
          <mesh position={[0, 0.07 + i * 0.02, 0]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshStandardMaterial color="#ffcc44" emissive="#ffaa00" emissiveIntensity={4} />
          </mesh>
        </group>
      ))}
      {/* Coffee table book */}
      <mesh position={[0.5, 0.395, 0.1]} castShadow>
        <boxGeometry args={[0.32, 0.035, 0.26]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
      </mesh>
      {/* Small bowl */}
      <mesh position={[-0.45, 0.39, -0.15]} castShadow>
        <cylinderGeometry args={[0.1, 0.07, 0.05, 12, 1, true]} />
        <primitive object={M.darkMarble} />
      </mesh>
    </group>
  );
}

function FloorLamps() {
  return (
    <>
      {[-2.2, 2.2].map((x, i) => (
        <group key={i} position={[x, 0, 0.8]}>
          {/* Base */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
            <primitive object={M.darkMarble} />
          </mesh>
          {/* Pole */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 1.5, 8]} />
            <primitive object={M.brass} />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 1.65, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.22, 0.35, 14, 1, true]} />
            <primitive object={M.lampShade} />
          </mesh>
          {/* Shade inner glow */}
          <mesh position={[0, 1.52, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 10]} />
            <meshStandardMaterial color="#ffcc80" emissive="#ffaa40" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function ShelvingWall() {
  const decorColors = ["#8a6a3a", "#3a4a6a", "#6a3a3a", "#2a4a3a", "#5a4a2a"];
  const items = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      x: (Math.random() - 0.5) * 5.0,
      y: 0.5 + Math.floor(i / 7) * 0.72,
      w: 0.06 + Math.random() * 0.1,
      color: decorColors[Math.floor(Math.random() * decorColors.length)],
    }));
  }, []);

  return (
    <group position={[5.88, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Back panel */}
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[14, 4.5, 0.1]} />
        <primitive object={M.shelfDark} />
      </mesh>
      {/* Shelf boards */}
      {[0.45, 1.17, 1.89, 2.61, 3.33].map((y, i) => (
        <mesh key={i} position={[0, y, 0.22]} castShadow>
          <boxGeometry args={[5.6, 0.04, 0.32]} />
          <primitive object={M.shelfDark} />
        </mesh>
      ))}
      {/* Vertical dividers */}
      {[-2.8, -0.93, 0.93, 2.8].map((x, i) => (
        <mesh key={i} position={[x, 2.0, 0.22]} castShadow>
          <boxGeometry args={[0.03, 4.0, 0.34]} />
          <primitive object={M.shelfDark} />
        </mesh>
      ))}
      {/* Books + decor */}
      {items.map((item, i) => (
        <mesh key={i} position={[item.x, item.y + 0.28, 0.24]} castShadow>
          <boxGeometry args={[item.w, 0.46, 0.26]} />
          <meshStandardMaterial color={item.color} roughness={0.82} />
        </mesh>
      ))}
      {/* Integrated LED strip */}
      {[0.45, 1.17, 1.89, 2.61].map((y, i) => (
        <mesh key={i} position={[0, y + 0.06, 0.24]}>
          <planeGeometry args={[5.4, 0.03]} />
          <meshStandardMaterial color="#ffd080" emissive="#ffd080" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

function AreaRug() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.4]}>
      <planeGeometry args={[5.5, 4.5]} />
      <primitive object={M.rugGray} />
    </mesh>
  );
}

// ── HVN Products ──────────────────────────────────────────────────────────────

function CombRailDiffuser() {
  // Dark glass vessel + brass comb rail on the coffee table
  return (
    <group position={[0, 0.395, -0.5]}>
      {/* Glass vessel */}
      <mesh castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.18, 16]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.05} metalness={0.2} transparent opacity={0.88} />
      </mesh>
      {/* Brass rail base */}
      <mesh position={[0, 0.105, 0]} castShadow>
        <boxGeometry args={[0.16, 0.022, 0.032]} />
        <primitive object={M.brass} />
      </mesh>
      {/* Blade reeds (5) */}
      {[-0.056, -0.028, 0, 0.028, 0.056].map((x, i) => (
        <mesh key={i} position={[x, 0.26, 0]} castShadow>
          <boxGeometry args={[0.009, 0.28, 0.003]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function FlaskSprayer() {
  // Vintage oval flask on the right side table — Obsidian finish
  return (
    <group position={[2.05, 0.62, 1.2]} rotation={[0, 0.4, 0]}>
      {/* Oval flask body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.11, 16]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.55} metalness={0.4} />
      </mesh>
      {/* Flatten to oval using scale on parent handled by shape — neck */}
      <mesh position={[0, 0.085, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.028, 0.06, 10]} />
        <meshStandardMaterial color="#2a2820" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Spray nozzle cap */}
      <mesh position={[0, 0.125, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.025, 10]} />
        <primitive object={M.brass} />
      </mesh>
      {/* Chain link suggestion */}
      <mesh position={[0.04, 0.06, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <torusGeometry args={[0.012, 0.003, 6, 12]} />
        <primitive object={M.brass} />
      </mesh>
      {/* HVN engraving plane (dark) */}
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[0.06, 0.04]} />
        <meshStandardMaterial color="#c9a96e" emissive="#c9a96e" emissiveIntensity={0.15} roughness={0.8} />
      </mesh>
    </group>
  );
}

function ReposeBolster() {
  // Cylindrical bolster cushion on sofa armrest
  return (
    <group position={[1.1, 0.65, 0.9]} rotation={[0, 0, Math.PI / 2]}>
      {/* Bolster body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.38, 16]} />
        <meshStandardMaterial color="#202022" roughness={0.96} />
      </mesh>
      {/* End caps */}
      {[-0.19, 0.19].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.008, 16]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.9} />
        </mesh>
      ))}
      {/* Brass HVN plate on end */}
      <mesh position={[0, 0.196, 0]}>
        <boxGeometry args={[0.04, 0.002, 0.025]} />
        <primitive object={M.brass} />
      </mesh>
    </group>
  );
}

function EmberLineIncense() {
  const smokeRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (smokeRef.current) {
      smokeRef.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      smokeRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      (smokeRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.06 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }
  });

  return (
    <group position={[3.5, 1.2, -4.0]}>
      {/* HVN box */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.04, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
      {/* Box lid slightly open */}
      <mesh position={[0.06, 0.025, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.1, 0.006, 0.1]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      {/* Incense sticks in holder */}
      <mesh position={[0, 0.035, 0.02]} castShadow>
        <boxGeometry args={[0.05, 0.01, 0.01]} />
        <primitive object={M.brass} />
      </mesh>
      {[0, 0.008, -0.008].map((z, i) => (
        <mesh key={i} position={[0.01 - i * 0.01, 0.2, 0.02 + z]} rotation={[0.05, 0, 0]} castShadow>
          <cylinderGeometry args={[0.002, 0.002, 0.32, 6]} />
          <meshStandardMaterial color="#2a1a08" roughness={0.85} />
        </mesh>
      ))}
      {/* Ember tip glow */}
      <mesh position={[0, 0.36, 0.02]}>
        <sphereGeometry args={[0.005, 6, 6]} />
        <meshStandardMaterial color="#ff6020" emissive="#ff4010" emissiveIntensity={3} />
      </mesh>
      {/* Rising smoke wisp */}
      <mesh ref={smokeRef} position={[0, 0.45, 0.02]}>
        <planeGeometry args={[0.04, 0.12]} />
        <meshStandardMaterial
          color="#c0c0c8"
          transparent
          opacity={0.07}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Incense light */}
      <pointLight position={[0, 0.4, 0.02]} intensity={0.3} color="#ff6020" distance={1.2} decay={2} />
    </group>
  );
}

function ShadowChamberCandle() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime;
      lightRef.current.intensity = 0.7 + Math.sin(t * 6.8) * 0.15 + Math.sin(t * 12.3) * 0.05;
    }
  });

  return (
    <group position={[0.55, 0.395, -0.5]}>
      {/* Outer body — dark volcanic composite */}
      <mesh castShadow>
        <cylinderGeometry args={[0.058, 0.058, 0.13, 16]} />
        <meshStandardMaterial color="#18140f" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* Inner glow core — seen through channel cuts */}
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.11, 10]} />
        <meshStandardMaterial color="#ff8820" emissive="#ff6600" emissiveIntensity={1.2} roughness={0.9} transparent opacity={0.75} />
      </mesh>
      {/* Cut channel markers — 4 vertical dark planes suggesting deep cuts */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <group key={i} rotation={[0, rot, 0]}>
          <mesh position={[0.058, 0, 0]}>
            <boxGeometry args={[0.004, 0.14, 0.014]} />
            <meshStandardMaterial color="#080604" roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Flame */}
      <mesh position={[0, 0.078, 0]}>
        <sphereGeometry args={[0.007, 6, 6]} />
        <meshStandardMaterial color="#ffdd44" emissive="#ff9900" emissiveIntensity={6} />
      </mesh>
      {/* Brass base ring */}
      <mesh position={[0, -0.068, 0]} castShadow>
        <cylinderGeometry args={[0.066, 0.066, 0.007, 16]} />
        <primitive object={M.brass} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.05, 0]} intensity={0.7} color="#ff8020" distance={2.8} decay={2} castShadow />
    </group>
  );
}

function ColumnChamberCandle() {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 9.1) * 0.1;
      flameRef.current.position.x = Math.sin(t * 5.7) * 0.002;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.55 + Math.sin(t * 7.4) * 0.12;
    }
  });

  return (
    <group position={[5.0, 1.65, -2.5]}>
      {/* Tall column body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.038, 0.038, 0.28, 14]} />
        <meshStandardMaterial color="#1c1814" roughness={0.88} />
      </mesh>
      {/* Slight taper at crown */}
      <mesh position={[0, 0.155, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.038, 0.03, 14]} />
        <meshStandardMaterial color="#1c1814" roughness={0.88} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.178, 0]}>
        <coneGeometry args={[0.007, 0.018, 8]} />
        <meshStandardMaterial color="#ffdd55" emissive="#ff9900" emissiveIntensity={5} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.172, 0]}>
        <sphereGeometry args={[0.005, 6, 6]} />
        <meshStandardMaterial color="#ffee66" emissive="#ffcc00" emissiveIntensity={7} />
      </mesh>
      {/* Brass base */}
      <mesh position={[0, -0.143, 0]} castShadow>
        <cylinderGeometry args={[0.046, 0.046, 0.006, 14]} />
        <primitive object={M.brass} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.2, 0]} intensity={0.55} color="#ff9040" distance={2} decay={2} />
    </group>
  );
}

function AtmosphereMist() {
  return (
    <group position={[-2.05, 0.63, 1.05]} rotation={[0, 0.8, 0]}>
      {/* Vessel body — matte black glass */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.042, 0.175, 14]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.08} metalness={0.25} />
      </mesh>
      {/* Shoulder taper */}
      <mesh position={[0, 0.098, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.04, 0.025, 14]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.08} metalness={0.25} />
      </mesh>
      {/* Brass pump collar */}
      <mesh position={[0, 0.114, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.014, 12]} />
        <primitive object={M.brass} />
      </mesh>
      {/* Pump stem */}
      <mesh position={[0, 0.138, 0]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.036, 8]} />
        <primitive object={M.brass} />
      </mesh>
      {/* Spray head */}
      <mesh position={[0, 0.158, 0]} castShadow>
        <boxGeometry args={[0.034, 0.018, 0.022]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* HVN label */}
      <mesh position={[0, -0.01, 0.043]}>
        <planeGeometry args={[0.055, 0.08]} />
        <meshStandardMaterial color="#c9a96e" emissive="#c9a96e" emissiveIntensity={0.12} roughness={0.85} />
      </mesh>
    </group>
  );
}

function CandleFlicker() {
  const refs = useRef<THREE.PointLight[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((light, i) => {
      if (light) {
        light.intensity = 0.6 + Math.sin(t * 7.1 + i * 2.3) * 0.18 + Math.sin(t * 13.7 + i) * 0.08;
      }
    });
  });
  return (
    <>
      {/* Candles on coffee table */}
      {[[-0.15, -0.5], [0.12, -0.38], [0.0, -0.6]].map(([x, z], i) => (
        <pointLight
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          position={[x, 0.55, z]}
          intensity={0.7}
          color="#ff9040"
          distance={2.5}
          decay={2}
        />
      ))}
      {/* Side table candles */}
      <pointLight position={[-2.05, 0.75, 1.2]} intensity={0.5} color="#ff9040" distance={2} decay={2} />
      <pointLight position={[2.05, 0.75, 1.2]} intensity={0.5} color="#ff9040" distance={2} decay={2} />
    </>
  );
}

export function RoomGeometry() {
  return (
    <group>
      <Floor />
      <Ceiling />
      <Walls />
      <CityWindows />
      <AbstractArt />
      <Sofa />
      <CoffeeTable />
      <FloorLamps />
      <ShelvingWall />
      <AreaRug />
      <CandleFlicker />
      {/* HVN Products */}
      <CombRailDiffuser />
      <FlaskSprayer />
      <ReposeBolster />
      <EmberLineIncense />
      <ShadowChamberCandle />
      <ColumnChamberCandle />
      <AtmosphereMist />
    </group>
  );
}
