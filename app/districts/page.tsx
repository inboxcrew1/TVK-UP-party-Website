'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Users, Building2, CheckCircle2, Search, Filter, ShieldCheck, ChevronRight, Crown, Layers, ArrowRight, Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { UP_DISTRICT_ASSEMBLIES } from '../../lib/upConstituencies';

const ALL_STATES = [
  { code: 'UP', name: 'Uttar Pradesh (उत्तर प्रदेश)' },
];

const ALL_UP_DISTRICTS = Object.keys(UP_DISTRICT_ASSEMBLIES);

export default function DistrictsPage() {
  const [selectedState] = useState('UP');
  const [selectedDistrict, setSelectedDistrict] = useState('Bulandshahr');
  const [selectedAssembly, setSelectedAssembly] = useState('065 - Sikandrabad');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveMetrics, setLiveMetrics] = useState({ districtCount: 0, assemblyCount: 0 });
  const [allDistrictsMap, setAllDistrictsMap] = useState<Record<string, number>>({});

  // Assemblies for selected district
  const availableAssemblies = useMemo(() => {
    return UP_DISTRICT_ASSEMBLIES[selectedDistrict] || [];
  }, [selectedDistrict]);

  // Set default assembly on district change
  useEffect(() => {
    if (availableAssemblies.length > 0 && !availableAssemblies.includes(selectedAssembly)) {
      setSelectedAssembly(availableAssemblies[0]);
    }
  }, [selectedDistrict, availableAssemblies]);

  // Fetch database counts for selected district/assembly AND all districts map
  useEffect(() => {
    const fetchDbCounts = async () => {
      try {
        const res = await fetch(`/api/member/counter?district=${encodeURIComponent(selectedDistrict)}&assembly=${encodeURIComponent(selectedAssembly)}&allDistricts=true`);
        if (res.ok) {
          const data = await res.json();
          setLiveMetrics({ districtCount: data.districtCount || 0, assemblyCount: data.assemblyCount || 0 });
          if (data.allDistricts) {
            setAllDistrictsMap(data.allDistricts);
          }
        }
      } catch (e) {
        setLiveMetrics({ districtCount: 0, assemblyCount: 0 });
      }
    };

    fetchDbCounts();
    const interval = setInterval(fetchDbCounts, 5000);
    return () => clearInterval(interval);
  }, [selectedDistrict, selectedAssembly]);

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);
  };

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return ALL_UP_DISTRICTS;
    const query = searchQuery.toLowerCase().trim();
    return ALL_UP_DISTRICTS.filter((d) => d.toLowerCase().includes(query));
  }, [searchQuery]);

  const currentAssembliesCount = availableAssemblies.length;
  const calculatedActiveMembers = liveMetrics.districtCount;

  return (
    <div className="min-h-screen bg-[#040105] text-white font-sans relative overflow-x-hidden select-none">
      <Header />

      {/* 1. LAYERED DEPTH BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#59000a]/35 via-[#080207] to-[#020003] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[500px] h-[600px] bg-gradient-to-br from-[#E11D48]/30 via-[#800000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#E11D48]/30 via-[#A00000]/15 to-transparent blur-3xl pointer-events-none z-0" />

      {/* 2. SUBTLE PARTY-THEMED WATERMARK EMBLEM LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] flex items-center justify-center">
        <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg" alt="TVK Watermark" className="w-[800px] h-auto object-contain filter grayscale invert" />
      </div>

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* HERO HEADER BANNER */}
        <div className="relative bg-gradient-to-r from-[#0c0307]/95 via-[#140409]/90 to-[#0c0307]/95 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.25)] overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-950/70 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
            <MapPin className="w-4 h-4 text-amber-400" /> उत्तर प्रदेश 75 जनपद एवं 403 विधानसभा क्षेत्र
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
            TVK Uttar Pradesh <span className="text-[#FFC72C] drop-shadow-[0_0_20px_rgba(255,199,44,0.5)]">Districts Explorer</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed font-medium">
            उत्तर प्रदेश के सभी 75 जनपदों एवं 403 विधानसभा क्षेत्रों में तमिलगा वेत्री कज़गम का सांगठनिक ढांचा, सदस्य संख्या एवं बूथ स्तरीय नेटवर्क देखें।
          </p>
        </div>

        {/* INTERACTIVE SELECTION MATRIX & FILTER FORM (DARK GLASS) */}
        <div className="bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 backdrop-blur-xl border border-red-500/35 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-950/80 text-amber-400 border border-red-500/50 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#FFC72C] uppercase tracking-widest font-display">
                  जनपद एवं विधानसभा चयन (Live Database Matrix)
                </h2>
                <p className="text-slate-300 text-xs font-medium">
                  राज्य, जनपद एवं विधानसभा चुनकर वास्तविक डेटाबेस सक्रिय सदस्य संख्या देखें।
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. STATE SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#FFC72C] uppercase tracking-wider block">
                1. राज्य (State)
              </label>
              <select
                value={selectedState}
                disabled
                className="w-full px-4 py-3.5 bg-slate-950 border-2 border-red-500/40 text-white text-sm font-bold rounded-2xl outline-none cursor-not-allowed opacity-90"
              >
                {ALL_STATES.map((s) => (
                  <option key={s.code} value={s.code} className="bg-slate-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. DISTRICT SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#FFC72C] uppercase tracking-wider block">
                2. जनपद चुनें (Select District *)
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictSelect(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-950 border-2 border-red-500/40 focus:border-[#FFC72C] rounded-2xl text-white text-sm font-bold outline-none cursor-pointer transition-colors"
              >
                {ALL_UP_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. ASSEMBLY SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#FFC72C] uppercase tracking-wider block">
                3. विधानसभा क्षेत्र चुनें (Assembly Constituency *)
              </label>
              <select
                value={selectedAssembly}
                onChange={(e) => setSelectedAssembly(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-950 border-2 border-red-500/40 focus:border-[#FFC72C] rounded-2xl text-white text-sm font-bold outline-none cursor-pointer transition-colors"
              >
                {availableAssemblies.map((ac) => (
                  <option key={ac} value={ac} className="bg-slate-900 text-white">
                    {ac}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACTIVE METRICS PANEL */}
          <div className="bg-[#0c0307]/90 border border-red-500/40 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 space-y-1">
              <span className="text-[10px] text-[#FFC72C] font-bold uppercase tracking-wider block">
                चयनित विधानसभा क्षेत्र (Selected Assembly)
              </span>
              <h3 className="text-2xl font-black text-white font-display">
                {selectedAssembly || `${selectedDistrict} Assembly`}
              </h3>
              <p className="text-xs text-slate-300">
                जनपद <span className="text-[#FFC72C] font-bold">{selectedDistrict}</span> के अंतर्गत सदस्य संख्या वास्तविक डेटाबेस रिकॉर्ड पर आधारित है।
              </p>
            </div>

            <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-4">
              <div className="bg-slate-950 border border-red-500/40 px-4 py-2 rounded-xl text-right">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">जनपद सक्रिय सदस्य</span>
                <span className="text-xl font-black font-mono text-[#FFC72C]">{calculatedActiveMembers.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-slate-950 border border-red-500/40 px-4 py-2 rounded-xl text-right">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">विधानसभा सक्रिय सदस्य</span>
                <span className="text-xl font-black font-mono text-emerald-400">{liveMetrics.assemblyCount.toLocaleString('en-IN')}</span>
              </div>

              <Link
                href={`/sadasyata?dist=${encodeURIComponent(selectedDistrict)}&asm=${encodeURIComponent(selectedAssembly)}`}
                className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg border border-amber-300 inline-flex items-center gap-1.5 uppercase tracking-wider hover:scale-105 transition-transform"
              >
                <span>इस विधानसभा से जुड़ें</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* SEARCH AND GRID OF ALL 75 DISTRICTS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-red-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 text-amber-400 flex items-center justify-center border border-red-500/50">
                <Building2 className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-[#FFC72C] uppercase tracking-widest font-display">
                उत्तर प्रदेश 75 जनपद सूची (All UP Districts)
              </h3>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="जनपद खोजें (Search district...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0c0307]/90 border border-red-500/40 rounded-xl text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-[#FFC72C] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDistricts.map((distName, i) => {
              const assembliesCount = (UP_DISTRICT_ASSEMBLIES[distName] || []).length;
              const countNum = allDistrictsMap[distName] || 0;
              const isCurrentSelected = selectedDistrict === distName;

              return (
                <div
                  key={distName}
                  onClick={() => handleDistrictSelect(distName)}
                  className={`relative bg-gradient-to-br from-[#240816]/90 via-[#19050e]/95 to-[#2a091a]/90 backdrop-blur-2xl border-2 rounded-3xl p-6 space-y-4 cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 group ${
                    isCurrentSelected
                      ? 'border-[#FFC72C] shadow-[0_0_30px_rgba(255,199,44,0.4)] ring-2 ring-[#FFC72C]/60 bg-gradient-to-br from-[#350b20]/95 via-[#230615]/95 to-[#3b0d24]/95'
                      : 'border-red-500/40 hover:border-[#FFC72C] hover:shadow-[0_15px_40px_rgba(255,199,44,0.25)]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-red-400 uppercase tracking-widest block bg-red-950/80 px-2.5 py-1 rounded-md border border-red-500/30">
                        {`DISTRICT #${String(i + 1).padStart(2, '0')}`}
                      </span>
                      {isCurrentSelected && (
                        <span className="text-xs font-black bg-[#FFC72C] text-slate-950 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-xl sm:text-2xl text-white group-hover:text-[#FFC72C] transition-colors font-display tracking-tight leading-snug">
                      {distName}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm font-bold text-slate-200 pt-1">
                      <span className="bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/10">{assembliesCount} विधानसभा क्षेत्र</span>
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span className="text-base font-black font-mono text-[#FFC72C] drop-shadow-sm bg-red-950/60 px-2.5 py-1 rounded-lg border border-amber-400/40">
                        {countNum.toLocaleString('en-IN')} सदस्य
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-red-500/30 flex justify-between items-center text-sm font-black text-[#FFC72C] group-hover:text-white transition-colors">
                    <span className="tracking-wide">विवरण देखें</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
