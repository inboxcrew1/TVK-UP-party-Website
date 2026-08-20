'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, User, Award, Mail, Phone, CheckCircle, Crown, ExternalLink, Sparkles, UserPlus, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function LeadershipPage() {
  const { t } = useLanguage();

  // OFFICIAL TVK LEADERSHIP ROSTER FROM TVKVIJAY.COM SCREENSHOTS & DIRECTORY
  const centralLeaders = [
    {
      name: 'Mr. C. Joseph Vijay',
      title: 'Founder & President',
      hindiTitle: 'संस्थापक एवं अध्यक्ष',
      bio: 'Visionary Founder and President of Tamilaga Vettri Kazhagam. Dedicated to people service, social justice, secular administration, and prosperous governance across Uttar Pradesh and India.',
      photoUrl: '/media/leadership.jpg',
    },
    {
      name: 'Mr. N. Anand',
      title: 'General Secretary',
      hindiTitle: 'महासचिव',
      bio: 'Mr. N. Anand, the General Secretary, serves as a pillar of organizational strength - known both for his excellent administrative abilities and for uniting party members. He began his public life as an ardent admirer of the party leader. From serving as the Puducherry State Vijay Fan Club President to holding the key role of All India Vijay Welfare Forum Coordinator, he has carried major responsibilities. In 2006, he was elected as a Member of the Legislative Assembly of the Union Territory of Puducherry.',
      photoUrl: '/media/leader_anand.jpg',
    },
    {
      name: 'P Venkataramanan',
      title: 'Treasurer',
      hindiTitle: 'कोषाध्यक्ष',
      bio: 'P Venkataramanan manages party financial auditing, administrative resources, regulatory compliance, and fiscal operations across central and state units.',
      photoUrl: '/media/leader_venkataramanan.jpg',
    },
    {
      name: 'Mr. K.A. Sengottaiyan',
      title: 'Chief Coordinator',
      hindiTitle: 'मुख्य समन्वयक',
      bio: 'Mr. K.A. Sengottaiyan serves as Chief Coordinator overseeing central organizational affairs, inter-state committee synchronization, and leadership alignment.',
      photoUrl: '/media/leader_sengottaiyan.jpg',
    },
    {
      name: 'Aadhav Arjuna B.A.,',
      title: 'General Secretary of Election Campaign Management',
      hindiTitle: 'चुनाव अभियान प्रबंधन के महासचिव',
      bio: 'Aadhav Arjuna is a political strategist, social worker, and accomplished sports administrator. He serves as President of both the Basketball Federation of India and the Tamil Nadu Basketball Association, as well as Secretary General of the Tamil Nadu Olympic Association. To guide students and youth toward meaningful political participation, he launched the "Voice of Commons" movement.',
      photoUrl: '/media/leader_aadhav.jpg',
    },
    {
      name: 'Mr. Dr. K.G. Arunraj, Ex-IRS',
      title: 'General Secretary of Party Policy and Propaganda',
      hindiTitle: 'पार्टी नीति एवं प्रचार के महासचिव',
      bio: 'Mr. Dr. K.G. Arunraj, Ex-IRS, directs party policy drafting, propaganda strategies, public welfare outreach, and administrative governance models.',
      photoUrl: '/media/leader_arunraj.jpg',
    },
    {
      name: 'CTR Nirmal Kumar',
      title: 'Deputy General Secretary & IT Wing Head',
      hindiTitle: 'उप महासचिव एवं आईटी विंग प्रमुख',
      bio: 'Spearheading digital technology, media operations, membership portals, social media strategy, and data analytics.',
      photoUrl: 'https://tvkassets.minsky.studio/media/CTR_Nirmal_Kumar-300x300.jpg',
    },
    {
      name: 'Vijayalakshmi',
      title: 'State Women\'s Wing Coordinator',
      hindiTitle: 'राज्य महिला विंग समन्वयक',
      bio: 'Championing women empowerment, gender equality programs, self-help group development, and grassroots women leadership.',
      photoUrl: 'https://tvkassets.minsky.studio/media/Vijayalakshmi-1-300x300.jpg',
    },
  ];

  // UP STATE APPOINTED & OPEN POSITIONS
  const upPositions = [
    { position: 'उत्तर प्रदेश राज्य उपाध्यक्ष (UP State Vice President)', status: 'Nomination Active', total: 4 },
    { position: 'उत्तर प्रदेश राज्य सचिव (UP State Secretary)', status: 'Selection Open', total: 8 },
    { position: '75 जनपद संगठन अध्यक्ष (District Presidents)', status: 'Active Appointing', total: 75 },
    { position: '403 विधानसभा क्षेत्र प्रभारी (Assembly In-Charges)', status: 'Registration Open', total: 403 },
  ];

  return (
    <div className="min-h-screen bg-[#040105] text-white font-sans relative overflow-x-hidden select-none">
      <Header />

      {/* 1. LAYERED DEPTH BACKGROUND: CINEMATIC RADIAL VIGNETTE & RED-GOLD ATMOSPHERIC GLOW */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#59000a]/35 via-[#080207] to-[#020003] pointer-events-none z-0" />

      {/* 2. ATMOSPHERIC RED-GOLD LASER LIGHT BEAMS */}
      <div className="fixed top-0 left-0 w-[500px] h-[900px] bg-gradient-to-br from-[#E11D48]/30 via-[#800000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed top-0 right-0 w-[600px] h-[900px] bg-gradient-to-bl from-[#E11D48]/30 via-[#A00000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-t from-red-950/20 via-amber-500/5 to-transparent blur-[200px] pointer-events-none z-0" />

      {/* 3. SUBTLE PARTY-THEMED WATERMARK EMBLEM LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] flex items-center justify-center">
        <img src="/media/tvk_official_logo.jpg" alt="TVK Watermark" className="w-[800px] h-auto object-contain filter grayscale invert" />
      </div>

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* HERO BANNER WITH 90% VISIBILITY CINEMATIC TVK EMBLEM ARTWORK BACKGROUND */}
        <div className="relative bg-[#0c0307]/70 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.3)] overflow-hidden space-y-4 text-center">
          
          {/* 90% VISIBILITY CINEMATIC TVK EMBLEM ARTWORK BACKGROUND LAYER */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/media/leadership_flag_hero.jpg"
              alt="Cinematic TVK Flag Artwork"
              className="w-full h-full object-cover object-center opacity-90 filter contrast-110 brightness-100"
            />
            {/* Soft Gradient Mask for High Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0307]/80 via-[#0c0307]/40 to-[#0c0307]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0c0307]/30 to-[#0c0307]" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-950/70 text-amber-400 border border-amber-400/60 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Crown className="w-4 h-4 text-amber-400" /> {t('leadershipBadge')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
              Tamilaga Vettri Kazhagam <span className="text-[#FFC72C] drop-shadow-[0_0_20px_rgba(255,199,44,0.5)]">{t('leadershipTitle')}</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              {t('leaderBio')}
            </p>
          </div>
        </div>

        {/* FEATURED PRESIDENT CARD - CINEMATIC DARK GLASS & GOLD */}
        <div className="relative bg-gradient-to-r from-[#0c0307]/95 via-[#140409]/90 to-[#0c0307]/95 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.25)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white">
          
          {/* Right Chevron Motion Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none overflow-hidden">
            <div className="w-48 h-48 border-r-8 border-t-8 border-[#FFC72C] rotate-45 rounded-tr-3xl" />
          </div>

          <div className="lg:col-span-5 flex justify-center relative z-10">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl border-4 border-[#FFC72C] shadow-[0_0_30px_rgba(255,199,44,0.4)] overflow-hidden bg-slate-950">
              <img
                src={centralLeaders[0].photoUrl}
                alt={centralLeaders[0].name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#FFC72C] text-slate-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
              <Sparkles className="w-3.5 h-3.5" /> {t('leaderRole')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
              {centralLeaders[0].name}
            </h2>
            <p className="text-[#FFC72C] text-sm font-extrabold uppercase tracking-wide">
              {centralLeaders[0].title}
            </p>
            <p className="text-slate-200 text-sm leading-relaxed bg-[#0c0307]/80 p-5 rounded-2xl border border-red-500/30 backdrop-blur-sm font-medium">
              {centralLeaders[0].bio}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/sadasyata"
                className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-xl transition-all border-2 border-amber-300 hover:scale-105 uppercase tracking-wider"
              >
                JOIN TVK-UP TODAY
              </Link>
              <a
                href="https://tvkvijay.com/en/leadership"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold px-5 py-3.5 rounded-xl inline-flex items-center gap-2"
              >
                <span>TVK Official Leadership Directory</span> <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Central Executive Body Grid (DARK GLASSMORPHISM CARDS) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-red-500/30 pb-3">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 text-amber-400 flex items-center justify-center border border-red-500/50">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xl font-black text-[#FFC72C] uppercase tracking-widest font-display">
              TVK Central Executive Leadership
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {centralLeaders.slice(1).map((leader, idx) => (
              <div
                key={idx}
                className="relative bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 backdrop-blur-xl border border-red-500/35 hover:border-amber-400/80 rounded-3xl p-6 transition-all shadow-[0_10px_30px_rgba(153,0,17,0.2)] hover:shadow-[0_15px_40px_rgba(255,199,44,0.2)] flex flex-col justify-between hover:scale-[1.02] group overflow-hidden"
              >
                {/* Left Edge Accent Line */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-600 via-amber-400 to-transparent group-hover:w-2 transition-all" />

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-[#FFC72C] overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,199,44,0.3)]">
                      <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white group-hover:text-[#FFC72C] transition-colors">
                        {leader.name}
                      </h4>
                      <span className="text-xs font-black text-[#FFC72C] uppercase tracking-wider block mt-0.5">
                        {leader.title}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed font-medium">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UP STATE APPOINTED EXECUTIVE POSITIONS & NOMINATIONS (DARK GLASS CARDS) */}
        <div className="space-y-6 border-t border-red-500/30 pt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#FFC72C] uppercase tracking-widest flex items-center gap-2 font-display">
              <Award className="w-5 h-5 text-amber-400" /> उत्तर प्रदेश संगठन पद एवं कार्यकारिणी नामांकन (UP Executive Positions)
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold bg-red-950/70 border border-amber-400/40 px-3.5 py-1 rounded-full">
              UP STATE WINGS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upPositions.map((pos, i) => (
              <div key={i} className="bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 border border-red-500/35 hover:border-amber-400/80 rounded-2xl p-5 space-y-3 shadow-lg group">
                <div className="w-10 h-10 rounded-xl bg-red-950/80 text-amber-400 border border-red-500/50 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white font-display group-hover:text-[#FFC72C] transition-colors">{pos.position}</h4>
                  <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">{pos.status}</span>
                </div>
                <div className="pt-2 border-t border-red-500/20 flex justify-between items-center text-[10px] text-slate-300 font-mono">
                  <span>कुल पद</span>
                  <span className="text-[#FFC72C] font-black text-xs">{pos.total}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#1a0206] via-[#0c0307] to-slate-950 border border-red-500/40 rounded-3xl p-8 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-amber-300 flex items-center justify-center mx-auto border border-red-500/60 shadow">
              <CheckCircle className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="text-base font-black text-white">उत्तर प्रदेश राज्य कार्यकारिणी मनोनयन (Active UP State Nominations)</h4>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              उत्तर प्रदेश के सभी जनपदों एवं विधानसभा क्षेत्रों के लिए नियुक्त पदाधिकारियों की सूची लगातार अद्यतन की जा रही है।
            </p>
            <Link
              href="/sadasyata"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow-xl transition-all border border-amber-300 hover:scale-105 uppercase tracking-wider"
            >
              <span>पद हेतु आवेदन करें (Apply for Position)</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
