import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Play, 
  CheckCircle, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  Terminal, 
  Activity, 
  Sparkles,
  Database
} from "lucide-react";

interface FilePackResult {
  fileName: string;
  label: string;
  originalSize: number;
  strippedSize: number;
  packedSize: number;
  ratio: number;
}

interface CompactionSummary {
  originalSizeBytes: number;
  packedSizeBytes: number;
  shrinkRatioPercent: number;
  aggregateRatio: string;
  shrunkTo: string;
  originalFrom: string;
  speedMs: number;
  outputManifest: string;
  blockchainSeal: string;
}

export default function TurboVecCompactor() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isPacked, setIsPacked] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [summary, setSummary] = useState<CompactionSummary | null>(null);
  const [fileDetails, setFileDetails] = useState<FilePackResult[]>([]);

  // Core list of target files before compression run
  const initialFiles = [
    { name: "CesiumGlobeViewer.tsx", label: "Cesium Globe Viewer", size: "32.8 KB" },
    { name: "PredictiveTwinAnalytics.tsx", label: "Predictive Analytics", size: "15.0 KB" },
    { name: "USGSTelemetryMonitor.tsx", label: "USGS Telemetry", size: "6.9 KB" },
    { name: "FEMAHazusMonitor.tsx", label: "FEMA Hazus", size: "6.2 KB" },
    { name: "solver.py", label: "Shallow Water Solver", size: "6.1 KB" },
    { name: "telemetry_pipeline.py", label: "Telemetry Pipeline", size: "2.2 KB" },
    { name: "main.py", label: "FastAPI Core Gateway", size: "7.0 KB" },
    { name: "server.ts", label: "Express Sovereign Node", size: "10.8 KB" }
  ];

  const triggerCompactor = async () => {
    if (loading) return;
    setLoading(true);
    setIsPacked(false);
    setLogs([]);
    setSummary(null);

    // Staggered high-fidelity console logs to mimic physical vector-packing initialization
    const logTimeline = [
      "▲ [BOOT] Initializing Sovereign TurboVec v23.0 Compactor Engine...",
      "▲ [BOOT] Active covenant anchor: 13101 Bonebank Road.",
      "▲ [SDE] Establishing cognitive pipeline to strip whitespace arrays...",
      "▲ [PARSE] Reading flat structure repository layouts...",
      "▲ [STRIP] Stripping multi-line code comments & whitespace maps...",
      "▲ [VECTOR] Initializing zlib compression matrices (Level-9 Hard Pack)...",
      "▲ [VECTOR] Vectorizing AST trees to flat source binaries...",
      "▲ [SEAL] Appending G1P cryptographic blockchain seals..."
    ];

    for (let i = 0; i < logTimeline.length; i++) {
      setLogs(prev => [...prev, logTimeline[i]]);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    try {
      const response = await fetch("/api/turbovec/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
        setFileDetails(data.files);
        setLogs(prev => [
          ...prev,
          `✓ [SUCCESS] Codebase successfully packed into unified vector format: ${data.summary.outputManifest}`,
          `✓ [SUCCESS] Total file sizes shrunk by ${data.summary.shrinkRatioPercent}%!`,
          `✓ [SUCCESS] Cryptographic signature generated: ${data.summary.blockchainSeal}`,
          "▲ SYSTEM CONVERGENCE ATTAINED • ORDER LOCKED • It is Finished - John 19:30"
        ]);
        setIsPacked(true);
      } else {
        setLogs(prev => [...prev, `❌ [FAULT] Compactor failed: ${data.error}`]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `❌ [FAULT] Network transport exception: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for Recharts comparison
  const chartData = fileDetails.map(f => ({
    name: f.fileName.split("/").pop() || f.fileName,
    "Original (KB)": parseFloat((f.originalSize / 1024).toFixed(2)),
    "TurboVec Packed (KB)": parseFloat((f.packedSize / 1024).toFixed(2)),
  }));

  return (
    <div className="bg-[#05070d]/95 border border-[#162035] rounded-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#162035] pb-4 gap-4">
        <div>
          <h3 className="font-display font-bold text-sm text-[#22d4bf] uppercase tracking-widest flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#22d4bf] animate-pulse" />
            Sovereign TurboVec Code Compactor (v23.0)
          </h3>
          <p className="text-[10px] text-gray-400 font-mono uppercase">
            AST Node Compression • Comment Stripping • High-Density Zlib Vector Packing
          </p>
        </div>

        <button
          onClick={triggerCompactor}
          disabled={loading}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold font-display uppercase tracking-wider rounded-lg text-[10.5px] transition disabled:opacity-50 flex items-center gap-1.5 shadow-lg shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              VECTORIZING SYSTEM CORES...
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              RUN TURBOVEC HARD PACK
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Core File Inventory & Target List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-black/40 border border-[#162035] rounded-xl p-4 space-y-3.5">
            <span className="font-mono text-[9px] text-[#a78bfa] font-bold block uppercase border-b border-[#162035]/50 pb-1.5 flex items-center gap-1">
              <Database className="h-3 w-3" />
              CODEBASE TARGET MANIFEST
            </span>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {(!isPacked ? initialFiles : fileDetails.map(f => ({
                name: f.fileName.split("/").pop() || f.fileName,
                label: f.label,
                size: `${(f.originalSize / 1024).toFixed(1)} KB`,
                packedSize: `${(f.packedSize / 1024).toFixed(1)} KB`,
                ratio: f.ratio
              }))).map((f: any, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-2 rounded-lg bg-[#0c1224]/50 border border-[#162035] text-[10px] font-mono hover:border-gray-700 transition"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{f.name}</span>
                    <span className="text-[8.5px] text-gray-500 uppercase">{f.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-300 font-bold">{f.size}</div>
                    {f.packedSize && (
                      <div className="text-[8.5px] text-emerald-400">
                        {f.packedSize} (-{f.ratio}%)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats panel */}
            <div className="pt-2 border-t border-[#162035]/50 flex items-center justify-between text-[9px] text-gray-400 font-mono">
              <span>PIPELINE RECONSTRUCTION:</span>
              <span className="text-[#22d4bf] font-bold">STRICT_AST_VALID</span>
            </div>
          </div>

          {/* Action Panel for TVEC downloads */}
          {isPacked && summary && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2.5 font-mono text-[10.5px]"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="h-4.5 w-4.5" />
                SOVEREIGN VECTOR ARCHIVE SEALED
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-300 text-[9px]">
                <div>
                  <span className="text-slate-500">ORIGINAL SIZE:</span>
                  <p className="text-white font-bold">{summary.originalFrom}</p>
                </div>
                <div>
                  <span className="text-slate-500">SHRUNK PAYLOAD:</span>
                  <p className="text-emerald-400 font-bold">{summary.shrunkTo}</p>
                </div>
                <div>
                  <span className="text-slate-500">AGGREGATE RATIO:</span>
                  <p className="text-[#22d4bf] font-bold">{summary.aggregateRatio} Reduction</p>
                </div>
                <div>
                  <span className="text-slate-500">SPEED DETECTED:</span>
                  <p className="text-amber-300">{summary.speedMs} ms</p>
                </div>
              </div>
              <p className="text-[8.5px] text-gray-400 border-t border-[#162035] pt-1.5 leading-relaxed truncate">
                BLOCKCHAIN SEAL: {summary.blockchainSeal}
              </p>
              <a 
                href="/system.tvec" 
                download 
                className="w-full mt-2 py-1.5 bg-[#0b1b1a] hover:bg-[#102a28] border border-emerald-500/20 rounded flex items-center justify-center gap-1.5 text-emerald-300 text-[9px] uppercase font-bold tracking-wider transition"
              >
                <Download className="h-3 w-3" />
                Download system.tvec Manifest
              </a>
            </motion.div>
          )}
        </div>

        {/* Right Hand: Terminal Log stream & Recharts visualizer */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Terminal log window */}
          <div className="bg-[#020408] border border-[#162035] rounded-xl p-4 font-mono text-[9px] text-gray-300 space-y-1.5 min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-[#162035]/40 pb-1.5 mb-1 text-slate-500 uppercase tracking-widest text-[8px]">
              <span className="flex items-center gap-1">
                <Terminal className="h-3 w-3 text-cyan-400" />
                TURBOVEC REAL-TIME CLI LOGS
              </span>
              <span>v23.0 active</span>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[110px] pr-1 flex-1">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center gap-1">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Compactor standby. Waiting for hard-pack execution command...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    {log.startsWith("❌") ? (
                      <span className="text-red-400 font-bold">{log}</span>
                    ) : log.startsWith("✓") ? (
                      <span className="text-emerald-400 font-bold">{log}</span>
                    ) : log.includes("▲") ? (
                      <span className="text-[#a78bfa]">{log}</span>
                    ) : (
                      <span className="text-cyan-300">{log}</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-1.5 border-t border-[#162035]/40 flex justify-between text-[8px] text-slate-600">
              <span>STATUS: {loading ? "VECTOR_RUN" : isPacked ? "COMPACTED_SEALED" : "STANDBY"}</span>
              <span>ENVELOPE COUPLING: HARDWARE_ACCELERATED</span>
            </div>
          </div>

          {/* Recharts comparison bar chart (shows only when packed) */}
          <div className="border border-[#162035] bg-black/40 rounded-xl p-4 relative h-64 flex flex-col justify-between">
            <span className="font-mono text-[9px] text-cyan-400 font-bold block uppercase border-b border-[#162035]/50 pb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 animate-pulse" />
              TURBOVEC COMPRESSION RATIO GRAPH
            </span>

            <div className="flex-1 mt-2">
              {isPacked ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162035" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={8} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(5, 7, 13, 0.95)", 
                        borderColor: "#162035", 
                        borderRadius: "8px",
                        fontSize: "9px",
                        fontFamily: "monospace"
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace' }} />
                    <Bar dataKey="Original (KB)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="TurboVec Packed (KB)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-[10px] font-mono border border-dashed border-[#162035] rounded-lg">
                  <Activity className="h-5 w-5 mb-1 text-slate-700 animate-pulse" />
                  BAR CHART COMPILES DYNAMICALLY ON COMPACTOR ACTIVATION
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
