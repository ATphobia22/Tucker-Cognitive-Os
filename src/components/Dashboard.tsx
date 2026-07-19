import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, MonitorPlay, Network, Shield, AlertTriangle, Cpu, Globe, Sun, Moon, Maximize2, Server, Zap, Settings, X, Music, Volume2, VolumeX, Power } from 'lucide-react';
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
import { useAudioSystem } from '../context/AudioContext';

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<'telemetry' | 'evidence' | 'system' | 'upgrades' | null>('telemetry');
  const { theme, toggleTheme } = useTheme();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { isMuted, toggleMute, volume, setVolume, setSystemOn, currentSoundscape, setSoundscape } = useAudioSystem();

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
            <h1 className="text-sm font-bold tracking-wider text-[#00D4FF]">TRI-STATE FAMILY SYSTEM: NODE 13101</h1>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
              <span>SYS_FRAME: <span className="text-white">{sysFrame}</span></span>
              <span className="h-3 w-px bg-slate-700"></span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] animate-pulse"></span> STATUS: ACTIVE SECURE</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSettingsModal(true)} 
              className="p-2 bg-[#001428]/85 backdrop-blur-md border border-slate-700/50 rounded hover:bg-[#003366] text-[#00D4FF] transition-colors shadow-xl cursor-pointer"
              title="System Configuration Settings"
            >
              <Settings size={18} />
            </button>
            <button onClick={toggleTheme} className="p-2 bg-[#001428]/85 backdrop-blur-md border border-slate-700/50 rounded hover:bg-[#003366] transition-colors shadow-xl cursor-pointer">
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
                  title="Export System Snapshot Archive (.ZIP)"
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

      {/* System Settings & Ambient Music Config Overlay */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-[#001428]/95 border border-indigo-500/30 p-6 rounded-lg w-full max-w-sm shadow-2xl font-sans relative">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-2 text-[#00D4FF] font-bold tracking-widest text-xs uppercase mb-4 pb-2 border-b border-indigo-500/20 font-mono">
              <Settings size={14} />
              SYSTEM CONFIGURATION
            </div>

            {/* Background Music controls */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  Background Music Engine
                </h3>
                <p className="text-[9px] text-slate-500 mb-3 leading-normal">
                  Procedural synth background ambient track dynamically synthesized via the Web Audio API.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">AUDIO CORES:</span>
                  <button 
                    onClick={toggleMute}
                    className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded cursor-pointer transition-all border ${
                      isMuted 
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' 
                        : 'bg-indigo-500/20 border-indigo-500/40 text-[#00D4FF] hover:bg-indigo-500/30'
                    }`}
                  >
                    {isMuted ? 'MUTE ON' : 'PLAYING'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-[#00D4FF] h-1 cursor-pointer"
                  />
                  <span className="text-[9px] font-mono text-slate-400 w-6 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Soundscapes</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSoundscape('hydraulic')}
                      className={`py-1 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer uppercase ${
                        currentSoundscape === 'hydraulic'
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-[#00D4FF]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Hydraulic Pulse
                    </button>
                    <button
                      onClick={() => setSoundscape('family')}
                      className={`py-1 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer uppercase ${
                        currentSoundscape === 'family'
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-[#00D4FF]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Family Harmony
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Power control */}
            <div className="pt-4 border-t border-slate-800/80">
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                <Power className="w-3.5 h-3.5 text-rose-500" />
                Power Grid Settings
              </h3>
              <p className="text-[9px] text-slate-500 mb-3 leading-normal">
                Suspend simulation calculations and transition the physical node into deep standby power-saver state.
              </p>
              
              <button
                onClick={() => {
                  setSystemOn(false);
                  setShowSettingsModal(false);
                }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/60 text-rose-400 font-bold font-mono rounded text-[9px] tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Power size={11} />
                SHUTDOWN CORES
              </button>
            </div>
          </div>
        </div>
      )}

      <TerminalOverlay />
    </div>
  );
}
