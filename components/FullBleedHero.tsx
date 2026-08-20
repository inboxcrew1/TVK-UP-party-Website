'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Users, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const heroSlides = [
  '/media/hero_slider_tvk_up.jpg',
  '/media/tvk_hero_official.jpg',
  '/media/home_slide_vijay_mentors.jpg',
  '/media/home_slide_up_varanasi.jpg',
  '/media/home_slide_flag_horizon.jpg',
  '/media/home_slide_mentors_clean.jpg',
];

export default function FullBleedHero() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide background every 5 seconds (5000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[92vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden pt-24 sm:pt-28 lg:pt-0 pb-12 lg:pb-0">
      {/* 1. DESKTOP FULL-BLEED SLIDING BACKGROUND (100% UNTOUCHED AT LG+ BREAKPOINT) */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-right transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundImage: `url('${slide}')` }}
          />
        ))}
      </div>

      {/* DESKTOP GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent w-2/3 pointer-events-none" />
      <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none" />

      {/* HERO OVERLAY CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 lg:py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-8 xl:col-span-7 space-y-4 sm:space-y-6 text-left">
          {/* OFFICIAL TVK FLAG LOGO TAGLINE BADGE */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-slate-900/95 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-wider border-2 border-amber-400/80 shadow-2xl backdrop-blur-md">
            <div className="w-8 h-5 sm:w-9 sm:h-6 rounded overflow-hidden border border-amber-300 shadow shrink-0">
              <img
                loading="eager"
                decoding="async"
                src="/media/tvk_official_logo.jpg"
                alt="TVK Official Flag Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span>आधिकारिक डिजिटल संगठन &bull; TVK {t('titleSub')}</span>
          </div>

          {/* DEDICATED MOBILE HERO PICTURE BANNER — 100% UNCROPPED FULL VISIBILITY ON PHONES */}
          <div className="block lg:hidden w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.35)] relative bg-slate-950 mt-3 sm:mt-4 mb-3 group">
            {heroSlides.map((slide, idx) => (
              <img
                key={idx}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                src={slide}
                alt="TVK Uttar Pradesh Official Hero Banner"
                className={`absolute inset-0 w-full h-full object-cover sm:object-contain transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest bg-slate-950/85 px-2.5 py-0.5 rounded-lg border border-amber-400/40 backdrop-blur-sm shadow-md">
                TVK UTTAR PRADESH OFFICIAL BANNER
              </span>
            </div>
          </div>

          {/* Main Heading with tracking-[0.14em] TVK Letter Spacing */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[0.14em] text-white font-display leading-none drop-shadow-2xl">
              TVK
            </h1>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white font-display leading-tight">
              {t('titleSub')}
            </h2>
          </div>

          {/* Horizontal Gold Line Accent */}
          <div className="w-28 sm:w-36 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full shadow-lg" />

          {/* Subheading Motto */}
          <div className="text-lg sm:text-2xl font-black text-amber-300 font-display tracking-wide drop-shadow-md">
            {t('motto')}
          </div>

          {/* Concise Supporting Statement */}
          <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-xl drop-shadow-md bg-slate-900/80 lg:bg-slate-950/40 p-3.5 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            {t('heroDesc')}
          </p>

          {/* DUAL ACTION CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            {/* Primary Red CTA Button Dynamic Translation */}
            <Link
              href="/sadasyata"
              className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-[#A00000]/50 transition-all hover:scale-105 flex items-center gap-3.5 sm:gap-4 border border-amber-400/50 group min-h-[48px]"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block font-black text-sm sm:text-base leading-tight">{t('joinTVK')}</span>
                <span className="text-[10px] sm:text-[11px] text-amber-200 font-bold block">{t('onlineMembership')}</span>
              </div>
            </Link>

            {/* Secondary CTA Button: TVK Officer Portal */}
            <Link
              href="/admin/login"
              className="bg-slate-900/90 hover:bg-slate-850 text-amber-300 border-2 border-amber-400/50 rounded-2xl p-3.5 sm:p-4 shadow-xl transition-all hover:scale-105 flex items-center gap-3.5 sm:gap-4 backdrop-blur-md group min-h-[48px]"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="block font-black text-sm sm:text-base leading-tight text-white">TVK Officer Portal</span>
                <span className="text-[10px] sm:text-[11px] text-amber-300 font-bold block">Admin Access & Verification</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <a
        href="#stats-panel"
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[11px] sm:text-xs text-amber-300 font-bold uppercase tracking-wider hover:text-white transition-colors animate-bounce"
      >
        <span>{t('scrollDown')}</span>
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
      </a>
    </section>
  );
}
