import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, MonitorPlay, Network, Shield, AlertTriangle, Cpu, Globe, Sun, Moon, Maximize2, Server, Zap } from 'lucide-react';
import { AssimilationView } from './AssimilationView';
import { EvidenceView } from './EvidenceView';
import { SystemTelemetry } from './SystemTelemetry';
import { UpgradesView } from './UpgradesView';
import { RiverCrossSection } from './RiverCrossSection';
import { MultiphysicsControls } from './MultiphysicsControls';
import { AssetRiskSummary } from './AssetRiskSummary';
import { DepthLegend } from './DepthLegend';
import { TurbovecPatternEngine } from './TurbovecPatternEngine';
import { TurbovecScorePlot } from './TurbovecScorePlot';
import { MapComponent } from './MapComponent';
import { TerminalOverlay } from './TerminalOverlay';
import { useTheme } from '../context/ThemeContext';

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<'telemetry' | 'evidence' | 'system' | 'upgrades' | null>('telemetry');
  const { theme, toggleTheme } = useTheme();
  const [layers, setLayers] = useState({
    geospatial: true,
    hydrodynamic: true,
    structural: false,
    predictiveBounds: "100year",
  });
  
  const [surgeStage, setSurgeStage] = useState(377.2);
  const [sysFrame, setSysFrame] = useState('0000');
  const [scenarioHorizon, setScenarioHorizon] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleBackupExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/turbovec/backup');
      if (!response.ok) throw new Error("Backup response failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `digital_twin_backup_${new Date().toISOString().slice(0,10)}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Error downloading backup:", err);
    } finally {
      setIsExporting(false);
    }
  };
  
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'TELEMETRY_UPDATE') {
          setSurgeStage(data.stage);
          setSysFrame(data.frame.toString().padStart(4, '0'));
        }
      } catch (err) {
        console.error('Error parsing telemetry stream:', err);
      }
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Background Map - Full Screen */}
      <div className="absolute inset-0 z-0">
        <MapComponent layers={layers} />
      </div>

      {/* HUD - Overlay */}
      <div className="absolute inset-0 z-10 p-6 pointer-events-none flex flex-col justify-between">
        {/* Header */}
        <header className="flex items-center justify-between pointer-events-auto">
          <div className="bg-[#001428]/85 backdrop-blur-md border-l-4 border-[#00D4FF] py-2 px-4 shadow-xl">
            <h1 className="text-sm font-bold tracking-wider text-[#00D4FF]">NODE: 13101 BONEBANK RD</h1>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
              <span>SYS_FRAME: <span className="text-white">{sysFrame}</span></span>
              <span className="h-3 w-px bg-slate-700"></span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> STATUS: SOVEREIGN SEALED</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 bg-[#001428]/85 backdrop-blur-md border border-slate-700/50 rounded hover:bg-[#003366] transition-colors shadow-xl">
              {theme === 'dark' ? <Sun size={18} className="text-[#00D4FF]" /> : <Moon size={18} className="text-slate-300" />}
            </button>
          </div>
        </header>

        {/* Side Panels - HUD */}
        <div className="flex-1 flex gap-6 mt-6 pointer-events-none">
          <div className="w-96 flex flex-col gap-4 pointer-events-auto overflow-y-auto max-h-full pr-2 pb-16 scrollbar-hide">
            {activePanel === 'telemetry' && (
              <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-100">
                <CardContent className="p-4">
                  <AssimilationView />
                </CardContent>
              </Card>
            )}
            {activePanel === 'evidence' && (
              <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-100">
                <CardContent className="p-4">
                  <EvidenceView />
                </CardContent>
              </Card>
            )}
            {activePanel === 'system' && (
              <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-100">
                <CardContent className="p-4">
                  <SystemTelemetry />
                </CardContent>
              </Card>
            )}
            {activePanel === 'upgrades' && (
              <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-100 h-[600px] flex flex-col">
                <CardContent className="p-4 flex-1 overflow-hidden">
                  <UpgradesView />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="flex-1"></div>
          
          {/* Right Panel - Multiphysics Controls */}
          <div className="w-80 pointer-events-auto">
            <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-100 shadow-xl">
              <CardContent className="p-4">
                <MultiphysicsControls layers={layers} setLayers={setLayers} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* UPDATED BOTTOM HUB CONTAINER: MATCHING EXACT PLACEMENT PATTERNS */}
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          right: "24px",
          display: "flex",
          gap: "24px",
          pointerEvents: "auto",
          height: "220px"
        }}>
          {/* Left Section: Dynamic D3 Cross-Section Graph */}
          <div style={{ width: "630px", flexShrink: 0 }}>
            <RiverCrossSection surgeStage={surgeStage + scenarioHorizon * 0.15} />
          </div>
        
          {/* Middle Section: Scenario Control Deck */}
          <div style={{
            flex: 1,
            background: "rgba(0, 10, 20, 0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(0, 212, 255, 0.15)",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-[#00D4FF] text-[13px] font-bold tracking-wider">
                    ANALYTICS & PREDICTIVE INSIGHTS
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Scenario Horizon: <span className="text-white font-mono">{scenarioHorizon} Hrs</span> | Vector Lookup Active
                  </p>
                </div>
                <button
                  onClick={handleBackupExport}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 border border-[#00D4FF]/30 hover:border-[#00D4FF]/60 disabled:opacity-50 text-[#00D4FF] rounded transition-all cursor-pointer font-bold font-mono"
                  title="Export Sovereign Snapshot Archive (.ZIP)"
                >
                  <Database size={11} /> {isExporting ? "EXPORTING..." : "EXPORT BACKUP"}
                </button>
              </div>
              
              {/* Slider */}
              <div className="mb-4 mt-2 px-2">
                <input 
                  type="range" 
                  min="0" max="72" 
                  value={scenarioHorizon} 
                  onChange={(e) => setScenarioHorizon(Number(e.target.value))}
                  className="w-full accent-[#00D4FF] cursor-pointer" 
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                  <span>T+0 (LIVE)</span>
                  <span>T+36</span>
                  <span>T+72 (FORECAST)</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4 h-[80px]">
                 <AssetRiskSummary />
                 <TurbovecPatternEngine frameCount={Number(sysFrame) + scenarioHorizon} />
                 <TurbovecScorePlot scenarioHorizon={scenarioHorizon} />
              </div>
          </div>
        
          {/* Right Section: Color Depth Metric Scale Block */}
          <div style={{ width: "260px", flexShrink: 0 }}>
            <DepthLegend />
          </div>
        </div>
      </div>

      <TerminalOverlay />
    </div>
  );
}
