'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Crown, Award, Users, ExternalLink, Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function LeaderPage() {
  const { t } = useLanguage();

  const centralLeaders = [
    {
      name: 'N. Anand (Bussy N. Anand)',
      title: 'General Secretary / महासचिव',
      bio: 'Heading party organization, cadre mobilization, and administrative coordination across all state units.',
      photoUrl: '/media/leader_anand.jpg',
    },
    {
      name: 'P. Venkataramanan',
      title: 'Treasurer / कोषाध्यक्ष',
      bio: 'Managing financial transparency, audit compliance, and party resource management.',
      photoUrl: '/media/leader_venkataramanan.jpg',
    },
    {
      name: 'Mr. K.A. Sengottaiyan',
      title: 'Chief Coordinator / मुख्य समन्वयक',
      bio: 'Overseeing central organizational affairs, inter-state committee synchronization, and leadership alignment.',
      photoUrl: '/media/leader_sengottaiyan.jpg',
    },
    {
      name: 'Aadhav Arjuna B.A.,',
      title: 'Campaign Management Head / चुनाव अभियान प्रमुख',
      bio: 'President of BFI and TN Olympic Association Secretary; heading campaign strategy and election planning.',
      photoUrl: '/media/leader_aadhav.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#A00000] via-red-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl space-y-4 border-2 border-amber-400/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Crown className="w-4 h-4 text-amber-300" /> {t('leaderRole')}
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display text-white">
              C. Joseph Vijay &bull; TVK President & Founder
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              &ldquo;{t('leaderBio')}&rdquo;
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/sadasyata"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
              >
                {t('joinTVK')}
              </Link>
              <Link
                href="/leadership"
                className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold px-5 py-3 rounded-xl inline-flex items-center gap-2"
              >
                <span>{t('viewAllBearers')}</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Leader Biography Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-slate-900">
                <img
                  src="/media/leadership.jpg"
                  alt="C. Joseph Vijay TVK Founder & President"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-slate-300 text-sm leading-relaxed">
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                  आधिकारिक नेतृत्व परिचय (OFFICIAL PROFILE)
                </span>
                <h3 className="text-3xl font-black text-white font-display">
                  सी. जोसेफ विजय (C. Joseph Vijay)
                </h3>
              </div>

              <p className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                सी. जोसेफ विजय (C. Joseph Vijay) तमिलग वेत्रि कषगम (TVK) के संस्थापक एवं अध्यक्ष हैं। उन्होंने सामाजिक न्याय, धर्मनिरपेक्ष प्रशासनिक व्यवस्था, राज्य स्वायत्तता एवं समानता आधारित जनसेवा का संकल्प लिया है।
              </p>

              <p>
                वर्ष 2009 में विजय मक्कल इयक्कम की स्थापना हुई, जिसने 2021 के स्थानीय निकायों के चुनावों में 115 से अधिक सीटें जीतकर अपार जनविश्वास हासिल किया। 2 फ़रवरी 2024 को TVK का औपचारिक गठन हुआ।
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/sadasyata"
                  className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-black px-6 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-lg transition-all border border-amber-300"
                >
                  <span>{t('joinTVK')}</span> <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/leadership"
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-black px-6 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-lg transition-all border border-amber-400/40"
                >
                  <span>{t('viewAllBearers')}</span> <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Key Central Executive Committee Leaders */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-amber-300 font-display border-b border-slate-800 pb-3 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" /> टीवीके केंद्रीय नेतृत्व मंडल (Central Executive Committee)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {centralLeaders.map((leader, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-amber-400/60 transition-all shadow-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-[4/3] rounded-2xl bg-slate-950 border border-amber-400/60 overflow-hidden shadow-md">
                      <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{leader.name}</h4>
                      <span className="text-xs font-bold text-amber-400 block mt-0.5">{leader.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
