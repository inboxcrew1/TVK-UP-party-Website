'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight, Smartphone, CreditCard, CheckCircle2, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DigitalCardMockup() {
  const { lang, t } = useLanguage();

  const steps = [
    {
      step: t('step1Title'),
      desc: t('step1Desc'),
      icon: Smartphone,
    },
    {
      step: t('step2Title'),
      desc: t('step2Desc'),
      icon: ShieldCheck,
    },
    {
      step: t('step3Title'),
      desc: t('step3Desc'),
      icon: CreditCard,
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#A00000]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
        {/* Section 1: Membership Steps */}
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> {t('stepBadge')}
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white font-display">
              {t('stepTitle')}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm">
              {t('stepDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 relative hover:border-amber-400/60 transition-all shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-xl text-white font-display">{item.step}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/sadasyata"
              className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-wider shadow-2xl transition-all inline-flex items-center gap-2 border border-amber-300 hover:scale-105"
            >
              <span>{t('joinNow')}</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section 2: Card Mockup Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-slate-800/80 pt-16">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-amber-300 border border-red-500/40 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-amber-400" /> {t('cardBadge')}
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white font-display">
              {t('cardTitle')}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              {t('cardDesc')}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('feat1')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bilingual ID Card (English / Hindi / Regional Languages)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('feat3')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('feat4')}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/sadasyata"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>{t('learnMembership')}</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CR80 DIGITAL CARD DEMO MOCKUP (DUMMY DEMO MEMBER PROFILE FOR SECURITY) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md aspect-[1.586/1] bg-gradient-to-br from-[#A00000] via-slate-950 to-slate-900 rounded-3xl p-6 border-2 border-amber-400/80 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white font-sans">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-amber-400/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-7 rounded border border-amber-300 overflow-hidden shrink-0 bg-slate-950">
                    <img src="/media/tvk_official_logo.jpg" alt="TVK Flag" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-white block font-display">TVK UTTAR PRADESH</span>
                    <span className="text-[9px] font-extrabold text-amber-300 uppercase block">तमिलग वेत्रि कषगम • TVK UP</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Body (Demo Dummy Member Information with Bilingual Labels) */}
              <div className="grid grid-cols-12 gap-3.5 items-center my-auto">
                <div className="col-span-4 aspect-[4/5] rounded-xl bg-slate-800 border-2 border-amber-400 overflow-hidden flex items-center justify-center text-slate-400">
                  <User className="w-12 h-12 text-amber-400/80" />
                </div>
                <div className="col-span-8 space-y-1 text-left">
                  <div className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black font-mono text-xs inline-block">
                    ID: TVK-UP DEMO
                  </div>
                  <h4 className="font-black text-base text-white font-display">Sample Member (नमूना कार्ड)</h4>
                  <div className="space-y-1 text-[10px]">
                    <p className="text-slate-200 font-mono font-bold">
                      Age (आयु): <span className="text-amber-300">30 Yrs</span> (DOB: 01/01/1996)
                    </p>
                    <p className="text-amber-200 font-bold font-mono">
                      City (जनपद): <span className="text-white">Sample City, UP</span>
                    </p>
                    <div className="text-emerald-400 text-[9.5px] font-mono font-extrabold flex items-center gap-2 pt-0.5">
                      <span>Issue: 01/01/2026</span>
                      <span>&bull;</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-md">
                        Exp: Lifetime
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Motto Line (No QR Code) */}
              <div className="border-t border-amber-400/40 pt-2 text-center">
                <p className="text-[11px] font-black uppercase text-[#FFC72C] font-display tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  All Human Beings Are Born Equal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
