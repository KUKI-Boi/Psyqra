import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════ */
/*  COLOR PALETTE — Electric Blue + White/Gray                    */
/* ═══════════════════════════════════════════════════════════════ */
const BLUE       = '#3B82F6';  // Electric blue primary
const BLUE_GLOW  = '#60A5FA';  // Lighter blue for glow
const BLUE_DEEP  = '#1D4ED8';  // Deeper blue for accents
const WHITE      = '#f0f0f0';  // Soft white body
const GRAY       = '#d4d4d8';  // Light gray
const GRAY_DARK  = '#a1a1aa';  // Darker gray for contrast
const BG         = '#0a0a0f';  // Near-black background

/* ═══════════════════════════════════════════════════════════════ */
/*  ANIMATION CONSTANTS                                           */
/* ═══════════════════════════════════════════════════════════════ */
const OSCILLATION_SPEED    = 2.2;    // ~2.85s per cycle  (2π/2.2)
const OSCILLATION_RANGE    = 0.35;   // ~35px equivalent vertical range
const RING_ROTATION_SPEED  = 1.1;    // ~5.7s per full rotation
const NODE_DELAY           = 0.2;    // 0.2s phase delay for energy node

/* ═══════════════════════════════════════════════════════════════ */
/*  BASE PLATFORM — Static, grounded foundation                   */
/* ═══════════════════════════════════════════════════════════════ */
const BasePlatform = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Outer base slab */}
      <RoundedBox args={[4.5, 0.25, 4.5]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={GRAY} metalness={0.15} roughness={0.4} />
      </RoundedBox>

      {/* Inner raised platform */}
      <RoundedBox args={[3.6, 0.3, 3.6]} radius={0.06} smoothness={4} position={[0, 0.25, 0]}>
        <meshStandardMaterial color={WHITE} metalness={0.2} roughness={0.3} />
      </RoundedBox>

      {/* Blue accent trim */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[3.8, 0.04, 3.8]} />
        <meshStandardMaterial color={BLUE} metalness={0.4} roughness={0.2} emissive={BLUE} emissiveIntensity={0.15} />
      </mesh>

      {/* Center elevated pad */}
      <RoundedBox args={[2.6, 0.15, 2.6]} radius={0.05} smoothness={4} position={[0, 0.47, 0]}>
        <meshStandardMaterial color={WHITE} metalness={0.1} roughness={0.3} />
      </RoundedBox>

      {/* Blue inset on pad */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[2.2, 0.02, 2.2]} />
        <meshStandardMaterial color={BLUE_DEEP} metalness={0.5} roughness={0.15} emissive={BLUE_DEEP} emissiveIntensity={0.3} />
      </mesh>

      {/* Soft shadow disc */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  SUPPORT ARM — Single articulated arm from base to cube        */
/*  Two segments with joint spheres, anchored at base, connected  */
/*  to the oscillating cube.                                      */
/* ═══════════════════════════════════════════════════════════════ */
const SupportArm = React.forwardRef(({ side }, ref) => {
  const mirror = side === 'left' ? -1 : 1;

  return (
    <group ref={ref} position={[mirror * 1.8, 0, 0]}>
      {/* Base anchor joint (on platform) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color={BLUE} metalness={0.4} roughness={0.2} emissive={BLUE} emissiveIntensity={0.5} />
      </mesh>

      {/* Lower arm segment — angled inward toward cube */}
      <mesh position={[mirror * -0.45, 0.55, 0]} rotation={[0, 0, mirror * 0.5]}>
        <boxGeometry args={[0.14, 1.3, 0.14]} />
        <meshStandardMaterial color={WHITE} metalness={0.25} roughness={0.25} />
      </mesh>

      {/* Elbow joint */}
      <mesh position={[mirror * -0.75, 1.05, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={BLUE} metalness={0.4} roughness={0.2} emissive={BLUE} emissiveIntensity={0.5} />
      </mesh>

      {/* Upper arm segment */}
      <mesh position={[mirror * -1.05, 1.65, 0]} rotation={[0, 0, mirror * -0.3]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color={GRAY} metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Top connection joint (touches cube) */}
      <mesh position={[mirror * -1.2, 2.2, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial color={BLUE_GLOW} metalness={0.3} roughness={0.2} emissive={BLUE_GLOW} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
});
SupportArm.displayName = 'SupportArm';

/* ═══════════════════════════════════════════════════════════════ */
/*  ORBITAL RING — Horizontal orbit around the cube               */
/* ═══════════════════════════════════════════════════════════════ */
const OrbitalRing = React.forwardRef((props, ref) => {
  return (
    <group {...props}>
      {/* Main ring */}
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 24, 128]} />
        <meshStandardMaterial
          color={BLUE_GLOW}
          emissive={BLUE_GLOW}
          emissiveIntensity={1.2}
          transparent
          opacity={0.75}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Secondary inner ring for depth */}
      <mesh ref={null} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={BLUE}
          emissive={BLUE}
          emissiveIntensity={0.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
});
OrbitalRing.displayName = 'OrbitalRing';

/* ═══════════════════════════════════════════════════════════════ */
/*  ENERGY NODE — Glowing sphere/droplet above the cube           */
/* ═══════════════════════════════════════════════════════════════ */
const EnergyNode = React.forwardRef((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={BLUE_GLOW}
          emissiveIntensity={3}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={BLUE_GLOW} transparent opacity={0.08} />
      </mesh>
      {/* Point light emanating from node */}
      <pointLight color={BLUE_GLOW} intensity={3} distance={6} />
    </group>
  );
});
EnergyNode.displayName = 'EnergyNode';

/* ═══════════════════════════════════════════════════════════════ */
/*  CENTRAL CUBE — Main animated glossy cube with inset panels    */
/* ═══════════════════════════════════════════════════════════════ */
const CentralCube = React.forwardRef((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Bottom block (wide base) */}
      <RoundedBox args={[2.0, 0.7, 2.0]} radius={0.06} smoothness={4} position={[0, 0.35, 0]}>
        <meshStandardMaterial color={WHITE} metalness={0.2} roughness={0.25} />
      </RoundedBox>

      {/* Middle block (narrower, taller) */}
      <RoundedBox args={[1.5, 1.1, 1.5]} radius={0.05} smoothness={4} position={[0, 1.25, 0]}>
        <meshStandardMaterial color={GRAY} metalness={0.15} roughness={0.3} />
      </RoundedBox>

      {/* Top cap block */}
      <RoundedBox args={[1.7, 0.4, 1.7]} radius={0.05} smoothness={4} position={[0, 2.0, 0]}>
        <meshStandardMaterial color={WHITE} metalness={0.2} roughness={0.2} />
      </RoundedBox>

      {/* Blue accent panels on all 4 faces of the middle block */}
      {[
        { pos: [0, 1.25, 0.76],  rot: [0, 0, 0] },
        { pos: [0, 1.25, -0.76], rot: [0, Math.PI, 0] },
        { pos: [0.76, 1.25, 0],  rot: [0, Math.PI / 2, 0] },
        { pos: [-0.76, 1.25, 0], rot: [0, -Math.PI / 2, 0] },
      ].map((face, i) => (
        <mesh key={i} position={face.pos} rotation={face.rot}>
          <boxGeometry args={[0.5, 0.45, 0.02]} />
          <meshStandardMaterial
            color={BLUE}
            metalness={0.5}
            roughness={0.15}
            emissive={BLUE}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Accent line between bottom and middle */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[1.55, 0.03, 1.55]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
});
CentralCube.displayName = 'CentralCube';

/* ═══════════════════════════════════════════════════════════════ */
/*  MECHANICAL SYSTEM — Orchestrates all animation logic          */
/* ═══════════════════════════════════════════════════════════════ */
const MechanicalSystem = ({ hovered }) => {
  const cubeRef = useRef();
  const nodeRef = useRef();
  const ringGroupRef = useRef();
  const ringRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    /* ─── 1. Vertical Oscillation (Primary) ─── */
    const osc = Math.sin(t * OSCILLATION_SPEED) * OSCILLATION_RANGE;

    // Cube follows oscillation
    if (cubeRef.current) {
      cubeRef.current.position.y = osc;
    }

    /* ─── 2. Energy Node (delayed micro-floating) ─── */
    if (nodeRef.current) {
      const nodeOsc = Math.sin((t - NODE_DELAY) * OSCILLATION_SPEED) * OSCILLATION_RANGE;
      const microFloat = Math.sin(t * 3.5) * 0.04; // subtle extra wobble
      nodeRef.current.position.y = 2.55 + nodeOsc + microFloat;

      // Pulse glow
      const pulse = 2.5 + Math.sin(t * 2.5) * 1.0;
      nodeRef.current.children[0].material.emissiveIntensity = pulse;
    }

    /* ─── 3. Ring Rotation (Independent, continuous) ─── */
    if (ringGroupRef.current) {
      // Ring follows cube Y but rotates independently
      ringGroupRef.current.position.y = 1.8 + osc;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * RING_ROTATION_SPEED;
    }

    /* ─── 4. Support Arms (Synchronized with cube) ─── */
    const armAngle = osc * 0.35; // subtle flex

    if (leftArmRef.current) {
      // Adjust arm segment angles to track cube position
      const lowerArm = leftArmRef.current.children[1]; // lower segment
      const upperArm = leftArmRef.current.children[3]; // upper segment
      if (lowerArm) lowerArm.rotation.z = -1 * 0.45 + armAngle * 0.6;
      if (upperArm) upperArm.rotation.z = -1 * -0.35 - armAngle * 0.8;
    }

    if (rightArmRef.current) {
      const lowerArm = rightArmRef.current.children[1];
      const upperArm = rightArmRef.current.children[3];
      if (lowerArm) lowerArm.rotation.z = 1 * 0.45 - armAngle * 0.6;
      if (upperArm) upperArm.rotation.z = 1 * -0.35 + armAngle * 0.8;
    }

    /* ─── 5. Hover Effect ─── */
    const targetScale = hovered ? 1.04 : 1.0;
    if (cubeRef.current) {
      cubeRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      );
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Support Arms (static base, dynamic joints) */}
      <SupportArm ref={leftArmRef} side="left" />
      <SupportArm ref={rightArmRef} side="right" />

      {/* Central Cube (oscillating) */}
      <CentralCube ref={cubeRef} />

      {/* Orbital Ring (follows cube Y, rotates independently) */}
      <group ref={ringGroupRef}>
        <OrbitalRing ref={ringRef} position={[0, 1.8, 0]} />
      </group>

      {/* Energy Node (delayed oscillation + micro-float) */}
      <EnergyNode ref={nodeRef} position={[0, 2.55, 0]} />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  FLOATING PARTICLES — Ambient detail                           */
/* ═══════════════════════════════════════════════════════════════ */
const FloatingParticles = ({ count = 30 }) => {
  const ref = useRef();
  const positions = React.useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 10,
        Math.random() * 5,
        (Math.random() - 0.5) * 10
      );
    }
    return new Float32Array(pos);
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={BLUE_GLOW} size={0.04} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN NEXUS FACTORY COMPONENT                                  */
/* ═══════════════════════════════════════════════════════════════ */
const NexusFactory = () => {
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);

  return (
    <div
      className="fixed inset-0 z-0 bg-primary"
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <Canvas
        camera={{
          position: [8, 5.5, 8],
          fov: 32,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: BG }}
      >
        {/* ─── LIGHTING — Premium studio setup ─── */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[6, 10, 6]}
          intensity={1.5}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-4, 6, -4]}
          intensity={0.5}
          color={BLUE_GLOW}
        />
        <pointLight
          position={[0, 6, 0]}
          intensity={2}
          color={BLUE}
          distance={15}
        />
        <hemisphereLight
          color="#ffffff"
          groundColor="#0a0a12"
          intensity={0.35}
        />

        {/* Atmospheric fog */}
        <fog attach="fog" args={[BG, 10, 28]} />

        {/* ─── SCENE ─── */}
        <group rotation={[0, -Math.PI / 5, 0]}>
          <BasePlatform />
          <MechanicalSystem hovered={hovered} />
          <FloatingParticles />
        </group>
      </Canvas>

      {/* Scanline overlay for cyberpunk feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_3px]" />
    </div>
  );
};

export default NexusFactory;
