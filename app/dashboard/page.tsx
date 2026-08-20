'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Download, Clock, CheckCircle2, AlertOctagon, User, LogOut, Loader2 } from 'lucide-react';

interface MemberData {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string | null;
  photoUrl: string;
  membershipId: string | null;
  membershipType: string;
  status: string;
  joiningDate: string;
  approvedAt: string | null;
  state: { name: string };
  district: { name: string };
  assembly: { name: string };
  documents: Array<{ documentType: string; documentNo: string }>;
  history: Array<{ oldStatus: string; newStatus: string; reason: string; createdAt: string }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/member/profile');
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await res.json();
        setMember(data.member);
      } catch (err) {
        console.error(err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    // Clear cookies by calling backend or setting max-age=0
    // Simple way is to delete cookies via client, or make a quick log out endpoint.
    // For simplicity, we can set member_token cookie to empty by call or delete it.
    // Let's create an api route for logout, or just delete cookie by setting past date:
    document.cookie = 'member_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  const handleDownloadCard = async () => {
    if (!member) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/member/card');
      if (!res.ok) throw new Error('Card download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TVK-Member-Card-${member.membershipId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download card. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading TVK membership profile...</p>
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg border border-amber-400/20">
            <Shield className="w-4 h-4 text-slate-950 stroke-[2]" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase font-display hidden sm:inline-block">
            Tamilaga Vetri Kazhagam
          </span>
          <span className="text-amber-500 text-xs font-semibold sm:border-l sm:border-slate-800 sm:pl-3">
            UP Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-400 font-semibold uppercase">Logged in as</p>
            <p className="text-sm font-bold text-white">{member.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-700/60 active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {member.status === 'ACTIVE' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-8"
            >
              {/* Profile card preview (Col span 3) */}
              <div className="md:col-span-3 space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/5 rounded-full blur-2xl" />
                  
                  <h2 className="text-lg font-bold text-amber-500 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" /> Membership Details
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-slate-400 font-semibold uppercase text-xs">Name</span>
                      <span className="col-span-2 font-bold text-white">{member.fullName}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-slate-400 font-semibold uppercase text-xs">Membership ID</span>
                      <span className="col-span-2 font-mono font-bold text-amber-500 tracking-wide">{member.membershipId}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-slate-400 font-semibold uppercase text-xs">District</span>
                      <span className="col-span-2 font-semibold text-slate-200">{member.district.name}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-slate-400 font-semibold uppercase text-xs">Constituency</span>
                      <span className="col-span-2 font-semibold text-slate-200">{member.assembly.name}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-slate-400 font-semibold uppercase text-xs">Date of Joining</span>
                      <span className="col-span-2 text-slate-300">{new Date(member.joiningDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-slate-400 font-semibold uppercase text-xs">Document Number</span>
                      <span className="col-span-2 font-mono text-slate-300">{member.documents[0]?.documentNo}</span>
                    </div>
                  </div>
                </div>

                {/* Download PDF Card Widget */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-white text-sm">Download Digital ID Card</h3>
                    <p className="text-slate-400 text-xs mt-1">Get your double-sided printable PDF membership card.</p>
                  </div>
                  <button
                    onClick={handleDownloadCard}
                    disabled={downloading}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 text-xs uppercase"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card visual mockup panel (Col span 2) */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl shadow-2xl p-6 relative overflow-hidden aspect-[1.586/1]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl" />
                  
                  {/* Brand Header */}
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <h4 className="font-bold text-[10px] text-amber-500 tracking-wider">TAMILAGA VETRI KAZHAGAM</h4>
                      <p className="text-[7px] text-slate-500 font-semibold uppercase">Uttar Pradesh Digital Membership</p>
                    </div>
                    <Shield className="w-6 h-6 text-amber-500/80 stroke-[1.5]" />
                  </div>

                  {/* Member Photo Frame & Details */}
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-slate-800 border border-amber-500/20 rounded-md overflow-hidden flex items-center justify-center">
                      {/* Avatar placeholder SVG */}
                      <User className="w-8 h-8 text-slate-600" />
                    </div>

                    <div className="space-y-1.5 text-[9px]">
                      <div>
                        <span className="text-slate-500 block uppercase font-bold text-[7px]">Name</span>
                        <span className="text-white font-bold">{member.fullName.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-bold text-[7px]">Membership ID</span>
                        <span className="text-amber-500 font-mono font-bold tracking-wide">{member.membershipId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-bold text-[7px]">District</span>
                        <span className="text-slate-300">{member.district.name.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom branding */}
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end border-t border-slate-850 pt-2.5">
                    <span className="text-[6px] text-slate-600 uppercase font-bold">Live QR Verified Card</span>
                    <span className="text-[7px] text-amber-500 font-bold uppercase">TVK UP Portal</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(member.status === 'SUBMITTED' || member.status === 'UNDER_REVIEW') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-xl relative max-w-xl mx-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide font-display">
                  Application Under Review
                </h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm">
                  Thank you for submitting your TVK membership request. Your application details and documents are currently undergoing review.
                </p>

                {/* Animated Timeline */}
                <div className="w-full max-w-sm space-y-6 text-left">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div className="w-0.5 h-10 bg-emerald-500/50" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Application Submitted</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Forms and consents correctly recorded.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                      <div className="w-0.5 h-10 bg-slate-800" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-500">Document Verification</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Verification Officer is auditing uploaded credentials.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Clock className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-600">Membership Card Allocation</h4>
                      <p className="text-slate-600 text-xs mt-0.5">Allocation of unique ID and card generation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {member.status === 'REJECTED' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-8 shadow-xl relative max-w-xl mx-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mb-6">
                  <AlertOctagon className="w-8 h-8 text-red-500" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide font-display uppercase">
                  Application Rejected
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Unfortunately, your TVK Uttar Pradesh membership application was not approved.
                </p>

                {/* Show Rejection Reason from history log */}
                <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800/80 mb-6 text-left">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Reason for Rejection</span>
                  <p className="text-red-400 text-sm font-semibold">
                    {member.history.find(h => h.newStatus === 'REJECTED')?.reason || 'Document verification failed.'}
                  </p>
                </div>

                <p className="text-slate-500 text-xs">
                  If you believe this was an error, please reach out to the TVK UP Digital Helpdesk or re-apply with corrected documents.
                </p>
              </div>
            </motion.div>
          )}

          {member.status === 'SUSPENDED' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 border border-rose-500/20 rounded-2xl p-8 shadow-xl relative max-w-xl mx-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/30 flex items-center justify-center mb-6">
                  <AlertOctagon className="w-8 h-8 text-rose-500 animate-bounce" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide font-display uppercase">
                  Membership Suspended
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Your TVK digital membership card has been temporarily suspended.
                </p>

                <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6 text-left">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Reason for Suspension</span>
                  <p className="text-rose-400 text-sm font-semibold">
                    {member.history.find(h => h.newStatus === 'SUSPENDED')?.reason || 'Violation of party guidelines.'}
                  </p>
                </div>

                <p className="text-slate-500 text-xs">
                  Please contact your scoped District Administrator for reinstatement instructions.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
