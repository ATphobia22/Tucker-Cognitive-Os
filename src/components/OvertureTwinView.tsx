import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';

export function OvertureTwinView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [floodStage, setFloodStage] = useState(330);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const protocolAdded = useRef(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!protocolAdded.current) {
      const protocol = new pmtiles.Protocol();
      maplibregl.addProtocol('pmtiles', protocol.tile);
      protocolAdded.current = true;
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
          },
          'overture-buildings': {
            type: 'vector',
            url: 'pmtiles://https://overturemaps-extras-us-west-2.s3.amazonaws.com/tiles/2026-05-20.0/buildings.pmtiles',
          }
        },
        layers: [
          {
            id: 'osm-base',
            type: 'raster',
            source: 'osm',
          },
          {
            id: 'overture-buildings-3d',
            type: 'fill-extrusion',
            source: 'overture-buildings',
            'source-layer': 'buildings',
            minzoom: 12,
            paint: {
              'fill-extrusion-color': '#475569',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-opacity': 0.8
            }
          }
        ]
      },
      center: [-88.0051, 37.8459],
      zoom: 15,
      pitch: 60,
      bearing: 15,
      antialias: true
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add flood plane
      map.addSource('flood-plane', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-88.02, 37.83],
                [-87.98, 37.83],
                [-87.98, 37.86],
                [-88.02, 37.86],
                [-88.02, 37.83]
              ]]
            },
            properties: {}
          }]
        }
      });

      map.addLayer({
        id: 'flood-plane-fill',
        type: 'fill-extrusion',
        source: 'flood-plane',
        paint: {
          'fill-extrusion-color': '#06b6d4',
          'fill-extrusion-height': floodStage * 0.3048,
          'fill-extrusion-opacity': 0.5
        }
      });

      // Archimedes Berm
      map.addSource('berm', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-88.0055, 37.8455],
                [-88.0045, 37.8455],
                [-88.0045, 37.8465],
                [-88.0055, 37.8465],
                [-88.0055, 37.8455]
              ]]
            },
            properties: {}
          }]
        }
      });

      map.addLayer({
        id: 'berm-extrusion',
        type: 'fill-extrusion',
        source: 'berm',
        paint: {
          'fill-extrusion-color': '#22c55e',
          'fill-extrusion-height': 115,
          'fill-extrusion-base': 112,
          'fill-extrusion-opacity': 0.7
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.getLayer('flood-plane-fill')) {
      mapRef.current.setPaintProperty('flood-plane-fill', 'fill-extrusion-height', floodStage * 0.3048);
    }
  }, [floodStage]);

  const flyTo = (location: string) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    switch (location) {
      case 'node':
        map.flyTo({ center: [-88.0051, 37.8459], zoom: 16, pitch: 60, bearing: 15, duration: 2000 });
        break;
      case 'dam':
        map.flyTo({ center: [-87.995, 37.795], zoom: 14, pitch: 45, bearing: 180, duration: 3000 });
        break;
      case 'confluence':
        map.flyTo({ center: [-88.030, 37.805], zoom: 13, pitch: 30, bearing: 90, duration: 3000 });
        break;
      case 'gauge':
        map.flyTo({ center: [-87.935, 38.130], zoom: 15, pitch: 45, bearing: 270, duration: 3000 });
        break;
    }
  };

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden font-mono text-white rounded-xl">
      <div className="absolute top-5 left-5 w-72 bg-slate-900/90 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)] z-10">
        <h1 className="m-0 mb-3 text-sm uppercase border-b border-cyan-500/50 pb-1 font-bold tracking-wider text-cyan-400">
          Tri-River Command
        </h1>
        
        <div className="mb-4 text-xs space-y-1">
          <div>SYSTEM: <span className="text-emerald-500 font-bold">ONLINE</span></div>
          <div>LAYER: <span className="text-emerald-500 font-bold">OVERTURE 3D TILES</span></div>
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

      <div className="absolute top-5 right-5 w-80 bg-slate-900/90 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)] z-10">
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

      <div ref={mapContainer} className="w-full h-full z-0" />
    </div>
  );
}

export default OvertureTwinView;
