'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  name: string;
  size: number;
  distance: number;
  color: string;
  orbitSpeed: number;
  rotationSpeed: number;
}

function Planet({ name, size, distance, color, orbitSpeed, rotationSpeed }: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * orbitSpeed;
    }
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      <Trail
        width={0.5}
        length={100}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh ref={ref} position={[distance, 0, 0]}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </Trail>
      
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.1, distance + 0.1, 64]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function SolarSystem() {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  const planets = [
    { name: 'Mercury', size: 0.2, distance: 4, color: '#8C7853', orbitSpeed: 0.5, rotationSpeed: 0.01 },
    { name: 'Venus', size: 0.4, distance: 6, color: '#FFC649', orbitSpeed: 0.35, rotationSpeed: 0.005 },
    { name: 'Earth', size: 0.4, distance: 8, color: '#4B7BEC', orbitSpeed: 0.3, rotationSpeed: 1 },
    { name: 'Mars', size: 0.3, distance: 10, color: '#CD4F39', orbitSpeed: 0.25, rotationSpeed: 0.9 },
    { name: 'Jupiter', size: 1, distance: 14, color: '#D4A574', orbitSpeed: 0.15, rotationSpeed: 2 },
    { name: 'Saturn', size: 0.8, distance: 18, color: '#FAD6A5', orbitSpeed: 0.1, rotationSpeed: 1.8 },
  ];

  return (
    <group>
      {/* Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#FDB813"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light from sun */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />

      {/* Planets */}
      {planets.map((planet) => (
        <Planet key={planet.name} {...planet} />
      ))}
    </group>
  );
}