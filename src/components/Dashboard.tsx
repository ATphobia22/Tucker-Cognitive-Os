import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Database, MonitorPlay, Network, Shield, AlertTriangle, Cpu, Globe, Sun, Moon, Maximize2 } from 'lucide-react';
import { AssimilationView } from './AssimilationView';
import { EvidenceView } from './EvidenceView';
import { MapComponent } from './MapComponent';
import { TerminalOverlay } from './TerminalOverlay';
import { useTheme } from '../context/ThemeContext';

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<'telemetry' | 'evidence' | null>('telemetry');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Background Map - Full Screen */}
      <div className="absolute inset-0 z-0">
        <MapComponent />
      </div>

      {/* HUD - Overlay */}
      <div className="absolute inset-0 z-10 p-6 pointer-events-none flex flex-col justify-between">
        {/* Header */}
        <header className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-700">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <Globe size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Tri-State Engineering Console</h1>
              <span className="text-[10px] text-emerald-400 font-mono uppercase">v32.1 Operational</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Side Panels - HUD */}
        <div className="flex-1 flex gap-6 mt-6 pointer-events-none">
          <div className="w-96 flex flex-col gap-4 pointer-events-auto">
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
          </div>

          <div className="flex-1"></div>
        </div>

        {/* Footer/Navigation HUD */}
        <footer className="pointer-events-auto flex gap-2">
          <button onClick={() => setActivePanel('telemetry')} className={`p-3 rounded-lg border ${activePanel === 'telemetry' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900/80 backdrop-blur-md border-slate-700'}`}>
            <Activity size={18} />
          </button>
          <button onClick={() => setActivePanel('evidence')} className={`p-3 rounded-lg border ${activePanel === 'evidence' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900/80 backdrop-blur-md border-slate-700'}`}>
            <Shield size={18} />
          </button>
        </footer>
      </div>

      <TerminalOverlay />
    </div>
  );
}
