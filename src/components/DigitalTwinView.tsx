import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGPURenderer, MeshBasicNodeMaterial } from 'three/webgpu';
import { color, positionLocal, vec3, uniform, mix, select, greaterThan, time, sin } from 'three/tsl';
import { ShieldAlert, Plus, Play, Pause, Thermometer, Waves, X, Info, Maximize, Minimize, FileText } from 'lucide-react';
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
  const viewWrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlacingBerm, setIsPlacingBerm] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [selectedParcel, setSelectedParcel] = useState<ParcelInfo | null>(null);
  const [showDossier, setShowDossier] = useState(false);

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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (viewWrapperRef.current && typeof viewWrapperRef.current.requestFullscreen === 'function') {
        viewWrapperRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        console.warn('Fullscreen API is not supported in this environment/iframe context.');
      }
    } else {
      if (typeof document.exitFullscreen === 'function') {
        document.exitFullscreen().catch(err => {
          console.error(`Error exiting fullscreen: ${err.message}`);
        });
      }
    }
  };

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
      const originalColors = new Map<THREE.Mesh, THREE.Color>();
      
      const parcelGeo = new THREE.BoxGeometry(2, 2, 2);
      const parcelMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.9 });
      const parcelMatDanger = new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.9 });

      const addParcel = (x: number, z: number, info: ParcelInfo) => {
        const mesh = new THREE.Mesh(parcelGeo, info.threatScore > 65 ? parcelMatDanger.clone() : parcelMat.clone());
        // compute approx Y on the terrain
        const valley = Math.abs(x) < 20 ? (Math.cos(x * Math.PI / 40) * -10) : 0;
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
        mesh.position.set(x, 5 + valley + noise + 1, z);
        scene.add(mesh);
        parcelMeshes.push(mesh);
        parcelDataMap.set(mesh, info);
        originalColors.set(mesh, (mesh.material as THREE.MeshBasicMaterial).color.clone());
      };

      addParcel(-15, 10, {
        id: "PRCL_TUCKER_01",
        tractName: "Tucker Homestead",
        lineageGroup: "Tucker",
        threatScore: 25.5,
        isInundated: false,
        historicalNote: "Original 1820s settlement boundaries. Significant elevation delta limits standard flood exposure.",
        historicalEvents: "Survived 1937 Great Ohio River Flood",
        grantEligibility: "FEMA_BRIC_2026 Eligible"
      });
      addParcel(5, -5, {
        id: "PRCL_YEIDA_01",
        tractName: "Yeida North Fork",
        lineageGroup: "Yeida",
        threatScore: 82.1,
        isInundated: true,
        historicalNote: "German immigrant era land grant. Highly vulnerable lowland area.",
        historicalEvents: "Severe damage during 1991 flash floods",
        grantEligibility: "IN_DNR_MIG_2026 High Priority"
      });
      addParcel(-22, -15, {
        id: "PRCL_SMITH_04",
        tractName: "Smith Elevation",
        lineageGroup: "Smith",
        threatScore: 12.0,
        isInundated: false,
        historicalNote: "Elevated plot acquired in 1950. Requires no immediate action.",
        historicalEvents: "No major inundations recorded",
        grantEligibility: "Standard Relief Tier 3"
      });

      // Brush Cursor for Berm Placement
      const brushGeo = new THREE.RingGeometry(4.5, 5.5, 32);
      const brushMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
      const brushMesh = new THREE.Mesh(brushGeo, brushMat);
      brushMesh.rotation.x = -Math.PI / 2;
      brushMesh.visible = false;
      scene.add(brushMesh);

      // Berm Placement Raycaster
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hoveredMesh: THREE.Mesh | null = null;

      const updateRaycaster = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
      };

      let isDraggingBerm = false;

      const placeBermAtPoint = (point: THREE.Vector3, intensity: number = 1.0) => {
        const radius = 6;
        const raiseAmount = 4 * intensity;
        const maxHeight = 12; // cap height to prevent infinite spikes during drag
        
        const pos = geometry.attributes.position;
        let changed = false;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const vz = pos.getZ(i);
          const dist = Math.sqrt((vx - point.x)**2 + (vz - point.z)**2);
          if (dist < radius) {
              const falloff = 1 - (dist / radius);
              const newY = vy + raiseAmount * falloff;
              if (newY < maxHeight) {
                pos.setY(i, newY);
                changed = true;
              }
          }
        }
        if (changed) {
          pos.needsUpdate = true;
          geometry.computeVertexNormals();
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        updateRaycaster(event);

        // Hover effect for parcels
        if (!isPlacingBermRef.current) {
          const parcelIntersects = raycaster.intersectObjects(parcelMeshes);
          if (parcelIntersects.length > 0) {
            container.style.cursor = 'pointer';
            const pMesh = parcelIntersects[0].object as THREE.Mesh;
            if (hoveredMesh !== pMesh) {
              if (hoveredMesh) {
                (hoveredMesh.material as THREE.MeshBasicMaterial).color.copy(originalColors.get(hoveredMesh)!);
              }
              hoveredMesh = pMesh;
              (pMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff); // Highlight
            }
          } else {
            container.style.cursor = 'default';
            if (hoveredMesh) {
              (hoveredMesh.material as THREE.MeshBasicMaterial).color.copy(originalColors.get(hoveredMesh)!);
              hoveredMesh = null;
            }
          }
          brushMesh.visible = false;
        } else {
          // Placing Berm Mode
          container.style.cursor = 'crosshair';
          if (hoveredMesh) {
            (hoveredMesh.material as THREE.MeshBasicMaterial).color.copy(originalColors.get(hoveredMesh)!);
            hoveredMesh = null;
          }

          const terrainIntersects = raycaster.intersectObject(terrainMesh);
          if (terrainIntersects.length > 0) {
            brushMesh.visible = true;
            brushMesh.position.copy(terrainIntersects[0].point);
            brushMesh.position.y += 0.2; 
            
            if (isDraggingBerm) {
              placeBermAtPoint(terrainIntersects[0].point, 0.3); // Apply smaller raise while dragging
            }
          } else {
            brushMesh.visible = false;
          }
        }
      };

      const onPointerDown = (event: PointerEvent) => {
        updateRaycaster(event);

        // First check if we clicked a parcel
        const parcelIntersects = raycaster.intersectObjects(parcelMeshes);
        if (parcelIntersects.length > 0 && !isPlacingBermRef.current) {
          const pMesh = parcelIntersects[0].object as THREE.Mesh;
          const info = parcelDataMap.get(pMesh);
          if (info) {
            setSelectedParcel(info);
          }
          return;
        }

        // If placing a berm, check terrain intersection
        if (isPlacingBermRef.current) {
          isDraggingBerm = true;
          const intersects = raycaster.intersectObject(terrainMesh);
          if (intersects.length > 0) {
            placeBermAtPoint(intersects[0].point, 1.0); // Full raise on initial click
          }
        } else {
          setSelectedParcel(null);
        }
      };
      
      const onPointerUp = () => {
        isDraggingBerm = false;
      };
      
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);

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
        window.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointermove', onPointerMove);
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
    <div ref={viewWrapperRef} className="w-full h-full relative dark:bg-[#020617] bg-slate-50 dark:text-slate-100 text-slate-900 flex overflow-hidden">
      {/* 3D Canvas Area */}
      <div className="flex-1 relative">
        {!(navigator as any).gpu && (
          <div className="absolute inset-0 flex items-center justify-center z-10 dark:bg-[#020617] bg-slate-50/80 backdrop-blur-sm">
            <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 max-w-md text-center">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-100 mb-2">WebGPU Not Supported</h3>
              <p className="text-sm text-red-200/70">
                Your browser does not support WebGPU, which is required for the Tri-State Digital Twin visualization engine. Please use Chrome 113+ or Edge 113+.
              </p>
            </div>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0 transition-cursor" />
        
        {/* Overlays */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <div className="dark:bg-[#0F172A] bg-white/80 backdrop-blur-md border dark:border-slate-800 border-slate-200 rounded-xl p-4 min-w-[280px]">
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Waves className="w-5 h-5 text-indigo-400" />
              WebGPU Twin Engine
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mb-4">Wabash-Ohio Confluence Model</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-slate-400 text-slate-500">Simulation Status</span>
                <span className={cn("text-xs font-mono px-2 py-0.5 rounded", isSimulating ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
                  {isSimulating ? "ACTIVE" : "STANDBY"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-slate-400 text-slate-500">Water Depth</span>
                <span className={cn("text-sm font-mono font-bold", waterDepth > 2.25 ? "text-red-400" : "text-indigo-400")}>
                  {waterDepth.toFixed(2)}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-slate-400 text-slate-500">Risk Threshold</span>
                <span className="text-sm font-mono dark:text-slate-300 text-slate-700">2.25m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 z-10 p-2.5 rounded-lg dark:bg-[#0F172A] bg-white/80 backdrop-blur-md border dark:border-slate-800 border-slate-200 dark:text-slate-400 text-slate-500 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* Parcel Lineage Popup */}
        {selectedParcel && !showDossier && (
          <div className="absolute top-20 right-6 z-20 w-80 dark:bg-[#0F172A] bg-white/95 backdrop-blur-xl border border-teal-500/30 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
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
              <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mb-5">{selectedParcel.id}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="dark:bg-slate-900 bg-slate-100/50 rounded-lg p-2.5 border dark:border-slate-800 border-slate-200">
                  <div className="text-[10px] dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-1">Lineage Group</div>
                  <div className="font-medium dark:text-slate-200 text-slate-800">{selectedParcel.lineageGroup}</div>
                </div>
                
                <div className="dark:bg-slate-900 bg-slate-100/50 rounded-lg p-2.5 border dark:border-slate-800 border-slate-200">
                  <div className="text-[10px] dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-1">Threat Score</div>
                  <div className={cn("font-bold font-mono", selectedParcel.threatScore > 70 ? 'text-red-500' : 'text-emerald-400')}>
                    {selectedParcel.threatScore.toFixed(1)}
                  </div>
                </div>
                
                <div className="dark:bg-slate-900 bg-slate-100/50 rounded-lg p-2.5 border dark:border-slate-800 border-slate-200 col-span-2">
                  <div className="text-[10px] dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-1">Current Status</div>
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
                  <h4 className="text-[10px] dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-1">Historical Context</h4>
                  <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed dark:bg-slate-900 bg-slate-100/30 p-3 rounded-lg border dark:border-slate-800 border-slate-200/50">
                    {selectedParcel.historicalNote}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-1">Grant Eligibility Assessment</h4>
                  <div className="text-sm text-indigo-300 font-mono bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20 space-y-2">
                    <div className="flex justify-between border-b border-indigo-500/20 pb-1">
                      <span className="text-indigo-400/70">Calculated Threat Index:</span>
                      <span className="font-bold">{selectedParcel.threatScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between border-b border-indigo-500/20 pb-1">
                      <span className="text-indigo-400/70">Federal Match (FEMA):</span>
                      <span className="font-bold">{selectedParcel.threatScore > 50 ? '75%' : '0%'}</span>
                    </div>
                    <div className="flex justify-between border-b border-indigo-500/20 pb-1">
                      <span className="text-indigo-400/70">State Match (IDNR):</span>
                      <span className="font-bold">{selectedParcel.threatScore > 75 ? '85%' : '0%'}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-indigo-400/70 block mb-1">Status:</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold",
                        selectedParcel.threatScore > 75 ? "bg-emerald-500/20 text-emerald-400" :
                        selectedParcel.threatScore > 50 ? "bg-amber-500/20 text-amber-400" :
                        "dark:bg-slate-800 bg-white dark:text-slate-400 text-slate-500"
                      )}>
                        {selectedParcel.threatScore > 75 ? "IN_DNR_MIG_2026 High Priority" :
                         selectedParcel.threatScore > 50 ? "FEMA_BRIC_2026 Eligible" :
                         "Standard Relief Tier 3"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-teal-950/30 border-t border-teal-500/20 p-3 flex justify-between items-center text-xs">
              <span className="text-teal-400/60 font-mono">NODE_LINK_ACTIVE</span>
              <button 
                onClick={() => setShowDossier(true)}
                className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
              >
                View Full Dossier <FileText size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4 dark:bg-[#0F172A] bg-white/80 backdrop-blur-md border dark:border-slate-800 border-slate-200 p-2 rounded-xl">
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
              isSimulating 
                ? "dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-200 text-white" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            )}
          >
            {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            {isSimulating ? "Halt Simulation" : "Run Inundation"}
          </button>
          <div className="w-px dark:bg-slate-800 bg-white mx-1" />
          <button 
            onClick={() => {
              setIsPlacingBerm(!isPlacingBerm);
              if (!isPlacingBerm) setSelectedParcel(null); // deselect when placing berms
            }}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-700 font-medium text-sm transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]", isPlacingBerm && "bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)]")}
          >
            <Plus size={16} />
            {isPlacingBerm ? "Stop Placing" : "Place Berm"}
          </button>
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-700 font-medium text-sm transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]", showHeatmap && "bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]")}
          >
            <Thermometer size={16} />
            Heatmap
          </button>
        </div>
      </div>
      
      {/* Right Sidebar - Analytics */}
      {!isFullscreen && (
        <div className="w-80 border-l dark:border-slate-800 border-slate-200 dark:bg-[#0F172A] bg-white flex flex-col shrink-0 z-10">
          <div className="p-4 border-b dark:border-slate-800 border-slate-200">
            <h3 className="font-bold">Real-Time Metrics</h3>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <div className="text-xs dark:text-slate-500 text-slate-400 font-medium uppercase tracking-wider">Hydrology Node (PT-001)</div>
              <div className="dark:bg-slate-900 bg-slate-100 rounded-lg p-3 border dark:border-slate-800 border-slate-200">
                <div className="text-2xl font-light font-mono text-emerald-400">
                  {(3500 + waterDepth * 2000).toFixed(0)} <span className="text-sm dark:text-slate-500 text-slate-400">cfs</span>
                </div>
                <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">Discharge Rate</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs dark:text-slate-500 text-slate-400 font-medium uppercase tracking-wider">Geotechnical Status</div>
              <div className="dark:bg-slate-900 bg-slate-100 rounded-lg p-3 border dark:border-slate-800 border-slate-200">
                <div className={cn("text-2xl font-light font-mono", waterDepth > 2.25 ? "text-red-400" : "text-emerald-400")}>
                  {Math.max(1.0, 3.5 - waterDepth * 0.5).toFixed(2)}
                </div>
                <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">Factor of Safety (FoS)</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs dark:text-slate-500 text-slate-400 font-medium uppercase tracking-wider">Compliance Engine</div>
              <div className="dark:bg-slate-900 bg-slate-100 rounded-lg p-3 border dark:border-slate-800 border-slate-200">
                <div className={cn("text-sm font-bold", waterDepth > 2.25 ? "text-red-400" : "text-emerald-400")}>
                  {waterDepth > 2.25 ? "VIOLATION DETECTED" : "COMPLIANT_NO_RISE"}
                </div>
                <div className="text-xs dark:text-slate-400 text-slate-500 mt-2">
                  {waterDepth > 2.25 ? "Depth exceeds FEMA maximum allowance (2.25m)." : "All state No-Rise limits currently satisfied."}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs dark:text-slate-500 text-slate-400 font-medium uppercase tracking-wider">Event Log</div>
              <div className="dark:bg-slate-900 bg-slate-100 rounded-lg p-3 border dark:border-slate-800 border-slate-200 h-40 overflow-y-auto space-y-2 font-mono text-[10px]">
                <div className="text-emerald-400">[{new Date().toISOString().split('T')[1].slice(0, 8)}] Engine initialized.</div>
                {waterDepth > 2.25 && (
                  <div className="text-red-400">[{new Date().toISOString().split('T')[1].slice(0, 8)}] CRITICAL_HAZARD: Breach detected in Wabash Confluence.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Dossier Modal */}
      {showDossier && selectedParcel && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="dark:bg-[#0F172A] bg-white border border-indigo-500/30 rounded-xl w-full max-w-3xl flex flex-col max-h-full shadow-2xl">
            
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-slate-100/50 rounded-t-xl">
              <div>
                <h3 className="font-bold text-lg dark:text-slate-100 text-slate-900 flex items-center gap-2">
                  <FileText className="text-indigo-400" size={20} />
                  DLT Infrastructure Asset Verification Pack
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mt-1">Target Zone: {selectedParcel.tractName} | ID: {selectedParcel.id}</p>
              </div>
              <button 
                onClick={() => setShowDossier(false)}
                className="p-2 rounded hover:dark:bg-slate-800 bg-white dark:text-slate-400 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 font-mono text-sm leading-relaxed dark:text-slate-300 text-slate-700 space-y-6">
              
              <div>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase tracking-widest text-xs border-b border-indigo-900/50 pb-2">Executive Framework Summary</h4>
                <p>
                  The infrastructure properties matching the target zone <strong className="dark:text-slate-100 text-slate-900">{selectedParcel.tractName}</strong> have been computed against multi-physics hazard layers. This package enforces compliance constraints regulated under checking authority rules.
                </p>
              </div>

              <div>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase tracking-widest text-xs border-b border-indigo-900/50 pb-2">Financial Apportionment Matrix</h4>
                <div className="dark:bg-[#020617] bg-slate-50 border dark:border-slate-800 border-slate-200 rounded p-4">
                  <div className="flex justify-between border-b dark:border-slate-800 border-slate-200 pb-2 mb-2 font-bold dark:text-slate-200 text-slate-800">
                    <span>Parameter Key</span>
                    <span>Calculated Metric Value</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="dark:text-slate-400 text-slate-500">Federal Contribution Percentage</span>
                    <span>75.0%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="dark:text-slate-400 text-slate-500">Local Matching Responsibility</span>
                    <span>25.0%</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-emerald-400 mt-2 pt-2 border-t dark:border-slate-800 border-slate-200/50">
                    <span>Evaluated Benefit-Cost Ratio (BCR)</span>
                    <span>BCR = 2.45</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase tracking-widest text-xs border-b border-indigo-900/50 pb-2">Analytical Risk Optimization Proofs</h4>
                <p className="mb-2">
                  Historical Records: {selectedParcel.historicalEvents}
                </p>
                <p>
                  Calculated threat exposure yields a severity index of <span className={selectedParcel.threatScore > 50 ? 'text-red-400' : 'text-emerald-400'}>{selectedParcel.threatScore.toFixed(2)}</span>.
                  Current multi-physics simulations indicate {selectedParcel.isInundated ? 'ACTIVE INUNDATION' : 'NO INUNDATION'}.
                </p>
              </div>

              <div>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase tracking-widest text-xs border-b border-indigo-900/50 pb-2">Regulatory Compliance Mandates Verified</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Indiana State Rule 61 Validation</li>
                  <li>Certified No-Rise Check</li>
                  <li>{selectedParcel.grantEligibility}</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t dark:border-slate-800 border-slate-200">
                <h4 className="dark:text-slate-100 text-slate-900 font-bold mb-1">Civil Engineering Certification Sign-Off</h4>
                <p className="text-xs dark:text-slate-400 text-slate-500 mb-6">
                  The undersigned processing system certifies that the simulated structural upgrade yields a net-zero displacement profile across the adjacent cross-border properties.
                </p>
                <div className="w-64 border-b border-slate-600 mb-2"></div>
                <p className="text-xs font-bold dark:text-slate-300 text-slate-700">Lead Automated Systems Engineer</p>
                <p className="text-[10px] dark:text-slate-500 text-slate-400">DLT Multi-Physics Twin Platform Workspace</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
