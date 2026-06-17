"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Reusable material configs
const MATERIALS = {
  floor: new THREE.MeshStandardMaterial({
    color: "#1a0e06",
    roughness: 0.25,
    metalness: 0.05,
  }),
  wall: new THREE.MeshStandardMaterial({
    color: "#2c2318",
    roughness: 0.85,
    metalness: 0.0,
  }),
  ceiling: new THREE.MeshStandardMaterial({
    color: "#1e1a14",
    roughness: 0.9,
    metalness: 0.0,
  }),
  mahogany: new THREE.MeshStandardMaterial({
    color: "#2a1208",
    roughness: 0.4,
    metalness: 0.05,
  }),
  marble: new THREE.MeshStandardMaterial({
    color: "#f0ece4",
    roughness: 0.15,
    metalness: 0.1,
  }),
  brass: new THREE.MeshStandardMaterial({
    color: "#c9a030",
    roughness: 0.3,
    metalness: 0.85,
  }),
  velvet: new THREE.MeshStandardMaterial({
    color: "#1e1040",
    roughness: 0.95,
    metalness: 0.0,
  }),
  leather: new THREE.MeshStandardMaterial({
    color: "#1a0e08",
    roughness: 0.7,
    metalness: 0.05,
  }),
  glass: new THREE.MeshStandardMaterial({
    color: "#203040",
    roughness: 0.05,
    metalness: 0.2,
    transparent: true,
    opacity: 0.45,
  }),
  molding: new THREE.MeshStandardMaterial({
    color: "#3a2e20",
    roughness: 0.5,
    metalness: 0.05,
  }),
};

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <primitive object={MATERIALS.floor} />
    </mesh>
  );
}

function Ceiling() {
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <primitive object={MATERIALS.ceiling} />
      </mesh>
      {/* Crown molding ring */}
      {[
        { pos: [0, 3.9, -5] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: 10 },
        { pos: [0, 3.9, 5] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], w: 10 },
        { pos: [-5, 3.9, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: 10 },
        { pos: [5, 3.9, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], w: 10 },
      ].map((m, i) => (
        <mesh key={i} position={m.pos} rotation={m.rot} castShadow>
          <boxGeometry args={[m.w, 0.12, 0.18]} />
          <primitive object={MATERIALS.molding} />
        </mesh>
      ))}
    </>
  );
}

function BackWall() {
  return (
    <>
      <mesh position={[0, 2.1, -5]} receiveShadow>
        <boxGeometry args={[10, 4.2, 0.15]} />
        <primitive object={MATERIALS.wall} />
      </mesh>
      {/* Chair rail */}
      <mesh position={[0, 0.9, -4.93]} castShadow>
        <boxGeometry args={[10, 0.06, 0.08]} />
        <primitive object={MATERIALS.molding} />
      </mesh>
      {/* Wainscoting panels */}
      {[-3.5, -1.2, 1.2, 3.5].map((x, i) => (
        <mesh key={i} position={[x, 0.45, -4.92]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.04]} />
          <primitive object={MATERIALS.molding} />
        </mesh>
      ))}
    </>
  );
}

function SideWalls() {
  return (
    <>
      {/* Left wall */}
      <mesh position={[-5, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4.2, 0.15]} />
        <primitive object={MATERIALS.wall} />
      </mesh>
      {/* Right wall */}
      <mesh position={[5, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4.2, 0.15]} />
        <primitive object={MATERIALS.wall} />
      </mesh>
    </>
  );
}

function LibraryWall() {
  const bookColors = [
    "#8b1a1a", "#1a3a8b", "#1a6b1a", "#8b6b1a",
    "#6b1a8b", "#2a6b6b", "#8b4a1a", "#3a3a8b",
  ];

  const books = useMemo(() => {
    const items: { x: number; y: number; w: number; color: string }[] = [];
    for (let row = 0; row < 6; row++) {
      let x = -3.8;
      while (x < 3.8) {
        const w = 0.08 + Math.random() * 0.12;
        items.push({ x, y: 0.6 + row * 0.52, w, color: bookColors[Math.floor(Math.random() * bookColors.length)] });
        x += w + 0.01;
      }
    }
    return items;
  }, []);

  return (
    <group position={[0, 0, -4.8]}>
      {/* Main shelf frame */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[8, 4, 0.25]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>

      {/* Shelf boards */}
      {[0.55, 1.07, 1.59, 2.11, 2.63, 3.15, 3.67].map((y, i) => (
        <mesh key={i} position={[0, y, 0.12]} castShadow>
          <boxGeometry args={[7.8, 0.05, 0.28]} />
          <primitive object={MATERIALS.mahogany} />
        </mesh>
      ))}

      {/* Books */}
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, b.y + 0.22, 0.13]} castShadow>
          <boxGeometry args={[b.w, 0.42, 0.22]} />
          <meshStandardMaterial color={b.color} roughness={0.8} />
        </mesh>
      ))}

      {/* Vertical dividers */}
      {[-2.6, 0, 2.6].map((x, i) => (
        <mesh key={i} position={[x, 2, 0.12]} castShadow>
          <boxGeometry args={[0.04, 4, 0.3]} />
          <primitive object={MATERIALS.mahogany} />
        </mesh>
      ))}
    </group>
  );
}

function Fireplace() {
  return (
    <group position={[-4.8, 0, -1.5]}>
      {/* Fireplace surround */}
      <mesh position={[0.1, 1.2, 0.5]} castShadow>
        <boxGeometry args={[0.25, 2.4, 2.0]} />
        <primitive object={MATERIALS.marble} />
      </mesh>
      {/* Mantle top */}
      <mesh position={[0.2, 2.45, 0.5]} castShadow>
        <boxGeometry args={[0.4, 0.1, 2.4]} />
        <primitive object={MATERIALS.marble} />
      </mesh>
      {/* Firebox opening */}
      <mesh position={[0.15, 0.7, 0.5]} castShadow>
        <boxGeometry args={[0.3, 1.0, 1.4]} />
        <meshStandardMaterial color="#0a0605" roughness={1} />
      </mesh>
      {/* Grate */}
      <mesh position={[0.15, 0.2, 0.5]}>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <primitive object={MATERIALS.brass} />
      </mesh>
      {/* Ember glow plane */}
      <mesh position={[0.18, 0.15, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.0, 0.1]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Sofa() {
  return (
    <group position={[0, 0, 1.5]}>
      {/* Base */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[3.0, 0.44, 1.0]} />
        <primitive object={MATERIALS.velvet} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.72, 0.42]} castShadow>
        <boxGeometry args={[3.0, 0.6, 0.18]} />
        <primitive object={MATERIALS.velvet} />
      </mesh>
      {/* Seat cushions */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, -0.05]} castShadow>
          <boxGeometry args={[1.25, 0.16, 0.9]} />
          <primitive object={MATERIALS.velvet} />
        </mesh>
      ))}
      {/* Arm rests */}
      {[-1.55, 1.55].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.66, 1.0]} />
          <primitive object={MATERIALS.velvet} />
        </mesh>
      ))}
      {/* Brass legs */}
      {[
        [-1.3, -0.4], [1.3, -0.4],
        [-1.3, 0.4], [1.3, 0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
          <primitive object={MATERIALS.brass} />
        </mesh>
      ))}
      {/* Coffee table */}
      <mesh position={[0, 0.26, -0.95]} castShadow>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <primitive object={MATERIALS.marble} />
      </mesh>
      <mesh position={[0, 0.12, -0.95]} castShadow>
        <boxGeometry args={[1.3, 0.22, 0.6]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group position={[3.0, 0, 0.5]}>
      {/* Desk top */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <primitive object={MATERIALS.leather} />
      </mesh>
      {/* Leather inlay */}
      <mesh position={[0, 0.815, 0]}>
        <boxGeometry args={[1.3, 0.01, 0.65]} />
        <meshStandardMaterial color="#1a3010" roughness={0.7} />
      </mesh>
      {/* Drawer pedestal left */}
      <mesh position={[-0.72, 0.38, 0.05]} castShadow>
        <boxGeometry args={[0.38, 0.76, 0.82]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>
      {/* Drawer pedestal right */}
      <mesh position={[0.72, 0.38, 0.05]} castShadow>
        <boxGeometry args={[0.38, 0.76, 0.82]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>
      {/* Drawer pulls (brass) */}
      {[-0.72, 0.72].flatMap((x) =>
        [0.55, 0.33, 0.11].map((y, i) => (
          <mesh key={`${x}-${i}`} position={[x, y, -0.36]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.06, 8]} />
            <primitive object={MATERIALS.brass} />
          </mesh>
        ))
      )}
      {/* Desk lamp */}
      <mesh position={[-0.6, 0.82, -0.25]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.55, 8]} />
        <primitive object={MATERIALS.brass} />
      </mesh>
      <mesh position={[-0.6, 1.1, -0.25]} rotation={[0.4, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.2, 12, 1, true]} />
        <meshStandardMaterial color="#e8d090" roughness={0.5} side={THREE.BackSide} />
      </mesh>
      {/* Chair */}
      <mesh position={[0, 0.46, 0.75]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.65]} />
        <primitive object={MATERIALS.leather} />
      </mesh>
      <mesh position={[0, 0.82, 1.08]} castShadow>
        <boxGeometry args={[0.7, 0.55, 0.08]} />
        <primitive object={MATERIALS.leather} />
      </mesh>
      {[[-0.3, 0.62], [0.3, 0.62]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
          <primitive object={MATERIALS.brass} />
        </mesh>
      ))}
    </group>
  );
}

function CornerBar() {
  return (
    <group position={[3.8, 0, -3.2]} rotation={[0, -Math.PI / 4, 0]}>
      {/* Main counter */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[2.2, 0.08, 0.7]} />
        <primitive object={MATERIALS.marble} />
      </mesh>
      {/* Cabinet body */}
      <mesh position={[0, 0.5, 0.05]} castShadow>
        <boxGeometry args={[2.2, 1.0, 0.62]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>
      {/* Back bar shelf */}
      <mesh position={[0, 1.5, 0.32]} castShadow>
        <boxGeometry args={[2.0, 0.06, 0.35]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>
      <mesh position={[0, 1.9, 0.32]} castShadow>
        <boxGeometry args={[2.0, 0.06, 0.35]} />
        <primitive object={MATERIALS.mahogany} />
      </mesh>
      {/* Back mirror panel */}
      <mesh position={[0, 1.7, 0.5]}>
        <boxGeometry args={[1.9, 0.8, 0.02]} />
        <meshStandardMaterial color="#a0c0c0" roughness={0.02} metalness={0.9} />
      </mesh>
      {/* Bottles (simplified cylinders) */}
      {[-0.7, -0.35, 0, 0.35, 0.7].flatMap((x, i) =>
        [1.56, 1.96].map((y, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, 0.33]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.32, 8]} />
            <meshStandardMaterial
              color={["#4a8a3a", "#8a1a1a", "#1a3a8a", "#8a6a1a", "#3a1a6a"][i]}
              roughness={0.15}
              metalness={0.05}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))
      )}
      {/* Bar stools */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={i} position={[x, 0, -0.65]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 12]} />
            <primitive object={MATERIALS.leather} />
          </mesh>
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
            <primitive object={MATERIALS.brass} />
          </mesh>
          {/* Foot ring */}
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.15, 0.012, 8, 24]} />
            <primitive object={MATERIALS.brass} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AreaRug() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.0]}>
      <planeGeometry args={[4.5, 3.0]} />
      <meshStandardMaterial color="#1a1230" roughness={0.95} />
    </mesh>
  );
}

export function RoomGeometry() {
  return (
    <group>
      <Floor />
      <Ceiling />
      <BackWall />
      <SideWalls />
      <LibraryWall />
      <Fireplace />
      <Sofa />
      <Desk />
      <CornerBar />
      <AreaRug />
    </group>
  );
}
