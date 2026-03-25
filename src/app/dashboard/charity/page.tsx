'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Percent } from 'lucide-react';
import { useAuth } from '@/lib/auth/provider';
import { createClient } from '@/lib/supabase/client';
import { Charity, UserCharity } from '@/lib/types';

const fallbackCharities: Charity[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'First Tee', description: 'Building game changers through golf.', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400', website: 'https://firsttee.org', featured: true, created_at: '', updated_at: '' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Golf Fore Africa', description: 'Clean water and education in Africa.', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400', website: 'https://golfforeafrica.org', featured: true, created_at: '', updated_at: '' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'St. Jude Hospital', description: 'Childhood cancer research and treatment.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400', website: 'https://stjude.org', featured: true, created_at: '', updated_at: '' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Folds of Honor', description: 'Scholarships for military families.', image: 'https://images.unsplash.com/photo-1529243856184-fd5465488984?w=400', website: 'https://foldsofhonor.org', featured: true, created_at: '', updated_at: '' },
];

export default function CharityPage() {
  const { user } = useAuth();
  const [charities, setCharities] = useState<Charity[]>(fallbackCharities);
  const [selectedCharity, setSelectedCharity] = useState<UserCharity | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const supabase = createClient();

      const [charitiesRes, userCharityRes] = await Promise.all([
        supabase.from('charities').select('*').order('name'),
        supabase
          .from('user_charities')
          .select('*, charity:charities(*)')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle(),
      ]);

      if (charitiesRes.data && charitiesRes.data.length > 0) {
        setCharities(charitiesRes.data);
      }

      if (userCharityRes.data) {
        setSelectedCharity(userCharityRes.data);
        setPercentage(userCharityRes.data.contribution_percentage);
      }
    };

    fetchData();
  }, [user]);

  const handleSelectCharity = async (charityId: string) => {
    if (!user) return;
    setSaving(true);

    const supabase = createClient();

    // Upsert user charity selection
    const { data, error } = await supabase
      .from('user_charities')
      .upsert(
        {
          user_id: user.id,
          charity_id: charityId,
          contribution_percentage: percentage,
        },
        { onConflict: 'user_id,charity_id' }
      )
      .select('*, charity:charities(*)')
      .single();

    if (!error && data) {
      setSelectedCharity(data);
      setSuccess('Charity updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }

    setSaving(false);
  };

  const handleUpdatePercentage = async () => {
    if (!user || !selectedCharity) return;
    setSaving(true);

    const supabase = createClient();

    await supabase
      .from('user_charities')
      .update({ contribution_percentage: percentage })
      .eq('user_id', user.id);

    setSuccess('Contribution percentage updated!');
    setTimeout(() => setSuccess(''), 3000);
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">My Charity</h1>
        <p className="text-slate-400">Choose a charity and set your contribution percentage.</p>
      </motion.div>

      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Current Selection */}
      {selectedCharity && selectedCharity.charity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Your Selected Charity
          </h2>
          <div className="flex items-start gap-4">
            <img
              src={selectedCharity.charity.image}
              alt={selectedCharity.charity.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-white">{selectedCharity.charity.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedCharity.charity.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm text-primary font-medium">
                  {selectedCharity.contribution_percentage}% of subscription
                </span>
              </div>
            </div>
          </div>

          {/* Percentage slider */}
          <div className="mt-6 pt-6 border-t border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Contribution Percentage
              </label>
              <span className="text-lg font-bold text-primary">{percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>10% (minimum)</span>
              <span>50%</span>
            </div>
            <button
              onClick={handleUpdatePercentage}
              disabled={saving}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Percentage'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Charity Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          {selectedCharity ? 'Switch Charity' : 'Choose a Charity'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {charities.map((charity) => {
            const isSelected = selectedCharity?.charity_id === charity.id;
            return (
              <div
                key={charity.id}
                className={`glass rounded-xl p-4 cursor-pointer transition-all hover:ring-1 hover:ring-primary/30 ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => !isSelected && handleSelectCharity(charity.id)}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={charity.image}
                    alt={charity.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">{charity.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{charity.description}</p>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                        <Heart className="w-3 h-3 fill-primary" />
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
