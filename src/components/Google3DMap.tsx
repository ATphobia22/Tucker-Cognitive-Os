import React, { useEffect, useRef } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Globe } from "lucide-react";

interface Google3DMapInnerProps {
  center: { lat: number; lng: number; altitude: number };
  heading: number;
  tilt: number;
  range: number;
  usgsGages: any[];
  selectedGage: any;
  waterLevel: number;
}

function Google3DMapInner({
  center,
  heading,
  tilt,
  range,
  usgsGages,
  selectedGage,
  waterLevel,
}: Google3DMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maps3dLib = useMapsLibrary("maps3d");
  const map3dInstanceRef = useRef<any>(null);
  const polygonInstanceRef = useRef<any>(null);
  const gaugeMarkersRef = useRef<any[]>([]);

  // 1. Initialize Map3DElement
  useEffect(() => {
    if (!containerRef.current || !maps3dLib) return;

    // Clear container
    containerRef.current.innerHTML = "";

    try {
      // Create Map3DElement
      const map3d = new (google.maps as any).maps3d.Map3DElement({
        center: { lat: center.lat, lng: center.lng, altitude: center.altitude },
        heading: heading,
        tilt: tilt,
        range: range,
        defaultLabelsDisabled: false, // Keeps labels on, so roads, bridges, and geographic names show up!
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
        } catch (e) {
          console.warn("Error cleaning up Map3DElement:", e);
        }
      }
      map3dInstanceRef.current = null;
    };
  }, [maps3dLib]);

  // 2. Add overlays (Polygon representing river inundation / flood simulation)
  useEffect(() => {
    const map3d = map3dInstanceRef.current;
    if (!map3d || !maps3dLib) return;

    // Remove old polygon if exists
    if (polygonInstanceRef.current) {
      try {
        map3d.removeChild(polygonInstanceRef.current);
      } catch (e) {
        console.warn("Error removing old polygon:", e);
      }
      polygonInstanceRef.current = null;
    }

    try {
      // Swell confluence geometry based on water depth (delta)
      const delta = (waterLevel - 0.5) * 0.0035;

      // Generate dynamic polygon coordinates matching Wabash-Ohio confluence
      const paths = [
        { lat: 37.84 - delta, lng: -88.08 - delta },
        { lat: 37.84 - delta, lng: -87.94 + delta },
        { lat: 37.94 + delta, lng: -87.92 + delta },
        { lat: 37.92 + delta, lng: -87.98 },
        { lat: 37.96 + delta, lng: -88.04 - delta },
        { lat: 37.84 - delta, lng: -88.08 - delta },
      ];

      // Determine color based on water level severity
      const fillColor = waterLevel > 4.5 
        ? "rgba(239, 68, 68, 0.45)" // Neon Red
        : (waterLevel > 2.8 ? "rgba(249, 115, 22, 0.45)" : "rgba(37, 99, 235, 0.45)"); // Neon Orange vs Royal Blue

      const strokeColor = waterLevel > 4.5 ? "#ef4444" : (waterLevel > 2.8 ? "#f97316" : "#2563eb");

      // Create 3D Polygon representing water level
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
    } catch (e) {
      console.warn("Could not create 3D Water Polygon:", e);
    }

    return () => {
      if (polygonInstanceRef.current && map3dInstanceRef.current) {
        try {
          map3dInstanceRef.current.removeChild(polygonInstanceRef.current);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [maps3dLib, waterLevel, map3dInstanceRef.current]);

  // 3. Add USGS Gauge Markers
  useEffect(() => {
    const map3d = map3dInstanceRef.current;
    if (!map3d || !maps3dLib) return;

    // Remove old markers
    gaugeMarkersRef.current.forEach((marker) => {
      try {
        map3d.removeChild(marker);
      } catch (e) {
        // ignore
      }
    });
    gaugeMarkersRef.current = [];

    // Add new markers for gages
    try {
      usgsGages.forEach((gage) => {
        const marker = new (google.maps as any).maps3d.Marker3DElement({
          position: { lat: gage.lat, lng: gage.lng, altitude: 45 },
          label: `${gage.name}\n${gage.water_level_stage_ft}ft`,
          altitudeMode: "RELATIVE_TO_GROUND",
        });

        map3d.appendChild(marker);
        gaugeMarkersRef.current.push(marker);
      });
    } catch (e) {
      console.warn("Could not create 3D gauge markers:", e);
    }

    return () => {
      gaugeMarkersRef.current.forEach((marker) => {
        try {
          if (map3dInstanceRef.current) {
            map3dInstanceRef.current.removeChild(marker);
          }
        } catch (e) {
          // ignore
        }
      });
    };
  }, [maps3dLib, usgsGages, map3dInstanceRef.current]);

  // 4. Handle Camera flyTo when a gauge is selected
  useEffect(() => {
    const map3d = map3dInstanceRef.current;
    if (!map3d || !selectedGage) return;

    // Fly camera smoothly to selected gauge
    try {
      map3d.flyTo({
        endCamera: {
          center: { lat: selectedGage.lat, lng: selectedGage.lng, altitude: 120 },
          heading: -45,
          tilt: 60,
          range: 480,
        },
        durationMillis: 2500,
      });
    } catch (e) {
      console.warn("flyTo failed, fallback to direct assign:", e);
      // Fallback: update properties directly
      map3d.center = { lat: selectedGage.lat, lng: selectedGage.lng, altitude: 120 };
      map3d.range = 480;
      map3d.tilt = 60;
    }
  }, [selectedGage]);

  return (
    <div className="w-full h-full relative" style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}

interface Google3DMapProps extends Google3DMapInnerProps {
  apiKey: string;
}

export default function Google3DMap(props: Google3DMapProps) {
  return (
    <APIProvider apiKey={props.apiKey} version="weekly">
      <Google3DMapInner {...props} />
    </APIProvider>
  );
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
          <p>
            Experience a photorealistic 3D representation of the Tri-River valley (confluence of the Ohio and Wabash rivers) showcasing actual roads, bridges, ditches, elevation structures, and forest overlays.
          </p>
          
          <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-lg p-3.5 space-y-2">
            <div className="font-semibold text-xs text-indigo-300 uppercase font-mono">Setup Checklist:</div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 font-mono text-[11px]">
              <li>
                <a 
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  Get a Google Maps API Key
                </a>
              </li>
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Create secret named <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
              <li>Paste key and press Enter</li>
            </ol>
          </div>
          
          <p className="text-[10px] text-slate-500 text-center font-mono">
            The application will automatically compile and activate the 3D Tiles view.
          </p>
        </div>
      </div>
    </div>
  );
}
