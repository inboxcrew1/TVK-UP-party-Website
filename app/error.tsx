'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Page Error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#040105] text-white flex items-center justify-center p-6 select-none font-sans">
      <div className="max-w-md w-full bg-slate-900/90 border-2 border-amber-400/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest block">
            TVK UTTAR PRADESH &bull; SYSTEM NOTICE
          </span>
          <h2 className="text-2xl font-black font-display text-white">
            पेज लोड करने में अस्थायी समस्या
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            सर्वर से संपर्क पुनः स्थापित किया जा रहा है। कृपया पेज को रीलोड करें। (Temporary connection reset. Please reload the page.)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span>पुनः प्रयास करें (Reload)</span>
          </button>

          <Link
            href="/"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>मुख्य पृष्ठ (Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
