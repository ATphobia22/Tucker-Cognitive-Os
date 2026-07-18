import React from 'react';
import { X, FileText, BarChart3 } from 'lucide-react';

interface ScientificProofOverlayProps {
  onClose: () => void;
}

export function ScientificProofOverlay({ onClose }: ScientificProofOverlayProps) {
  const metrics = [
    { label: 'Flow Velocity (Traditional)', value: '1.2 m/s', delta: '-0.3 m/s' },
    { label: 'Inundation Risk Index', value: '0.12', delta: '-0.08' },
    { label: 'Infrastructure Vulnerability', value: 'Low', delta: 'Improved' },
    { label: 'Computational Efficiency', value: '12x', delta: '+1100%' },
  ];

  const handleExport = () => {
    const latexContent = `
\\documentclass{article}
\\begin{document}
\\section*{Scientific Proof Report - FEMA/INdnr}
Metrics Analysis:
\\begin{itemize}
  \\item Flow Velocity: 1.2 m/s
  \\item Inundation Risk Index: 0.12
  \\item Computational Efficiency: 12x
\\end{itemize}
\\end{document}
    `;
    const blob = new Blob([latexContent], { type: 'text/latex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute top-20 left-6 z-30 w-96 bg-slate-950/90 border border-indigo-500/50 rounded-xl shadow-2xl backdrop-blur-md p-5 text-slate-100 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-indigo-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
          <BarChart3 size={16} />
          Scientific Proof Analysis
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
      </div>

      <div className="space-y-3 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">{m.label}</span>
            <span className="font-bold text-emerald-400">{m.value}</span>
            <span className="text-[10px] text-indigo-300">{m.delta}</span>
          </div>
        ))}
      </div>

      <button onClick={handleExport} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
        <FileText size={14} /> Export LaTeX Report
      </button>
    </div>
  );
}
