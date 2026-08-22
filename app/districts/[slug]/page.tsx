'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Landmark, Users, ArrowRight, ChevronRight, Building2 } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LiveMemberCounter from '../../../components/LiveMemberCounter';
import { UP_DISTRICT_ASSEMBLIES, getConstituenciesByDistrict } from '../../../lib/upConstituencies';

export default function DynamicDistrictSEOPage() {
  const params = useParams();
  const slug = (params.slug as string) || 'bulandshahr';

  // Format slug to District Name
  const formattedDistrictName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Match UP_DISTRICT_ASSEMBLIES
  const matchedKey =
    Object.keys(UP_DISTRICT_ASSEMBLIES).find(
      (key) => key.toLowerCase() === formattedDistrictName.toLowerCase()
    ) || 'Bulandshahr';

  const assemblies = getConstituenciesByDistrict(matchedKey);
  const [assembliesMap, setAssembliesMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchAssemblyCounts = async () => {
      try {
        const res = await fetch(
          `/api/member/counter?district=${encodeURIComponent(matchedKey)}&assemblies=true`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.assemblies) {
            setAssembliesMap(data.assemblies);
          }
        }
      } catch (err) {
        console.error('Failed to load assembly counts:', err);
      }
    };

    fetchAssemblyCounts();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchAssemblyCounts();
      }
    }, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [matchedKey]);

  return (
    <div className="min-h-screen bg-[#040105] text-white font-sans relative overflow-x-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/districts" className="hover:underline">Districts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">{matchedKey}</span>
        </div>

        <div className="bg-gradient-to-br from-[#A00000]/40 via-slate-950 to-slate-900 border-2 border-amber-400/60 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Landmark className="w-4 h-4" /> Official District Cadre Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display">
            TVK {matchedKey} District Samiti
          </h1>
          <p className="text-amber-200 text-sm md:text-base max-w-3xl font-medium">
            Official digital cadre portal and primary membership drive for Tamizhaga Vettri Kazhagam (TVK) in {matchedKey} District, Uttar Pradesh.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/sadasyata"
              className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl flex items-center gap-2 border border-amber-300 shadow-xl transition-all hover:scale-105"
            >
              <Users className="w-4 h-4" /> Join TVK in {matchedKey}
            </Link>
          </div>
        </div>
      </section>

      {/* DISTRICT SPECIFIC DATABASE COUNTER */}
      <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <LiveMemberCounter district={matchedKey} />
      </section>

      {/* ASSEMBLY CONSTITUENCIES GRID WITH LIVE DATABASE COUNTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10 space-y-8">
        <div className="space-y-2 border-l-4 border-amber-400 pl-4">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Assembly Constituencies in {matchedKey} ({assemblies.length})
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium">
            Active booth networks and primary membership coverage across all legislative assemblies in {matchedKey}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assemblies.map((acName, idx) => {
            const assemblyCount = assembliesMap[acName] ?? 0;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-amber-400/40 rounded-2xl p-5 hover:border-amber-400 transition-all hover:scale-105 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">Assembly #{idx + 1}</span>
                  <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>{assemblyCount.toLocaleString('en-IN')} Members</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white font-display">{acName}</h3>
                <p className="text-slate-400 text-xs font-medium">
                  Official booth cadre unit & active primary membership drive.
                </p>
                <Link
                  href="/sadasyata"
                  className="text-amber-300 font-bold text-xs inline-flex items-center gap-1 hover:underline pt-2"
                >
                  <span>Register in {acName}</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
