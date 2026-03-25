'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8 flex justify-center relative">
          <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50 scale-150"></div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="relative z-10 p-6 bg-white rounded-3xl shadow-xl text-primary-600"
          >
            <Search className="w-16 h-16" />
          </motion.div>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-10 leading-relaxed text-lg">
          Oops! The green you&apos;re looking for seems to be on another course. Let&apos;s get you back on track.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transform hover:-translate-y-1 transition-all active:scale-95"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transform hover:-translate-y-1 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Scores</div>
            <Link href="/dashboard/scores" className="text-primary-600 hover:underline font-medium">Log Score</Link>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Draws</div>
            <Link href="/pricing" className="text-primary-600 hover:underline font-medium">Pricing</Link>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Impact</div>
            <Link href="/charities" className="text-primary-600 hover:underline font-medium">Charities</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
