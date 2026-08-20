'use client';

import Link from 'next/link';
import { Shield, Flag, Phone, Mail, MapPin, ExternalLink, ArrowRight, Heart, Sparkles, Send, Globe, ChevronRight, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  const footerI18n: Record<string, Record<string, string>> = {
    HI: {
      tagline: 'जन्म से सभी जीव समान हैं (Pirappokkum Ella Uyirkkum)',
      desc: 'तमिलग वेत्रि कषगम (TVK) उत्तर प्रदेश - धर्मनिरपेक्ष सामाजिक न्याय, राज्य स्वायत्तता, भ्रष्टाचार मुक्त पारदर्शी शासन एवं जनसेवा का मजबूत संकल्प।',
      quickLinks: 'त्वरित नेविगेशन',
      keyDistricts: 'प्रमुख जनपद उत्तर प्रदेश',
      contactUs: 'संपर्क एवं मुख्यालय',
      headquarters: 'टीवीके उत्तर प्रदेश राज्य मुख्यालय, बुलंदशहर (203001)',
      helpline: 'हेल्पलाइन: +91 5732 234567 / +91 98765 43210',
      email: 'ईमेल: contact@tvkuttarpradesh.in',
      joinBtn: 'टीवीके-यूपी प्राथमिक सदस्य बनें',
      rights: '© 2026 तमिलग वेत्रि कषगम (TVK) उत्तर प्रदेश। सर्वाधिकार सुरक्षित।',
      secularTag: 'धर्मनिरपेक्ष सामाजिक न्याय • समानता • जनसेवा',
    },
    EN: {
      tagline: 'All Human Beings Are Born Equal (Pirappokkum Ella Uyirkkum)',
      desc: 'Tamilaga Vettri Kazhagam (TVK) Uttar Pradesh - Dedicated to secular social justice, state autonomy, transparent corruption-free governance, and public welfare.',
      quickLinks: 'Quick Navigation',
      keyDistricts: 'Key UP Districts',
      contactUs: 'Contact & Headquarters',
      headquarters: 'TVK Uttar Pradesh State HQ, Bulandshahr (203001)',
      helpline: 'Helpline: +91 5732 234567 / +91 98765 43210',
      email: 'Email: contact@tvkuttarpradesh.in',
      joinBtn: 'Join TVK-UP Primary Membership',
      rights: '© 2026 Tamilaga Vettri Kazhagam (TVK) Uttar Pradesh. All Rights Reserved.',
      secularTag: 'Secular Social Justice • Equality • Public Welfare',
    },
    TA: {
      tagline: 'பிறப்பொக்கும் எல்லா உயிர்க்கும்',
      desc: 'தமிழக வெற்றிக் கழகம் (TVK) உத்தரப் பிரதேசம் - மதச்சார்பற்ற சமூக நீதி, மாநில சுயாட்சி மற்றும் வெளிப்படையான மக்கள் சேவை.',
      quickLinks: 'விரைவு வழிசெலுத்தல்',
      keyDistricts: 'முக்கிய மாவட்டங்கள்',
      contactUs: 'தொடர்பு & தலைமை அலுவலகம்',
      headquarters: 'டிவிகே உத்தரப் பிரதேச மாநில தலைமை அலுவலகம், புலந்தசஹர் (203001)',
      helpline: 'உதவி எண்: +91 5732 234567',
      email: 'மின்னஞ்சல்: contact@tvkuttarpradesh.in',
      joinBtn: 'TVK-UP உறுப்பினராக சேருங்கள்',
      rights: '© 2026 தமிழக வெற்றிக் கழகம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      secularTag: 'சமூக நீதி • சமத்துவம் • மக்கள் சேவை',
    },
    TE: {
      tagline: 'పుట్టుకతో జీవులన్నీ సమానమే (Pirappokkum Ella Uyirkkum)',
      desc: 'తమిళగ వెట్రి కజగం (TVK) ఉత్తర ప్రదేశ్ - లౌకిక సామాజిక న్యాయం, ప్రజా సంక్షేమం మరియు పారదర్శక పాలనకు కట్టుబడి ఉంది.',
      quickLinks: 'త్వరిత నావిగేషన్',
      keyDistricts: 'ముఖ్యమైన జిల్లాలు',
      contactUs: 'సంప్రదించండి & ప్రధాన కార్యాలయం',
      headquarters: 'టీవీకే ఉత్తర ప్రదేశ్ రాష్ట్ర ప్రధాన కార్యాలయం, బులంద్‌షహర్ (203001)',
      helpline: 'హెల్ప్‌లైన్: +91 5732 234567',
      email: 'ఈమెయిల్: contact@tvkuttarpradesh.in',
      joinBtn: 'టీవీకే-యూపీ ప్రాథమిక సభ్యుడిగా చేరండి',
      rights: '© 2026 తమిళగ వెట్రి కజగం ఉత్తర ప్రదేశ్. సర్వహక్కులూ ప్రత్యేకించబడ్డాయి.',
      secularTag: 'సామాజిక న్యాయం • సమానత్వం • ప్రజాసేవ',
    },
    KN: {
      tagline: 'ಹುಟ್ಟಿನಿಂದ ಎಲ್ಲಾ ಜೀವಿಗಳೂ ಸಮಾನ (Pirappokkum Ella Uyirkkum)',
      desc: 'ತಮಿಳಗ ವೆಟ್ರಿ ಕಳಗಂ (TVK) ಉತ್ತರ ಪ್ರದೇಶ - ಜಾತ್ಯತೀತ ಸಾಮಾಜಿಕ ನ್ಯಾಯ, ರಾಜ್ಯ ಸ್ವಾಯತ್ತತೆ ಮತ್ತು ಪಾರದರ್ಶಕ ಜನಸೇವೆಗೆ ಬದ್ಧವಾಗಿದೆ.',
      quickLinks: 'ತ್ವರಿತ ನ್ಯಾವಿಗೇಷನ್',
      keyDistricts: 'ಪ್ರಮುಖ ಜಿಲ್ಲೆಗಳು',
      contactUs: 'ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ಪ್ರಧಾನ ಕಚೇರಿ',
      headquarters: 'ಟಿವಿಕೆ ಉತ್ತರ ಪ್ರದೇಶ ರಾಜ್ಯ ಪ್ರಧಾನ ಕಚೇರಿ, ಬುಲಂದ್‌ಶಹರ್ (203001)',
      helpline: 'ಹೆಲ್ಪ್‌ಲೈನ್: +91 5732 234567',
      email: 'ಇಮೇಲ್: contact@tvkuttarpradesh.in',
      joinBtn: 'ಟಿವಿಕೆ-ಯುಪಿ ಪ್ರಾಥಮಿಕ ಸದಸ್ಯರಾಗಿ',
      rights: '© 2026 ತಮಿಳಗ ವೆಟ್ರಿ ಕಳಗಂ ಉತ್ತರ ಪ್ರದೇಶ. ಸರ್ವಾಧಿಕಾರ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      secularTag: 'ಸಾಮಾಜಿಕ ನ್ಯಾಯ • ಸಮಾನತೆ • ಜನಸೇವೆ',
    },
    ML: {
      tagline: 'ജനനത്താൽ എല്ലാ ജീവികളും സമന്മാർ (Pirappokkum Ella Uyirkkum)',
      desc: 'തമിഴക വെട്രി കഴകം (TVK) ഉത്തർപ്രദേശ് - മതേതര സാമൂഹിക നീതിക്കും സുതാര്യമായ ജനസേവനത്തിനും പ്രതിജ്ഞാബദ്ധമാണ്.',
      quickLinks: 'ക്വിക്ക് നാവിഗേഷൻ',
      keyDistricts: 'പ്രധാന ജില്ലകൾ',
      contactUs: 'ബന്ധപ്പെടുക & ആസ്ഥാനം',
      headquarters: 'ടിവികെ ഉത്തർപ്രദേശ് സംസ്ഥാന ആസ്ഥാനം, ബുലന്ദ്ഷഹർ (203001)',
      helpline: 'ഹെൽപ്പ് ലൈൻ: +91 5732 234567',
      email: 'ഇമെയിൽ: contact@tvkuttarpradesh.in',
      joinBtn: 'ടിവികെ-യുപി പ്രാഥമിക അംഗമാകുക',
      rights: '© 2026 തമിഴക വെട്രി കഴകം ഉത്തർപ്രദേശ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
      secularTag: 'സാമൂഹിക നീതി • സമത്വം • ജനസേവനം',
    },
    MR: {
      tagline: 'जन्माने सर्व जीव समान आहेत (Pirappokkum Ella Uyirkkum)',
      desc: 'तमिळगा वेत्री कळघम (TVK) उत्तर प्रदेश - धर्मनिरपेक्ष सामाजिक न्याय, राज्य स्वायत्तता आणि भ्रष्टाचारमुक्त पारदर्शक प्रशासनासाठी कटिबद्ध.',
      quickLinks: 'जलद नेव्हिगेशन',
      keyDistricts: 'प्रमुख जिल्हे उत्तर प्रदेश',
      contactUs: 'संपर्क आणि मुख्यालय',
      headquarters: 'टीव्हीके उत्तर प्रदेश राज्य मुख्यालय, बुलंदशहर (२०३००१)',
      helpline: 'हेल्पलाइन: +91 5732 234567',
      email: 'ईमेल: contact@tvkuttarpradesh.in',
      joinBtn: 'टीव्हीके-यूपी प्राथमिक सदस्य व्हा',
      rights: '© 2026 तमिळगा वेत्री कळघम उत्तर प्रदेश. सर्व हक्क सुरक्षित.',
      secularTag: 'धर्मनिरपेक्ष सामाजिक न्याय • समानता • जनसेवा',
    },
  };

  const fs = footerI18n[lang] || footerI18n['HI'];

  const quickNav = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/leadership', label: t('leader') },
    { href: '/ideology', label: t('org') },
    { href: '/districts', label: t('districts') },
    { href: '/gallery', label: t('gallery') },
    { href: '/sadasyata', label: t('membership') },
  ];

  const topDistricts = [
    'Bulandshahr (बुलंदशहर)',
    'Lucknow (लखनऊ)',
    'Kanpur Nagar (कानपुर नगर)',
    'Varanasi (वाराणसी)',
    'Prayagraj (प्रयागराज)',
    'Agra (आगरा)',
    'Gorakhpur (गोरखपुर)',
    'Meerut (मेरठ)',
    'Noida / GB Nagar (गौतम बुद्ध नगर)',
  ];

  return (
    <footer className="bg-[#070b14] text-white border-t-4 border-amber-400/80 relative overflow-hidden font-sans pt-16 pb-10">
      {/* Background Lighting Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#A00000]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* TOP BRANDING & MOTTO BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-800/80 pb-10">
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] bg-slate-950 shrink-0 p-0.5">
              <img
                src="/media/tvk_official_logo.jpg"
                alt="TVK Official Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black font-display tracking-wider text-white">
                  TVK UTTAR PRADESH
                </span>
                <span className="bg-gradient-to-r from-[#A00000] to-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase border border-amber-300">
                  तमिलग वेत्रि कषगम
                </span>
              </div>
              <p className="text-amber-400 font-extrabold text-xs tracking-wide">
                &ldquo;{fs.tagline}&rdquo;
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <Link
              href="/sadasyata"
              className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(160,0,0,0.5)] transition-all hover:scale-105 inline-flex items-center gap-2 border-2 border-amber-300"
            >
              <Users className="w-4 h-4 text-white" />
              <span>{fs.joinBtn}</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </Link>
          </div>
        </div>

        {/* MAIN FOOTER 4-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
          {/* Col 1: Party Overview */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider font-display border-l-4 border-amber-400 pl-2">
              तमिलग वेत्रि कषगम (TVK)
            </h4>
            <p className="text-slate-300 leading-relaxed font-medium">
              {fs.desc}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{fs.secularTag}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider font-display border-l-4 border-amber-400 pl-2">
              {fs.quickLinks}
            </h4>
            <ul className="space-y-2 font-bold text-slate-300">
              {quickNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key UP Districts */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider font-display border-l-4 border-amber-400 pl-2">
              {fs.keyDistricts}
            </h4>
            <ul className="space-y-1.5 font-medium text-slate-400">
              {topDistricts.slice(0, 7).map((dist, idx) => (
                <li key={idx} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{dist}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & State HQ */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider font-display border-l-4 border-amber-400 pl-2">
              {fs.contactUs}
            </h4>
            <div className="space-y-2.5 font-medium text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{fs.headquarters}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{fs.helpline}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{fs.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>{fs.rights}</p>
          <div className="flex flex-wrap items-center gap-6 font-bold uppercase">
            <Link href="/" className="hover:text-amber-300">{t('home')}</Link>
            <Link href="/about" className="hover:text-amber-300">{t('about')}</Link>
            <Link href="/leadership" className="hover:text-amber-300">{t('leader')}</Link>
            <Link href="/ideology" className="hover:text-amber-300">{t('org')}</Link>
            <Link href="/sadasyata" className="hover:text-amber-300">{t('membership')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
