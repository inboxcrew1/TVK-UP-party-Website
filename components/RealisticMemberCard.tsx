'use client';

import { useRef, useEffect } from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../lib/i18n';

interface MemberCardProps {
  membershipNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: string;
  dob?: string;
  govtIdType?: string;
  govtIdNumber?: string;
  photoPreview?: string;
  addressLine?: string;
  locality?: string;
  city?: string;
  districtName: string;
  stateName: string;
  pincode?: string;
  assemblyName?: string;
  joinedAt: string;
  validity?: string;
  showDownloadButton?: boolean;
}

export default function RealisticMemberCard({
  membershipNumber,
  fullName,
  phone,
  email,
  gender,
  age,
  dob,
  photoPreview,
  city,
  districtName,
  stateName,
  joinedAt,
  showDownloadButton = true,
}: MemberCardProps) {
  const { lang } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);

  const cityName = city || districtName || 'Lucknow';
  const displayDob = dob || (age ? `15/08/${2026 - parseInt(age || '25', 10)}` : '15/08/1994');

  // Bilingual Field Label Mapper for All 7 Languages
  const getBilingualLabels = (l: LanguageCode) => {
    switch (l) {
      case 'HI':
        return {
          subtitle: 'तमिलग वेत्रि कषगम • उत्तर प्रदेश (TVK UP)',
          idLabel: 'सदस्यता क्रमांक (MEMBER ID)',
          nameLabel: 'नाम (NAME)',
          stateLabel: 'राज्य (STATE)',
          districtLabel: 'जनपद (DISTRICT)',
          ageLabel: 'आयु (AGE)',
          dobLabel: 'जन्मतिथि (DOB)',
          issueLabel: 'जारी (ISSUE)',
          validityLabel: 'आजीवन (LIFETIME)',
          sloganTamil: '"Pirappokkum Ella Uyirkkum"',
          sloganTranslated: 'जन्म से सभी जीव समान हैं',
        };
      case 'TA':
        return {
          subtitle: 'தமிழக வெற்றிக் கழகம் • TVK UP',
          idLabel: 'உறுப்பினர் எண் (MEMBER ID)',
          nameLabel: 'பெயர் (NAME)',
          stateLabel: 'மாநிலம் (STATE)',
          districtLabel: 'மாவட்டம் (DISTRICT)',
          ageLabel: 'வயது (AGE)',
          dobLabel: 'பிறந்த தேதி (DOB)',
          issueLabel: 'தேதி (ISSUE)',
          validityLabel: 'ஆயுட்காலம் (LIFETIME)',
          sloganTamil: '"பிறப்பொக்கும் எல்லா உயிர்க்கும்"',
          sloganTranslated: 'All Human Beings Are Born Equal',
        };
      case 'TE':
        return {
          subtitle: 'తమిళగ వెట్రి కజగం • TVK UP',
          idLabel: 'సభ్యత్వ సంఖ్య (MEMBER ID)',
          nameLabel: 'పేరు (NAME)',
          stateLabel: 'రాష్ట్రం (STATE)',
          districtLabel: 'జిల్లా (DISTRICT)',
          ageLabel: 'వయస్సు (AGE)',
          dobLabel: 'పుట్టిన తేదీ (DOB)',
          issueLabel: 'తేదీ (ISSUE)',
          validityLabel: 'జీవితకాలం (LIFETIME)',
          sloganTamil: '"Pirappokkum Ella Uyirkkum"',
          sloganTranslated: 'జన్మతః మానవులందరూ సమానమే',
        };
      case 'KN':
        return {
          subtitle: 'ತಮಿಳಗ ವೆಟ್ರಿ ಕಳಗಂ • TVK UP',
          idLabel: 'ಸದಸ್ಯತ್ವ ಸಂಖ್ಯೆ (MEMBER ID)',
          nameLabel: 'ಹೆಸರು (NAME)',
          stateLabel: 'ರಾಜ್ಯ (STATE)',
          districtLabel: 'ಜಿಲ್ಲೆ (DISTRICT)',
          ageLabel: 'ವಯಸ್ಸು (AGE)',
          dobLabel: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ (DOB)',
          issueLabel: 'ದಿನಾಂಕ (ISSUE)',
          validityLabel: 'ಆಜೀವ (LIFETIME)',
          sloganTamil: '"Pirappokkum Ella Uyirkkum"',
          sloganTranslated: 'ಹುಟ್ಟಿನಿಂದ എല്ലാ മാനവരും സമਾਨರು',
        };
      case 'ML':
        return {
          subtitle: 'തമിഴക വെട്രി കഴകം • TVK UP',
          idLabel: 'അംഗത്വ നമ്പർ (MEMBER ID)',
          nameLabel: 'പേര് (NAME)',
          stateLabel: 'സംസ്ഥാനം (STATE)',
          districtLabel: 'ജില്ല (DISTRICT)',
          ageLabel: 'പ്രായം (AGE)',
          dobLabel: 'ജനന തീയതി (DOB)',
          issueLabel: 'തീയതി (ISSUE)',
          validityLabel: 'ആയുഷ്കാലം (LIFETIME)',
          sloganTamil: '"Pirappokkum Ella Uyirkkum"',
          sloganTranslated: 'ജനനത്താൽ എല്ലാ മനുഷ്യരും സമന്മാർ',
        };
      case 'MR':
        return {
          subtitle: 'तमिळग वेत्री कळघम • TVK UP',
          idLabel: 'सदस्यत्व क्रमांक (MEMBER ID)',
          nameLabel: 'नाव (NAME)',
          stateLabel: 'राज्य (STATE)',
          districtLabel: 'जिल्हा (DISTRICT)',
          ageLabel: 'वय (AGE)',
          dobLabel: 'जन्मतारीख (DOB)',
          issueLabel: 'दिनांक (ISSUE)',
          validityLabel: 'आजीवन (LIFETIME)',
          sloganTamil: '"Pirappokkum Ella Uyirkkum"',
          sloganTranslated: 'जन्माने सर्व मानव समान आहेत',
        };
      default:
        return {
          subtitle: 'TAMILAGA VETTRI KAZHAGAM • TVK UP',
          idLabel: 'MEMBER ID / सदस्यता क्रमांक',
          nameLabel: 'NAME / नाम',
          stateLabel: 'STATE / राज्य',
          districtLabel: 'DISTRICT / जनपद',
          ageLabel: 'AGE',
          dobLabel: 'DOB',
          issueLabel: 'ISSUE',
          validityLabel: 'VALIDITY: LIFETIME',
          sloganTamil: '"Pirappokkum Ella Uyirkkum"',
          sloganTranslated: 'All Human Beings Are Born Equal',
        };
    }
  };

  const labels = getBilingualLabels(lang);

  // Store member payload in localStorage for verification lookup
  useEffect(() => {
    if (typeof window !== 'undefined' && membershipNumber) {
      const safePhotoUrl = photoPreview && photoPreview.length > 50000 ? '/media/thalapathy_vijay_watermark.jpg' : photoPreview;
      const memberRecord = {
        membershipNumber,
        fullName,
        phone,
        email,
        gender,
        age,
        dob: displayDob,
        photoPreview: safePhotoUrl,
        city: cityName,
        districtName,
        stateName: stateName || 'Uttar Pradesh',
        joinedAt,
        validity: 'Lifetime',
        status: 'ACTIVE',
      };

      try {
        localStorage.setItem(`tvk_member_${membershipNumber.replace(/\s+/g, '_')}`, JSON.stringify(memberRecord));
        localStorage.setItem('tvk_latest_member', JSON.stringify(memberRecord));
      } catch (err) {
        console.warn('LocalStorage quota limit reached:', err);
      }
    }
  }, [membershipNumber, fullName, phone, email, gender, age, displayDob, photoPreview, cityName, districtName, stateName, joinedAt]);

  // HIGH-RESOLUTION Standalone ID Card Print & Download (Exact 3.375in x 2.125in @ 300 DPI -> 1013px x 638px)
  const handleDownloadStandaloneCard = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const printWindow = window.open('', '_blank', 'width=1050,height=680');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>TVK_UP_Member_Card_${membershipNumber.replace(/\s+/g, '_')}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: 3.375in 2.125in;
                margin: 0;
              }
              html, body {
                width: 3.375in;
                height: 2.125in;
                margin: 0;
                padding: 0;
                background: #090d16;
                overflow: hidden;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-card-box {
                width: 1013px !important;
                height: 638px !important;
                transform-origin: top left;
                transform: scale(0.242346); /* Scales 1013px to exactly 3.375in on screen */
              }
              @media print {
                body {
                  width: 3.375in !important;
                  height: 2.125in !important;
                }
                .print-card-box {
                  transform: scale(0.242346) !important;
                }
              }
            </style>
          </head>
          <body>
            <div className="print-card-box">
              ${cardElement.outerHTML}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* REALISTIC CR80 STANDARD ID CARD (EXACT ASPECT RATIO 3.375 : 2.125) */}
      <div
        ref={cardRef}
        className="w-full max-w-[480px] aspect-[3.375/2.125] bg-gradient-to-br from-[#A00000] via-slate-950 to-slate-900 rounded-[20px] p-3.5 sm:p-4 md:p-5 border-2 border-amber-400/80 shadow-2xl relative overflow-hidden text-white font-sans flex flex-col justify-between select-none shrink-0"
      >
        {/* Background Wave Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-red-900/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* TOP HEADER: OFFICIAL TVK UTTAR PRADESH NAME & FLAG LOGO */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-400/40 pb-2">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Official TVK Flag Logo */}
            <div className="w-10 sm:w-12 h-6 sm:h-7 rounded border-2 border-amber-300 shadow-md overflow-hidden shrink-0 bg-slate-950 flex items-center justify-center">
              <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg"
                alt="Official TVK Flag Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="font-black text-xs sm:text-sm text-white tracking-tight leading-none block font-display">
                TVK UTTAR PRADESH
              </span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-300 uppercase tracking-wider block mt-0.5">
                {labels.subtitle}
              </span>
            </div>
          </div>

          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-500 p-0.5 shadow-lg shrink-0 flex items-center justify-center border border-amber-200">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" />
            </div>
          </div>
        </div>

        {/* MIDDLE BODY: Photo & Member Details with Bilingual Labels */}
        <div className="relative z-10 grid grid-cols-12 gap-2.5 sm:gap-3.5 items-center my-auto">
          {/* Passport Photo Frame */}
          <div className="col-span-4 aspect-[4/5] rounded-xl bg-slate-800 border-2 border-amber-400 shadow-md overflow-hidden shrink-0 relative">
            <img loading="lazy" decoding="async" src={photoPreview || '/media/leadership.jpg'}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Member Details */}
          <div className="col-span-8 space-y-1 text-left">
            <div className="bg-amber-400 text-slate-950 px-2 sm:px-2.5 py-0.5 rounded-md font-black font-mono text-[10px] sm:text-xs inline-flex items-center gap-1 sm:gap-1.5 shadow-md border border-amber-300">
              <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider">Member ID:</span>
              <span className="tracking-wide font-black">{membershipNumber}</span>
            </div>

            <div>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-300/90 uppercase tracking-wider block">
                {labels.nameLabel}
              </span>
              <h4 className="font-black text-xs sm:text-sm md:text-base text-white line-clamp-1 font-display tracking-tight leading-none">
                {fullName}
              </h4>
            </div>

            <div className="space-y-0.5 text-[9px] sm:text-[10px]">
              <p className="text-slate-200 font-mono font-bold">
                {labels.ageLabel}: <span className="text-amber-300">{age ? `${age} Yrs` : '32 Yrs'}</span>
                <span className="text-slate-300 font-normal"> ({labels.dobLabel}: {displayDob})</span>
              </p>

              <p className="text-amber-200 font-bold font-mono">
                {labels.districtLabel}: <span className="text-white">{cityName}, {stateName || 'UP'}</span>
              </p>

              <div className="text-emerald-400 text-[8.5px] sm:text-[9.5px] font-mono font-extrabold flex items-center gap-2 pt-0.5">
                <span>{labels.issueLabel}: {joinedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEAMLESS ORIGINAL COLOR BACKGROUND WATERMARK */}
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-[36%] aspect-square opacity-50 pointer-events-none z-0 overflow-hidden flex items-center justify-center"
          style={{
            WebkitMaskImage: 'radial-gradient(circle at 75% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 85%)',
            maskImage: 'radial-gradient(circle at 75% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 85%)',
          }}
        >
          <img loading="lazy" decoding="async" src="/media/thalapathy_vijay_watermark.jpg"
            alt="Thalapathy Vijay Official Watermark"
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).src = '/media/leadership.jpg'; }}
          />
        </div>

        {/* FOOTER: DYNAMIC TRANSLATED SLOGAN BANNER */}
        <div className="relative z-10 border-t border-amber-400/50 pt-1 text-center bg-slate-950/60 rounded-b-xl -mx-3.5 sm:-mx-4 md:-mx-5 -mb-3.5 sm:-mb-4 md:-mb-5 p-1.5 sm:p-2">
          <p className="text-[10px] sm:text-[11px] font-black uppercase text-[#FFC72C] font-display tracking-wider drop-shadow">
            {labels.sloganTamil}
          </p>
          <p className="text-[7.5px] sm:text-[8px] text-amber-200 font-semibold tracking-wide">
            {labels.sloganTranslated}
          </p>
        </div>
      </div>

      {/* STANDALONE CARD DOWNLOAD BUTTON */}
      {showDownloadButton && (
        <button
          onClick={handleDownloadStandaloneCard}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xl transition-all hover:scale-105"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>DOWNLOAD ID CARD (3.375" x 2.125")</span>
        </button>
      )}
    </div>
  );
}
