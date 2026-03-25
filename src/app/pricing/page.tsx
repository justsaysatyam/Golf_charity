'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Star } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const plans = [
  {
    name: 'Monthly',
    price: '9.99',
    interval: '/month',
    badge: null,
    features: [
      'Enter your last 5 golf scores',
      'Participate in monthly draws',
      'Support your chosen charity (min 10%)',
      'Win from the prize pool',
      'Full dashboard access',
      'Score history & analytics',
    ],
    cta: 'Start Monthly',
    popular: false,
    gradient: 'from-slate-600 to-slate-700',
  },
  {
    name: 'Yearly',
    price: '99.99',
    interval: '/year',
    badge: 'Save 17%',
    features: [
      'Everything in Monthly',
      'Save £19.89 per year',
      'Priority customer support',
      'Exclusive yearly bonus draws',
      'Early access to new features',
      'Annual charity impact report',
    ],
    cta: 'Start Yearly',
    popular: true,
    gradient: 'from-primary to-primary-dark',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple Pricing
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Join thousands of golfers making a difference. Every plan includes full access to draws, scores, and charity contributions.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary shadow-xl shadow-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 gradient-primary py-2 text-center text-sm font-semibold text-white flex items-center justify-center gap-1.5">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              )}
              <div className={`glass p-8 h-full flex flex-col ${plan.popular ? 'pt-14' : ''}`}>
                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-1">{plan.name}</h3>
                  {plan.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <span className="font-display text-5xl font-bold text-white">£{plan.price}</span>
                  <span className="text-slate-400 text-lg">{plan.interval}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`w-full py-3.5 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'text-white gradient-primary hover:opacity-90 shadow-lg shadow-primary/25'
                      : 'text-slate-300 glass hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-12">
          <p className="text-sm text-slate-400">
            All plans include a minimum 10% charitable contribution. Cancel anytime.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
