import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const ACCENT = '#00FF41';
const ACCENT_DIM = '#00cc33';
const BODY = '#e8e8e8';
const BODY_DARK = '#d0d0d0';
const BODY_LIGHT = '#f5f5f5';

/* ═══════════════════════════════════════════ */
/* ─── LAYERED PLATFORM BASE ─── */
/* ═══════════════════════════════════════════ */
const Platform = () => {
  return (
    <group>
      {/* Outer Base - Rounded large slab */}
      <RoundedBox args={[9, 0.35, 6]} radius={0.15} position={[0, -0.35, 0]}>
        <meshStandardMaterial color={BODY_LIGHT} metalness={0.1} roughness={0.4} />
      </RoundedBox>

      {/* Inner Raised Platform */}
      <RoundedBox args={[7.5, 0.4, 4.8]} radius={0.1} position={[0, 0, 0]}>
        <meshStandardMaterial color={BODY} metalness={0.15} roughness={0.35} />
      </RoundedBox>

      {/* Accent trim ring around inner platform */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[7.7, 0.06, 5]} />
        <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Center Elevated Pad (where tower sits) */}
      <RoundedBox args={[2.8, 0.25, 2.8]} radius={0.08} position={[0, 0.32, -0.3]}>
        <meshStandardMaterial color={BODY_LIGHT} metalness={0.1} roughness={0.3} />
      </RoundedBox>

      {/* Blue/Green inset panel on center pad */}
      <mesh position={[0, 0.46, -0.3]}>
        <boxGeometry args={[2, 0.02, 2]} />
        <meshStandardMaterial color={ACCENT} metalness={0.4} roughness={0.2} />
      </mesh>

      {/* Small scattered button pads on surface */}
      {[
        [-2.5, 0.22, 1.5], [2.5, 0.22, 1.8], [-3, 0.22, -1], [3.2, 0.22, -0.5],
        [-1.5, 0.22, 2], [1.5, 0.22, -2], [0, 0.22, 2.2]
      ].map((pos, i) => (
        <RoundedBox key={i} args={[0.4, 0.1, 0.4]} radius={0.05} position={pos}>
          <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── CENTRAL PROCESSING TOWER ─── */
/* ═══════════════════════════════════════════ */
const CentralTower = () => {
  const ringRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    ringRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    glowRef.current.material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 1;
  });

  return (
    <group position={[0, 0.47, -0.3]}>
      {/* Bottom large cube (base) */}
      <RoundedBox args={[2, 0.8, 2]} radius={0.05} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={BODY_LIGHT} metalness={0.15} roughness={0.3} />
      </RoundedBox>

      {/* Middle cube (narrower) */}
      <RoundedBox args={[1.4, 1.2, 1.4]} radius={0.04} position={[0, 1.4, 0]}>
        <meshStandardMaterial color={BODY} metalness={0.1} roughness={0.3} />
      </RoundedBox>

      {/* Top cube (cap) */}
      <RoundedBox args={[1.6, 0.5, 1.6]} radius={0.04} position={[0, 2.3, 0]}>
        <meshStandardMaterial color={BODY_LIGHT} metalness={0.1} roughness={0.25} />
      </RoundedBox>

      {/* Blue front inset panel on middle cube */}
      <mesh position={[0, 1.4, 0.71]}>
        <boxGeometry args={[0.6, 0.5, 0.02]} />
        <meshStandardMaterial color={ACCENT} metalness={0.4} roughness={0.2} />
      </mesh>

      {/* Glowing Sphere on top */}
      <mesh ref={glowRef} position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive={ACCENT} emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 2.8, 0]} color={ACCENT} intensity={2} distance={5} />

      {/* Orbital Ring */}
      <mesh ref={ringRef} position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.025, 16, 100]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.8} transparent opacity={0.7} />
      </mesh>

      {/* BRACKET ARMS — L-shaped supports from tower sides */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <group key={i} rotation={[0, rot, 0]} position={[0, 1.0, 0]}>
          {/* Arm extending outward */}
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[1.2, 0.12, 0.12]} />
            <meshStandardMaterial color={BODY} metalness={0.2} roughness={0.3} />
          </mesh>
          {/* Arm elbow (bracket angle) */}
          <mesh position={[1.6, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.6, 0.1, 0.1]} />
            <meshStandardMaterial color={BODY} metalness={0.2} roughness={0.3} />
          </mesh>
          {/* Joint Sphere */}
          <mesh position={[1.0, 0.15, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={ACCENT} metalness={0.4} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── ROBOTIC ARM (cube head on post) ─── */
/* ═══════════════════════════════════════════ */
const RoboticArm = ({ position }) => {
  const armRef = useRef();
  useFrame((state) => {
    armRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
  });

  return (
    <group ref={armRef} position={position}>
      {/* Base block */}
      <RoundedBox args={[0.5, 0.3, 0.5]} radius={0.05} position={[0, 0.35, 0]}>
        <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
      </RoundedBox>

      {/* Vertical post */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 8]} />
        <meshStandardMaterial color={BODY} metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Joint sphere */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={BODY_DARK} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Horizontal arm */}
      <mesh position={[0.4, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
        <meshStandardMaterial color={BODY} metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Cube Head */}
      <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.04} position={[0.8, 1.35, 0]}>
        <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
      </RoundedBox>
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── BAR CHART (bars behind glass panel) ─── */
/* ═══════════════════════════════════════════ */
const BarChart = ({ position }) => {
  const barHeights = [0.5, 0.9, 0.35, 0.7, 0.55];
  return (
    <group position={position}>
      {/* Base shelf */}
      <RoundedBox args={[1.4, 0.12, 0.5]} radius={0.03} position={[0, 0.28, 0]}>
        <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
      </RoundedBox>

      {/* Glass back panel */}
      <mesh position={[0, 0.8, -0.15]}>
        <boxGeometry args={[1.2, 1.0, 0.03]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.9} 
          roughness={0.1} 
          metalness={0} 
          transparent 
          opacity={0.15} 
        />
      </mesh>

      {/* Bars */}
      {barHeights.map((h, i) => (
        <RoundedBox 
          key={i} 
          args={[0.14, h, 0.14]} 
          radius={0.02} 
          position={[(i - 2) * 0.22, 0.34 + h / 2, 0.05]}
        >
          <meshStandardMaterial 
            color={i % 2 === 0 ? ACCENT : BODY} 
            metalness={0.2} 
            roughness={0.3}
            emissive={i % 2 === 0 ? ACCENT : '#000000'}
            emissiveIntensity={i % 2 === 0 ? 0.3 : 0}
          />
        </RoundedBox>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── DNA DISPLAY STAND ─── */
/* ═══════════════════════════════════════════ */
const DNAStand = ({ position }) => {
  const helixRef = useRef();
  useFrame((state) => {
    helixRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <group position={position}>
      {/* Base platform */}
      <RoundedBox args={[1.2, 0.15, 1.2]} radius={0.05} position={[0, 0.28, 0]}>
        <meshStandardMaterial color={BODY_LIGHT} metalness={0.1} roughness={0.4} />
      </RoundedBox>
      {/* Accent rim */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.04, 1.3]} />
        <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Stand pillar (thin) */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.0, 8]} />
        <meshStandardMaterial color={BODY} metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Flat Display Panel on top */}
      <RoundedBox args={[1.0, 0.08, 1.0]} radius={0.04} position={[0, 1.4, 0]}>
        <meshStandardMaterial color={ACCENT} metalness={0.35} roughness={0.3} />
      </RoundedBox>

      {/* DNA Helix under the panel */}
      <group ref={helixRef} position={[0, 0.85, 0]}>
        {Array.from({ length: 16 }, (_, i) => {
          const t = i * 0.35;
          const y = (i - 8) * 0.06;
          return (
            <React.Fragment key={i}>
              <mesh position={[Math.cos(t) * 0.2, y, Math.sin(t) * 0.2]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.5} />
              </mesh>
              <mesh position={[Math.cos(t + Math.PI) * 0.2, y, Math.sin(t + Math.PI) * 0.2]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.5} />
              </mesh>
            </React.Fragment>
          );
        })}
      </group>
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── MOLECULE IN GLASS CONTAINER ─── */
/* ═══════════════════════════════════════════ */
const MoleculeDisplay = ({ position }) => {
  const molRef = useRef();
  useFrame((state) => {
    molRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    molRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  const atoms = [
    [0, 0, 0], [0.3, 0.25, 0], [-0.25, 0.2, 0.2],
    [0, -0.25, 0.25], [0.2, -0.15, -0.25], [-0.2, -0.1, -0.2]
  ];

  return (
    <group position={position}>
      {/* Base platform with accent trim */}
      <RoundedBox args={[1.5, 0.15, 1.5]} radius={0.06} position={[0, 0.28, 0]}>
        <meshStandardMaterial color={BODY_LIGHT} metalness={0.1} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.05, 1.6]} />
        <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Inner raised pad */}
      <RoundedBox args={[1.1, 0.1, 1.1]} radius={0.04} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={BODY} metalness={0.15} roughness={0.3} />
      </RoundedBox>

      {/* Glass Cube Container */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={0.92}
          roughness={0.05}
          metalness={0}
          thickness={0.3}
          transparent
          opacity={0.12}
        />
      </mesh>
      {/* Glass edges wireframe */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.02, 1.02, 1.02]} />
        <meshStandardMaterial color={ACCENT} wireframe transparent opacity={0.12} />
      </mesh>

      {/* Molecule inside */}
      <group ref={molRef} position={[0, 1.0, 0]}>
        {atoms.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2} />
          </mesh>
        ))}
        {/* Bonds from center atom to others */}
        {atoms.slice(1).map((pos, i) => {
          const center = atoms[0];
          const mid = [(center[0]+pos[0])/2, (center[1]+pos[1])/2, (center[2]+pos[2])/2];
          const len = Math.sqrt(pos.reduce((s, v, j) => s + (v-center[j])**2, 0));
          return (
            <mesh key={`b${i}`} position={mid}>
              <cylinderGeometry args={[0.02, 0.02, len, 6]} />
              <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1} transparent opacity={0.6} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── CURVED CONVEYOR PATHS ─── */
/* ═══════════════════════════════════════════ */
const ConveyorPaths = () => {
  const packetsRef = useRef([]);

  useFrame((state) => {
    packetsRef.current.forEach((p, i) => {
      if (!p) return;
      const t = ((state.clock.elapsedTime * 0.25 + i * 0.33) % 1);
      // S-curve across the platform
      p.position.x = THREE.MathUtils.lerp(-3.5, 3.5, t);
      p.position.z = Math.sin(t * Math.PI * 2) * 1.2;
      p.position.y = 0.3;
    });
  });

  // Create the curved channel shape using tube-like flat boxes
  const channelPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = THREE.MathUtils.lerp(-3.5, 3.5, t);
      const z = Math.sin(t * Math.PI * 2) * 1.2;
      pts.push([x, 0.22, z]);
    }
    return pts;
  }, []);

  return (
    <group>
      {/* Channel segments */}
      {channelPoints.slice(0, -1).map((p, i) => {
        const next = channelPoints[i + 1];
        const midX = (p[0] + next[0]) / 2;
        const midZ = (p[2] + next[2]) / 2;
        const dx = next[0] - p[0];
        const dz = next[2] - p[2];
        const angle = Math.atan2(dz, dx);
        const len = Math.sqrt(dx*dx + dz*dz);
        return (
          <mesh key={i} position={[midX, 0.22, midZ]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[len * 1.05, 0.03, 0.5]} />
            <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.3} transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* Small radial stripe pattern on conveyor (detail) */}
      {channelPoints.filter((_, i) => i % 3 === 0).map((p, i) => (
        <mesh key={`stripe-${i}`} position={[p[0], 0.24, p[2]]}>
          <boxGeometry args={[0.03, 0.01, 0.45]} />
          <meshStandardMaterial color={ACCENT_DIM} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Moving data capsules */}
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} ref={(el) => (packetsRef.current[i] = el)} args={[0.2, 0.12, 0.12]} radius={0.03}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.8} 
            roughness={0.1} 
            transparent 
            opacity={0.5}
          />
        </RoundedBox>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── FLOATING PARTICLES ─── */
/* ═══════════════════════════════════════════ */
const Particles = ({ count = 25 }) => {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push((Math.random() - 0.5) * 12, Math.random() * 6, (Math.random() - 0.5) * 8);
    }
    return new Float32Array(pos);
  }, [count]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={ACCENT} size={0.03} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

/* ═══════════════════════════════════════════ */
/* ─── MAIN NEXUS FACTORY COMPONENT ─── */
/* ═══════════════════════════════════════════ */
const NexusFactory = () => {
  return (
    <div className="fixed inset-0 z-0 bg-primary">
      <Canvas
        camera={{
          position: [10, 7, 10],
          fov: 30,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: '#050505' }}
      >
        {/* Lighting — soft studio setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[8, 12, 8]} intensity={1.2} color="#ffffff" castShadow />
        <directionalLight position={[-5, 8, -5]} intensity={0.4} color={ACCENT} />
        <pointLight position={[0, 5, 0]} intensity={1.5} color={ACCENT} distance={15} />
        <hemisphereLight color="#ffffff" groundColor="#0a0a0a" intensity={0.3} />

        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#050505', 12, 30]} />

        {/* The Scene — all elements positioned to match the reference layout */}
        <group rotation={[0, -Math.PI / 5, 0]}>
          <Platform />
          <CentralTower />
          <RoboticArm position={[-3, 0, -0.8]} />
          <BarChart position={[-1.8, 0, -1.5]} />
          <DNAStand position={[2.8, 0, -0.8]} />
          <MoleculeDisplay position={[0.8, 0, 2.0]} />
          <ConveyorPaths />
          <Particles />
        </group>

        {/* Subtle auto-orbit for cinematic feel */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 3.2}
        />
      </Canvas>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_3px]" />
    </div>
  );
};

export default NexusFactory;
