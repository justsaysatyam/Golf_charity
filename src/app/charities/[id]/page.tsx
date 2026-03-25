'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Heart, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Charity } from '@/lib/types';

export default function CharityProfilePage() {
  const { id } = useParams();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('charities')
          .select('*')
          .eq('id', id)
          .single();
        setCharity(data);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchCharity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex items-center justify-center py-32">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-white mb-4">Charity Not Found</h1>
          <Link href="/charities" className="text-primary hover:text-primary-light">
            ← Back to Charities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/charities"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Charities
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass rounded-2xl overflow-hidden">
            {charity.image && (
              <div className="relative h-64 sm:h-80">
                <img
                  src={charity.image}
                  alt={charity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                {charity.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-accent/90 text-sm font-semibold text-dark flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    Featured Charity
                  </div>
                )}
              </div>
            )}

            <div className="p-8">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                {charity.name}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                {charity.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {charity.website && (
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-sm font-medium text-slate-300 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                >
                  <Heart className="w-4 h-4" />
                  Support This Charity
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
