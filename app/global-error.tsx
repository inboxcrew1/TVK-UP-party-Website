'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Global Root Error:', error);
  }, [error]);

  return (
    <html lang="hi">
      <body className="bg-[#040105] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mx-auto text-2xl font-black">
            TVK
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              TVK Uttar Pradesh Platform
            </h2>
            <p className="text-xs text-slate-300">
              An unexpected system recovery event occurred. Click below to refresh.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            Reload Website
          </button>
        </div>
      </body>
    </html>
  );
}
