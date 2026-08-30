'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, ArrowRight, KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [preAuthToken, setPreAuthToken] = useState<string | null>(null);
  const [targetEmail, setTargetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 5-minute expiry timer (300 seconds)
  const [expirySeconds, setExpirySeconds] = useState(300);
  // Resend cooldown timer (60 seconds)
  const [resendCooldown, setResendCooldown] = useState(60);

  // Expiry countdown effect
  useEffect(() => {
    if (step !== 'OTP') return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Resend cooldown countdown effect
  useEffect(() => {
    if (step !== 'OTP' || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendCooldown]);

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate. Please check your admin credentials.');
      }

      if (data.requireOtp && data.preAuthToken) {
        setPreAuthToken(data.preAuthToken);
        setTargetEmail(data.email || email.trim());
        setStep('OTP');
        setExpirySeconds(300);
        setResendCooldown(60);
        setOtp('');
      } else {
        // Direct session fallback if ever configured
        router.push('/admin/dashboard');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected login error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanOtp = otp.replace(/\s+/g, '');
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError('Please enter the complete 6-digit numeric verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preAuthToken,
          otp: cleanOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      // Success: redirect to dashboard
      router.push(data.redirect || '/admin/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to verify code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setError(null);
    setSuccessMsg(null);
    setResending(true);

    try {
      const res = await fetch('/api/admin/login/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preAuthToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to resend verification code.');
      }

      setSuccessMsg('A fresh verification code has been dispatched to your email.');
      setExpirySeconds(300);
      setResendCooldown(60);
      setOtp('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code';
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#F3EDE2] to-[#FCE8E8] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Atmosphere Beams */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#A00000]/25 via-[#C8102E]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#C8102E]/20 via-[#A00000]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-stone-300 rounded-3xl shadow-2xl p-8 relative z-10 text-slate-900"
      >
        <AnimatePresence mode="wait">
          {step === 'CREDENTIALS' ? (
            <motion.div
              key="step-credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
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
                  UP State High-Security Administration
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

              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-800 text-xs font-black uppercase tracking-wider mb-2">
                    Authorized Admin Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="tvkuttarpradesh@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border-2 border-stone-300 focus:border-[#A00000] focus:ring-1 focus:ring-[#A00000] text-slate-900 font-bold rounded-xl pl-12 pr-4 py-3.5 text-sm transition-all outline-none"
                      required
                      autoFocus
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
                      Sign In & Request OTP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  <Shield className="w-3 h-3 text-amber-600" /> Mandatory 2FA Active
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* OTP Screen Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#800000] via-[#A00000] to-amber-500 flex items-center justify-center shadow-lg mb-3 border-2 border-amber-300">
                  <KeyRound className="w-8 h-8 text-white stroke-[2.5]" />
                </div>
                <h1 className="text-xl font-black text-[#800000] text-center font-display tracking-wider uppercase">
                  TWO-FACTOR SECURITY
                </h1>
                <p className="text-slate-600 text-xs font-semibold text-center mt-1">
                  Enter the 6-digit verification code sent to:
                </p>
                <div className="mt-1.5 px-3 py-1 bg-stone-100 border border-stone-300 rounded-lg text-xs font-mono font-black text-slate-900">
                  {targetEmail}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {successMsg}
                </motion.div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-800 text-xs font-black uppercase tracking-wider">
                      6-Digit Security Code
                    </label>
                    <span className={`text-xs font-mono font-bold ${expirySeconds < 60 ? 'text-red-600 animate-pulse' : 'text-slate-500'}`}>
                      Expires: {formatTime(expirySeconds)}
                    </span>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-stone-50 border-2 border-stone-300 focus:border-[#A00000] focus:ring-2 focus:ring-[#A00000]/20 text-slate-950 font-black rounded-xl text-center text-3xl tracking-[0.5em] py-3.5 transition-all outline-none font-mono placeholder:text-stone-300"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Check your spam or junk folder if you do not see the email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6 || expirySeconds === 0}
                  className="w-full bg-gradient-to-r from-[#800000] via-[#A00000] to-amber-600 hover:from-red-900 hover:to-amber-700 text-white font-black py-4 px-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Access Dashboard <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend and Back Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('CREDENTIALS');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-slate-600 hover:text-slate-950 font-bold flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || resending}
                    onClick={handleResendOtp}
                    className="text-[#A00000] hover:text-[#800000] disabled:text-slate-400 font-black flex items-center gap-1 transition-colors"
                  >
                    {resending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}