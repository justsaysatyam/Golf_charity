'use client';

import { motion } from 'framer-motion';
import { BarChart3, Users, DollarSign, Heart, Trophy, TrendingUp } from 'lucide-react';

const reports = [
  { label: 'Total Registered Users', value: '5,234', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+247 this month' },
  { label: 'Active Subscribers', value: '4,180', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', trend: '79.8% conversion' },
  { label: 'Monthly Revenue', value: '£41,758', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10', trend: '+12% vs last month' },
  { label: 'Total Prize Pool (Current)', value: '£14,500', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: 'Including £3,200 rollover' },
  { label: 'Total Charity Contributions', value: '£45,200', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10', trend: 'Across 6 charities' },
  { label: 'Total Draws Conducted', value: '24', icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-400/10', trend: '156 total winners' },
];

const charityBreakdown = [
  { name: 'First Tee', amount: '£12,500', pct: 28 },
  { name: 'Golf Fore Africa', amount: '£9,800', pct: 22 },
  { name: 'St. Jude Hospital', amount: '£8,200', pct: 18 },
  { name: 'Folds of Honor', amount: '£7,100', pct: 16 },
  { name: 'PGA HOPE', amount: '£4,200', pct: 9 },
  { name: 'Nature Conservancy', amount: '£3,400', pct: 7 },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Reports & Analytics</h1>
        <p className="text-slate-400">Platform statistics and performance metrics.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{r.label}</span>
              <div className={`w-9 h-9 rounded-lg ${r.bg} flex items-center justify-center`}><r.icon className={`w-5 h-5 ${r.color}`} /></div>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-1">{r.value}</div>
            <div className="text-xs text-slate-400">{r.trend}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4">Charity Contribution Breakdown</h2>
        <div className="space-y-4">
          {charityBreakdown.map(c => (
            <div key={c.name}>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-300">{c.name}</span><span className="text-primary font-medium">{c.amount}</span></div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <motion.div className="h-full gradient-primary rounded-full" initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4">Draw Statistics</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: 'Avg. 5-Match Pool', value: '£5,800' },
            { label: 'Avg. 4-Match Pool', value: '£5,075' },
            { label: 'Avg. 3-Match Pool', value: '£3,625' },
            { label: 'Total Rollover', value: '£3,200' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl bg-dark/50 border border-dark-border/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{s.label}</div>
              <div className="font-display text-xl font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
