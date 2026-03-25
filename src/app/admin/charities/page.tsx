'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Star, Loader2, X } from 'lucide-react';
import { Charity } from '@/lib/types';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Charity | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', website: '', featured: false });
  const [saving, setSaving] = useState(false);

  const fetchCharities = async () => {
    const res = await fetch('/api/charities');
    const data = await res.json();
    setCharities(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCharities(); }, []);

  const handleSave = async () => {
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch('/api/charities', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', image: '', website: '', featured: false });
    await fetchCharities();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this charity?')) return;
    await fetch('/api/charities', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await fetchCharities();
  };

  const openEdit = (c: Charity) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, image: c.image || '', website: c.website || '', featured: c.featured });
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold text-white mb-1">Charities</h1><p className="text-slate-400">Manage partner charities.</p></div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', image: '', website: '', featured: false }); }} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 flex items-center gap-2"><Plus className="w-4 h-4" />Add Charity</button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">{editing ? 'Edit' : 'Add'} Charity</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-300 mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-dark-input border border-dark-border text-white text-sm focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm text-slate-300 mb-1">Website</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-dark-input border border-dark-border text-white text-sm focus:outline-none focus:border-primary" /></div>
            <div className="sm:col-span-2"><label className="block text-sm text-slate-300 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-dark-input border border-dark-border text-white text-sm focus:outline-none focus:border-primary resize-none" /></div>
            <div><label className="block text-sm text-slate-300 mb-1">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-dark-input border border-dark-border text-white text-sm focus:outline-none focus:border-primary" /></div>
            <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" /><span className="text-sm text-slate-300">Featured</span></label></div>
          </div>
          <button onClick={handleSave} disabled={saving || !form.name || !form.description} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{editing ? 'Update' : 'Create'}
          </button>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {charities.map(c => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl overflow-hidden">
            {c.image && <img src={c.image} alt={c.name} className="w-full h-36 object-cover" />}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                {c.featured && <Star className="w-4 h-4 text-accent flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(c)} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1"><Pencil className="w-3 h-3" />Edit</button>
                <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-400/10 flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
