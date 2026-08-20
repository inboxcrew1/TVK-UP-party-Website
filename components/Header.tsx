'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, Menu, X, Sparkles } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/leadership', label: t('leader') },
    { href: '/ideology', label: t('org') },
    { href: '/districts', label: t('districts') },
    { href: '/gallery', label: t('gallery') },
    { href: '/sadasyata', label: t('membership') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-2xl border-b-2 border-amber-400/50 py-2.5 text-white'
            : 'bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent py-3 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 flex items-center justify-between gap-2 lg:gap-3">
          {/* Left: TVK Logo with UTTAR PRADESH */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-14 sm:w-16 h-10 rounded-lg overflow-hidden border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] shrink-0 bg-slate-950 flex items-center justify-center transition-transform group-hover:scale-105">
              <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg"
                alt="TVK Official Red-Yellow Elephant Flag Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center text-left">
              <span className="font-black text-xl sm:text-2xl tracking-[0.12em] font-display text-white group-hover:text-amber-300 transition-colors leading-none drop-shadow-md">
                TVK
              </span>
              <span className="font-extrabold text-[10px] sm:text-[11px] tracking-widest text-amber-400 uppercase drop-shadow leading-tight mt-0.5">
                {t('titleSub')}
              </span>
              <p className="text-[8.5px] sm:text-[9px] font-extrabold text-slate-300 tracking-wide uppercase mt-0.5">
                तमिलग वेत्रि कषगम
              </p>
            </div>
          </Link>

          {/* Center Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-4 font-black tracking-normal shrink min-w-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/leadership' && pathname === '/leader') || (link.href === '/gallery' && pathname === '/elections');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 px-2.5 xl:px-3.5 rounded-xl transition-all whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm min-h-[44px] flex items-center ${
                    isActive
                      ? 'text-amber-300 bg-amber-400/20 border border-amber-400/60 shadow-md font-black'
                      : 'text-slate-100 hover:text-amber-300 hover:bg-slate-800/70'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full shadow" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: JOIN TVK BUTTON FIRST, THEN TRANSLATION AT FAR RIGHT END */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
            <Link
              href="/sadasyata"
              className="relative bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white px-3.5 xl:px-4 py-2.5 rounded-xl text-xs xl:text-sm font-black uppercase tracking-wider shadow-[0_0_15px_rgba(160,0,0,0.6)] transition-all hover:scale-105 flex items-center gap-1.5 border-2 border-amber-300 group overflow-hidden shrink-0 min-h-[44px]"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Users className="w-4 h-4 text-white shrink-0" />
              <span className="relative z-10 text-white font-black drop-shadow whitespace-nowrap">{t('joinTVK')}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
            </Link>

            <div className="border-l border-slate-700/80 pl-2 shrink-0 relative">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Toggle Button & Language Switcher */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Navigation Menu"
              className="p-2.5 rounded-xl bg-slate-800 text-amber-300 border border-amber-400/40 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL RESPONSIVE MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] sm:top-[68px] z-40 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto animate-fade-in border-t-2 border-amber-400/60 pb-[env(safe-area-inset-bottom,24px)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest">
                TVK UTTAR PRADESH &bull; NAVIGATION
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-900 rounded-lg border border-slate-700"
              >
                ✕ Close
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === '/leadership' && pathname === '/leader') || (link.href === '/gallery' && pathname === '/elections');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-3.5 px-4 rounded-2xl text-base font-extrabold transition-all flex items-center justify-between min-h-[48px] ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 border-2 border-amber-400/60 shadow-lg'
                        : 'text-slate-100 hover:bg-slate-900 hover:text-amber-300 border border-slate-800/80'
                    }`}
                  >
                    <span>{link.label}</span>
                    <Shield className="w-4 h-4 text-amber-400/60" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <Link
              href="/sadasyata"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 text-white py-4 rounded-2xl font-black text-center text-sm uppercase tracking-wider shadow-2xl border-2 border-amber-300 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Users className="w-5 h-5 text-white" />
              <span>{t('joinTVK')}</span>
            </Link>

            <p className="text-[10px] text-center text-slate-400 font-mono">
              Official TVK Uttar Pradesh Web Cadre Portal &bull; 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
}
