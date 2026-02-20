"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, OrbitControls, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AbstractShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 16]} />
                <MeshDistortMaterial
                    color="#000000"
                    envMapIntensity={2}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={1}
                    roughness={0.1}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

export default function ThreeCanvas() {
    return (
        <div className="canvas-wrapper">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <AbstractShape />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
}
