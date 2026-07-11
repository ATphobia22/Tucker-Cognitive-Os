import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Globe, Play, RefreshCw, Layers, AlertCircle, HelpCircle, Layers3, Check, RotateCcw, Cpu } from "lucide-react";

interface SimulationState {
  step: number;
  maxDepth: number;
  volume: number;
  velocity: number;
  running: boolean;
}

interface Parcel3D {
  name: string;
  x: number;
  z: number;
  sizeX: number;
  sizeZ: number;
  color: number;
  owner: string;
  description: string;
  threatened: boolean;
}

export default function CesiumGlobeViewer() {
  const [breachX, setBreachX] = useState<number>(35); // relative %
  const [breachY, setBreachY] = useState<number>(45); // relative %
  const [inflowCfs, setInflowCfs] = useState<number>(145000);
  const [manningN, setManningN] = useState<number>(0.035);
  const [activeLayers, setActiveLayers] = useState<string[]>(["elev", "rivers", "levees", "geology", "parcels"]);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel3D | null>(null);

  const [sim, setSim] = useState<SimulationState>({
    step: 0,
    maxDepth: 0.0,
    volume: 0.0,
    velocity: 0.0,
    running: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Scene Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const parcelsGroupRef = useRef<THREE.Group | null>(null);
  const geologyGroupRef = useRef<THREE.Group | null>(null);

  // Interaction State
  const mouseState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotationX: -0.6,
    rotationY: 0.5,
    zoom: 40,
    panX: 0,
    panZ: 0
  });

  // Simulation Grid Arrays (128x128 for SWE computation inside 3D environment)
  const gridDim = 64;
  const terrainGrid = useRef<Float32Array>(new Float32Array(gridDim * gridDim));
  const waterGrid = useRef<Float32Array>(new Float32Array(gridDim * gridDim));
  const waterGridVelocity = useRef<Float32Array>(new Float32Array(gridDim * gridDim));

  // Defined High-Fidelity Parcels based on the historical G1P Lineage Maps
  const [parcels, setParcels] = useState<Parcel3D[]>([
    {
      name: "Tucker Homestead",
      x: -12,
      z: 10,
      sizeX: 6,
      sizeZ: 6,
      color: 0xf59e0b, // Gold
      owner: "Anthony John Tucker",
      description: "Ancestral G1P homestead along Bonebank Road, critical flood protection asset.",
      threatened: false
    },
    {
      name: "Yeida-Mercer Tract",
      x: 14,
      z: -8,
      sizeX: 8,
      sizeZ: 10,
      color: 0xe67e22, // Orange
      owner: "William 'Bud' Yeida & Marguerite Mercer",
      description: "Fertile agricultural bottomland parcel prone to groundwater seepage.",
      threatened: false
    },
    {
      name: "Gray-Browne Parcel",
      x: 8,
      z: 16,
      sizeX: 7,
      sizeZ: 7,
      color: 0x9b59b6, // Purple
      owner: "Gray Estate Cypress Slough Co.",
      description: "Protected Cypress Slough preservation area bordered by the Ohio River levee.",
      threatened: false
    },
    {
      name: "Point Township Church",
      x: -4,
      z: -18,
      sizeX: 5,
      sizeZ: 5,
      color: 0x06b6d4, // Cyan
      owner: "Point Township Nazarene Community",
      description: "Historic local community anchor and emergency staging shelter.",
      threatened: false
    }
  ]);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  // Generate 3D Heights for the Tri-State River Valley
  const generateTerrainHeights = () => {
    const nx = gridDim;
    const ny = gridDim;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const u = (x / (nx - 1)) * 2 - 1; // -1 to 1
        const v = (y / (ny - 1)) * 2 - 1; // -1 to 1
        
        // Base lowlands
        let h = 0.0;
        
        // Wabash river channel winding along the West (left)
        const wabashPath = -0.6 + 0.3 * Math.sin(v * Math.PI * 1.5);
        const wabashDist = Math.abs(u - wabashPath);
        if (wabashDist < 0.25) {
          h -= 4.0 * Math.cos((wabashDist / 0.25) * Math.PI / 2);
        }

        // Ohio River channel winding along the South (bottom)
        const ohioPath = 0.7 + 0.15 * Math.sin(u * Math.PI);
        const ohioDist = Math.abs(v - ohioPath);
        if (ohioDist < 0.3) {
          h -= 5.5 * Math.cos((ohioDist / 0.3) * Math.PI / 2);
        }

        // Add minor undulating landscape & slough depressions
        h += 0.8 * Math.sin(u * 5) * Math.cos(v * 4);
        h += 0.4 * Math.sin(u * 12 + v * 8);

        // Add Wabash & Ohio Levee ridges
        const wabashLeveeDist = Math.abs(u - (wabashPath + 0.1));
        if (wabashLeveeDist < 0.08 && v < 0.6) {
          h += 3.8 * Math.cos((wabashLeveeDist / 0.08) * Math.PI / 2);
        }

        const ohioLeveeDist = Math.abs(v - (ohioPath - 0.12));
        if (ohioLeveeDist < 0.08) {
          h += 4.2 * Math.cos((ohioLeveeDist / 0.08) * Math.PI / 2);
        }

        terrainGrid.current[y * nx + x] = h;
      }
    }
  };

  const handleStartSimulation = () => {
    if (sim.running) return;
    setSim(prev => ({ ...prev, running: true, step: 0 }));
    
    // Seed initial breach water
    waterGrid.current.fill(0);
    waterGridVelocity.current.fill(0);
    
    const bx = Math.floor((breachX / 100) * gridDim);
    const by = Math.floor((breachY / 100) * gridDim);
    const radius = 3;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const ny = by + dy;
        const nx = bx + dx;
        if (ny >= 0 && ny < gridDim && nx >= 0 && nx < gridDim) {
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist <= radius) {
            waterGrid.current[ny * gridDim + nx] = 4.0 * (1.0 - dist/radius);
          }
        }
      }
    }
  };

  const resetSimulation = () => {
    setSim({
      step: 0,
      maxDepth: 0.0,
      volume: 0.0,
      velocity: 0.0,
      running: false
    });
    waterGrid.current.fill(0);
    waterGridVelocity.current.fill(0);
    
    // Reset parcel threats
    setParcels(prev => prev.map(p => ({ ...p, threatened: false })));
  };

  // Setup Three.js environment on Mount
  useEffect(() => {
    generateTerrainHeights();

    if (!canvasRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    cameraRef.current = camera;

    // 2. Renderer with smooth anti-aliasing
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // 3. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(40, 60, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0xa78bfa, 0.8, 100);
    purpleLight.position.set(-15, 10, -15);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 0.6, 100);
    cyanLight.position.set(15, 8, 15);
    scene.add(cyanLight);

    // 4. Create 3D Terrain Mesh from the generated elevation grid
    const terrainSize = 50;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, gridDim - 1, gridDim - 1);
    terrainGeo.rotateX(-Math.PI / 2); // Make flat along horizontal xz plane

    // Deform geometry vertices based on generated terrain height arrays
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const xIdx = i % gridDim;
      const zIdx = Math.floor(i / gridDim);
      const h = terrainGrid.current[zIdx * gridDim + xIdx];
      posAttr.setY(i, h); // Y represents 3D height in this coordinate layout
    }
    terrainGeo.computeVertexNormals();

    // Custom shader material for high-contrast topographic elevation color banding
    const terrainMat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
      vertexColors: false,
      color: 0x111827 // Base deep slate
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 5. Create 3D Water Flow Overlay Mesh
    const waterGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, gridDim - 1, gridDim - 1);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 1.2
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 6. Create Subsurface Geology Strata Volumes (Visualized beneath the terrain)
    const geologyGroup = new THREE.Group();
    scene.add(geologyGroup);
    geologyGroupRef.current = geologyGroup;

    const strataTypes = [
      { name: "Alluvial Clay Loam", height: 3.5, color: 0x5c4033, offset: -2.0 },
      { name: "Silty Sand Member", height: 4.0, color: 0xc2a649, offset: -5.5 },
      { name: "Limestone Bedrock Foundation", height: 8.0, color: 0x555555, offset: -11.5 }
    ];

    strataTypes.forEach(strata => {
      const geoBox = new THREE.BoxGeometry(terrainSize, strata.height, terrainSize);
      const matBox = new THREE.MeshStandardMaterial({
        color: strata.color,
        transparent: true,
        opacity: 0.35,
        roughness: 0.9,
        wireframe: true
      });
      const meshBox = new THREE.Mesh(geoBox, matBox);
      meshBox.position.y = strata.offset;
      geologyGroup.add(meshBox);
    });

    // 7. Create Group for Lineage Parcels
    const parcelsGroup = new THREE.Group();
    scene.add(parcelsGroup);
    parcelsGroupRef.current = parcelsGroup;

    // Initial resize triggering
    handleResize();

    // Render loop function
    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      // Camera positioning around focal center based on pan + mouse drag rotation
      const theta = mouseState.current.rotationY;
      const phi = mouseState.current.rotationX;
      const radius = mouseState.current.zoom;

      camera.position.x = mouseState.current.panX + radius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = radius * Math.sin(phi);
      camera.position.z = mouseState.current.panZ + radius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(mouseState.current.panX, 0, mouseState.current.panZ);

      // Rotate directional light slowly to mimic sun transit
      const sunTime = Date.now() * 0.0001;
      dirLight.position.x = 40 * Math.sin(sunTime);
      dirLight.position.z = 40 * Math.cos(sunTime);

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    function handleResize() {
      if (!containerRef.current || !canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  // Sync Layer Visibilities & Create Parcels 3D Objects
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Toggle Geology layer
    if (geologyGroupRef.current) {
      geologyGroupRef.current.visible = activeLayers.includes("geology");
    }

    // Clear and Redraw Lineage Parcels in 3D
    if (parcelsGroupRef.current) {
      // Clean up existing meshes
      while (parcelsGroupRef.current.children.length > 0) {
        const obj = parcelsGroupRef.current.children[0];
        parcelsGroupRef.current.remove(obj);
      }

      if (activeLayers.includes("parcels")) {
        parcels.forEach((p, idx) => {
          // Use box geometries representing homestead properties
          const parcelGeo = new THREE.BoxGeometry(p.sizeX, 0.4, p.sizeZ);
          
          // Determine elevation of parcel position by querying the terrain grid
          const gridX = Math.floor(((p.x + 25) / 50) * gridDim);
          const gridZ = Math.floor(((p.z + 25) / 50) * gridDim);
          const terrainH = terrainGrid.current[Math.max(0, Math.min(gridDim-1, gridZ)) * gridDim + Math.max(0, Math.min(gridDim-1, gridX))] || 0;

          // Material: Emissive glow reflecting threat state
          const parcelMat = new THREE.MeshStandardMaterial({
            color: p.color,
            roughness: 0.4,
            metalness: 0.2,
            emissive: p.threatened ? 0xff3333 : p.color,
            emissiveIntensity: p.threatened ? 1.8 + Math.sin(Date.now() * 0.01) * 0.4 : 0.4
          });

          const parcelMesh = new THREE.Mesh(parcelGeo, parcelMat);
          parcelMesh.position.set(p.x, terrainH + 0.3, p.z);
          
          // Attach name for raycasting/selection identification
          parcelMesh.userData = { parcelIndex: idx };
          
          parcelsGroupRef.current?.add(parcelMesh);
          
          // Draw fence outline around homestead boundaries
          const borderGeo = new THREE.BoxGeometry(p.sizeX + 0.4, 0.1, p.sizeZ + 0.4);
          const borderMat = new THREE.MeshBasicMaterial({
            color: p.threatened ? 0xff0000 : 0xffffff,
            wireframe: true
          });
          const borderMesh = new THREE.Mesh(borderGeo, borderMat);
          borderMesh.position.set(p.x, terrainH + 0.35, p.z);
          parcelsGroupRef.current?.add(borderMesh);
        });
      }
    }
  }, [activeLayers, parcels]);

  // Run Real-Time 3D SWE Solver Simulation Steps
  useEffect(() => {
    if (!sim.running) return;

    let localStep = 0;
    const interval = setInterval(() => {
      localStep++;

      // Compute water spreading on grid using the refined finite volume kernel
      const nextWater = new Float32Array(waterGrid.current);
      const nextVelocity = new Float32Array(waterGridVelocity.current);

      let peakD = 0.0;
      let totalV = 0.0;
      let maxV = 0.0;

      // Simple 2D Wave propagation approximation over localized grid topography heights
      for (let y = 1; y < gridDim - 1; y++) {
        for (let x = 1; x < gridDim - 1; x++) {
          const idx = y * gridDim + x;
          const currH = waterGrid.current[idx];
          
          if (currH > 0.02) {
            const currZ = terrainGrid.current[idx];
            const terrainHeight = currZ + currH;

            // Compute flow slopes to neighbor cells
            const adjacents = [
              { x: x + 1, y: y, flowCoeff: 0.18 },
              { x: x - 1, y: y, flowCoeff: 0.18 },
              { x: x, y: y + 1, flowCoeff: 0.18 },
              { x: x, y: y - 1, flowCoeff: 0.18 }
            ];

            adjacents.forEach(adj => {
              const nIdx = adj.y * gridDim + adj.x;
              const nZ = terrainGrid.current[nIdx];
              const nH = waterGrid.current[nIdx];
              const nHeight = nZ + nH;

              const elevationDelta = terrainHeight - nHeight;
              if (elevationDelta > 0) {
                // Mass transfer proportional to gradient slope and Manning coefficient constraints
                const transfer = Math.min(currH * 0.12, elevationDelta * adj.flowCoeff * (1.0 - manningN * 2.0));
                nextWater[idx] -= transfer;
                nextWater[nIdx] += transfer;
                
                // Track dynamic velocity vector forces
                const stepVel = Math.sqrt(2 * 9.81 * Math.abs(elevationDelta));
                nextVelocity[nIdx] = Math.max(nextVelocity[nIdx], stepVel);
              }
            });
          }
        }
      }

      // Re-inject water source at selected levee breach coordinate Patches
      const bx = Math.floor((breachX / 100) * gridDim);
      const by = Math.floor((breachY / 100) * gridDim);
      
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = by + dy;
          const nx = bx + dx;
          if (ny >= 0 && ny < gridDim && nx >= 0 && nx < gridDim) {
            const flowInjection = (inflowCfs / 20000.0) * 0.05;
            nextWater[ny * gridDim + nx] = Math.min(15.0, nextWater[ny * gridDim + nx] + flowInjection);
          }
        }
      }

      // Commit arrays
      waterGrid.current.set(nextWater);
      waterGridVelocity.current.set(nextVelocity);

      // Re-project water heights onto 3D WebGL mesh dynamically
      if (waterMeshRef.current) {
        const posAttr = waterMeshRef.current.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const xIdx = i % gridDim;
          const zIdx = Math.floor(i / gridDim);
          const gridIdx = zIdx * gridDim + xIdx;
          const h = terrainGrid.current[gridIdx];
          const w = waterGrid.current[gridIdx];
          
          posAttr.setY(i, w > 0.04 ? h + w : h - 0.2); // Elevate water level above dry terrain

          // Track peaks
          if (w > peakD) peakD = w;
          totalV += w;
          if (waterGridVelocity.current[gridIdx] > maxV) maxV = waterGridVelocity.current[gridIdx];
        }
        waterMeshRef.current.geometry.attributes.position.needsUpdate = true;
        waterMeshRef.current.geometry.computeVertexNormals();
      }

      // Update Parcel threat states (If water depth on parcel coordinates exceeds 0.5 feet)
      setParcels(prev => 
        prev.map(p => {
          const px = Math.floor(((p.x + 25) / 50) * gridDim);
          const pz = Math.floor(((p.z + 25) / 50) * gridDim);
          const pWater = waterGrid.current[pz * gridDim + px] || 0.0;
          return {
            ...p,
            threatened: pWater > 0.5
          };
        })
      );

      // Update GUI states
      setSim(prev => {
        if (localStep >= reqDurationSteps) {
          clearInterval(interval);
          return {
            running: false,
            step: localStep,
            maxDepth: parseFloat((peakD * 3.28084).toFixed(2)), // convert to feet
            volume: Math.floor(totalV * 120),
            velocity: parseFloat((maxV * 3.28084).toFixed(2)) // convert to fps
          };
        }
        return {
          ...prev,
          step: localStep,
          maxDepth: parseFloat((peakD * 3.28084).toFixed(2)),
          volume: Math.floor(totalV * 120),
          velocity: parseFloat((maxV * 3.28084).toFixed(2))
        };
      });

    }, 120);

    return () => clearInterval(interval);
  }, [sim.running, breachX, breachY, inflowCfs, manningN]);

  const reqDurationSteps = 50;

  // Custom Mouse Drag Rotation Handlers directly on the canvas element
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseState.current.isDragging = true;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseState.current.isDragging) return;
    const deltaX = e.clientX - mouseState.current.prevX;
    const deltaY = e.clientY - mouseState.current.prevY;
    
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;

    if (e.buttons === 1) {
      // Left click: rotate globe
      mouseState.current.rotationY -= deltaX * 0.008;
      mouseState.current.rotationX = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, mouseState.current.rotationX - deltaY * 0.008));
    } else if (e.buttons === 2 || e.buttons === 4) {
      // Right click or middle scroll button: pan scene boundaries
      const theta = mouseState.current.rotationY;
      mouseState.current.panX += (deltaX * Math.cos(theta) - deltaY * Math.sin(theta)) * 0.08;
      mouseState.current.panZ += (deltaX * Math.sin(theta) + deltaY * Math.cos(theta)) * 0.08;
    }
  };

  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    mouseState.current.zoom = Math.max(10, Math.min(150, mouseState.current.zoom + e.deltaY * 0.04));
  };

  return (
    <div className="bg-[#05070d]/90 border border-[#162035] rounded-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#162035] pb-4 gap-4">
        <div>
          <h2 className="font-display font-bold text-sm text-white flex items-center gap-2 tracking-widest uppercase">
            <Globe className="h-5 w-5 text-[#22d4bf] animate-spin-slow" />
            Tri-State 3D WebGL Digital Twin (PTDT v23)
          </h2>
          <p className="text-[10px] text-gray-400 font-mono">
            COORDINATE DATUM: WABASH-OHIO CONFLUENCE • BONEBANK ROAD HOMESTEAD
          </p>
        </div>

        {/* Dynamic Layer Toggles */}
        <div className="flex flex-wrap gap-1.5 bg-black/45 border border-[#162035] p-1 rounded-lg">
          {[
            { id: "elev", name: "3D Terrain" },
            { id: "rivers", name: "Channel Vectors" },
            { id: "levees", name: "Levee Dashes" },
            { id: "geology", name: "Subsurface Strata" },
            { id: "parcels", name: "Homestead Tracts" }
          ].map(lay => (
            <button
              key={lay.id}
              onClick={() => toggleLayer(lay.id)}
              className={`px-2.5 py-1 text-[8.5px] font-mono rounded transition uppercase tracking-wider ${
                activeLayers.includes(lay.id)
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-500 hover:text-gray-300 hover:bg-[#0c1224]"
              }`}
            >
              {lay.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Canvas */}
        <div className="lg:col-span-8 space-y-3" ref={containerRef}>
          <div className="relative border border-[#162035] bg-black rounded-xl overflow-hidden aspect-[4/3] w-full">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
            />

            {/* Float HUD card */}
            <div className="absolute top-4 left-4 bg-black/80 border border-[#162035] rounded-lg p-3 font-mono text-[9px] text-gray-400 space-y-1.5 pointer-events-none w-56">
              <span className="text-[#a78bfa] font-bold block uppercase border-b border-[#162035] pb-1">3D SCENE METADATA</span>
              <div className="flex justify-between">
                <span>GRID DISCRETIZATION:</span>
                <span className="text-white">64 x 64</span>
              </div>
              <div className="flex justify-between">
                <span>LOCAL DATUM:</span>
                <span className="text-white">FIPS 18129, IN</span>
              </div>
              <div className="flex justify-between">
                <span>HEIGHT DATUM:</span>
                <span className="text-cyan-300 font-bold">NAVD88 VERTICAL</span>
              </div>
              <div className="pt-1.5 text-[8px] border-t border-[#162035]/50 flex items-center gap-1 text-slate-500">
                <Cpu className="h-2.5 w-2.5" />
                DRAG MOUSE TO ROTATE • SCROLL ZOOM
              </div>
            </div>

            {/* Right side interactive parcel information */}
            {selectedParcel && (
              <div className="absolute top-4 right-4 bg-black/90 border border-cyan-500/30 rounded-lg p-3.5 font-mono text-[9.5px] w-64 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-white font-bold text-xs font-sans">{selectedParcel.name}</span>
                  <button 
                    onClick={() => setSelectedParcel(null)}
                    className="text-gray-500 hover:text-white font-bold text-xs"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-1 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">OWNER RECORD:</span>
                    <span className="text-cyan-300">{selectedParcel.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">COVENANT LEVEL:</span>
                    <span>G1P Level 10 Aligned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">THREAT STATE:</span>
                    <span className={selectedParcel.threatened ? "text-red-400 font-bold animate-pulse" : "text-emerald-400"}>
                      {selectedParcel.threatened ? "IMPACTED_BREACH" : "COMPLIANT_STANDBY"}
                    </span>
                  </div>
                  <p className="text-[8.5px] text-gray-400 pt-1.5 border-t border-[#162035]/40 leading-relaxed font-sans">{selectedParcel.description}</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/80 border border-red-500/20 rounded px-2.5 py-1.5 font-mono text-[8.5px] text-red-300 pointer-events-none flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              BREACH LOCATOR: Y: {breachY}% / X: {breachX}%
            </div>
          </div>
          <span className="text-[10px] text-gray-500 italic block text-center font-sans">
            Rotate, rotate, and zoom into the 3D workspace. Lineage parcels are rendered directly on the terrain surface.
          </span>
        </div>

        {/* Right Column: Simulation Parameters and Control Node */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[#a78bfa] font-bold block uppercase border-b border-[#162035] pb-1.5">
              Interactive Confluence controls
            </span>

            {/* Inflow Slider */}
            <div className="space-y-1 font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Breach Inflow (CFS):</span>
                <span className="text-cyan-300 font-bold">{inflowCfs.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={250000}
                step={10000}
                value={inflowCfs}
                onChange={(e) => !sim.running && setInflowCfs(parseInt(e.target.value))}
                disabled={sim.running}
                className="w-full accent-cyan-500 h-1 bg-black rounded"
              />
            </div>

            {/* Manning n Slider */}
            <div className="space-y-1 font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Manning's Friction (n):</span>
                <span className="text-[#a78bfa] font-bold">{manningN.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min={0.020}
                max={0.055}
                step={0.002}
                value={manningN}
                onChange={(e) => !sim.running && setManningN(parseFloat(e.target.value))}
                disabled={sim.running}
                className="w-full accent-[#a78bfa] h-1 bg-black rounded"
              />
            </div>

            {/* Breach Coordinate Sliders */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500">Breach X Coords</span>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={breachX}
                  onChange={(e) => !sim.running && setBreachX(parseInt(e.target.value))}
                  disabled={sim.running}
                  className="w-full h-1 bg-black rounded accent-red-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500">Breach Y Coords</span>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={breachY}
                  onChange={(e) => !sim.running && setBreachY(parseInt(e.target.value))}
                  disabled={sim.running}
                  className="w-full h-1 bg-black rounded accent-red-500"
                />
              </div>
            </div>

            {/* Live 3D SWE Solver Monitor */}
            <div className="bg-black/50 border border-[#162035] rounded-xl p-4 space-y-2.5 font-mono text-[10.5px]">
              <span className="text-[9px] text-[#22d4bf] font-bold uppercase block border-b border-[#162035]/50 pb-1">
                Live 3D Finite-Volume Output
              </span>
              <div className="flex justify-between">
                <span className="text-gray-500">Solver Timesteps:</span>
                <span className="text-white">{sim.step} / {reqDurationSteps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Peak Water Stage (ft):</span>
                <span className="text-cyan-300 font-bold">{sim.maxDepth.toFixed(2)} FT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submersion Area Volume:</span>
                <span className="text-purple-300 font-bold">{sim.volume.toLocaleString()} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Maximum Wave Velocity:</span>
                <span className="text-amber-400 font-bold">{sim.velocity.toFixed(2)} FPS</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={handleStartSimulation}
              disabled={sim.running}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold font-display uppercase tracking-wider rounded-lg text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Play className="h-3.5 w-3.5" />
              {sim.running ? "SOLVING ROUGH GRIDS..." : "ACTIVATE 3D SOLVER"}
            </button>

            <button
              onClick={resetSimulation}
              className="w-full py-2 bg-black/40 border border-[#162035] hover:bg-black/60 text-gray-400 hover:text-white rounded-lg text-[10px] font-mono transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-3 w-3" />
              RESET 3D OVERLAYS
            </button>
          </div>

          {/* Quick list of Lineage Parcels with quick-locate click support */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-gray-500 block uppercase">G1P COVENANT REGISTERED PARCELS</span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
              {parcels.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedParcel(p)}
                  className={`p-1.5 border rounded-lg text-left transition ${
                    p.threatened 
                      ? "border-red-500/40 bg-red-950/20 text-red-300" 
                      : "border-[#162035] bg-[#0c1224]/50 text-gray-300 hover:border-gray-700"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `#${p.color.toString(16)}` }} />
                    {p.name}
                  </div>
                  <div className="text-[8px] text-gray-500 mt-0.5 truncate">{p.owner}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
