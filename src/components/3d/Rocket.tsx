'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cone, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface RocketProps {
  launching?: boolean;
  position?: [number, number, number];
}

export function Rocket({ launching = false, position = [0, 0, 0] }: RocketProps) {
  const rocketRef = useRef<THREE.Group>(null);
  const [altitude, setAltitude] = useState(0);

  useFrame(({ clock }, delta) => {
    if (rocketRef.current && launching) {
      setAltitude(prev => prev + delta * 5);
      rocketRef.current.position.y = altitude;
      
      // Add wobble during launch
      rocketRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 10) * 0.05;
    }
  });

  return (
    <group ref={rocketRef} position={position}>
      {/* Rocket body */}
      <Cylinder args={[0.3, 0.3, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#E5E5E5" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Nose cone */}
      <Cone args={[0.3, 0.6, 8]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#FF0000" />
      </Cone>
      
      {/* Fins */}
      {[0, 120, 240].map((angle, i) => (
        <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <mesh position={[0.4, -0.8, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.05]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        </group>
      ))}
      
      {/* Exhaust flame */}
      {launching && (
        <group position={[0, -1.5, 0]}>
          <Cone args={[0.4, 1.5, 8]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color="#FF6B00" transparent opacity={0.8} />
          </Cone>
          <pointLight position={[0, -1, 0]} intensity={2} color="#FF6B00" />
        </group>
      )}
    </group>
  );
}