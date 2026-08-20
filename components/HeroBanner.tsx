'use client';

import Link from 'next/link';
import { Shield, Users } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* PURE HERO SECTION BACKGROUND - NO BLUR, NO DISTORTION, 100% SHARP NATURAL IMAGE */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN (45% Width): HINDI TYPOGRAPHY & DUAL CTAs */}
        <div className="lg:col-span-6 space-y-6 text-left z-20">
          {/* Main Title Block */}
          <div className="space-y-1">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#A00000] font-display leading-none">
              टीवीके
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 font-display leading-tight">
              उत्तर प्रदेश
            </h2>
          </div>

          {/* Gold Accent Divider Bar */}
          <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full" />

          {/* Subheading Motto */}
          <div className="text-xl sm:text-2xl font-black text-[#A00000] font-display tracking-wide">
            जन सेवा • जन अधिकार • जन सम्मान
          </div>

          {/* Description Paragraph in Hindi */}
          <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium max-w-xl">
            समाज के अंतिम व्यक्ति के उत्थान और स्वाभिमानी, सशक्त एवं समृद्ध उत्तर प्रदेश के निर्माण हेतु हमारा संकल्प, हमारा संगठन, हमारा परिवार।
          </p>

          {/* DUAL ACTION CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {/* Primary Red CTA Button */}
            <Link
              href="/login"
              className="bg-[#A00000] hover:bg-red-800 text-white rounded-2xl p-4 shadow-xl shadow-[#A00000]/25 transition-all hover:scale-105 flex items-center gap-4 border border-red-700 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block font-black text-base leading-tight">TVK से जुड़ें</span>
                <span className="text-[11px] text-amber-200 font-bold block">ऑनलाइन सदस्यता लें</span>
              </div>
            </Link>

            {/* Secondary White CTA Button with Red Border & Shield */}
            <Link
              href="/login"
              className="bg-white hover:bg-slate-50 text-[#A00000] border-2 border-slate-300 rounded-2xl p-4 shadow-md transition-all hover:scale-105 flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-200">
                <Shield className="w-6 h-6 text-[#A00000]" />
              </div>
              <div className="text-left">
                <span className="block font-black text-base leading-tight text-slate-900">सदस्यता सत्यापित करें</span>
                <span className="text-[11px] text-slate-500 font-bold block">अपना सदस्यता ID जाँचें</span>
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN (55% Width): PURE, UNBLURRED, HIGH-RESOLUTION UPLOADED HERO PICTURE */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center z-10">
          <div className="relative w-full max-w-xl aspect-[16/9] md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img loading="eager" decoding="async" src="/media/tvk_hero_official.jpg"
              alt="C. Joseph Vijay TVK President Pure Official Hero Picture"
              className="w-full h-full object-cover object-center shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
