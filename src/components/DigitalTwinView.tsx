import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGPURenderer, MeshBasicNodeMaterial } from 'three/webgpu';
import { color, positionLocal, vec3, uniform, mix, select, greaterThan, time, sin } from 'three/tsl';
import { ShieldAlert, Plus, Play, Pause, Thermometer, Waves } from 'lucide-react';
import { cn } from '../lib/utils';

export function DigitalTwinView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlacingBerm, setIsPlacingBerm] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
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

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 5; // Raise slightly above grid
      scene.add(mesh);

      // Berm Placement Raycaster
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onPointerDown = (event: PointerEvent) => {
        if (!isPlacingBermRef.current) return;
        
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mesh);

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
      };
      
      container.addEventListener('pointerdown', onPointerDown);

      // Wait for renderer initialization
      await renderer.init();
      
      if (!isMounted) return;

      renderer.setAnimationLoop(() => {
        if (!isPlacingBermRef.current) {
          mesh.rotation.y += 0.001;
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
        <div ref={containerRef} className="absolute inset-0" />
        
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
            onClick={() => setIsPlacingBerm(!isPlacingBerm)}
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
