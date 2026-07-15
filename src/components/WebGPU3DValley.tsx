import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface WebGPU3DValleyProps {
  waterLevel?: number;
}

const Terrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate terrain geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 128, 128);
    geo.rotateX(-Math.PI / 2);
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      // Simple valley shape: higher on edges (x), lower in middle
      const valley = Math.pow(x / 30, 2) * 10;
      // Add some noise
      const noise = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 1.5 + Math.sin(x * 0.8 + z * 0.5) * 0.5;
      
      pos.setY(i, valley + noise);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial 
        color="#3b5e2b" 
        wireframe={false}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

const Water = ({ level = 5 }: { level: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle wave animation
      meshRef.current.position.y = level + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, level, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#2c82c9" 
        transparent 
        opacity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
};

export const WebGPU3DValley: React.FC<WebGPU3DValleyProps> = ({ waterLevel = 2 }) => {
  return (
    <div className="w-full h-full relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      <Canvas shadows camera={{ position: [0, 20, 40], fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 50, 25]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <Environment preset="city" />
        
        <Terrain />
        <Water level={waterLevel} />
        
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={80}
        />
      </Canvas>
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-md border border-slate-700 text-xs font-mono shadow-lg flex items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Water Level: {waterLevel.toFixed(2)}m
      </div>
    </div>
  );
};
