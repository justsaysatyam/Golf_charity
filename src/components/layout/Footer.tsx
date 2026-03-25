import Link from 'next/link';
import { Trophy, Heart, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Golf<span className="text-primary">Charity</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Play golf, win prizes, and make a difference. Every subscription
              contributes to meaningful charitable causes.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Making a difference, one score at a time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/charities', label: 'Charities' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#', label: 'FAQ' },
                { href: '#', label: 'Contact Us' },
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-primary" />
                support@golfcharity.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-primary" />
                Golf Charity HQ, United Kingdom
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GolfCharity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
