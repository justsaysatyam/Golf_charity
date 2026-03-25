'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const s = createClient();
      const { data } = await s.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">User Management</h1>
        <p className="text-slate-400">View and manage platform users.</p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white placeholder-slate-500 focus:outline-none focus:border-primary" />
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">User</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Email</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Role</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white">{u.full_name?.charAt(0) || u.email.charAt(0).toUpperCase()}</div>
                      <span className="text-sm font-medium text-white">{u.full_name || 'No name'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-amber-400/10 text-amber-400' : 'bg-primary/10 text-primary'}`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}{u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">No users found.</div>}
      </div>
    </div>
  );
}
