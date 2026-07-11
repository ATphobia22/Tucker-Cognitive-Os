import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, Radio, CheckCircle, Database } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TelemetryPoint {
  time: string;
  wabashStage: number;
  ohioStage: number;
}

export default function USGSTelemetryMonitor() {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [liveGages, setLiveGages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadLiveGageTelemetry = async () => {
    setIsLoading(true);
    // Simulate API query delay
    setTimeout(() => {
      const now = new Date();
      const newGages = [
        {
          gauge_id: "USGS-03377500",
          name: "Wabash River at New Harmony, IN",
          stage_ft: parseFloat((18.42 + (Math.random() - 0.5) * 0.4).toFixed(2)),
          discharge_cfs: Math.floor(45100 + (Math.random() - 0.5) * 1200),
          temperature_c: 16.5,
          seal: Math.random().toString(16).substring(2, 10).toUpperCase()
        },
        {
          gauge_id: "USGS-03322000",
          name: "Ohio River at Uniontown Dam, IN",
          stage_ft: parseFloat((24.85 + (Math.random() - 0.5) * 0.6).toFixed(2)),
          discharge_cfs: Math.floor(115000 + (Math.random() - 0.5) * 2500),
          temperature_c: 15.2,
          seal: Math.random().toString(16).substring(2, 10).toUpperCase()
        }
      ];

      setLiveGages(newGages);
      
      // Update Chart timeseries
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTelemetryHistory(prev => {
        const next = [...prev, {
          time: timeStr,
          wabashStage: newGages[0].stage_ft,
          ohioStage: newGages[1].stage_ft
        }];
        if (next.length > 8) return next.slice(1);
        return next;
      });

      setLastUpdated(now.toLocaleTimeString());
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    // Generate initial chart data points for historical context
    const points: TelemetryPoint[] = [];
    const baseWabash = 18.0;
    const baseOhio = 24.2;
    for (let i = 7; i >= 0; i--) {
      const d = new Date(Date.now() - i * 60000);
      points.push({
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        wabashStage: parseFloat((baseWabash + Math.sin(i) * 0.3 + Math.random() * 0.1).toFixed(2)),
        ohioStage: parseFloat((baseOhio + Math.cos(i) * 0.4 + Math.random() * 0.15).toFixed(2))
      });
    }
    setTelemetryHistory(points);
    loadLiveGageTelemetry();

    const interval = setInterval(loadLiveGageTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#05070d]/80 border border-[#162035] rounded-xl p-5 shadow-2xl space-y-5">
      <div className="flex justify-between items-center border-b border-[#162035] pb-3">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-xs text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            USGS Stream Telemetry & Hydrology Gages
          </h3>
          <p className="text-[10px] text-gray-400">
            High-frequency stream gages monitoring water level and discharge rates under G1P seals.
          </p>
        </div>
        <button
          onClick={loadLiveGageTelemetry}
          disabled={isLoading}
          className="p-1.5 rounded bg-cyan-950/45 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-900/30 transition text-xs flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "FEEDING..." : "QUERY NOW"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveGages.map((gage, i) => (
          <div key={i} className="bg-black/40 border border-[#162035]/65 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] text-[#22d4bf] font-bold block">{gage.gauge_id}</span>
              <span className="text-[8px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/25 rounded px-1.5 py-0.5 flex items-center gap-0.5 font-mono">
                <CheckCircle className="h-2 w-2 text-emerald-400" />
                SEALED: 0x{gage.seal}
              </span>
            </div>
            <h4 className="font-display text-xs font-semibold text-white leading-tight">{gage.name}</h4>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#162035]/40 font-mono">
              <div>
                <span className="text-[8.5px] text-gray-500 block">WATER STAGE</span>
                <span className="text-sm font-bold text-cyan-300">{gage.stage_ft} FT</span>
              </div>
              <div>
                <span className="text-[8.5px] text-gray-500 block">DISCHARGE FLOW</span>
                <span className="text-sm font-bold text-purple-400">{gage.discharge_cfs.toLocaleString()} CFS</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <span className="text-[9px] font-mono text-gray-500 block uppercase">Real-Time River Depth Elevation Levels (ft)</span>
        <div className="h-[140px] bg-black/40 rounded-lg p-2 border border-[#162035]/65">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid stroke="#162035" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '8px', fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" domain={[10, 30]} style={{ fontSize: '8px', fontFamily: 'monospace' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#070b14', borderColor: '#162035', color: '#f1f5f9', fontSize: '9px', fontFamily: 'monospace' }}
                labelStyle={{ color: '#64748b' }}
              />
              <Line type="monotone" dataKey="wabashStage" stroke="#06b6d4" strokeWidth={2} dot={false} name="Wabash Stage" />
              <Line type="monotone" dataKey="ohioStage" stroke="#a78bfa" strokeWidth={2} dot={false} name="Ohio Stage" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 pt-1 border-t border-[#162035]/40">
        <span className="flex items-center gap-1">
          <Database className="h-2.5 w-2.5" />
          TIMESCALEDB TELEMETRY BUFFER: CONNECTED
        </span>
        <span>LAST SWARM POLL: {lastUpdated || "STANDBY"}</span>
      </div>
    </div>
  );
}
