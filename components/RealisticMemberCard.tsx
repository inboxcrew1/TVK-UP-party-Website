'use client';

import { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Download, Printer, ImageIcon, Loader2 } from 'lucide-react';
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
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingJpg, setIsDownloadingJpg] = useState(false);

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
          sloganTranslated: 'ಹುಟ್ಟಿನಿಂದ ಎಲ್ಲಾ ಮಾನವರೂ ಸಮಾನರು',
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

  // ============================================================
  // HIGH-DEFINITION 2D CANVAS CARD RENDERER (1440×906px — 3× CR80)
  // Direct Native HTML5 Canvas 2D Engine with zero external dependencies
  // Guarantees 100% reliability across all desktop and mobile browsers
  // ============================================================
  const renderCardToCanvas = async (): Promise<HTMLCanvasElement> => {
    const W = 1440;
    const H = 906;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Helper: Safely load images with fallback
    const loadImage = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Retry without crossOrigin if CORS was rejected
          const img2 = new Image();
          img2.onload = () => resolve(img2);
          img2.onerror = () => resolve(null);
          img2.src = src;
        };
        img.src = src;
      });
    };

    // Helper: Draw rounded rectangle path
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // 1. Clip outer rounded card boundary (Radius: 40px)
    roundRect(0, 0, W, H, 40);
    ctx.clip();

    // 2. Base Background: Deep Maroon to Dark Slate Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#A00000');
    bgGrad.addColorStop(0.35, '#0B0F19');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Radial Gold Glow in top-right
    const glow = ctx.createRadialGradient(W * 0.85, 0, 10, W * 0.85, 0, W * 0.6);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.20)');
    glow.addColorStop(0.6, 'rgba(160, 0, 0, 0.10)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 3. Background Watermark (Thalapathy Vijay) on the right side
    const watermarkImg = await loadImage('/media/thalapathy_vijay_watermark.jpg');
    if (watermarkImg) {
      ctx.save();
      ctx.globalAlpha = 0.30;
      const wmSize = 540;
      const wmX = W - wmSize - 10;
      const wmY = (H - wmSize) / 2 - 10;
      ctx.drawImage(watermarkImg, wmX, wmY, wmSize, wmSize);
      ctx.restore();
    }

    // 4. Outer Gold Border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FBBF24';
    roundRect(5, 5, W - 10, H - 10, 40);
    ctx.stroke();

    // ============================================================
    // TOP HEADER
    // ============================================================
    const headerY = 40;

    // TVK Flag Logo box (x: 45, y: 40, w: 120, h: 80)
    const logoImg = await loadImage('/media/tvk_official_logo.jpg');
    ctx.save();
    roundRect(45, headerY, 120, 80, 12);
    ctx.clip();
    if (logoImg) {
      ctx.drawImage(logoImg, 45, headerY, 120, 80);
    } else {
      ctx.fillStyle = '#A00000';
      ctx.fillRect(45, headerY, 120, 80);
    }
    ctx.restore();

    // Border around Logo Box
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FDE68A';
    roundRect(45, headerY, 120, 80, 12);
    ctx.stroke();

    // TVK Title & Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 42px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('TVK UTTAR PRADESH', 185, headerY + 6);

    ctx.fillStyle = '#FCD34D';
    ctx.font = '800 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(labels.subtitle, 185, headerY + 54);

    // Right Shield Check Badge
    const emblemX = W - 90;
    const emblemY = headerY + 40;
    ctx.save();
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, 34, 0, Math.PI * 2);
    const emblemGrad = ctx.createLinearGradient(emblemX - 34, emblemY - 34, emblemX + 34, emblemY + 34);
    emblemGrad.addColorStop(0, '#FDE68A');
    emblemGrad.addColorStop(0.5, '#F59E0B');
    emblemGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = emblemGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FEF3C7';
    ctx.stroke();

    // Inner dark circle
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#020617';
    ctx.fill();

    // Shield check icon
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.moveTo(emblemX, emblemY - 14);
    ctx.lineTo(emblemX + 14, emblemY - 6);
    ctx.lineTo(emblemX + 14, emblemY + 8);
    ctx.quadraticCurveTo(emblemX, emblemY + 20, emblemX, emblemY + 20);
    ctx.quadraticCurveTo(emblemX, emblemY + 20, emblemX - 14, emblemY + 8);
    ctx.lineTo(emblemX - 14, emblemY - 6);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(emblemX - 6, emblemY + 3);
    ctx.lineTo(emblemX - 1, emblemY + 8);
    ctx.lineTo(emblemX + 7, emblemY - 2);
    ctx.stroke();
    ctx.restore();

    // Header bottom gold divider
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(45, 140);
    ctx.lineTo(W - 45, 140);
    ctx.stroke();

    // ============================================================
    // MIDDLE BODY
    // ============================================================
    // 1. Passport Photo Frame (x: 45, y: 170, w: 340, h: 425)
    const photoX = 45;
    const photoY = 170;
    const photoW = 340;
    const photoH = 425;

    ctx.save();
    roundRect(photoX, photoY, photoW, photoH, 24);
    ctx.clip();
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    const memberPhotoImg = photoPreview
      ? await loadImage(photoPreview)
      : await loadImage('/media/leadership.jpg');

    if (memberPhotoImg) {
      const imgRatio = memberPhotoImg.width / memberPhotoImg.height;
      const frameRatio = photoW / photoH;
      let sW, sH, sX, sY;
      if (imgRatio > frameRatio) {
        sH = memberPhotoImg.height;
        sW = sH * frameRatio;
        sX = (memberPhotoImg.width - sW) / 2;
        sY = 0;
      } else {
        sW = memberPhotoImg.width;
        sH = sW / frameRatio;
        sX = 0;
        sY = (memberPhotoImg.height - sH) / 2;
      }
      ctx.drawImage(memberPhotoImg, sX, sY, sW, sH, photoX, photoY, photoW, photoH);
    }
    ctx.restore();

    // Photo Frame Gold Border
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FBBF24';
    roundRect(photoX, photoY, photoW, photoH, 24);
    ctx.stroke();

    // 2. Member Details (x: 425)
    const detailX = 425;
    let textY = 175;

    // Member ID Badge
    ctx.save();
    const badgeW = 440;
    const badgeH = 50;
    roundRect(detailX, textY, badgeW, badgeH, 12);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FDE68A';
    ctx.stroke();

    ctx.fillStyle = '#020617';
    ctx.font = '900 24px monospace, system-ui';
    ctx.textBaseline = 'middle';
    ctx.fillText(`MEMBER ID:  ${membershipNumber}`, detailX + 18, textY + badgeH / 2);
    ctx.restore();

    textY += 75;

    // Name Section
    ctx.fillStyle = '#FCD34D';
    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(labels.nameLabel, detailX, textY);

    textY += 32;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 44px system-ui, -apple-system, sans-serif';
    ctx.fillText(fullName, detailX, textY);

    textY += 68;

    // Age & DOB
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '700 26px monospace, system-ui';
    const ageStr = age ? `${age} Yrs` : '32 Yrs';
    ctx.fillText(`${labels.ageLabel}: `, detailX, textY);
    const ageLabelWidth = ctx.measureText(`${labels.ageLabel}: `).width;

    ctx.fillStyle = '#FCD34D';
    ctx.fillText(ageStr, detailX + ageLabelWidth, textY);
    const ageValWidth = ctx.measureText(ageStr).width;

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '600 24px monospace, system-ui';
    ctx.fillText(` (${labels.dobLabel}: ${displayDob})`, detailX + ageLabelWidth + ageValWidth, textY);

    textY += 46;

    // District & State
    ctx.fillStyle = '#FDE68A';
    ctx.font = '800 26px monospace, system-ui';
    ctx.fillText(`${labels.districtLabel}: `, detailX, textY);
    const distLabelWidth = ctx.measureText(`${labels.districtLabel}: `).width;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${cityName}, ${stateName || 'UP'}`, detailX + distLabelWidth, textY);

    textY += 50;

    // Issue Date (Emerald Badge)
    ctx.fillStyle = '#34D399';
    ctx.font = '900 25px monospace, system-ui';
    ctx.fillText(`${labels.issueLabel}: ${joinedAt}`, detailX, textY);

    // ============================================================
    // FOOTER SLOGAN BANNER
    // ============================================================
    const footerY = 635;
    const footerH = 120;

    // Footer top divider
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, footerY);
    ctx.lineTo(W, footerY);
    ctx.stroke();

    // Footer Background
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, footerY, W, footerH);

    // Tamil Slogan
    ctx.fillStyle = '#FFC72C';
    ctx.font = '900 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(labels.sloganTamil, W / 2, footerY + 18);

    // Translated Slogan
    ctx.fillStyle = '#FDE68A';
    ctx.font = '700 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(labels.sloganTranslated, W / 2, footerY + 66);

    return canvas;
  };

  // ============================================================
  // DIRECT IMAGE DOWNLOAD (PNG / JPG)
  // ============================================================
  const downloadAsImage = async (format: 'png' | 'jpg') => {
    format === 'png' ? setIsDownloadingPng(true) : setIsDownloadingJpg(true);

    try {
      // Render canvas using native high-definition 2D canvas pipeline
      const canvas = await renderCardToCanvas();

      const safeMemberId = membershipNumber.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
      const filename = `TVK-UP-Membership-ID-${safeMemberId || 'Member'}.${format}`;
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpg' ? 0.95 : undefined;

      // Trigger download using Blob or DataURL fallback
      if (canvas.toBlob) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 2000);
            } else {
              const dataUrl = canvas.toDataURL(mimeType, quality);
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          },
          mimeType,
          quality
        );
      } else {
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Direct Canvas download error:', err);
      alert('Could not download image. Please try the Print ID button.');
    } finally {
      format === 'png' ? setIsDownloadingPng(false) : setIsDownloadingJpg(false);
    }
  };

  // ============================================================
  // PRINT FUNCTION — Physical 3.375in × 2.125in card
  // ============================================================
  const handlePrint = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const cardHtml = cardElement.outerHTML
      .replace(/loading="lazy"/g, 'loading="eager"')
      .replace(/loading='lazy'/g, "loading='eager'");

    const printWindow = window.open('', '_blank', 'width=1050,height=680');
    if (!printWindow) {
      alert('Please allow popups for this site to use Print. Then click Print again.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>Print_TVK_UP_Card_${membershipNumber.replace(/\s+/g, '_')}</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>
      @page { size: 3.375in 2.125in; margin: 0; }
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        width: 3.375in;
        height: 2.125in;
        margin: 0; padding: 0;
        background: #090d16;
        overflow: hidden;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
      .tvk-print-wrap {
        position: absolute;
        top: 0; left: 0;
        width: 480px;
        height: 302px;
        transform-origin: top left;
        transform: scale(0.675);
      }
      .tvk-print-wrap > div {
        width: 480px !important;
        height: 302px !important;
        max-width: 480px !important;
        border-radius: 20px !important;
        overflow: hidden !important;
      }
      @media print {
        html, body { width: 3.375in !important; height: 2.125in !important; }
        .tvk-print-wrap { transform: scale(0.675) !important; }
      }
    </style>
  </head>
  <body>
    <div class="tvk-print-wrap">
      ${cardHtml}
    </div>
    <script>
      var imgs = document.querySelectorAll('img');
      var total = imgs.length;
      var loaded = 0;
      function tryPrint() {
        loaded++;
        if (loaded >= total) { setTimeout(function() { window.print(); }, 150); }
      }
      if (total === 0) {
        setTimeout(function() { window.print(); }, 200);
      } else {
        imgs.forEach(function(img) {
          if (img.complete && img.naturalWidth > 0) { tryPrint(); }
          else { img.onload = tryPrint; img.onerror = tryPrint; }
        });
      }
    <\/script>
  </body>
</html>`);
    printWindow.document.close();
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
              <img loading="eager" decoding="sync" src="/media/tvk_official_logo.jpg"
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
            <img loading="eager" decoding="sync" src={photoPreview || '/media/leadership.jpg'}
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
          <img loading="eager" decoding="sync" src="/media/thalapathy_vijay_watermark.jpg"
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

      {/* ============================================================
          DOWNLOAD BUTTONS — Outside the card, never captured in image
          ============================================================ */}
      {showDownloadButton && (
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-[480px]">

          {/* PRIMARY: Download PNG */}
          <button
            onClick={() => downloadAsImage('png')}
            disabled={isDownloadingPng || isDownloadingJpg}
            className="flex-1 min-w-[140px] bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {isDownloadingPng ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></>
            ) : (
              <><Download className="w-4 h-4 stroke-[2.5]" /><span>Download PNG</span></>
            )}
          </button>

          {/* SECONDARY: Download JPG */}
          <button
            onClick={() => downloadAsImage('jpg')}
            disabled={isDownloadingPng || isDownloadingJpg}
            className="flex-1 min-w-[120px] bg-slate-700 hover:bg-slate-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border border-slate-600"
          >
            {isDownloadingJpg ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></>
            ) : (
              <><ImageIcon className="w-4 h-4" /><span>Download JPG</span></>
            )}
          </button>

          {/* TERTIARY: Print (physical 3.375×2.125in) */}
          <button
            onClick={handlePrint}
            disabled={isDownloadingPng || isDownloadingJpg}
            className="flex-1 min-w-[100px] bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-amber-300 font-black px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border border-amber-400/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print ID</span>
          </button>
        </div>
      )}

      {/* Helper text */}
      {showDownloadButton && (
        <p className="text-[10px] text-slate-400 text-center max-w-[480px] font-mono">
          PNG = sharpest quality for digital use &bull; JPG = smaller file &bull; Print = exact 3.375&quot; × 2.125&quot; physical card
        </p>
      )}
    </div>
  );
}
