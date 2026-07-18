import React, { useEffect, useRef, useState } from 'react';

export function CesiumTwinView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const viewerRef = useRef<any>(null);
  const floodEntityRef = useRef<any>(null);
  const [floodStage, setFloodStage] = useState(330);
  
  useEffect(() => {
    if (window.Cesium) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Cesium.js';
    script.async = true;
    
    const link = document.createElement('link');
    link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Widgets/widgets.css';
    link.rel = 'stylesheet';

    script.onload = () => setIsLoaded(true);

    document.head.appendChild(link);
    document.head.appendChild(script);

    return () => {
      // Optional: don't remove so we don't reload it every time tab switches
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;
    const Cesium = (window as any).Cesium;

    // Use a free Ion token if needed, or omit. The PDF uses 'YOUR_TOKEN_HERE'
    // but the asset 2275207 is Google Photorealistic 3D Tiles, which usually requires a token.
    // If the user didn't provide one, we'll try to just load it or provide a placeholder.
    // Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN_HERE';

    const viewer = new Cesium.Viewer(containerRef.current, {
      globe: false,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      selectionIndicator: false,
      infoBox: false,
    });
    viewerRef.current = viewer;

    async function loadWorld() {
      try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
        viewer.scene.primitives.add(tileset);

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-88.0051, 37.8459, 400),
          orientation: { heading: 0, pitch: Cesium.Math.toRadians(-45), roll: 0 }
        });
      } catch (e) {
        console.error("Error loading tiles:", e);
      }
    }
    
    // Fallback: Using OSM Buildings instead of Google 3D Tiles if Ion fails or no token
    async function loadFallback() {
       try {
           const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
           viewer.scene.globe.enableLighting = true;
           viewer.scene.highDynamicRange = true;
           
           viewer.camera.setView({
              destination: Cesium.Cartesian3.fromDegrees(-88.0051, 37.8459, 400),
              orientation: { heading: 0, pitch: Cesium.Math.toRadians(-45), roll: 0 }
            });
       } catch (e) {
           console.error(e);
       }
    }

    loadWorld().catch(() => loadFallback());

    // Flood Plane
    const floodEntity = viewer.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          -88.02, 37.83, -87.98, 37.83, -87.98, 37.86, -88.02, 37.86
        ]),
        extrudedHeight: 330.0 * 0.3048,
        material: new Cesium.Color(0.0, 0.5, 1.0, 0.4),
        outline: false
      }
    });
    floodEntityRef.current = floodEntity;

    // Archimedes Line (Berm Defense)
    viewer.entities.add({
      name: 'Archimedes Berm',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -88.0055, 37.8455, -88.0045, 37.8455,
          -88.0045, 37.8465, -88.0055, 37.8465, -88.0055, 37.8455
        ]),
        maximumHeights: [115, 115, 115, 115, 115], // approx 377 ft in meters
        minimumHeights: [112, 112, 112, 112, 112],
        material: new Cesium.Color(0.0, 1.0, 0.0, 0.6),
        outline: true,
        outlineColor: Cesium.Color.WHITE
      }
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [isLoaded]);

  useEffect(() => {
    if (floodEntityRef.current) {
      floodEntityRef.current.polygon.extrudedHeight = floodStage * 0.3048;
    }
  }, [floodStage]);

  const flyTo = (location: string) => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    
    switch (location) {
      case 'node':
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-88.0051, 37.8459, 250),
          orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-35), roll: 0 },
          duration: 2
        });
        break;
      case 'dam':
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-87.995, 37.795, 1200),
          orientation: { heading: Cesium.Math.toRadians(180), pitch: Cesium.Math.toRadians(-45), roll: 0 },
          duration: 3
        });
        break;
      case 'confluence':
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-88.030, 37.805, 3000),
          orientation: { heading: Cesium.Math.toRadians(90), pitch: Cesium.Math.toRadians(-25), roll: 0 },
          duration: 3
        });
        break;
      case 'gauge':
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-87.935, 38.130, 800),
          orientation: { heading: Cesium.Math.toRadians(270), pitch: Cesium.Math.toRadians(-30), roll: 0 },
          duration: 3
        });
        break;
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-mono text-white rounded-xl">
      <div 
        className="absolute top-5 left-5 w-72 bg-slate-900/90 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)] z-10"
      >
        <h1 className="m-0 mb-3 text-sm uppercase border-b border-cyan-500/50 pb-1 font-bold tracking-wider text-cyan-400">
          Tri-River Command
        </h1>
        
        <div className="mb-4 text-xs space-y-1">
          <div>SYSTEM: <span className="text-emerald-500 font-bold">ONLINE</span></div>
          <div>LAYER: <span className="text-emerald-500 font-bold">GOOGLE 3D TILES</span></div>
          <div>DATA: <span className="text-emerald-500 font-bold">SOVEREIGN SEALED</span></div>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={() => flyTo('node')}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-cyan-800 hover:border-cyan-500 px-3 py-2 text-xs transition-colors rounded"
          >
            1. SOVEREIGN NODE (Home)
          </button>
          <button 
            onClick={() => flyTo('dam')}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-cyan-800 hover:border-cyan-500 px-3 py-2 text-xs transition-colors rounded"
          >
            2. J.T. MYERS DAM (Source)
          </button>
          <button 
            onClick={() => flyTo('confluence')}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-cyan-800 hover:border-cyan-500 px-3 py-2 text-xs transition-colors rounded"
          >
            3. THE CONFLUENCE (Tri-State)
          </button>
          <button 
            onClick={() => flyTo('gauge')}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-cyan-800 hover:border-cyan-500 px-3 py-2 text-xs transition-colors rounded"
          >
            4. WABASH GAUGE (New Harmony)
          </button>
        </div>
      </div>

      <div 
        className="absolute top-5 right-5 w-80 bg-slate-900/90 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)] z-10"
      >
        <h2 className="m-0 mb-3 text-sm uppercase border-b border-cyan-500/50 pb-1 font-bold tracking-wider">
          Archimedes Defense Console
        </h2>
        
        <div className="flex justify-between mb-2 text-xs">
          <span className="text-slate-300">WABASH (New Harmony):</span>
          <span className="font-bold text-cyan-400">6.55 ft</span>
        </div>
        <div className="flex justify-between mb-3 text-xs">
          <span className="text-slate-300">OHIO (Myers Dam):</span>
          <span className="font-bold text-cyan-400">18.32 ft</span>
        </div>
        
        <hr className="border-slate-700 my-3" />
        
        <label className="block text-xs mb-2">
          SIMULATED FLOOD STAGE (ft): <span className="font-bold text-amber-400">{floodStage.toFixed(1)}</span> MSL
        </label>
        
        <input 
          type="range" 
          min="320" 
          max="380" 
          step="0.5" 
          value={floodStage}
          onChange={(e) => setFloodStage(parseFloat(e.target.value))}
          className="w-full mb-3 accent-cyan-500"
        />
        
        <div className="flex justify-between items-center text-xs mt-4">
          <span className="text-slate-300">IMPACT STATUS:</span>
          {floodStage > 375 ? (
            <span className="font-bold text-red-500 animate-pulse">BREACH DETECTED</span>
          ) : (
            <span className="font-bold text-emerald-500">SECURE</span>
          )}
        </div>
      </div>
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0">
          <div className="animate-pulse text-cyan-500 text-sm tracking-widest">
            INITIALIZING CESIUM 3D TWIN...
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full z-0" />
    </div>
  );
}

export default CesiumTwinView;
