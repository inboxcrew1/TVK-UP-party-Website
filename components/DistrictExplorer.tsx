'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Users, Building2, Landmark, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DistrictItem {
  id: string;
  name: string;
  count: number;
  assemblies: number;
}

const BASE_SAMPLE_DISTRICTS: DistrictItem[] = [
  { id: '1', name: 'Bulandshahr', count: 0, assemblies: 7 },
  { id: '2', name: 'Lucknow', count: 0, assemblies: 9 },
  { id: '3', name: 'Varanasi', count: 0, assemblies: 8 },
  { id: '4', name: 'Kanpur Nagar', count: 0, assemblies: 10 },
  { id: '5', name: 'Prayagraj', count: 0, assemblies: 12 },
  { id: '6', name: 'Gautam Buddha Nagar (Noida)', count: 0, assemblies: 3 },
  { id: '7', name: 'Ghaziabad', count: 0, assemblies: 5 },
  { id: '8', name: 'Gorakhpur', count: 0, assemblies: 9 },
  { id: '9', name: 'Agra', count: 0, assemblies: 9 },
  { id: '10', name: 'Meerut', count: 0, assemblies: 7 },
];

export default function DistrictExplorer() {
  const { t } = useLanguage();
  const [districtList, setDistrictList] = useState<DistrictItem[]>(BASE_SAMPLE_DISTRICTS);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem>(BASE_SAMPLE_DISTRICTS[0]);

  useEffect(() => {
    const fetchLiveDistrictCounts = async () => {
      try {
        const res = await fetch('/api/member/counter?allDistricts=true');
        if (res.ok) {
          const data = await res.json();
          const allMap: Record<string, number> = data.allDistricts || {};

          setDistrictList((prevList) =>
            prevList.map((item) => ({
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
    const interval = setInterval(fetchLiveDistrictCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update selected district when districtList count changes
  useEffect(() => {
    const matched = districtList.find((d) => d.id === selectedDistrict.id);
    if (matched) {
      setSelectedDistrict(matched);
    }
  }, [districtList]);

  return (
    <section className="py-16 bg-[#F8F9FA] border-t border-slate-200 relative z-20 select-none shadow-sm">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-200/80 border border-slate-300 text-slate-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#A00000]" /> {t('districtBadge')}
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-display">
            {t('districtTitle')}
          </h3>
          <p className="text-slate-600 text-xs md:text-sm">
            {t('districtDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: District List Selector */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 max-h-[480px] overflow-y-auto">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider px-2">
              {t('selectDistrict')}
            </h4>
            <div className="space-y-1.5">
              {districtList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all border ${
                    selectedDistrict.id === d.id
                      ? 'bg-[#A00000] text-white border-[#A00000] shadow-md font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${selectedDistrict.id === d.id ? 'text-amber-300' : 'text-[#A00000]'}`} />
                    <span className="text-xs font-extrabold">{d.name}</span>
                  </div>
                  <span className={`text-xs font-mono font-black ${selectedDistrict.id === d.id ? 'text-amber-300' : 'text-slate-600'}`}>
                    {d.count.toLocaleString('en-IN')} {t('activeMembers')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed District Panel */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
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
