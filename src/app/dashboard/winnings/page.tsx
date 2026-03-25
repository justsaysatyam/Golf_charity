'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/provider';
import { createClient } from '@/lib/supabase/client';
import { Winner } from '@/lib/types';

export default function WinningsPage() {
  const { user } = useAuth();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    const fetch_ = async () => {
      if (!user) return;
      const s = createClient();
      const { data } = await s.from('winners').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setWinners(data || []);
      setLoading(false);
    };
    fetch_();
  }, [user]);

  const handleUpload = async (wId: string) => {
    if (!proofUrl) return;
    await fetch('/api/winners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ winner_id: wId, proof_url: proofUrl, notes: 'Proof uploaded' }) });
    setUploadingId(null);
    setProofUrl('');
  };

  const sc: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Pending' },
    approved: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Approved' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Rejected' },
    paid: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10', label: 'Paid' },
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">My Winnings</h1>
        <p className="text-slate-400">View prizes and submit verification proof.</p>
      </motion.div>

      {winners.length > 0 ? (
        <div className="space-y-4">
          {winners.map((w, i) => {
            const st = sc[w.verification_status] || sc.pending;
            const Icon = st.icon;
            return (
              <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center"><Gift className="w-7 h-7 text-white" /></div>
                    <div>
                      <div className="font-display text-xl font-bold text-white">£{w.prize_amount.toFixed(2)}</div>
                      <div className="text-sm text-slate-400">{w.match_type.replace('_', ' ').toUpperCase()}</div>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${st.bg} ${st.color} text-sm font-medium`}><Icon className="w-4 h-4" />{st.label}</div>
                </div>
                {w.verification_status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    {uploadingId === w.id ? (
                      <div className="space-y-3">
                        <input type="url" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="Paste screenshot URL..." className="w-full px-4 py-2.5 rounded-xl bg-dark-input border border-dark-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary" />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpload(w.id)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white gradient-primary hover:opacity-90">Submit</button>
                          <button onClick={() => setUploadingId(null)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setUploadingId(w.id)} className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"><Upload className="w-4 h-4" />Upload Proof</button>
                    )}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-3">Won {new Date(w.created_at).toLocaleDateString('en-GB')}</div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-12 text-center">
          <Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold text-white mb-2">No Winnings Yet</h2>
          <p className="text-slate-400 text-sm">Keep entering scores and participating in draws!</p>
        </motion.div>
      )}
    </div>
  );
}
