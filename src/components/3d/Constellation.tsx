'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Star } from '@/types';

interface ConstellationProps {
  stars: Star[];
  connections: number[][];
  color?: string;
}

export function Constellation({ stars, connections, color = '#FFE0BD' }: ConstellationProps) {
  const starPositions = useMemo(() => {
    return stars.map(star => new THREE.Vector3(star.position.x, star.position.y, star.position.z));
  }, [stars]);

  const lines = useMemo(() => {
    return connections.map(([start, end]) => [starPositions[start], starPositions[end]]);
  }, [connections, starPositions]);

  return (
    <group>
      {/* Stars */}
      {stars.map((star, i) => (
        <mesh key={i} position={[star.position.x, star.position.y, star.position.z]}>
          <sphereGeometry args={[0.05 * (1 + star.magnitude / 5), 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      
      {/* Connection lines */}
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={color}
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}