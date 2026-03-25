'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Heart } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { createClient } from '@/lib/supabase/client';
import { Charity } from '@/lib/types';

// Fallback charities for demo
const fallbackCharities: Charity[] = [
  { id: '1', name: 'First Tee', description: 'Building game changers by providing young people with character education and life skills through golf.', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800', website: 'https://firsttee.org', featured: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Golf Fore Africa', description: 'Providing clean water, nutrition, education, and healthcare to communities in sub-Saharan Africa.', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800', website: 'https://golfforeafrica.org', featured: true, created_at: '', updated_at: '' },
  { id: '3', name: 'St. Jude Children\'s Research Hospital', description: 'Leading the way the world understands, treats, and defeats childhood cancer and other life-threatening diseases.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', website: 'https://stjude.org', featured: true, created_at: '', updated_at: '' },
  { id: '4', name: 'PGA HOPE', description: 'Introducing golf to veterans with disabilities to enhance their physical, mental, social, and emotional well-being.', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800', website: 'https://pgareach.org', featured: false, created_at: '', updated_at: '' },
  { id: '5', name: 'The Nature Conservancy', description: 'Protecting the lands and waters on which all life depends. Conservation through science and partnership.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', website: 'https://nature.org', featured: false, created_at: '', updated_at: '' },
  { id: '6', name: 'Folds of Honor', description: 'Providing educational scholarships to the spouses and children of fallen and disabled service members.', image: 'https://images.unsplash.com/photo-1529243856184-fd5465488984?w=800', website: 'https://foldsofhonor.org', featured: true, created_at: '', updated_at: '' },
];

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>(fallbackCharities);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('charities').select('*').order('name');
        if (data && data.length > 0) setCharities(data);
      } catch {
        // Use fallback charities
      }
    };
    fetchCharities();
  }, []);

  const filtered = charities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Our <span className="gradient-text">Charities</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Choose a charity to support with your subscription. Every penny counts.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search charities..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((charity) => (
            <StaggerItem key={charity.id}>
              <div className="glass rounded-2xl overflow-hidden group hover:ring-1 hover:ring-primary/30 transition-all h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={charity.image}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {charity.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent/90 text-xs font-semibold text-dark flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{charity.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{charity.description}</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dark-border">
                    <Link
                      href={`/charities/${charity.id}`}
                      className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
                    >
                      Learn More →
                    </Link>
                    {charity.website && (
                      <a
                        href={charity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-slate-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">No charities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
