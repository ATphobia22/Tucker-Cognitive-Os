import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, ClipboardCheck, ArrowRight, Activity, TrendingUp } from "lucide-react";

interface EvaluationRun {
  scenario: string;
  peakDepth: number;
  maxVel: number;
  safetyScore: number;
  status: "COMPLIANT" | "CRITICAL_HAZARD" | "WARNING";
}

export default function FEMAHazusMonitor() {
  const [runs, setRuns] = useState<EvaluationRun[]>([
    { scenario: "Standard Wabash Flood (100-yr)", peakDepth: 9.4, maxVel: 3.22, safetyScore: 84.5, status: "COMPLIANT" },
    { scenario: "Ohio Confluence Surge (500-yr)", peakDepth: 11.2, maxVel: 4.05, safetyScore: 78.4, status: "COMPLIANT" },
    { scenario: "Levee Overtopping Event (Category A)", peakDepth: 14.8, maxVel: 8.44, safetyScore: 32.1, status: "CRITICAL_HAZARD" },
    { scenario: "Wabash Tidal Backwater Wave", peakDepth: 6.8, maxVel: 1.89, safetyScore: 92.4, status: "COMPLIANT" }
  ]);

  return (
    <div className="bg-[#05070d]/80 border border-[#162035] rounded-xl p-5 shadow-2xl space-y-4">
      <div className="border-b border-[#162035] pb-3 flex justify-between items-start">
        <div className="space-y-0.5">
          <h3 className="font-display font-bold text-xs text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-purple-400" />
            FEMA Hazus Hydraulic Compliance Center
          </h3>
          <p className="text-[10px] text-gray-400">
            Automated verification of flood safety levels against FEMA regulatory models and structural guidelines.
          </p>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 bg-purple-950/40 text-purple-300 border border-purple-500/30 rounded">
          HAZUS-MH V5.0
        </span>
      </div>

      {/* Aggregate compliance status block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-[8px] text-gray-500 uppercase block font-mono">REGIONAL BOUNDS</div>
          <div className="text-sm font-display font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="h-4 w-4" />
            STABILIZED
          </div>
        </div>
        <div className="bg-black/40 border border-[#162035] rounded-lg p-3 text-center">
          <div className="text-[8px] text-gray-500 uppercase block font-mono">MITIGATION RATIO</div>
          <div className="text-sm font-display font-bold text-[#b49bf3] mt-0.5">
            75% COMPLIANT
          </div>
        </div>
        <div className="bg-black/40 border border-[#162035] rounded-lg p-3 text-center">
          <div className="text-[8px] text-gray-500 uppercase block font-mono">SAFETY MARGIN INDEX</div>
          <div className="text-sm font-display font-bold text-amber-400 mt-0.5">
            81.8% / TIER-2
          </div>
        </div>
      </div>

      {/* Flood runs table */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-mono text-gray-500 block uppercase">Simulated Scenario Evaluation logs</span>
        <div className="overflow-x-auto border border-[#162035]/65 rounded-lg bg-black/40 text-[9.5px]">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="bg-[#0b1022] border-b border-[#162035] text-gray-400 text-[8px] uppercase">
                <th className="p-2 py-1.5">Scenario Name</th>
                <th className="p-2 py-1.5">Peak Depth</th>
                <th className="p-2 py-1.5">Vel (fps)</th>
                <th className="p-2 py-1.5">Safety Score</th>
                <th className="p-2 py-1.5 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162035]/50">
              {runs.map((r, i) => (
                <tr key={i} className="hover:bg-[#070d1a]/55 transition">
                  <td className="p-2 text-white font-sans font-medium">{r.scenario}</td>
                  <td className="p-2 text-cyan-300">{r.peakDepth} FT</td>
                  <td className="p-2 text-purple-300">{r.maxVel} FPS</td>
                  <td className="p-2 text-amber-300">{r.safetyScore}%</td>
                  <td className="p-2 text-right">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      r.status === "COMPLIANT" 
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20" 
                        : "bg-red-950/60 text-red-400 border border-red-500/20"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hazus safety checks list */}
      <div className="bg-[#04060c] border border-purple-500/10 rounded-lg p-2.5 space-y-2 text-[9px] leading-relaxed">
        <span className="font-mono font-bold text-purple-300 uppercase flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-purple-400" />
          FEMA Regulatory Mandates Check list:
        </span>
        <div className="grid grid-cols-2 gap-2 text-gray-300 font-sans">
          <div className="flex items-start gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Wabash Confluence freeboard index height satisfies &gt; 3.0 ft clearance bounds.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Point Township East Section levee complies with structural shear index.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-red-400 font-bold">✗</span>
            <span>Category A breach results in 14.8 ft flood depth, violating dry floodplain limits.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Discharge velocity at Ohio junction stays inside 5.0 fps erosion threshold.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
