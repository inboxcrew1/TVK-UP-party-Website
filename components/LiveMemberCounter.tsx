'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LiveMemberCounterProps {
  baseCount?: number;
  district?: string;
  assembly?: string;
  customTitle?: string;
}

export default function LiveMemberCounter({
  baseCount = 0,
  district,
  assembly,
  customTitle,
}: LiveMemberCounterProps) {
  const [totalCount, setTotalCount] = useState<number>(baseCount);
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    const fetchRealDatabaseCount = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (district) queryParams.set('district', district);
        if (assembly) queryParams.set('assembly', assembly);

        const url = `/api/member/counter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await fetch(url);
        if (res.ok && isMounted) {
          const data = await res.json();
          const count = district ? (assembly ? data.assemblyCount : data.districtCount) : data.activeMembers ?? data.count;
          setTotalCount(count ?? 0);
        }
      } catch (err) {
        console.error('Failed to load database member count:', err);
      }
    };

    fetchRealDatabaseCount();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchRealDatabaseCount();
      }
    }, 60000); // 60s — prevents DB overload from concurrent page visitors

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [district, assembly]);

  const displayTitle = customTitle
    ? customTitle
    : district
    ? `TVK ${district} District Active Members`
    : t('totalMembersUP');

  const formattedCount = totalCount.toLocaleString('en-IN');

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-amber-400/60 relative overflow-hidden my-8 select-none">
      {/* Glow ambient circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE COUNTER</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            {displayTitle}
          </h3>

          <p className="text-slate-400 text-xs flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {district
                ? `आधिकारिक ${district} सक्रिय सदस्य संख्या (Database Verified)`
                : 'आधिकारिक प्राथमिक सदस्य संख्या (Database Verified Active Members)'}
            </span>
          </p>
        </div>

        {/* RIGHT SIDE: LIVE COUNT FROM DATABASE */}
        <div className="flex flex-col items-center md:items-end">
          <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{district ? `${district.toUpperCase()} MEMBERS` : 'LIVE REGISTERED MEMBERS'}</span>
          </div>

          <div className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
            {formattedCount}
          </div>
        </div>
      </div>
    </div>
  );
}
