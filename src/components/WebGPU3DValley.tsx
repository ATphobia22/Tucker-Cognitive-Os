import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Ruler, Shield, X, Check } from 'lucide-react';

interface WebGPU3DValleyProps {
  waterLevel?: number;
}

const Terrain = ({ onPointerDown, onPointerMove }: { 
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void,
  onPointerMove?: (e: ThreeEvent<PointerEvent>) => void 
}) => {
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
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      receiveShadow 
      castShadow
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <meshStandardMaterial 
        color="#3b5e2b" 
        wireframe={false}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

const Water = ({ level = 5, blockedPoints = [] }: { level: number, blockedPoints: THREE.Vector3[] }) => {
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

const BermVisual = ({ points, draftPoint }: { points: THREE.Vector3[], draftPoint: THREE.Vector3 | null }) => {
  const allPoints = draftPoint ? [...points, draftPoint] : points;
  
  if (allPoints.length === 0) return null;

  // Lift points slightly above terrain so they are visible
  const renderPoints = allPoints.map(p => new THREE.Vector3(p.x, p.y + 0.5, p.z));

  return (
    <group>
      {renderPoints.length > 1 && (
        <Line
          points={renderPoints}
          color="#f59e0b" // Amber color for construction
          lineWidth={15}
          dashed={false}
        />
      )}
      {renderPoints.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={i === renderPoints.length - 1 && draftPoint ? "#fbbf24" : "#d97706"} />
        </mesh>
      ))}
    </group>
  );
}

export const WebGPU3DValley: React.FC<WebGPU3DValleyProps> = ({ waterLevel = 2 }) => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [bermPoints, setBermPoints] = useState<THREE.Vector3[]>([]);
  const [draftPoint, setDraftPoint] = useState<THREE.Vector3 | null>(null);
  const [savedBerms, setSavedBerms] = useState<THREE.Vector3[][]>([]);
  const [inundationReduction, setInundationReduction] = useState(0);

  // Calculate protection area based on berm length as a simple proxy
  useEffect(() => {
    let totalLength = 0;
    savedBerms.forEach(berm => {
      for (let i = 0; i < berm.length - 1; i++) {
        totalLength += berm[i].distanceTo(berm[i+1]);
      }
    });
    
    // Estimate: each unit of berm protects ~15 square units
    const reduction = Math.min(100, (totalLength * 15) / 100); 
    setInundationReduction(reduction);
  }, [savedBerms]);

  const handleTerrainPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isDrawingMode) return;
    e.stopPropagation();
    setBermPoints([...bermPoints, e.point.clone()]);
  };

  const handleTerrainPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDrawingMode) return;
    e.stopPropagation();
    setDraftPoint(e.point.clone());
  };

  const cancelDrawing = () => {
    setIsDrawingMode(false);
    setBermPoints([]);
    setDraftPoint(null);
  };

  const finishDrawing = () => {
    if (bermPoints.length > 1) {
      setSavedBerms([...savedBerms, bermPoints]);
    }
    setIsDrawingMode(false);
    setBermPoints([]);
    setDraftPoint(null);
  };

  const clearBerms = () => {
    setSavedBerms([]);
  };

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
        
        <Terrain 
          onPointerDown={handleTerrainPointerDown} 
          onPointerMove={handleTerrainPointerMove}
        />
        <Water level={waterLevel} blockedPoints={[]} />
        
        <BermVisual points={bermPoints} draftPoint={draftPoint} />
        {savedBerms.map((berm, i) => (
          <BermVisual key={i} points={berm} draftPoint={null} />
        ))}
        
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={80}
          enabled={!isDrawingMode}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-md border border-slate-700 text-xs font-mono shadow-lg flex items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Water Level: {waterLevel.toFixed(2)}m
      </div>

      {/* Berm Placement Tool UI */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 items-end">
        {!isDrawingMode ? (
          <>
            <button 
              onClick={() => setIsDrawingMode(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md border border-indigo-500 text-xs font-semibold shadow-lg flex items-center gap-2 transition-colors"
            >
              <Ruler size={14} />
              Draw Temporary Berm
            </button>
            {savedBerms.length > 0 && (
              <button 
                onClick={clearBerms}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md border border-slate-700 text-[11px] shadow-lg flex items-center gap-2 transition-colors"
              >
                Clear Berms
              </button>
            )}
          </>
        ) : (
          <div className="bg-slate-900/90 backdrop-blur border border-amber-500/50 rounded-lg p-3 shadow-xl flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Ruler size={16} />
              Drawing Mode Active
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Click on the terrain to place berm nodes. Dragging is disabled.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={cancelDrawing}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded border border-slate-700 text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <X size={12} /> Cancel
              </button>
              <button 
                onClick={finishDrawing}
                disabled={bermPoints.length < 2}
                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white py-1.5 rounded border border-amber-500 text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Check size={12} /> Complete
              </button>
            </div>
          </div>
        )}

        {/* Protection Stats Panel */}
        {savedBerms.length > 0 && !isDrawingMode && (
          <div className="bg-emerald-950/80 backdrop-blur border border-emerald-500/50 rounded-lg p-3 shadow-xl flex flex-col gap-2 mt-2 w-[240px] animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm border-b border-emerald-500/30 pb-2">
              <Shield size={16} />
              Inundation Mitigation
            </div>
            <div className="space-y-1.5 mt-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Active Berms:</span>
                <span className="font-mono text-white">{savedBerms.length}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Projected Reduction:</span>
                <span className="font-mono text-emerald-400 font-bold">{inundationReduction.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, inundationReduction)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
