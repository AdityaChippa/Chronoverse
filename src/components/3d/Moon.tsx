'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoonProps {
  position?: [number, number, number];
  scale?: number;
  showPhases?: boolean;
}

export function Moon({ position = [0, 0, 0], scale = 1, showPhases = false }: MoonProps) {
  const moonRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group position={position}>
      {showPhases && (
        <directionalLight
          ref={lightRef}
          position={[5, 0, 0]}
          intensity={1}
          color="white"
          castShadow
        />
      )}
      
      <mesh ref={moonRef} scale={scale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#C0C0C0"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Moon surface details */}
      <mesh scale={scale * 1.001}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#808080"
          roughness={1}
          transparent
          opacity={0.3}
          bumpScale={0.05}
        />
      </mesh>
    </group>
  );
}