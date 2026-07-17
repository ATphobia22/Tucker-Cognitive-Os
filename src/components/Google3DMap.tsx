import React, { useEffect, useRef, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Globe, Play, Pause, Camera, Layers, Droplets } from "lucide-react";

interface Google3DMapInnerProps {
  center: { lat: number; lng: number; altitude: number };
  heading: number;
  tilt: number;
  range: number;
  usgsGages: any[];
  selectedGage: any;
  waterLevel: number;
  cinematicMode?: boolean;
}

function Google3DMapInner({
  center,
  heading,
  tilt,
  range,
  usgsGages,
  selectedGage,
  waterLevel,
  cinematicMode = false,
}: Google3DMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maps3dLib = useMapsLibrary("maps3d");
  const map3dInstanceRef = useRef<any>(null);
  const polygonInstanceRef = useRef<any>(null);
  const gaugeMarkersRef = useRef<any[]>([]);

  // 1. Initialize Map3DElement
  useEffect(() => {
    if (!containerRef.current || !maps3dLib) return;
    containerRef.current.innerHTML = "";

    try {
      const map3d = new (google.maps as any).maps3d.Map3DElement({
        center: { lat: center.lat, lng: center.lng, altitude: center.altitude },
        heading: heading,
        tilt: tilt,
        range: range,
        defaultLabelsDisabled: false, // Show roads, bridges, and geographic names
      });

      containerRef.current.appendChild(map3d);
      map3dInstanceRef.current = map3d;
    } catch (error) {
      console.error("Error creating Google Maps Map3DElement:", error);
    }

    return () => {
      if (map3dInstanceRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(map3dInstanceRef.current);
        } catch (e) {}
      }
      map3dInstanceRef.current = null;
    };
  }, [maps3dLib]);

  // 2. Cinematic Tour (Fly-through)
  useEffect(() => {
    const map3d = map3dInstanceRef.current;
    if (!map3d || !cinematicMode) return;

    let isRunning = true;
    let sequenceIndex = 0;

    const tourWaypoints = [
      { lat: 37.893, lng: -88.005, altitude: 280, heading: -15, tilt: 60, range: 1500, duration: 4000 },
      { lat: 37.840, lng: -88.080, altitude: 320, heading: 45, tilt: 65, range: 1200, duration: 5000 },
      { lat: 37.860, lng: -88.050, altitude: 150, heading: 90, tilt: 75, range: 800, duration: 6000 },
      { lat: 37.893, lng: -88.005, altitude: 400, heading: 0, tilt: 45, range: 2500, duration: 5000 },
    ];

    const runTour = async () => {
      while (isRunning) {
        const wp = tourWaypoints[sequenceIndex];
        try {
          map3d.flyCameraTo({
            endCamera: { center: { lat: wp.lat, lng: wp.lng, altitude: wp.altitude }, heading: wp.heading, tilt: wp.tilt, range: wp.range },
            durationMillis: wp.duration,
          });
          await new Promise(resolve => setTimeout(resolve, wp.duration + 500));
        } catch (e) { break; }
        sequenceIndex = (sequenceIndex + 1) % tourWaypoints.length;
      }
    };

    runTour();

    return () => { isRunning = false; };
  }, [maps3dLib, cinematicMode, map3dInstanceRef.current]);

  // 3. Flood Polygon (Water Volume)
  useEffect(() => {
    const map3d = map3dInstanceRef.current;
    if (!map3d || !maps3dLib) return;

    if (polygonInstanceRef.current) {
      try { map3d.removeChild(polygonInstanceRef.current); } catch (e) {}
      polygonInstanceRef.current = null;
    }

    try {
      const delta = (waterLevel - 0.5) * 0.0045;
      // Wabash-Ohio Confluence Box
      const paths = [
        { lat: 37.84 - delta, lng: -88.08 - delta },
        { lat: 37.84 - delta, lng: -87.94 + delta },
        { lat: 37.94 + delta, lng: -87.92 + delta },
        { lat: 37.92 + delta, lng: -87.98 },
        { lat: 37.96 + delta, lng: -88.04 - delta },
        { lat: 37.84 - delta, lng: -88.08 - delta },
      ];

      const fillColor = waterLevel > 4.5 ? "rgba(239, 68, 68, 0.55)" : (waterLevel > 2.8 ? "rgba(249, 115, 22, 0.55)" : "rgba(37, 99, 235, 0.55)");
      const strokeColor = waterLevel > 4.5 ? "#ef4444" : (waterLevel > 2.8 ? "#f97316" : "#2563eb");

      const waterPolygon = new (google.maps as any).maps3d.Polygon3DElement({
        paths,
        fillColor,
        strokeColor,
        strokeWidth: 4,
        extruded: true,
        altitudeMode: "RELATIVE_TO_GROUND",
        drawsOccludedSegments: true,
      });

      map3d.appendChild(waterPolygon);
      polygonInstanceRef.current = waterPolygon;
    } catch (e) {}

    return () => {
      if (polygonInstanceRef.current && map3dInstanceRef.current) {
        try { map3dInstanceRef.current.removeChild(polygonInstanceRef.current); } catch (e) {}
      }
    };
  }, [maps3dLib, waterLevel, map3dInstanceRef.current]);

  return (
    <div className="w-full h-full relative" style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      {cinematicMode && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/40 mix-blend-overlay" />
      )}
    </div>
  );
}

interface Google3DMapProps extends Google3DMapInnerProps { apiKey: string; }
export default function Google3DMap(props: Google3DMapProps) {
  return <APIProvider apiKey={props.apiKey} version="weekly"><Google3DMapInner {...props} /></APIProvider>;
}

export function GoogleKeySplashScreen() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-950 p-6 text-slate-100 font-sans">
      <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
            <Globe className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-100">Google 3D Earth GIS</h3>
            <p className="text-[11px] text-slate-400">Photorealistic 3D Tiles Integration</p>
          </div>
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>Experience a photorealistic 3D representation of the Tri-River valley showcasing actual roads, bridges, houses, and vegetation overlays.</p>
          <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-lg p-3.5 space-y-2">
            <div className="font-semibold text-xs text-indigo-300 uppercase font-mono">Setup Checklist:</div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 font-mono text-[11px]">
              <li><a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" className="text-indigo-400 hover:underline">Get a Google Maps API Key</a></li>
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Create secret named <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
