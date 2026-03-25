'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Play, Eye, Zap, Loader2, Hash } from 'lucide-react';

export default function AdminDrawsPage() {
  const [drawType, setDrawType] = useState<'random' | 'weighted'>('random');
  const [simMode, setSimMode] = useState(true);
  const [running, setRunning] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const runDraw = async () => {
    setRunning(true);
    setError('');
    setResult(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await fetch('/api/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draw_type: drawType, simulate: simMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message || 'Failed to run draw');
    }
    setRunning(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Draw Management</h1>
        <p className="text-slate-400">Configure and run monthly prize draws.</p>
      </motion.div>

      {/* Draw Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-accent" />Configure Draw</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Draw Type</label>
            <div className="flex gap-3">
              {(['random', 'weighted'] as const).map(t => (
                <button key={t} onClick={() => setDrawType(t)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${drawType === t ? 'gradient-primary text-white shadow-lg shadow-primary/25' : 'glass text-slate-400 hover:text-white'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
            <div className="flex gap-3">
              <button onClick={() => setSimMode(true)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${simMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'glass text-slate-400 hover:text-white'}`}><Eye className="w-4 h-4 inline mr-1" />Simulate</button>
              <button onClick={() => setSimMode(false)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${!simMode ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass text-slate-400 hover:text-white'}`}><Play className="w-4 h-4 inline mr-1" />Publish</button>
            </div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <button onClick={runDraw} disabled={running} className="px-6 py-3 rounded-xl font-semibold text-white gradient-gold hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 disabled:opacity-50">
          {running ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
          {running ? 'Running...' : simMode ? 'Run Simulation' : 'Run & Publish Draw'}
        </button>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Hash className="w-5 h-5 text-primary" />Draw Results</h2>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-slate-400">Winning Numbers:</span>
            <div className="flex gap-2">
              {result.results?.winningNumbers?.map((n: number, i: number) => (
                <div key={i} className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-primary/20">{n}</div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
              <div className="text-xs text-slate-400 mb-1">5 Match Winners</div>
              <div className="font-display text-2xl font-bold text-amber-400">{result.results?.winners?.fiveMatch?.length || 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/10 text-center">
              <div className="text-xs text-slate-400 mb-1">4 Match Winners</div>
              <div className="font-display text-2xl font-bold text-slate-300">{result.results?.winners?.fourMatch?.length || 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-700/5 border border-amber-700/10 text-center">
              <div className="text-xs text-slate-400 mb-1">3 Match Winners</div>
              <div className="font-display text-2xl font-bold text-amber-600">{result.results?.winners?.threeMatch?.length || 0}</div>
            </div>
          </div>

          {result.results?.jackpotRollover > 0 && (
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 text-center text-sm text-accent">🎰 Jackpot rollover: £{result.results.jackpotRollover.toFixed(2)}</div>
          )}
          <div className="mt-4 text-xs text-slate-500">{simMode ? '⚠️ This was a simulation — no results saved.' : '✅ Draw published and results saved.'}</div>
        </motion.div>
      )}
    </div>
  );
}
