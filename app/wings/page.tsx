'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, Users, GraduationCap, Heart, Laptop, Tractor, Layers, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

const FRONTAL_WINGS = [
  {
    title: 'Youth Wing (इकाई - युवा मोर्चा)',
    icon: Users,
    description: 'Empowering young leaders across Uttar Pradesh to drive digital transformation, sports development, and grassroots political participation.',
    color: 'from-[#A00000] to-red-600',
  },
  {
    title: 'Women Wing (इकाई - महिला मोर्चा)',
    icon: Heart,
    description: 'Advancing women safety, financial independence, skill training, and active leadership representation in local administration.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'IT & Digital Media Wing (आईटी एवं सोशल मीडिया प्रकोष्ठ)',
    icon: Laptop,
    description: 'Managing secure digital member verification, community WhatsApp broadcasts, portal infrastructure, and anti-misinformation.',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'Student Wing (छात्र मोर्चा)',
    icon: GraduationCap,
    description: 'Fostering academic excellence, career counseling, competitive exam preparation support, and student rights awareness.',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    title: 'Farmers & Laborers Wing (किसान एवं मजदूर प्रकोष्ठ)',
    icon: Tractor,
    description: 'Championing fair agricultural pricing, direct subsidy delivery, unorganized worker welfare, and rural development.',
    color: 'from-orange-600 to-amber-700',
  },
];

export default function WingsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      <Header />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Layers className="w-4 h-4 text-amber-400" /> Frontal Organizations
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white">
            TVK <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">Frontal Wings</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Specialized state units driving targeted welfare, grassroots organization, and sector-specific development across Uttar Pradesh.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FRONTAL_WINGS.map((wing, idx) => {
            const Icon = wing.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border-2 border-slate-800 hover:border-amber-400 rounded-3xl p-8 transition-all shadow-xl space-y-4 flex flex-col justify-between hover:scale-[1.02] group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${wing.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{wing.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{wing.description}</p>
                </div>
                <div className="border-t border-slate-800 pt-4 text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>ACTIVE STATE DIVISION</span>
                  <Link href="/sadasyata" className="text-amber-300 hover:text-white inline-flex items-center gap-1">
                    <span>जुड़ें</span> <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
