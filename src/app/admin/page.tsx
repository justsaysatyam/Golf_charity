'use client';

import { motion } from 'framer-motion';
import { Users, Trophy, Heart, Gift, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Users', value: '5,234', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', change: '+12%' },
  { label: 'Active Subscribers', value: '4,180', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', change: '+8%' },
  { label: 'Total Prize Pool', value: '£14,500', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10', change: '+15%' },
  { label: 'Charity Donations', value: '£45,200', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10', change: '+22%' },
  { label: 'Total Draws', value: '24', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10', change: '' },
  { label: 'Pending Verifications', value: '7', icon: Gift, color: 'text-amber-400', bg: 'bg-amber-400/10', change: '' },
];

const actions = [
  { href: '/admin/draws', label: 'Run Monthly Draw', desc: 'Execute or simulate the monthly prize draw', icon: Trophy, color: 'gradient-gold' },
  { href: '/admin/users', label: 'Manage Users', desc: 'View and edit user profiles and subscriptions', icon: Users, color: 'gradient-primary' },
  { href: '/admin/winners', label: 'Verify Winners', desc: 'Review proof submissions and approve payouts', icon: Gift, color: 'gradient-secondary' },
  { href: '/admin/charities', label: 'Manage Charities', desc: 'Add, edit, or remove partner charities', icon: Heart, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-slate-400">Platform overview and quick actions.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            </div>
            <div className="flex items-end justify-between">
              <span className="font-display text-2xl font-bold text-white">{s.value}</span>
              {s.change && <span className="text-xs text-green-400 font-medium">{s.change}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {actions.map((a, i) => (
            <motion.div key={a.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
              <Link href={a.href} className="block p-5 rounded-xl glass hover:bg-white/[0.06] transition-all group">
                <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <a.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{a.label}</h3>
                <p className="text-xs text-slate-400">{a.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
