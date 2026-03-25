'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Hash, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/provider';
import { Draw, DrawResult } from '@/lib/types';

export default function DrawsPage() {
  const { user } = useAuth();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [myResults, setMyResults] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const supabase = createClient();

      const [drawsRes, resultsRes] = await Promise.all([
        supabase
          .from('draws')
          .select('*')
          .eq('status', 'published')
          .order('draw_date', { ascending: false }),
        supabase
          .from('draw_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      setDraws(drawsRes.data || []);
      setMyResults(resultsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Draw History</h1>
        <p className="text-slate-400">View past draws and check your results.</p>
      </motion.div>

      {/* My Results */}
      {myResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            My Results
          </h2>
          <div className="space-y-3">
            {myResults.map((result) => (
              <div
                key={result.id}
                className="p-4 rounded-xl bg-dark/50 border border-dark-border/50 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {result.match_count} Match{result.match_count !== 1 ? 'es' : ''}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Matched: {result.matched_numbers.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-bold text-primary">
                    £{result.prize_amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Draw History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Published Draws
        </h2>

        {draws.length > 0 ? (
          <div className="space-y-4">
            {draws.map((draw) => (
              <div
                key={draw.id}
                className="p-5 rounded-xl bg-dark/50 border border-dark-border/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">
                      {new Date(draw.draw_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Hash className="w-3 h-3" />
                    {draw.draw_type}
                  </span>
                </div>

                {/* Winning Numbers */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Winning Numbers:</span>
                  <div className="flex gap-2">
                    {draw.winning_numbers.map((num, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/20"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prize Pool */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-center">
                    <div className="text-xs text-slate-400 mb-1">5 Match</div>
                    <div className="font-semibold text-amber-400">
                      £{draw.prize_pool_5_match.toFixed(0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-500/5 border border-slate-500/10 text-center">
                    <div className="text-xs text-slate-400 mb-1">4 Match</div>
                    <div className="font-semibold text-slate-300">
                      £{draw.prize_pool_4_match.toFixed(0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-700/5 border border-amber-700/10 text-center">
                    <div className="text-xs text-slate-400 mb-1">3 Match</div>
                    <div className="font-semibold text-amber-600">
                      £{draw.prize_pool_3_match.toFixed(0)}
                    </div>
                  </div>
                </div>

                {draw.jackpot_rollover > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-accent/5 text-center text-xs text-accent">
                    🎰 Jackpot rolled over: £{draw.jackpot_rollover.toFixed(0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No draws published yet.</p>
            <p className="text-xs text-slate-500 mt-1">Stay tuned for the next monthly draw!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
