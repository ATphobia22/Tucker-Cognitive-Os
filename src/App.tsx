import { useState } from 'react';
import { ExecutionGraph } from './components/ExecutionGraph';
import { AssimilationView } from './components/AssimilationView';
import { EvidenceView } from './components/EvidenceView';
import { DigitalTwinView } from './components/DigitalTwinView';
import { Network, Database, Shield, MonitorPlay } from 'lucide-react';
import { cn } from './lib/utils';

type Tab = 'twin' | 'dag' | 'assimilation' | 'evidence';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('twin');

  return (
    <div className="w-screen h-screen flex flex-col bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <div className="h-14 border-b border-slate-800 bg-[#0F172A] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white tracking-tighter">
            PT
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide">Tri-State Digital Engineering System</h1>
            <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">v32 Operational Build</div>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setActiveTab('twin')}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200", activeTab === 'twin' ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}
          >
            <MonitorPlay size={14} /> WebGPU Twin
          </button>
          <button 
            onClick={() => setActiveTab('dag')}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200", activeTab === 'dag' ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}
          >
            <Network size={14} /> Execution DAG
          </button>
          <button 
            onClick={() => setActiveTab('assimilation')}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200", activeTab === 'assimilation' ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}
          >
            <Database size={14} /> Assimilation
          </button>
          <button 
            onClick={() => setActiveTab('evidence')}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200", activeTab === 'evidence' ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}
          >
            <Shield size={14} /> Evidence
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'twin' && <DigitalTwinView />}
        {activeTab === 'dag' && <ExecutionGraph />}
        {activeTab === 'assimilation' && <AssimilationView />}
        {activeTab === 'evidence' && <EvidenceView />}
      </div>
    </div>
  );
}

export default App;
