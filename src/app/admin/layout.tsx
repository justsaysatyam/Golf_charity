'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/provider';
import { LayoutDashboard, Users, Trophy, Heart, Gift, BarChart3, Shield, ChevronRight, Menu, X } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/draws', label: 'Draws', icon: Trophy },
  { href: '/admin/charities', label: 'Charities', icon: Heart },
  { href: '/admin/winners', label: 'Winners', icon: Gift },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      <button onClick={() => setOpen(!open)} className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-gold shadow-lg flex items-center justify-center text-white">
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <div className="flex">
        <aside className={`fixed lg:sticky top-16 lg:top-20 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-64 bg-dark-card border-r border-dark-border z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex flex-col h-full p-4">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold"><Shield className="w-4 h-4" />Admin Panel</div>
              <div className="text-xs text-slate-400 mt-1">{profile?.full_name || 'Admin'}</div>
            </div>
            <nav className="flex-1 space-y-1">
              {links.map(l => {
                const active = pathname === l.href;
                return (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <l.icon className="w-5 h-5" />{l.label}{active && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 mt-2">
              <LayoutDashboard className="w-5 h-5" />User Dashboard
            </Link>
          </div>
        </aside>
        <div className="flex-1 min-h-[calc(100vh-4rem)]"><div className="p-4 sm:p-6 lg:p-8">{children}</div></div>
      </div>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
