'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text.includes('Internal Server Error') ? 'Server configuration error: Database connection could not be established. Please verify your DATABASE_URL in Hostinger settings.' : (text || `Server error (${res.status})`) };
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate. Please check your admin credentials.');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected login error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#F3EDE2] to-[#FCE8E8] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Decorative 30% TVK Party Flag Red Atmosphere Beams */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#A00000]/25 via-[#C8102E]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#C8102E]/20 via-[#A00000]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-stone-300 rounded-3xl shadow-2xl p-8 relative z-10 text-slate-900"
      >
        {/* Header/Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#800000] via-[#A00000] to-amber-500 flex items-center justify-center shadow-lg mb-4 border-2 border-amber-300">
            <Shield className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-black text-[#800000] text-center font-display tracking-wider uppercase">
            TVK OFFICER PORTAL
          </h1>
          <p className="text-amber-700 text-[11px] font-extrabold tracking-widest mt-1 uppercase">
            UP Digital Membership Administration
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-xs font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-800 text-xs font-black uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@tvkup.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border-2 border-stone-300 focus:border-[#A00000] focus:ring-1 focus:ring-[#A00000] text-slate-900 font-bold rounded-xl pl-12 pr-4 py-3.5 text-sm transition-all outline-none"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 text-xs font-black uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border-2 border-stone-300 focus:border-[#A00000] focus:ring-1 focus:ring-[#A00000] text-slate-900 font-bold rounded-xl pl-12 pr-4 py-3.5 text-sm transition-all outline-none"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#800000] via-[#A00000] to-amber-600 hover:from-red-900 hover:to-amber-700 text-white font-black py-4 px-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}