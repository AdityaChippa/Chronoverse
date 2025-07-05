'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const distance = Math.random() * 50 + 10;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = distance * Math.cos(theta);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.x = clock.getElapsedTime() * 0.005;
      points.current.rotation.y = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#FFF8E7"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function NebulaCloud() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -10]}>
      <planeGeometry args={[50, 50, 32, 32]} />
      <shaderMaterial
        transparent
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);
            float alpha = smoothstep(0.5, 0.0, dist) * 0.1;
            
            vec3 color = mix(
              vec3(1.0, 0.878, 0.906),
              vec3(1.0, 0.969, 0.906), 
              dist
            );
            
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

export function Universe() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <StarField />
        <NebulaCloud />
        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        
        <fog attach="fog" args={['#000000', 5, 50]} />
      </Canvas>
    </div>
  );
}