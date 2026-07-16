import React, { useMemo } from 'react';
import * as THREE from 'three';

// Utility to get height of terrain at x, z
export function getTerrainHeight(x: number, z: number) {
  const valley = Math.pow(x / 30, 2) * 10;
  const noise = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 1.5 + Math.sin(x * 0.8 + z * 0.5) * 0.5;
  return valley + noise;
}

export const CityInfrastructure = () => {
  // Generate mock buildings
  const { buildingGeom, buildingColors } = useMemo(() => {
    const geom = new THREE.InstancedBufferGeometry();
    const baseGeom = new THREE.BoxGeometry(1, 1, 1);
    
    // Copy attributes from base
    geom.index = baseGeom.index;
    geom.attributes.position = baseGeom.attributes.position;
    geom.attributes.normal = baseGeom.attributes.normal;
    geom.attributes.uv = baseGeom.attributes.uv;

    const count = 300;
    const instanceMatrices = new Float32Array(count * 16);
    const instanceColors = new Float32Array(count * 3);
    
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let idx = 0;
    for (let i = 0; i < count; i++) {
      // Clustered positions
      const cluster = i % 3;
      let cx = 0, cz = 0;
      if (cluster === 0) { cx = 15; cz = 15; }
      else if (cluster === 1) { cx = -20; cz = -10; }
      else { cx = 25; cz = -25; }

      const x = cx + (Math.random() - 0.5) * 20;
      const z = cz + (Math.random() - 0.5) * 20;
      
      const width = 1 + Math.random() * 1.5;
      const depth = 1 + Math.random() * 1.5;
      const height = 1 + Math.random() * 3 + (Math.random() > 0.9 ? Math.random() * 5 : 0); // some tall buildings

      const y = getTerrainHeight(x, z) + height / 2;

      dummy.position.set(x, y, z);
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = (Math.random() > 0.5 ? 0 : Math.PI / 4) + (Math.random() - 0.5) * 0.2;
      dummy.updateMatrix();
      
      dummy.matrix.toArray(instanceMatrices, idx * 16);
      
      color.setHSL(0.6, 0.1, 0.4 + Math.random() * 0.4); // slate/gray colors
      color.toArray(instanceColors, idx * 3);
      
      idx++;
    }
    
    geom.setAttribute('instanceMatrix', new THREE.InstancedBufferAttribute(instanceMatrices, 16));
    geom.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(instanceColors, 3));
    
    return { buildingGeom: geom, buildingColors: instanceColors };
  }, []);

  // Generate mock roads
  const roadPaths = useMemo(() => {
    const paths = [];
    
    // Main highway along the valley
    const highway = [];
    for(let z = -50; z <= 50; z += 2) {
      const x = Math.sin(z * 0.05) * 5;
      const y = getTerrainHeight(x, z) + 0.1;
      highway.push(new THREE.Vector3(x, y, z));
    }
    paths.push({ points: highway, width: 1.5, color: '#334155' }); // slate-700

    // Cross roads
    for(let i = 0; i < 5; i++) {
      const cross = [];
      const zOffset = -40 + i * 20;
      for(let x = -50; x <= 50; x += 2) {
        const z = zOffset + Math.sin(x * 0.1) * 2;
        const y = getTerrainHeight(x, z) + 0.1;
        cross.push(new THREE.Vector3(x, y, z));
      }
      paths.push({ points: cross, width: 0.8, color: '#475569' }); // slate-600
    }

    return paths;
  }, []);

  return (
    <group>
      {/* Buildings */}
      <mesh geometry={buildingGeom} castShadow receiveShadow>
        <meshStandardMaterial 
          roughness={0.8} 
          metalness={0.2}
          vertexColors={true}
        />
      </mesh>

      {/* Roads (drawn as TubeGeometries or thick lines) */}
      {roadPaths.map((road, idx) => {
        const curve = new THREE.CatmullRomCurve3(road.points);
        return (
          <mesh key={idx} receiveShadow>
            <tubeGeometry args={[curve, road.points.length * 2, road.width / 2, 8, false]} />
            <meshStandardMaterial color={road.color} roughness={0.9} metalness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
};
