'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Users, ArrowRight, CheckCircle2, ChevronRight, Award, Landmark, MapPin, Building2, Newspaper, Calendar, ArrowUpRight, ArrowUp, Flag, Image as ImageIcon, QrCode, FileText, Sparkles, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import FullBleedHero from '../components/FullBleedHero';
import LiveMemberCounter from '../components/LiveMemberCounter';
import DistrictExplorer from '../components/DistrictExplorer';
import DigitalCardMockup from '../components/DigitalCardMockup';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';

export default function Home() {
  const { t } = useLanguage();
  const [liveCount, setLiveCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch('/api/member/counter');
        if (res.ok) {
          const data = await res.json();
          setLiveCount(data.count ?? 0);
        }
      } catch (err) {
        setLiveCount(0);
      }
    };
    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formattedMemberCount = liveCount === null ? 'Loading...' : liveCount.toLocaleString('en-IN');

  const statistics = [
    { label: t('activeMembers'), value: formattedMemberCount, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: t('totalDistricts'), value: '75', icon: Landmark, color: 'text-amber-400' },
    { label: t('totalAssemblies'), value: '403', icon: Building2, color: 'text-red-400' },
    { label: t('verifiedBooths'), value: '0', icon: Award, color: 'text-indigo-400' },
  ];

  const orgCards = [
    { title: t('orgCard1Title'), subtitle: t('orgCard1Sub'), icon: Landmark, desc: t('orgCard1Desc') },
    { title: t('orgCard2Title'), subtitle: t('orgCard2Sub'), icon: Building2, desc: t('orgCard2Desc') },
    { title: t('orgCard3Title'), subtitle: t('orgCard3Sub'), icon: Landmark, desc: t('orgCard3Desc') },
    { title: t('orgCard4Title'), subtitle: t('orgCard4Sub'), icon: Users, desc: t('orgCard4Desc') },
    { title: t('orgCard5Title'), subtitle: t('orgCard5Sub'), icon: FileText, desc: t('orgCard5Desc') },
    { title: t('orgCard6Title'), subtitle: t('orgCard6Sub'), icon: Award, desc: t('orgCard6Desc') },
  ];

  return (
    <div className="min-h-screen bg-[#040105] text-slate-100 font-sans relative overflow-x-hidden">
      {/* 1. ATMOSPHERIC RED-GOLD LASER LIGHT BEAMS */}
      <div className="fixed top-0 left-0 w-[600px] h-[900px] bg-gradient-to-br from-[#E11D48]/25 via-[#800000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed top-0 right-0 w-[600px] h-[900px] bg-gradient-to-bl from-[#E11D48]/25 via-[#A00000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-t from-red-950/20 via-amber-500/5 to-transparent blur-[200px] pointer-events-none z-0" />

      {/* 2. SUBTLE PARTY-THEMED WATERMARK EMBLEM LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025] flex items-center justify-center">
        <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg" alt="TVK Watermark" className="w-[800px] h-auto object-contain filter grayscale invert" />
      </div>

      {/* HEADER WITH GLOBAL 7-LANGUAGE SELECTOR */}
      <Header />

      {/* HERO SECTION — UNTOUCHED AS REQUESTED */}
      <FullBleedHero />

      {/* LIVE AUTO-COUNTING MEMBER COUNTER & STATISTICS PANEL */}
      <section id="stats-panel" className="max-w-7xl mx-auto px-6 -mt-10 relative z-30 space-y-6">
        {/* LIVE AUTO INCREMENTING COUNTER PANEL */}
        <LiveMemberCounter baseCount={0} />

        {/* DATA GRID WITH DARK GLASSMORPHISM */}
        <div className="bg-[#0c0307]/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(225,29,72,0.2)] border border-red-500/35 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statistics.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center space-y-1.5 border-r last:border-r-0 border-red-900/40 pr-2">
                <div className="flex items-center gap-2">
                  <IconComp className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">{stat.label}</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,199,44,0.3)]">
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2 — TVK UTTAR PRADESH INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 backdrop-blur-xl rounded-3xl border border-red-500/35 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-red-950/80 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
              <Flag className="w-4 h-4 text-amber-400" /> {t('introBadge')}
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-display leading-tight">
              {t('introTitle')}
            </h3>
            <div className="w-28 h-1.5 bg-gradient-to-r from-[#FFC72C] via-red-600 to-transparent rounded-full shadow-[0_0_10px_rgba(255,199,44,0.6)]" />
            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
              {t('introDesc')}
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-black px-8 py-4 rounded-2xl inline-flex items-center gap-2 shadow-xl border border-amber-300/60 transition-all hover:scale-105 uppercase tracking-wider"
              >
                {t('readMore')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.4)] border-4 border-[#FFC72C]/80 bg-slate-950 group">
              <img loading="lazy" decoding="async" src="/media/puducherry_campaign.jpg"
                alt="TVK Uttar Pradesh State Assembly Rally"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080207] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="text-sm font-black text-[#FFC72C] block uppercase tracking-wider">{t('stateRallyTitle')}</span>
                <span className="text-xs text-slate-200 font-bold block">{t('stateRallySub')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR ORGANISATION */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
            <Landmark className="w-4 h-4 text-amber-400" /> {t('orgBadge')}
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-display">
            {t('orgTitle')}
          </h3>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#FFC72C] via-red-600 to-transparent rounded-full mx-auto shadow-[0_0_10px_rgba(255,199,44,0.6)]" />
          <p className="text-slate-300 text-xs md:text-sm font-medium">
            {t('orgDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orgCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#12050b]/90 via-[#0a0206]/95 to-[#16060e]/90 backdrop-blur-2xl border border-red-500/35 rounded-3xl p-8 space-y-4 hover:border-[#FFC72C] transition-all hover:-translate-y-2 shadow-[0_0_30px_rgba(0,0,0,0.6)] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-amber-400/50 flex items-center justify-center text-[#FFC72C] group-hover:scale-110 transition-transform shadow-lg">
                  <IconComponent className="w-7 h-7 text-[#FFC72C]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">{card.subtitle}</span>
                  <h4 className="text-xl font-black text-white font-display">{card.title}</h4>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 — DISTRICT EXPANDER WIDGET */}
      <DistrictExplorer />

      {/* SECTION 5 — DIGITAL CARD MOCKUP PREVIEW */}
      <DigitalCardMockup />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
