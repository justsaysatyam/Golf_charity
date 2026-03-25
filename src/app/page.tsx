'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Heart,
  Target,
  Users,
  ArrowRight,
  Zap,
  CheckCircle,
  TrendingUp,
  Gift,
  Star,
} from 'lucide-react';
import {
  AnimatedSection,
  AnimatedCard,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/AnimatedSection';

// ====== HERO SECTION ======
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-primary font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            New Monthly Draw — March 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Play Golf.{' '}
            <span className="gradient-text">Win Prizes.</span>
            <br />
            <span className="gradient-text-gold">Make a Difference.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enter your golf scores, participate in exciting monthly prize draws,
            and know that part of your subscription goes to charities you care about.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-300 glass hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              View Plans
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto"
          >
            {[
              { value: '5K+', label: 'Members' },
              { value: '£120K', label: 'Prizes Won' },
              { value: '£45K', label: 'To Charity' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  );
}

// ====== HOW IT WORKS ======
function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: 'Subscribe',
      description: 'Choose a monthly or yearly plan that fits your budget.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Target,
      title: 'Enter Scores',
      description: 'Submit your last 5 golf scores from real rounds.',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      icon: Trophy,
      title: 'Monthly Draw',
      description: '5 numbers are drawn — match 3, 4, or all 5 to win!',
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Heart,
      title: 'Give Back',
      description: 'Part of your subscription goes to charities you choose.',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Four simple steps to start winning and making a difference
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="relative p-6 rounded-2xl glass hover:bg-white/[0.06] transition-all group h-full">
                <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ====== CHARITY IMPACT ======
function CharityImpact() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-400/10 text-red-400 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Charity Impact
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Every Subscription <span className="gradient-text">Changes Lives</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              At least 10% of every subscription goes directly to the charity of
              your choice. You can increase this percentage anytime, or make
              independent donations to causes close to your heart.
            </p>
            <div className="space-y-4">
              {[
                'Choose from verified charitable organizations',
                'Minimum 10% of your subscription to charity',
                'Increase your contribution percentage anytime',
                'Track your total charitable impact over time',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="glass rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="font-display text-5xl font-bold gradient-text mb-2">£45,000+</div>
                  <p className="text-slate-400">Donated to charities so far</p>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'First Tee', amount: '£12,500', pct: 75 },
                    { name: 'Golf Fore Africa', amount: '£9,800', pct: 60 },
                    { name: 'St. Jude Hospital', amount: '£8,200', pct: 50 },
                    { name: 'Folds of Honor', amount: '£7,100', pct: 43 },
                  ].map((charity) => (
                    <div key={charity.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300">{charity.name}</span>
                        <span className="text-primary font-medium">{charity.amount}</span>
                      </div>
                      <div className="h-2 bg-dark rounded-full overflow-hidden">
                        <motion.div
                          className="h-full gradient-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${charity.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ====== MONTHLY DRAW SECTION ======
function MonthlyDraw() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Monthly Prize Draw
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Match Your Scores, <span className="gradient-text-gold">Win Big</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every month, 5 numbers are drawn. The more your scores match, the bigger your prize!
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              match: '5 Match',
              pct: '40%',
              desc: 'Match all 5 numbers for the jackpot!',
              gradient: 'from-amber-500 to-orange-600',
              icon: '🏆',
              shadow: 'shadow-amber-500/20',
            },
            {
              match: '4 Match',
              pct: '35%',
              desc: 'Match 4 numbers for a great prize.',
              gradient: 'from-slate-300 to-slate-400',
              icon: '🥈',
              shadow: 'shadow-slate-400/20',
            },
            {
              match: '3 Match',
              pct: '25%',
              desc: 'Match 3 numbers to win a share.',
              gradient: 'from-amber-700 to-amber-800',
              icon: '🥉',
              shadow: 'shadow-amber-700/20',
            },
          ].map((tier, i) => (
            <AnimatedCard key={tier.match} delay={i * 0.1}>
              <div className={`relative p-6 rounded-2xl glass text-center h-full ${tier.shadow} shadow-lg`}>
                <div className="text-4xl mb-4">{tier.icon}</div>
                <h3 className="font-display text-xl font-bold text-white mb-1">
                  {tier.match}
                </h3>
                <div className={`text-3xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent mb-3`}>
                  {tier.pct}
                </div>
                <p className="text-sm text-slate-400">{tier.desc}</p>
                <p className="text-xs text-slate-500 mt-2">of the prize pool</p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-10">
          <div className="glass rounded-xl px-6 py-4 inline-flex items-center gap-3 text-sm text-slate-300">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span>No 5-match winner? The <strong className="text-accent">jackpot rolls over</strong> to next month!</span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ====== FEATURED CHARITIES ======
function FeaturedCharities() {
  const charities = [
    { name: 'First Tee', desc: 'Building character through golf for young people.', emoji: '⛳' },
    { name: 'Golf Fore Africa', desc: 'Clean water and education in sub-Saharan Africa.', emoji: '🌍' },
    { name: 'St. Jude Hospital', desc: 'Leading childhood cancer research and treatment.', emoji: '🏥' },
    { name: 'Folds of Honor', desc: 'Educational scholarships for military families.', emoji: '🎖️' },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured <span className="gradient-text">Charities</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose from our partner charities and make a real impact
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {charities.map((charity) => (
            <StaggerItem key={charity.name}>
              <div className="p-6 rounded-2xl glass hover:bg-white/[0.06] transition-all h-full group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{charity.emoji}</div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{charity.name}</h3>
                <p className="text-sm text-slate-400">{charity.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.2} className="text-center mt-10">
          <Link
            href="/charities"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors"
          >
            View All Charities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ====== SUBSCRIBE CTA ======
function SubscribeCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <Gift className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to <span className="gradient-text">Join the Game?</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Start from just £9.99/month. Enter your scores, win from the prize pool, and support your favourite charity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Subscribe Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Compare Plans →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ====== TESTIMONIALS ======
function Testimonials() {
  const testimonials = [
    {
      name: 'James W.',
      role: 'Member since 2025',
      text: "I love that my hobby is helping charities. Won the 4-match draw last month — amazing feeling!",
      rating: 5,
    },
    {
      name: 'Sarah M.',
      role: 'Member since 2024',
      text: "The platform is beautifully designed and so easy to use. Entering scores takes seconds.",
      rating: 5,
    },
    {
      name: 'David K.',
      role: 'Member since 2025',
      text: "Knowing part of my subscription goes to First Tee makes every round more meaningful.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our <span className="gradient-text">Members Say</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="p-6 rounded-2xl glass h-full">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ====== HOMEPAGE ======
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <CharityImpact />
      <MonthlyDraw />
      <FeaturedCharities />
      <SubscribeCTA />
      <Testimonials />
    </>
  );
}
