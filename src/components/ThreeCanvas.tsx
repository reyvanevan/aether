"use client";

import {
    useDevicePerformance,
    type PerformanceTier,
} from "@/hooks/useDevicePerformance";
import { useUIStore } from "@/store/useUIStore";
import {
    AdaptiveDpr,
    ContactShadows,
    Environment,
    Float,
    MeshTransmissionMaterial,
    OrbitControls,
    PerformanceMonitor,
    Preload,
    Stars,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, Suspense, useCallback, useMemo, useRef } from "react";
import * as THREE from "three";

// ──────────────────────────────────────────────────────────────────────────────
// PRE-ALLOCATED OBJECTS — Avoids GC pressure from creating objects every frame.
// Before: `new THREE.Vector3()` and `new THREE.Color()` called 60x/sec = GC spikes
// After: Zero allocations in the render loop
// ──────────────────────────────────────────────────────────────────────────────
const _scale = new THREE.Vector3();
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();

// ──────────────────────────────────────────────────────────────────────────────
// PARTICLES — memoised component, for-loop instead of forEach (no closures)
// ──────────────────────────────────────────────────────────────────────────────
interface ParticlesProps {
  count: number;
}

const Particles = memo(function Particles({ count }: ParticlesProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
        mx: 0,
        my: 0,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    const inst = mesh.current;
    if (!inst) return;

    // Plain for-loop — no closure allocation per iteration like forEach
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const t = (p.t += p.speed / 2);
      const a = Math.cos(t) + Math.sin(t) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      dummy.position.set(
        (p.mx / 10) * a +
          p.xFactor +
          Math.cos((t / 10) * p.factor) +
          (Math.sin(t) * p.factor) / 10,
        (p.my / 10) * b +
          p.yFactor +
          Math.sin((t / 10) * p.factor) +
          (Math.cos(t * 2) * p.factor) / 10,
        (p.my / 10) * b +
          p.zFactor +
          Math.cos((t / 10) * p.factor) +
          (Math.sin(t * 3) * p.factor) / 10
      );
      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      scale={0.1}
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </instancedMesh>
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// FALLBACK GLASS — for medium/low tiers (NO FBO passes, just standard PBR)
// Looks ~80% as good, costs ~10% GPU compared to MeshTransmissionMaterial
// ──────────────────────────────────────────────────────────────────────────────
function FallbackGlassMaterial() {
  // No `transmission` prop — that triggers an internal FBO pass in Three.js
  // which is nearly as expensive as MeshTransmissionMaterial.
  // Pure opacity + high envMap reflection = decent glass look at ~0 GPU cost.
  return (
    <meshPhysicalMaterial
      transparent
      opacity={0.25}
      roughness={0.05}
      metalness={0.2}
      clearcoat={1}
      clearcoatRoughness={0.05}
      envMapIntensity={3}
      reflectivity={1}
      color="#aaccff"
      side={THREE.DoubleSide}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// QUANTUM CORE — adaptive quality based on device tier
// ──────────────────────────────────────────────────────────────────────────────
interface QuantumCoreProps {
  tier: PerformanceTier;
  particleCount: number;
  starCount: number;
  useTransmission: boolean;
  geometryDetail: number;
}

const QuantumCore = memo(function QuantumCore({
  tier,
  particleCount,
  starCount,
  useTransmission,
  geometryDetail,
}: QuantumCoreProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const parallaxRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isHoveringButton = useUIStore((s) => s.isHoveringButton);
  const { viewport } = useThree();

  const responsiveScale = Math.min(1, viewport.width / 6);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speed = isHoveringButton ? 5 : 1;

    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.5 * speed;
      innerRef.current.rotation.y += delta * 0.8 * speed;

      const s = isHoveringButton
        ? 1.2 + Math.sin(time * 15) * 0.1
        : 1 + Math.sin(time * 3) * 0.05;

      // ✅ FIX: Reuse pre-allocated vector (was: new THREE.Vector3() every frame)
      _scale.setScalar(s);
      innerRef.current.scale.lerp(_scale, 0.1);
    }

    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.2 * speed;
      outerRef.current.rotation.y -= delta * 0.3 * speed;
    }

    if (materialRef.current) {
      const mat = materialRef.current;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        isHoveringButton ? 5 : 2,
        0.1
      );

      // ✅ FIX: Reuse pre-allocated colors (was: new THREE.Color() every frame)
      _colorA.set(isHoveringButton ? "#ff3333" : "#ffffff");
      mat.color.lerp(_colorA, 0.1);

      _colorB.set(isHoveringButton ? "#ff0000" : "#ffffff");
      mat.emissive.lerp(_colorB, 0.1);
    }

    if (parallaxRef.current) {
      const tx = state.pointer.x * (Math.PI / 8);
      const ty = -(state.pointer.y * (Math.PI / 8));
      parallaxRef.current.rotation.y = THREE.MathUtils.lerp(
        parallaxRef.current.rotation.y,
        tx,
        0.05
      );
      parallaxRef.current.rotation.x = THREE.MathUtils.lerp(
        parallaxRef.current.rotation.x,
        ty,
        0.05
      );
    }
  });

  return (
    <group ref={parallaxRef} scale={responsiveScale}>
      <Float
        speed={isHoveringButton ? 5 : 2}
        rotationIntensity={isHoveringButton ? 2 : 1}
        floatIntensity={1.5}
      >
        <group>
          {/* Inner Glowing Core */}
          <mesh ref={innerRef}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              ref={materialRef}
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
              wireframe
            />
          </mesh>

          {/* Outer Shell — Transmission on high-end, PBR fallback on mobile */}
          <mesh ref={outerRef}>
            <icosahedronGeometry args={[2, geometryDetail]} />
            {useTransmission ? (
              <MeshTransmissionMaterial
                backside
                backsideThickness={1}
                thickness={1.5}
                chromaticAberration={0.05}
                anisotropy={0.5}
                distortion={0.2}
                distortionScale={0.5}
                temporalDistortion={0.1}
                iridescence={1}
                iridescenceIOR={1}
                iridescenceThicknessRange={[0, 1400]}
                color="#ffffff"
                roughness={0}
                clearcoat={1}
                clearcoatRoughness={0.1}
                // ⚡ PERF: lower FBO res & samples (orig was default ~1024/16)
                samples={6}
                resolution={512}
              />
            ) : (
              <FallbackGlassMaterial />
            )}
          </mesh>
        </group>
      </Float>

      <Particles count={particleCount} />

      {starCount > 0 && (
        <Stars
          radius={100}
          depth={50}
          count={starCount}
          factor={4}
          saturation={0}
          fade
          speed={isHoveringButton ? 5 : 1}
        />
      )}
    </group>
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// CANVAS — adaptive renderer, auto-DPR, performance monitoring
// ──────────────────────────────────────────────────────────────────────────────
export default function ThreeCanvas() {
  const setInteracted = useUIStore((s) => s.setInteracted);
  const perf = useDevicePerformance();

  const handleDecline = useCallback(() => {
    // PerformanceMonitor auto-triggers AdaptiveDpr reduction
  }, []);

  return (
    <div className="canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={perf.dpr}
        gl={{
          powerPreference: "high-performance",
          antialias: perf.antialias,
          alpha: false,
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#000000"]} />

        {/* Auto-downgrades DPR when framerate drops */}
        <PerformanceMonitor
          onDecline={handleDecline}
          flipflops={3}
          onFallback={() =>
            console.warn("[Aether] Performance fallback triggered")
          }
        >
          <AdaptiveDpr pixelated />
        </PerformanceMonitor>

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          <QuantumCore
            tier={perf.tier}
            particleCount={perf.particleCount}
            starCount={perf.starCount}
            useTransmission={perf.useTransmission}
            geometryDetail={perf.geometryDetail}
          />
          {/* HDR cubemap — skip on low tier to save GPU texture sampling */}
          {perf.tier !== "low" && <Environment preset="city" />}
          {perf.shadowResolution > 0 && (
            <ContactShadows
              position={[0, -3, 0]}
              resolution={perf.shadowResolution}
              scale={20}
              blur={2}
              opacity={0.5}
              far={10}
              color="#ffffff"
            />
          )}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          onStart={() => setInteracted(true)}
        />

        <Preload all />
      </Canvas>
    </div>
  );
}
