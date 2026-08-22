'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Users, Building2, Landmark, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UP_DISTRICT_ASSEMBLIES } from '../lib/upConstituencies';

interface DistrictItem {
  id: string;
  name: string;
  count: number;
  assemblies: number;
}

// Generate the complete initial list of all 75 UP Districts
const ALL_75_UP_DISTRICTS: DistrictItem[] = Object.keys(UP_DISTRICT_ASSEMBLIES).map((dName, idx) => ({
  id: String(idx + 1),
  name: dName,
  count: 0,
  assemblies: UP_DISTRICT_ASSEMBLIES[dName]?.length || 5,
}));

export default function DistrictExplorer() {
  const { t } = useLanguage();
  const [districtList, setDistrictList] = useState<DistrictItem[]>(ALL_75_UP_DISTRICTS);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Bulandshahr');

  useEffect(() => {
    let isMounted = true;

    const fetchLiveDistrictCounts = async () => {
      try {
        const res = await fetch('/api/member/counter?allDistricts=true');
        if (res.ok && isMounted) {
          const data = await res.json();
          const allMap: Record<string, number> = data.allDistricts || {};

          setDistrictList(
            ALL_75_UP_DISTRICTS.map((item) => ({
              ...item,
              count: allMap[item.name] || 0,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load district explorer counts:', err);
      }
    };

    fetchLiveDistrictCounts();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchLiveDistrictCounts();
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const selectedDistrict = useMemo(() => {
    return districtList.find((d) => d.name === selectedDistrictName) || districtList[0] || ALL_75_UP_DISTRICTS[0];
  }, [districtList, selectedDistrictName]);

  return (
    <section className="py-16 bg-[#F4F4F6] text-slate-900 border-t border-b border-slate-300 relative z-30 w-full select-none shadow-md overflow-hidden">
      
      {/* SOLID OPAQUE BACKDROP TO BLOCK ALL FIXED BACKGROUND GLOWS */}
      <div className="absolute inset-0 bg-[#F4F4F6] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-8 relative z-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          {/* NEUTRAL OFF-WHITE BADGE */}
          <div className="inline-flex items-center gap-2 bg-slate-200/90 border border-slate-300 text-slate-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <MapPin className="w-4 h-4 text-[#A00000]" /> {t('districtBadge')}
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-display">
            {t('districtTitle')}
          </h3>
          <p className="text-slate-600 text-xs md:text-sm font-medium">
            {t('districtDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: District List Selector (All 75 UP Districts with live counts) */}
          <div className="lg:col-span-5 bg-white border border-slate-300 rounded-3xl p-5 shadow-sm space-y-3 max-h-[480px] overflow-y-auto">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                {t('selectDistrict')} (75 Districts)
              </h4>
            </div>
            <div className="space-y-1.5">
              {districtList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrictName(d.name)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all border ${
                    selectedDistrict.name === d.name
                      ? 'bg-[#A00000] text-white border-[#A00000] shadow-md font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${selectedDistrict.name === d.name ? 'text-amber-300' : 'text-[#A00000]'}`} />
                    <span className="text-xs font-extrabold">{d.name}</span>
                  </div>
                  <span className={`text-xs font-mono font-black ${selectedDistrict.name === d.name ? 'text-amber-300' : 'text-slate-600'}`}>
                    {d.count.toLocaleString('en-IN')} {t('activeMembers')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed District Panel */}
          <div className="lg:col-span-7 bg-white border border-slate-300 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-[#A00000] font-bold uppercase tracking-wider block">
                  {t('selectDistrict')}
                </span>
                <h4 className="text-2xl font-black text-slate-900 font-display">{selectedDistrict.name}</h4>
              </div>
              <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black">
                {t('activeDistrict')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] font-bold uppercase block">{t('activeMembers')}</span>
                <span className="text-3xl font-black font-mono text-[#A00000]">
                  {selectedDistrict.count.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] font-bold uppercase block">{t('totalAssemblies')}</span>
                <span className="text-3xl font-black font-mono text-slate-900">
                  {selectedDistrict.assemblies}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{t('districtDetails')}</h5>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Assembly Booth Level Verification Completed.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital Membership ID Card & QR Verification Active.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/districts"
                className="bg-[#A00000] hover:bg-red-800 text-white text-xs font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all"
              >
                <span>{t('viewAllDistricts')}</span> <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
