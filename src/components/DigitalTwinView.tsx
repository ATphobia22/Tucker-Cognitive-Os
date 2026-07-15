import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGPURenderer, MeshBasicNodeMaterial } from 'three/webgpu';
import { color, positionLocal, vec3, uniform, mix, select, greaterThan, time, sin } from 'three/tsl';
import { ShieldAlert, Plus, Play, Pause, Thermometer, Waves, X, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ParcelInfo {
  id: string;
  tractName: string;
  lineageGroup: string;
  threatScore: number;
  isInundated: boolean;
  historicalNote: string;
  historicalEvents: string;
  grantEligibility: string;
}

export function DigitalTwinView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlacingBerm, setIsPlacingBerm] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  const [selectedParcel, setSelectedParcel] = useState<ParcelInfo | null>(null);

  const isPlacingBermRef = useRef(false);
  const showHeatmapRef = useRef(false);
  const [waterDepth, setWaterDepth] = useState(0.1);
  const waterDepthUniformRef = useRef<any>(null);
  const heatmapUniformRef = useRef<any>(null);
  
  useEffect(() => {
    isPlacingBermRef.current = isPlacingBerm;
  }, [isPlacingBerm]);

  useEffect(() => {
    showHeatmapRef.current = showHeatmap;
    if (heatmapUniformRef.current) {
      heatmapUniformRef.current.value = showHeatmap ? 1.0 : 0.0;
    }
  }, [showHeatmap]);

  useEffect(() => {
    const nav = navigator as any;
    if (!containerRef.current || !nav.gpu) return;
    
    let isMounted = true;
    
    async function initWebGPU() {
      const container = containerRef.current!;
      const renderer = new WebGPURenderer({ antialias: true, alpha: true });
      rendererRef.current = renderer;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
      camera.position.set(0, 55, 95);
      camera.lookAt(0, 0, 0);
      
      // Grid helper for terrain base
      const gridHelper = new THREE.GridHelper(100, 50, 0x1e293b, 0x0f172a);
      scene.add(gridHelper);

      // TSL Uniforms
      const waterDepthUniform = uniform(waterDepth);
      waterDepthUniformRef.current = waterDepthUniform;
      
      const heatmapUniform = uniform(showHeatmapRef.current ? 1.0 : 0.0);
      heatmapUniformRef.current = heatmapUniform;
      
      const lineatTractColorUniform = uniform(vec3(0.0, 0.45, 0.85));

      const localCoords = positionLocal;
      const flowDisplacement = sin(localCoords.x.mul(0.1).add(time.mul(0.8)));

      const depthColor = select(
          greaterThan(waterDepthUniform, 2.25),
          mix(vec3(1.0, 0.1, 0.1), vec3(1.0, 1.0, 1.0), flowDisplacement.mul(0.2)),
          mix(lineatTractColorUniform, vec3(0.0, 1.0, 0.5), localCoords.y.mul(0.02))
      );
      
      const heatColor = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), localCoords.y.add(10).mul(0.05));

      const dynamicColorNode = select(
          greaterThan(heatmapUniform, 0.5),
          heatColor,
          depthColor
      );

      // @ts-ignore
      const material = new MeshBasicNodeMaterial();
      material.colorNode = dynamicColorNode;
      material.wireframe = true;
      material.transparent = true;
      material.opacity = 0.8;

      const geometry = new THREE.PlaneGeometry(100, 100, 50, 50).rotateX(-Math.PI / 2);
      
      // Modify vertices to create a river valley shape
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        // Valley depression in the middle
        const valley = Math.abs(x) < 20 ? (Math.cos(x * Math.PI / 40) * -10) : 0;
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
        positions.setY(i, valley + noise);
      }
      geometry.computeVertexNormals();

      const terrainMesh = new THREE.Mesh(geometry, material);
      terrainMesh.position.y = 5; // Raise slightly above grid
      scene.add(terrainMesh);

      // Create interactive parcels
      const parcelMeshes: THREE.Mesh[] = [];
      const parcelDataMap = new Map<THREE.Mesh, ParcelInfo>();
      
      const parcelGeo = new THREE.BoxGeometry(2, 2, 2);
      const parcelMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.9 });
      const parcelMatDanger = new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.9 });

      const addParcel = (x: number, z: number, info: ParcelInfo) => {
        const mesh = new THREE.Mesh(parcelGeo, info.threatScore > 65 ? parcelMatDanger : parcelMat);
        // compute approx Y on the terrain
        const valley = Math.abs(x) < 20 ? (Math.cos(x * Math.PI / 40) * -10) : 0;
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
        mesh.position.set(x, 5 + valley + noise + 1, z);
        scene.add(mesh);
        parcelMeshes.push(mesh);
        parcelDataMap.set(mesh, info);
      };

      addParcel(-15, 10, {
        id: "PRCL_TUCKER_01",
        tractName: "Tucker Homestead",
        lineageGroup: "Tucker",
        threatScore: 25.5,
        isInundated: false,
        historicalNote: "Original 1820s settlement boundaries.",
        historicalEvents: "Survived 1937 Great Ohio River Flood",
        grantEligibility: "FEMA_BRIC_2026 Eligible"
      });
      addParcel(5, -5, {
        id: "PRCL_YEIDA_01",
        tractName: "Yeida North Fork",
        lineageGroup: "Yeida",
        threatScore: 82.1,
        isInundated: true,
        historicalNote: "German immigrant era land grant.",
        historicalEvents: "Severe damage during 1991 flash floods",
        grantEligibility: "IN_DNR_MIG_2026 High Priority"
      });
      addParcel(-22, -15, {
        id: "PRCL_SMITH_04",
        tractName: "Smith Elevation",
        lineageGroup: "Smith",
        threatScore: 12.0,
        isInundated: false,
        historicalNote: "Elevated plot acquired in 1950.",
        historicalEvents: "No major inundations recorded",
        grantEligibility: "Standard Relief Tier 3"
      });


      // Berm Placement / Parcel Selection Raycaster
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onPointerDown = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // First check if we clicked a parcel
        const parcelIntersects = raycaster.intersectObjects(parcelMeshes);
        if (parcelIntersects.length > 0) {
          const pMesh = parcelIntersects[0].object as THREE.Mesh;
          const info = parcelDataMap.get(pMesh);
          if (info) {
            setSelectedParcel(info);
          }
          return; // Stop if we hit a parcel
        }

        // If placing a berm, check terrain intersection
        if (isPlacingBermRef.current) {
          const intersects = raycaster.intersectObject(terrainMesh);
          if (intersects.length > 0) {
            const intersect = intersects[0];
            const point = intersect.point;
            
            const radius = 6;
            const raiseAmount = 4;
            
            const pos = geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
              const vx = pos.getX(i);
              const vy = pos.getY(i);
              const vz = pos.getZ(i);
              const dist = Math.sqrt((vx - point.x)**2 + (vz - point.z)**2);
              if (dist < radius) {
                  const falloff = 1 - (dist / radius);
                  pos.setY(i, vy + raiseAmount * falloff);
              }
            }
            pos.needsUpdate = true;
            geometry.computeVertexNormals();
          }
        } else {
          // Deselect parcel if we clicked empty space
          setSelectedParcel(null);
        }
      };
      
      container.addEventListener('pointerdown', onPointerDown);

      // Wait for renderer initialization
      await renderer.init();
      
      if (!isMounted) return;

      renderer.setAnimationLoop(() => {
        if (!isPlacingBermRef.current) {
          terrainMesh.rotation.y += 0.001;
          // Rotate parcels with terrain
          const rotMatrix = new THREE.Matrix4().makeRotationY(0.001);
          for (const mesh of parcelMeshes) {
            mesh.position.applyMatrix4(rotMatrix);
            // also rotate the box itself slightly for effect
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
          }
        }
        renderer.render(scene, camera);
      });
      
      const handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('pointerdown', onPointerDown);
      };
    }
    
    initWebGPU().catch(e => console.error("WebGPU initialization failed:", e));
    
    return () => {
      isMounted = false;
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (waterDepthUniformRef.current) {
      waterDepthUniformRef.current.value = waterDepth;
    }
  }, [waterDepth]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setWaterDepth(prev => {
          const newDepth = prev + 0.1;
          if (newDepth > 5) return 0.1; // reset
          return newDepth;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="w-full h-full relative bg-[#020617] text-slate-100 flex overflow-hidden">
      {/* 3D Canvas Area */}
      <div className="flex-1 relative">
        {!(navigator as any).gpu && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#020617]/80 backdrop-blur-sm">
            <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 max-w-md text-center">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-100 mb-2">WebGPU Not Supported</h3>
              <p className="text-sm text-red-200/70">
                Your browser does not support WebGPU, which is required for the Tri-State Digital Twin visualization engine. Please use Chrome 113+ or Edge 113+.
              </p>
            </div>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0 cursor-crosshair" />
        
        {/* Overlays */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <div className="bg-[#0F172A]/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 min-w-[280px]">
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Waves className="w-5 h-5 text-indigo-400" />
              WebGPU Twin Engine
            </h2>
            <p className="text-xs text-slate-400 font-mono mb-4">Wabash-Ohio Confluence Model</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Simulation Status</span>
                <span className={cn("text-xs font-mono px-2 py-0.5 rounded", isSimulating ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
                  {isSimulating ? "ACTIVE" : "STANDBY"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Water Depth</span>
                <span className={cn("text-sm font-mono font-bold", waterDepth > 2.25 ? "text-red-400" : "text-indigo-400")}>
                  {waterDepth.toFixed(2)}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Risk Threshold</span>
                <span className="text-sm font-mono text-slate-300">2.25m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parcel Lineage Popup */}
        {selectedParcel && (
          <div className="absolute top-6 right-6 z-20 w-80 bg-[#0F172A]/90 backdrop-blur-xl border border-teal-500/30 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="relative p-5">
              <button 
                onClick={() => setSelectedParcel(null)}
                className="absolute top-4 right-4 text-teal-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="text-[10px] text-teal-400/80 font-mono tracking-widest mb-1 flex items-center gap-1.5">
                <Info size={12} />
                ANCESTRAL PARCEL
              </div>
              
              <h3 className="text-xl font-bold tracking-tight text-white mb-0.5">
                {selectedParcel.tractName}
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-5">{selectedParcel.id}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Lineage Group</div>
                  <div className="font-medium text-slate-200">{selectedParcel.lineageGroup}</div>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Threat Score</div>
                  <div className={cn("font-bold font-mono", selectedParcel.threatScore > 70 ? 'text-red-500' : 'text-emerald-400')}>
                    {selectedParcel.threatScore.toFixed(1)}
                  </div>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800 col-span-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Current Status</div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", selectedParcel.isInundated ? "bg-red-500" : "bg-emerald-500")} />
                    <span className={cn("font-medium text-sm", selectedParcel.isInundated ? "text-red-400" : "text-emerald-400")}>
                      {selectedParcel.isInundated ? 'INUNDATED' : 'DRY'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Historical Context</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
                    {selectedParcel.historicalNote}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Flood Events</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
                    {selectedParcel.historicalEvents}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Grant Eligibility</h4>
                  <div className="text-sm text-indigo-300 font-mono bg-indigo-900/20 p-2.5 rounded-lg border border-indigo-500/20">
                    {selectedParcel.grantEligibility}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-teal-950/30 border-t border-teal-500/20 p-3 flex justify-between items-center text-xs">
              <span className="text-teal-400/60 font-mono">NODE_LINK_ACTIVE</span>
              <button className="text-teal-400 hover:text-teal-300 font-medium">
                View Full Dossier →
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4 bg-[#0F172A]/80 backdrop-blur-md border border-slate-800 p-2 rounded-xl">
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
              isSimulating 
                ? "bg-slate-800 hover:bg-slate-700 text-white" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            )}
          >
            {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            {isSimulating ? "Halt Simulation" : "Run Inundation"}
          </button>
          <div className="w-px bg-slate-800 mx-1" />
          <button 
            onClick={() => {
              setIsPlacingBerm(!isPlacingBerm);
              if (!isPlacingBerm) setSelectedParcel(null); // deselect when placing berms
            }}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all", isPlacingBerm && "bg-indigo-600 text-white hover:bg-indigo-500")}
          >
            <Plus size={16} />
            {isPlacingBerm ? "Stop Placing" : "Place Berm"}
          </button>
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all", showHeatmap && "bg-emerald-600 text-white hover:bg-emerald-500")}
          >
            <Thermometer size={16} />
            Heatmap
          </button>
        </div>
      </div>
      
      {/* Right Sidebar - Analytics */}
      <div className="w-80 border-l border-slate-800 bg-[#0F172A] flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold">Real-Time Metrics</h3>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hydrology Node (PT-001)</div>
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
              <div className="text-2xl font-light font-mono text-emerald-400">
                {(3500 + waterDepth * 2000).toFixed(0)} <span className="text-sm text-slate-500">cfs</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Discharge Rate</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Geotechnical Status</div>
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
              <div className={cn("text-2xl font-light font-mono", waterDepth > 2.25 ? "text-red-400" : "text-emerald-400")}>
                {Math.max(1.0, 3.5 - waterDepth * 0.5).toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Factor of Safety (FoS)</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Compliance Engine</div>
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
              <div className={cn("text-sm font-bold", waterDepth > 2.25 ? "text-red-400" : "text-emerald-400")}>
                {waterDepth > 2.25 ? "VIOLATION DETECTED" : "COMPLIANT_NO_RISE"}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                {waterDepth > 2.25 ? "Depth exceeds FEMA maximum allowance (2.25m)." : "All state No-Rise limits currently satisfied."}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Event Log</div>
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 h-40 overflow-y-auto space-y-2 font-mono text-[10px]">
              <div className="text-emerald-400">[{new Date().toISOString().split('T')[1].slice(0, 8)}] Engine initialized.</div>
              {waterDepth > 2.25 && (
                <div className="text-red-400">[{new Date().toISOString().split('T')[1].slice(0, 8)}] CRITICAL_HAZARD: Breach detected in Wabash Confluence.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
