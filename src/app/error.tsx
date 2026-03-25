'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full text-red-600">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Please try refreshing or return to the home page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-left bg-gray-100 p-4 rounded-lg overflow-auto max-h-48">
            <p className="text-xs font-mono text-red-500 whitespace-pre-wrap">
              {error.message}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
