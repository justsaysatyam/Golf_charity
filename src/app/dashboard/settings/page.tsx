'use client';

import { motion } from 'framer-motion';
import { Settings, CreditCard, User, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/provider';

export default function SettingsPage() {
  const { profile, user } = useAuth();

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { /* handle error */ }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-400">Manage your account and subscription.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-dark/50 border border-dark-border/50">
            <User className="w-5 h-5 text-slate-400" />
            <div><div className="text-xs text-slate-400">Name</div><div className="text-sm text-white">{profile?.full_name || 'Not set'}</div></div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-dark/50 border border-dark-border/50">
            <Mail className="w-5 h-5 text-slate-400" />
            <div><div className="text-xs text-slate-400">Email</div><div className="text-sm text-white">{user?.email}</div></div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Subscription
        </h2>
        <p className="text-sm text-slate-400 mb-4">Manage your billing, update payment methods, or cancel your subscription through the Stripe portal.</p>
        <button onClick={handleManageSubscription} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Manage Subscription
        </button>
      </motion.div>
    </div>
  );
}
