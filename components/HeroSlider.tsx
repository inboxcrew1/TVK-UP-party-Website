'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Crown, BookOpen } from 'lucide-react';

interface HeroSlide {
  id: number;
  labelEn: string;
  labelHi: string;
  badgeEn: string;
  badgeHi: string;
  headlineEn: string;
  headlineHi: string;
  goldTextEn: string;
  goldTextHi: string;
  quoteEn: string;
  quoteHi: string;
  imageUrl: string;
  imageAlt: string;
  leaderTitleEn: string;
  leaderTitleHi: string;
  leaderRoleEn: string;
  leaderRoleHi: string;
  ctaTextEn: string;
  ctaTextHi: string;
  ctaLink: string;
  secondaryCtaTextEn: string;
  secondaryCtaTextHi: string;
  secondaryCtaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    labelEn: 'C. Joseph Vijay',
    labelHi: 'सी. जोसेफ विजय',
    badgeEn: 'FOUNDER & PRESIDENT &bull; C. JOSEPH VIJAY',
    badgeHi: 'संस्थापक एवं अध्यक्ष &bull; सी. जोसेफ विजय',
    headlineEn: 'Work! Rise!',
    headlineHi: 'कार्य करो! उठो!',
    goldTextEn: 'You Can!',
    goldTextHi: 'तुम कर सकते हो!',
    quoteEn: 'The journey of our leader was not laid out with flowers. He turned obstacles into stepping stones and marched forward with determination. His life stands as a story of success. Since 1992, his supporters have been defined by their commitment to social service.',
    quoteHi: 'हमारे नेता की यात्रा फूलों से नहीं सजी थी। उन्होंने बाधाओं को सीढ़ियों में बदल दिया और दृढ़ संकल्प के साथ आगे बढ़े। 1992 से ही उनके समर्थक समाज सेवा के प्रति समर्पित रहे हैं।',
    imageUrl: 'https://tvkassets.minsky.studio/media/leadership.png',
    imageAlt: 'C. Joseph Vijay Speech Podium Leadership',
    leaderTitleEn: 'C. Joseph Vijay',
    leaderTitleHi: 'सी. जोसेफ विजय',
    leaderRoleEn: 'Founder & President, TVK',
    leaderRoleHi: 'संस्थापक और अध्यक्ष, TVK',
    ctaTextEn: 'Join TVK Membership',
    ctaTextHi: 'TVK सदस्यता लें',
    ctaLink: '/login',
    secondaryCtaTextEn: 'Leader Profile',
    secondaryCtaTextHi: 'नेता प्रोफ़ाइल',
    secondaryCtaLink: '/leader',
  },
  {
    id: 2,
    labelEn: 'Founding Visionaries',
    labelHi: 'महापुरुष एवं विचारक',
    badgeEn: 'FOUNDING VISIONARIES &bull; EQUALITY FOR ALL',
    badgeHi: 'संस्थापक विचार एवं सामाजिक न्याय',
    headlineEn: 'Pirappokkum Ella Uyirkkum',
    headlineHi: 'जन्म से सभी जीव समान हैं',
    goldTextEn: 'All are Equal by Birth',
    goldTextHi: '(Pirappokkum Ella Uyirkkum)',
    quoteEn: 'Rooted in egalitarianism, secular social justice, and state autonomy guided by Dr. B.R. Ambedkar, Thanthai Periyar, K. Kamaraj, Rani Velu Nachiyar, and Anjalai Ammal.',
    quoteHi: 'डॉ. बी.आर. अंबेडकर, तंतै पेरियार, के. कामराज, रानी वेलु नाचियार और अंजलि अम्मल के विचारों पर आधारित धर्मनिरपेक्ष सामाजिक न्याय।',
    imageUrl: 'https://tvkassets.minsky.studio/media/ideology.png',
    imageAlt: 'TVK Ideology Visionaries - Velu Nachiyar, Kamaraj, Periyar, C. Joseph Vijay, Ambedkar, Anjalai Ammal',
    leaderTitleEn: 'Secular Social Justice',
    leaderTitleHi: 'धर्मनिरपेक्ष सामाजिक न्याय',
    leaderRoleEn: 'Guided by Great Visionaries',
    leaderRoleHi: 'महान विचारकों के मार्गदर्शन में',
    ctaTextEn: 'Explore Ideology',
    ctaTextHi: 'विचारधारा देखें',
    ctaLink: '/ideology',
    secondaryCtaTextEn: 'About TVK',
    secondaryCtaTextHi: 'TVK के बारे में',
    secondaryCtaLink: '/about',
  },
  {
    id: 3,
    labelEn: 'Mass Conference',
    labelHi: 'ऐतिहासिक राज्य सम्मेलन',
    badgeEn: '800,000+ CITIZENS &bull; STATE CONFERENCE',
    badgeHi: '8,00,000+ नागरिक &bull; विशाल जनसभा',
    headlineEn: 'People-Centric Governance &',
    headlineHi: 'जन-केंद्रित शासन और',
    goldTextEn: 'Social Empowerment',
    goldTextHi: 'सामाजिक कल्याण',
    quoteEn: 'A political movement must never be just a loud voice for change. At its core, it must advance people-centric politics through concrete welfare-driven actions.',
    quoteHi: 'एक राजनीतिक आंदोलन को केवल बदलाव की आवाज नहीं बनना चाहिए। इसके मूल में, इसे ठोस कल्याणकारी कार्यों के माध्यम से जन-केंद्रित राजनीति को आगे बढ़ाना चाहिए।',
    imageUrl: 'https://tvkassets.minsky.studio/media/puducherry_campaign.jpg',
    imageAlt: 'TVK Historic State Conference Puducherry Assembly Rally',
    leaderTitleEn: 'Mass People Conference',
    leaderTitleHi: 'विशाल जन सम्मेलन',
    leaderRoleEn: 'Puducherry & Tamil Nadu Assemblies',
    leaderRoleHi: 'पुडुचेरी एवं तमिलनाडु जनसभा',
    ctaTextEn: '26 Resolutions',
    ctaTextHi: '26 मुख्य प्रस्ताव',
    ctaLink: '/cms',
    secondaryCtaTextEn: 'Party History',
    secondaryCtaTextHi: 'पार्टी इतिहास',
    secondaryCtaLink: '/history',
  },
  {
    id: 4,
    labelEn: 'Electoral Victory',
    labelHi: 'ऐतिहासिक चुनावी जीत',
    badgeEn: 'HISTORIC MANDATE &bull; 108 SEATS WON',
    badgeHi: 'ऐतिहासिक जनादेश &bull; 108 सीटें जीतीं',
    headlineEn: '108 Assembly Seats Won in',
    headlineHi: 'विधानसभा चुनाव में 108 सीटें जीतकर',
    goldTextEn: 'Historic Victory',
    goldTextHi: 'ऐतिहासिक जीत दर्ज की',
    quoteEn: 'Winning 108 assembly seats in Tamil Nadu & 2 seats in Puducherry to establish transparent, corruption-free governance for all citizens.',
    quoteHi: 'तमिलनाडु में 108 सीटें जीतकर जनता की सेवा के लिए भ्रष्टाचार मुक्त और पारदर्शी शासन की स्थापना।',
    imageUrl: 'https://tvkassets.minsky.studio/media/perambur_nomination.jpg',
    imageAlt: 'Perambur Historic Candidacy & Nomination Filing',
    leaderTitleEn: 'Historic Victory 2026',
    leaderTitleHi: 'ऐतिहासिक जीत 2026',
    leaderRoleEn: '108 Seats Won out of 234',
    leaderRoleHi: '234 में से 108 सीटें जीतीं',
    ctaTextEn: 'Electoral Records',
    ctaTextHi: 'चुनाव रिकॉर्ड',
    ctaLink: '/elections',
    secondaryCtaTextEn: 'District Explorer',
    secondaryCtaTextHi: 'जिला खोजें',
    secondaryCtaLink: '/districts',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  useEffect(() => {
    const handleLangChange = () => {
      const currentLang = (document.documentElement.getAttribute('data-lang') as 'EN' | 'HI') || 'EN';
      setLang(currentLang);
    };

    handleLangChange();
    window.addEventListener('tvk_lang_change', handleLangChange);
    return () => window.removeEventListener('tvk_lang_change', handleLangChange);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];
  const isHi = lang === 'HI';

  return (
    <div
      className="relative w-full bg-slate-950 text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* FULL AREA BACKGROUND PICTURE SLIDESHOW - NO BOXES */}
      <div className="relative w-full min-h-[550px] md:min-h-[650px] flex items-center">
        {HERO_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img loading="lazy" decoding="async" src={item.imageUrl}
              alt={item.imageAlt}
              className="w-full h-full object-cover object-center"
            />
            {/* Immersive Full-Width Multi-layered Gradients for Crystal Clear Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
          </div>
        ))}

        {/* FULL AREA HERO CONTENT OVERLAY */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-6 w-full">
          {/* Top Pill Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all border ${
                    idx === currentSlide
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                      : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  {isHi ? s.labelHi : s.labelEn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-amber-300 font-extrabold uppercase tracking-wider bg-slate-900/80 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isHi ? 'हर 5.5 सेकंड में ऑटो स्लाइड' : 'Auto-Switching Every 5.5s'}</span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#A00000] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/50 shadow-xl backdrop-blur-md">
            <Crown className="w-4 h-4 text-amber-300" />
            <span dangerouslySetInnerHTML={{ __html: isHi ? slide.badgeHi : slide.badgeEn }} />
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              {isHi ? slide.headlineHi : slide.headlineEn}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                {isHi ? slide.goldTextHi : slide.goldTextEn}
              </span>
            </h2>
          </div>

          {/* Quote Card */}
          <div className="bg-slate-950/80 backdrop-blur-md border-l-4 border-amber-400 rounded-2xl p-6 shadow-2xl max-w-3xl border border-white/10 space-y-2">
            <p className="text-slate-200 text-xs md:text-sm leading-relaxed italic font-medium">
              &ldquo;{isHi ? slide.quoteHi : slide.quoteEn}&rdquo;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={slide.ctaLink}
              className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black py-4 px-8 rounded-xl shadow-2xl shadow-[#A00000]/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-amber-400/50 hover:scale-105"
            >
              {isHi ? slide.ctaTextHi : slide.ctaTextEn} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={slide.secondaryCtaLink}
              className="bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold py-4 px-6 rounded-xl border border-amber-400/30 transition-all flex items-center justify-center gap-2 text-xs backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4 text-amber-400" /> {isHi ? slide.secondaryCtaTextHi : slide.secondaryCtaTextEn}
            </Link>
          </div>
        </div>

        {/* CONTROLS ARROWS */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-[#A00000] text-white flex items-center justify-center border border-amber-400/40 backdrop-blur-md transition-all hover:scale-110 shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-[#A00000] text-white flex items-center justify-center border border-amber-400/40 backdrop-blur-md transition-all hover:scale-110 shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* INDICATOR DOTS */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-between items-center border-t border-white/10 pt-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide
                    ? 'w-10 bg-gradient-to-r from-amber-400 to-[#A00000]'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-xs text-amber-300 font-extrabold uppercase tracking-wider">
            {isHi ? slide.leaderTitleHi : slide.leaderTitleEn} &bull; {isHi ? slide.leaderRoleHi : slide.leaderRoleEn}
          </div>
        </div>
      </div>
    </div>
  );
}
