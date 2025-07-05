'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface SatelliteProps {
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  name?: string;
}

export function Satellite({ position, orbitRadius, orbitSpeed, name = 'Satellite' }: SatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * orbitSpeed;
      groupRef.current.position.x = Math.cos(time) * orbitRadius;
      groupRef.current.position.z = Math.sin(time) * orbitRadius;
    }
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={satelliteRef}>
        {/* Main body */}
        <Box args={[0.2, 0.1, 0.1]}>
          <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.2} />
        </Box>
        
        {/* Solar panels */}
        <Box args={[0.6, 0.01, 0.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1E3A8A" metalness={0.3} roughness={0.7} />
        </Box>
        
        {/* Antenna */}
        <Cylinder args={[0.01, 0.01, 0.15]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#white" metalness={0.9} roughness={0.1} />
        </Cylinder>
      </group>
    </group>
  );
}