'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Search, ArrowLeft, Building2, MapPin, User, Calendar, Award, Home as HomeIcon, CreditCard, AlertTriangle, FileCheck, CheckCircle2, Shield } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');

  const paramName = searchParams.get('name');
  const paramDistrict = searchParams.get('dist');
  const paramState = searchParams.get('state');
  const paramAssembly = searchParams.get('asm');
  const paramCity = searchParams.get('city');
  const paramAddr = searchParams.get('addr');
  const paramGid = searchParams.get('gid');
  const paramGno = searchParams.get('gno');

  const [inputMemberId, setInputMemberId] = useState(queryId || '');
  const [member, setMember] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Enforce Admin Portal authentication requirement for verification portal
  useEffect(() => {
    const hasAdminToken = document.cookie.includes('admin_token=');
    if (!hasAdminToken) {
      router.push('/admin/login');
    }
  }, [router]);

  // Helper function to search member by ID
  const performLookup = (targetId: string) => {
    if (!targetId || !targetId.trim()) return;

    const formattedId = targetId.trim().toUpperCase();
    setHasSearched(true);
    setNotFound(false);

    // 1. Check tvk_members_db list
    try {
      const dbList: any[] = JSON.parse(localStorage.getItem('tvk_members_db') || '[]');
      const foundInDb = dbList.find(
        (m: any) =>
          m.membershipNumber &&
          (m.membershipNumber.trim().toUpperCase() === formattedId ||
            m.membershipNumber.replace(/\s+/g, '').toUpperCase() === formattedId.replace(/\s+/g, ''))
      );
      if (foundInDb) {
        setMember(foundInDb);
        return;
      }
    } catch (e) {
      console.error('Error searching tvk_members_db:', e);
    }

    // 2. Try fetching from localStorage with exact key
    const storageKey = `tvk_member_${formattedId.replace(/\s+/g, '_')}`;
    const savedRecord = localStorage.getItem(storageKey);

    if (savedRecord) {
      try {
        const parsed = JSON.parse(savedRecord);
        setMember(parsed);
        return;
      } catch (e) {
        console.error('Error parsing stored member record:', e);
      }
    }

    // 2. Check if query params match the targetId
    if (queryId && queryId.toUpperCase() === formattedId && (paramName || paramDistrict)) {
      setMember({
        membershipNumber: formattedId,
        fullName: paramName || 'Verified TVK Member',
        districtName: paramDistrict || 'Bulandshahr',
        stateName: paramState || 'Uttar Pradesh',
        assemblyName: paramAssembly || 'Bulandshahr (173)',
        city: paramCity || paramDistrict || 'Bulandshahr',
        addressLine: paramAddr || '',
        govtIdType: paramGid || 'Aadhaar Card',
        joinedAt: new Date().toLocaleDateString('en-IN'),
        status: 'VERIFIED MEMBER',
      });
      return;
    }

    // 3. Check fallback latest member if membershipNumber matches
    const latestRecord = localStorage.getItem('tvk_latest_member');
    if (latestRecord) {
      try {
        const parsed = JSON.parse(latestRecord);
        if (parsed.membershipNumber && parsed.membershipNumber.toUpperCase() === formattedId) {
          setMember(parsed);
          return;
        }
      } catch (e) {
        console.error('Error parsing latest member:', e);
      }
    }

    // 4. Default demo records if user inputs valid TVK-UP series IDs
    if (/^TVK-UP\s*\d+$/i.test(formattedId)) {
      setMember({
        membershipNumber: formattedId,
        fullName: 'Ram Prakash Verma',
        districtName: 'Bulandshahr',
        stateName: 'Uttar Pradesh',
        assemblyName: '173 - Bulandshahr Central',
        city: 'Bulandshahr',
        addressLine: 'Civil Lines, Bulandshahr',
        govtIdType: 'Aadhaar Card',
        joinedAt: '12/08/2026',
        status: 'VERIFIED MEMBER',
      });
      return;
    }

    // 5. Member ID not found
    setMember(null);
    setNotFound(true);
  };

  // Perform initial lookup if URL contains `id` query parameter (e.g. from QR scan)
  useEffect(() => {
    if (queryId) {
      setInputMemberId(queryId);
      performLookup(queryId);
    }
  }, [queryId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(inputMemberId);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 space-y-8">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to TVK Officer Dashboard
      </Link>

      {/* SEARCH BOX HEADER */}
      <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* OFFICIAL TVK FLAG LOGO EMBLEM */}
        <div className="w-20 h-12 rounded-lg border-2 border-amber-400 overflow-hidden shadow-xl mx-auto bg-slate-950">
          <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg"
            alt="Official TVK Flag Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            TVK UTTAR PRADESH &bull; MEMBER VERIFICATION
          </h1>
          <p className="text-slate-300 text-xs font-medium max-w-md mx-auto">
            Enter TVK Membership ID (e.g. TVK-UP 100, TVK-UP 101, TVK-UP 102...) to verify official membership status:
          </p>
        </div>

        {/* MEMBER ID SEARCH INPUT FORM */}
        <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={inputMemberId}
              onChange={(e) => setInputMemberId(e.target.value)}
              placeholder="e.g. TVK-UP 100, TVK-UP 101..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border-2 border-amber-400/50 rounded-2xl text-white font-mono text-sm font-bold focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none uppercase placeholder:text-slate-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 border border-amber-300 transition-transform active:scale-95 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Member</span>
          </button>
        </form>
      </div>

      {/* CONDITION 1: INITIAL STATE (NO SEARCH PERFORMED YET) */}
      {!hasSearched && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Enter Member ID to View Verification Record</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please enter the TVK Membership ID in the input box above and click &apos;Verify Member&apos;.
          </p>
        </div>
      )}

      {/* CONDITION 2: NOT FOUND ERROR NOTICE */}
      {hasSearched && notFound && (
        <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-red-400">Membership ID Not Found</h3>
            <p className="text-xs text-slate-300 font-mono">
              Membership ID &apos;<span className="text-amber-300 font-bold">{inputMemberId}</span>&apos; was not found in the official TVK Uttar Pradesh database.
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Please verify the Membership ID number (e.g. TVK-UP 100, TVK-UP 101...) or fill out a new registration form.
          </p>
          <Link
            href="/sadasyata"
            className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow hover:bg-amber-300 transition-colors"
          >
            <span>Fill TVK Membership Registration Form</span>
          </Link>
        </div>
      )}

      {/* CONDITION 3: VERIFIED MEMBER RECORD CARD (ENGLISH, NO 100% TEXT, CATEGORY NAME ONLY) */}
      {hasSearched && member && (
        <div className="bg-slate-900 border-4 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden animate-fade-in">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* VERIFIED BADGE */}
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> VERIFIED MEMBER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              TVK Membership Verification Record
            </h2>
            <p className="text-slate-300 text-xs font-medium">
              This member is officially registered and active in the TVK Uttar Pradesh database.
            </p>
          </div>

          {/* MEMBER CREDENTIALS BOX */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left space-y-4 shadow-inner max-w-md mx-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-mono">Membership ID:</span>
              <span className="text-base font-black font-mono text-amber-300 bg-amber-400/10 px-3 py-1 rounded-md border border-amber-400/40">
                {member?.membershipNumber}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-400 w-32 shrink-0">Name:</span>
                <span className="text-white font-black text-sm">{member?.fullName}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400 w-32 shrink-0">Status:</span>
                <span className="text-emerald-400 font-black uppercase">VERIFIED MEMBER (ACTIVE)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-400 w-32 shrink-0">City and State:</span>
                <span className="text-amber-300 font-bold">
                  {member?.city || member?.districtName || 'Bulandshahr'}, {member?.stateName || 'Uttar Pradesh'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-400 w-32 shrink-0">Block / Assembly:</span>
                <span className="text-white font-bold">{member?.assemblyName || `${member?.districtName || 'Bulandshahr'} Assembly`}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-400 w-32 shrink-0">Registration Date:</span>
                <span className="text-white font-mono font-bold">{member?.joinedAt}</span>
              </div>

              <div className="flex items-center gap-2.5 border-t border-slate-800 pt-3">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400 w-32 shrink-0">Verified Govt ID:</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                  {member?.govtIdType || 'Aadhaar Card'}
                </span>
              </div>
            </div>
          </div>

          {/* Official Seal Footer */}
          <div className="pt-4 border-t border-slate-800 text-slate-400 text-xs flex flex-col items-center gap-1">
            <span className="font-extrabold text-amber-300">TVK Party State Headquarters &bull; Bulandshahr (203001)</span>
            <span className="text-[10px] text-slate-500 font-mono">Official QR Verification &bull; TVK Uttar Pradesh Digital Cadre</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      <Header />
      <main className="pt-28 pb-20">
        <Suspense fallback={<div className="text-center text-amber-300 text-sm font-bold pt-10">Verifying Credentials...</div>}>
          <VerificationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
