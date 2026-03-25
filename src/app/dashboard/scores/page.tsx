'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/provider';
import { createClient } from '@/lib/supabase/client';
import { Score } from '@/lib/types';

export default function ScoresPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [scoreValue, setScoreValue] = useState('');
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchScores = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5);
    setScores(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_value: parseInt(scoreValue),
          score_date: scoreDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add score');
      } else {
        setSuccess('Score added successfully!');
        setScoreValue('');
        await fetchScores();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/scores', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await fetchScores();
    } catch {
      setError('Failed to delete score');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-white mb-1">My Scores</h1>
        <p className="text-slate-400">
          Enter your last 5 golf scores (1-45). Oldest is replaced when you add a new one.
        </p>
      </motion.div>

      {/* Score Entry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Enter New Score
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Score Value (1-45)
            </label>
            <input
              type="number"
              min="1"
              max="45"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value)}
              placeholder="e.g. 28"
              required
              className="w-full px-4 py-3 rounded-xl bg-dark-input border border-dark-border text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Date Played
            </label>
            <input
              type="date"
              value={scoreDate}
              onChange={(e) => setScoreDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-dark-input border border-dark-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Score
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Score History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Score History ({scores.length}/5)
        </h2>

        {scores.length > 0 ? (
          <div className="space-y-3">
            {scores.map((score, i) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-dark/50 border border-dark-border/50 group hover:border-dark-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-primary">
                      {score.score_value}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Score: {score.score_value}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(score.score_date).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(score.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No scores entered yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Enter your first score above to get started!
            </p>
          </div>
        )}

        {scores.length >= 5 && (
          <p className="text-xs text-slate-500 mt-4 text-center">
            Maximum 5 scores stored. Adding a new score will replace the oldest.
          </p>
        )}
      </motion.div>
    </div>
  );
}
