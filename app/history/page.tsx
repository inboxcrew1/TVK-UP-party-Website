'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, History as HistoryIcon, Clock, CheckCircle2 } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

const TIMELINE_EVENTS = [
  {
    year: '1992 - 2009',
    title: 'Social Service Movement & Fan Club Consolidation',
    description: 'Initial social welfare activities by supporters, consolidating into Vijay Makkal Iyakkam in July 2009 with over 85,000 registered fan clubs.',
  },
  {
    year: '2021',
    title: 'Local Body Electoral Success',
    description: 'Vijay Makkal Iyakkam contested local body elections in Tamil Nadu, winning 115 out of 169 contested seats.',
  },
  {
    year: '2 February 2024',
    title: 'Official Launch of TVK',
    description: 'C. Joseph Vijay officially announces the founding of Tamilaga Vetri Kazhagam (TVK) with headquarters in Panaiyur, Chennai.',
  },
  {
    year: 'July 2024',
    title: 'NEET & Educational Reform Demand',
    description: 'Called for the abolishment of NEET and demanded Education be moved from Concurrent List back to State List.',
  },
  {
    year: 'September 2024',
    title: 'Centre-Left Ideological Principles',
    description: 'Announced alignment with Centre-Left principles based on Ambedkar, Periyar, and Kamaraj, rejecting right-wing politics.',
  },
  {
    year: '27 October 2024',
    title: 'Historic Vikravandi State Conference',
    description: 'TVK held its first political conference in Vikravandi attended by over 800,000 people, unveiling secular social justice principles.',
  },
  {
    year: '3 November 2024',
    title: '26 Core Resolutions Passed',
    description: 'Party passed 26 key resolutions detailing state autonomy, youth employment, and corruption-free administration.',
  },
  {
    year: '13 February 2025',
    title: '70,000+ Booth Agents Enrollment Drive',
    description: 'Initiated statewide organization drive appointing 70,000 booth agents and restructuring internal hierarchy.',
  },
  {
    year: '21 August 2025',
    title: 'Second Conference in Madurai',
    description: 'Large-scale gathering in Madurai reiterating promises for women safety, trans rights, and farmers welfare.',
  },
  {
    year: 'March 2026',
    title: 'Legislative Assembly Victory (108 Seats)',
    description: 'TVK emerged as single largest party winning 108 of 234 seats in Tamil Nadu, with C. Joseph Vijay assuming office as Chief Minister.',
  },
];

export default function HistoryPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      <Header />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6 relative z-10 space-y-12">
        {/* Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <HistoryIcon className="w-4 h-4 text-amber-400" /> Historic Milestones (1992 - 2026)
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white">
            TVK Party History &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">Timeline</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto">
            From grassroots social service in 1992 to Vijay Makkal Iyakkam and TVK’s historic 2026 legislative assembly victory.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative border-l-2 border-amber-400/40 ml-4 md:ml-8 pl-6 md:pl-8">
          {TIMELINE_EVENTS.map((event, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400">
                <Clock className="w-3 h-3" />
              </div>

              <div className="bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-6 transition-all shadow-xl space-y-2">
                <span className="text-xs font-mono font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 inline-block">
                  {event.year}
                </span>
                <h3 className="text-xl font-bold text-white font-display">{event.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
