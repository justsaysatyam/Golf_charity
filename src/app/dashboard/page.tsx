'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Trophy,
  Heart,
  CreditCard,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/provider';
import { createClient } from '@/lib/supabase/client';
import { Score, Subscription } from '@/lib/types';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const supabase = createClient();

      const [subRes, scoresRes] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .order('score_date', { ascending: false })
          .limit(5),
      ]);

      setSubscription(subRes.data);
      setScores(scoresRes.data || []);
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

  const stats = [
    {
      label: 'Subscription',
      value: subscription?.status === 'active' ? 'Active' : 'Inactive',
      icon: CreditCard,
      color: subscription?.status === 'active' ? 'text-green-400' : 'text-red-400',
      bg: subscription?.status === 'active' ? 'bg-green-400/10' : 'bg-red-400/10',
    },
    {
      label: 'Scores Entered',
      value: `${scores.length}/5`,
      icon: Target,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Best Score',
      value: scores.length > 0 ? Math.min(...scores.map((s) => s.score_value)) : '-',
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Plan Type',
      value: subscription?.plan_type
        ? subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)
        : 'None',
      icon: Calendar,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
  ];

  const quickLinks = [
    { href: '/dashboard/scores', label: 'Enter Scores', icon: Target, desc: 'Submit your latest golf scores' },
    { href: '/dashboard/charity', label: 'My Charity', icon: Heart, desc: 'Choose and manage your charity' },
    { href: '/dashboard/draws', label: 'View Draws', icon: Trophy, desc: 'Check draw results and history' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold text-white mb-1">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Golfer'} 👋
        </h1>
        <p className="text-slate-400">Here&apos;s your golf charity dashboard overview.</p>
      </motion.div>

      {/* Subscription Warning */}
      {!subscription || subscription.status !== 'active' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-300">
              Subscribe to enter scores and participate in draws
            </span>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-dark gradient-gold"
          >
            Subscribe
          </Link>
        </motion.div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className={`font-display text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-white">Recent Scores</h2>
          <Link
            href="/dashboard/scores"
            className="text-sm text-primary hover:text-primary-light flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {scores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3">
                    Score
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.id} className="border-b border-dark-border/50 last:border-0">
                    <td className="py-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold">
                        {score.score_value}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-400">
                      {new Date(score.score_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-4 text-center">No scores entered yet.</p>
        )}
      </motion.div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
          >
            <Link
              href={link.href}
              className="block p-5 rounded-xl glass hover:bg-white/[0.06] transition-all group"
            >
              <link.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">{link.label}</h3>
              <p className="text-xs text-slate-400">{link.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
