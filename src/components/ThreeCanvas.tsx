"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Float, MeshTransmissionMaterial, ContactShadows, Stars } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

function Particles({ count = 1000 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            if (mesh.current) {
                mesh.current.setMatrixAt(i, dummy.matrix);
            }
        });
        if (mesh.current) {
            mesh.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} scale={0.1}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </instancedMesh>
    );
}

function QuantumCore() {
    const innerRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Mesh>(null);
    const parallaxRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const isHoveringButton = useUIStore((state) => state.isHoveringButton);
    const { viewport } = useThree();

    // Calculate a responsive scale strictly based on viewport, 
    // ensuring desktop remains large and mobile shrinks linearly.
    const responsiveScale = Math.min(1, viewport.width / 6);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const targetSpeed = isHoveringButton ? 5 : 1;

        if (innerRef.current) {
            innerRef.current.rotation.x += delta * 0.5 * targetSpeed;
            innerRef.current.rotation.y += delta * 0.8 * targetSpeed;

            const scale = isHoveringButton
                ? 1.2 + Math.sin(time * 15) * 0.1
                : 1 + Math.sin(time * 3) * 0.05;

            innerRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }

        if (outerRef.current) {
            outerRef.current.rotation.x -= delta * 0.2 * targetSpeed;
            outerRef.current.rotation.y -= delta * 0.3 * targetSpeed;
        }

        if (materialRef.current) {
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, isHoveringButton ? 5 : 2, 0.1);
            materialRef.current.color.lerp(new THREE.Color(isHoveringButton ? '#ff3333' : '#ffffff'), 0.1);
            materialRef.current.emissive.lerp(new THREE.Color(isHoveringButton ? '#ff0000' : '#ffffff'), 0.1);
        }

        if (parallaxRef.current) {
            const targetX = state.pointer.x * (Math.PI / 8);
            const targetY = -(state.pointer.y * (Math.PI / 8));
            parallaxRef.current.rotation.y = THREE.MathUtils.lerp(parallaxRef.current.rotation.y, targetX, 0.05);
            parallaxRef.current.rotation.x = THREE.MathUtils.lerp(parallaxRef.current.rotation.x, targetY, 0.05);
        }
    });

    return (
        <group ref={parallaxRef} scale={responsiveScale}>
            <Float speed={isHoveringButton ? 5 : 2} rotationIntensity={isHoveringButton ? 2 : 1} floatIntensity={1.5}>
                <group>
                    {/* Inner Glowing Core */}
                    <mesh ref={innerRef}>
                        <icosahedronGeometry args={[1, 1]} />
                        <meshStandardMaterial
                            ref={materialRef}
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={2}
                            wireframe={true}
                        />
                    </mesh>

                    {/* Outer Refractive Glass Shell */}
                    <mesh ref={outerRef}>
                        <icosahedronGeometry args={[2, 4]} />
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
                        />
                    </mesh>
                </group>
            </Float>

            <Particles count={200} />
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={isHoveringButton ? 5 : 1} />
        </group>
    );
}

export default function ThreeCanvas() {
    const setInteracted = useUIStore((state) => state.setInteracted);

    return (
        <div className="canvas-wrapper">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <QuantumCore />
                <Environment preset="city" />
                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#ffffff" />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    onStart={() => setInteracted(true)}
                />
            </Canvas>
        </div>
    );
}
