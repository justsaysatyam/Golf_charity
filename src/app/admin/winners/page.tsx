'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { Winner } from '@/lib/types';

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    const res = await fetch('/api/winners');
    const data = await res.json();
    setWinners(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchWinners(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/winners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, verification_status: status }) });
    await fetchWinners();
  };

  const sc: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    approved: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
    paid: { icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Winner Verification</h1>
        <p className="text-slate-400">Review proof and manage payouts.</p>
      </motion.div>

      {winners.length > 0 ? (
        <div className="space-y-4">
          {winners.map((w, i) => {
            const s = sc[w.verification_status] || sc.pending;
            const Icon = s.icon;
            return (
              <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center"><Gift className="w-6 h-6 text-white" /></div>
                    <div>
                      <div className="font-semibold text-white">£{w.prize_amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">{w.match_type.replace('_', ' ')} • User: {w.user_id.slice(0, 8)}...</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${s.bg} ${s.color} text-xs font-medium`}><Icon className="w-3.5 h-3.5" />{w.verification_status}</span>
                  </div>
                </div>
                {w.verification_status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                    <button onClick={() => updateStatus(w.id, 'approved')} className="px-4 py-2 rounded-lg text-xs font-semibold text-green-400 bg-green-400/10 hover:bg-green-400/20">Approve</button>
                    <button onClick={() => updateStatus(w.id, 'rejected')} className="px-4 py-2 rounded-lg text-xs font-semibold text-red-400 bg-red-400/10 hover:bg-red-400/20">Reject</button>
                  </div>
                )}
                {w.verification_status === 'approved' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                    <button onClick={() => updateStatus(w.id, 'paid')} className="px-4 py-2 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20">Mark as Paid</button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center"><Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" /><p className="text-slate-400">No winners to verify.</p></div>
      )}
    </div>
  );
}
