import { ShieldCheck, FileKey, Fingerprint, History, Box } from 'lucide-react';

export function EvidenceView() {
  const manifests = [
    { id: 'evd-a7x9...2b1c', time: '2026-07-14T18:45:00Z', status: 'Verified', signers: 3 },
    { id: 'evd-b4y8...9d3e', time: '2026-07-14T17:45:00Z', status: 'Verified', signers: 3 },
    { id: 'evd-c1z7...4f5a', time: '2026-07-14T16:45:00Z', status: 'Verified', signers: 3 },
  ];

  return (
    <div className="w-full h-full p-6 bg-[#020617] text-slate-100 flex flex-col gap-6 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-tight">Cryptographic Evidence Ledger</h2>
        <p className="text-sm text-slate-400 font-mono">Immutable provenance and supply chain security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#064E3B]/10 flex flex-col gap-3">
          <ShieldCheck className="text-emerald-400" size={24} />
          <div>
            <div className="text-sm font-medium">Chain Status</div>
            <div className="text-xl font-light text-emerald-400">Intact</div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0F172A] flex flex-col gap-3">
          <Box className="text-indigo-400" size={24} />
          <div>
            <div className="text-sm font-medium">Active SBOMs</div>
            <div className="text-xl font-light text-slate-200">12 Packages</div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0F172A] flex flex-col gap-3">
          <FileKey className="text-amber-400" size={24} />
          <div>
            <div className="text-sm font-medium">Key Rotation</div>
            <div className="text-xl font-light text-slate-200">In 45 Days</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Recent Manifests</h3>
        
        <div className="flex flex-col gap-3 font-mono text-sm">
          {manifests.map((m, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#0F172A] hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Fingerprint size={16} />
                </div>
                <div>
                  <div className="text-slate-200">{m.id}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <History size={12} /> {m.time}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-6 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500">Signatures</span>
                  <span className="text-emerald-400">{m.signers}/3 Valid</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500">Hash Alg</span>
                  <span className="text-slate-300">SHA-256 / ECDSA</span>
                </div>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                  View JSON
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
