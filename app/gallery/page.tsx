'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Image as ImageIcon, Calendar, MapPin, Sparkles, Filter, X, Download, Share2, ZoomIn, ArrowRight, Eye, Tag, Flag } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function GalleryPage() {
  const { lang, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  // Dynamic Translations Dictionary for Gallery Page across 7 Languages
  const galleryText: Record<string, Record<string, string>> = {
    HI: {
      heroBadge: 'टीवीके आधिकारिक फोटो एवं मीडिया गैलरी',
      heroTitle: 'टीवीके आधिकारिक मीडिया एवं फोटो गैलरी',
      heroDesc: 'तमिलग वेत्रि कषगम (TVK) के राज्य सम्मेलनों, विशाल जन सभाओं, नामांकन दाखिल समारोहों एवं शीर्ष नेतृत्व गतिविधियों की प्रामाणिक फोटो संग्रह।',
      filterAll: 'सभी फोटो (All Media)',
      filterRallies: 'जन सभाएं एवं रैलियां (Rallies)',
      filterConventions: 'पार्टी सम्मेलन (Conventions)',
      filterElections: 'चुनाव एवं नामांकन (Elections)',
      filterPublicService: 'प्रशासनिक गतिविधियां (Leadership)',
      viewHd: 'फुल स्क्रीन फोटो देखें (View HD)',
      downloadHd: 'हाई-रेज़ोल्यूशन फोटो डाउनलोड करें',
      close: 'बंद करें',
      officialTag: 'आधिकारिक मीडिया',
    },
    EN: {
      heroBadge: 'TVK OFFICIAL MEDIA ARCHIVE',
      heroTitle: 'TVK Official Media & Photo Gallery',
      heroDesc: 'Authentic high-resolution media coverage, state convention rallies, nomination filings, and leadership conferences of Tamilaga Vettri Kazhagam.',
      filterAll: 'All Media',
      filterRallies: 'Rallies & Conventions',
      filterConventions: 'Party Conferences',
      filterElections: 'Elections & Filings',
      filterPublicService: 'Leadership Sessions',
      viewHd: 'View Full HD Photo',
      downloadHd: 'Download High-Res HD Photo',
      close: 'Close',
      officialTag: 'Official Media',
    },
    TA: {
      heroBadge: 'தமிழக வெற்றிக் கழகம் அதிகாரப்பூர்வ புகைப்படத் தொகுப்பு',
      heroTitle: 'தமிழக வெற்றிக் கழகம் ஊடக மற்றும் புகைப்பட மையம்',
      heroDesc: 'தமிழக வெற்றிக் கழகத்தின் (TVK) மாநில மாநாடுகள், மக்கள் பேரணிகள், வேட்புமனுத் தாக்கல் நிகழ்வுகளின் உயர்தர புகைப்படத் தொகுப்பு.',
      filterAll: 'அனைத்து புகைப்படங்கள்',
      filterRallies: 'மாநாடுகள் & பேரணிகள்',
      filterConventions: 'கட்சி மாநாடுகள்',
      filterElections: 'தேர்தல் & வேட்புமனு',
      filterPublicService: 'தலைமைத்துவ கூட்டங்கள்',
      viewHd: 'முழுப் படத்தை காண்க',
      downloadHd: 'HD புகைப்படத்தை பதிவிறக்கவும்',
      close: 'மூடு',
      officialTag: 'அதிகாரப்பூர்வ ஊடகம்',
    },
    TE: {
      heroBadge: 'టీవీకే అధికారిక ఫోటో గ్యాలరీ',
      heroTitle: 'టీవీకే అధికారిక మీడియా & ఫోటో గ్యాలరీ',
      heroDesc: 'తమిళగ వెట్రి కజగం (TVK) రాష్ట్ర సదస్సులు, భారీ ప్రజా ర్యాలీలు మరియు నాయకత్వ కార్యక్రమాల అధికారిక హెచ్‌డి ఫోటో గ్యాలరీ.',
      filterAll: 'అన్ని ఫోటోలు',
      filterRallies: 'ర్యాలీలు & సదస్సులు',
      filterConventions: 'పార్టీ సమావేశాలు',
      filterElections: 'ఎన్నికలు & నామినేషన్లు',
      filterPublicService: 'నాయకత్వ సమావేశాలు',
      viewHd: 'ఫుల్ HD ఫోటో చూడండి',
      downloadHd: 'HD ఫోటో డౌన్‌లోడ్ చేయండి',
      close: 'మూసివేయి',
      officialTag: 'అధికారిక మీడియా',
    },
    KN: {
      heroBadge: 'ಟಿವಿಕೆ ಅಧಿಕೃತ ಫೋಟೋ ಗ್ಯಾಲರಿ',
      heroTitle: 'ಟಿವಿಕೆ ಅಧಿಕೃತ ಮಾಧ್ಯಮ ಮತ್ತು ಫೋಟೋ ಗ್ಯಾಲರಿ',
      heroDesc: 'ತಮಿಳಗ ವೆಟ್ರಿ ಕಳಗಂ (TVK) ರಾಜ್ಯ ಸಮಾವೇಶಗಳು, ಬೃಹತ್ ರ್ಯಾಲಿಗಳು ಮತ್ತು ನಾಯಕತ್ವ ಕಾರ್ಯಕ್ರಮಗಳ ಅಧಿಕೃತ ಎಚ್‌ಡಿ ಫೋಟೋ ಸಂಗ್ರಹ.',
      filterAll: 'ಎಲ್ಲಾ ಫೋಟೋಗಳು',
      filterRallies: 'ರ್ಯಾಲಿಗಳು ಮತ್ತು ಸಮಾವೇಶಗಳು',
      filterConventions: 'ಪಕ್ಷದ ಸಭೆಗಳು',
      filterElections: 'ಚುನಾವಣೆಗಳು ಮತ್ತು ನಾಮನಿರ್ದೇಶನ',
      filterPublicService: 'ನಾಯಕತ್ವ ಸಭೆಗಳು',
      viewHd: 'ಪೂರ್ಣ ಎಚ್‌ಡಿ ಫೋಟೋ ವೀಕ್ಷಿಸಿ',
      downloadHd: 'ಎಚ್‌ಡಿ ಫೋಟೋ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      close: 'ಮುಚ್ಚಿ',
      officialTag: 'ಅಧಿಕೃತ ಮಾಧ್ಯಮ',
    },
    ML: {
      heroBadge: 'ടിവികെ ഔദ്യോഗിക ഫോട്ടോ ഗാലറി',
      heroTitle: 'ടിവികെ ഔദ്യോഗിക മീഡിയ & ഫോട്ടോ ഗാലറി',
      heroDesc: 'തമിഴക വെട്രി കഴകം (TVK) സംസ്ഥാന സമ്മേളനങ്ങളുടെയും ജനകീയ റാലികളുടെയും ഔദ്യോഗിക എച്ച്ഡി ഫോട്ടോ ശേഖരം.',
      filterAll: 'എല്ലാ ഫോട്ടോകളും',
      filterRallies: 'റാലികളും സമ്മേളനങ്ങളും',
      filterConventions: 'പാർട്ടി യോഗങ്ങൾ',
      filterElections: 'തിരഞ്ഞെടുപ്പും നാമനിർദ്ദേശവും',
      filterPublicService: 'നേതൃത്വ യോഗങ്ങൾ',
      viewHd: 'ഫുൾ HD ഫോട്ടോ കാണുക',
      downloadHd: 'HD ഫോട്ടോ ഡൗൺലോഡ് ചെയ്യുക',
      close: 'അടയ്ക്കുക',
      officialTag: 'ഔദ്യോഗിക മീഡിയ',
    },
    MR: {
      heroBadge: 'टीव्हीके अधिकृत फोटो गॅलरी',
      heroTitle: 'टीव्हीके अधिकृत मीडिया आणि फोटो गॅलरी',
      heroDesc: 'तमिळगा वेत्री कळघम (TVK) राज्य संमेलने, भव्य जनसभा आणि पक्ष नेतृत्व उपक्रमांचे अधिकृत उच्च-गुणवत्तेचे फोटो संकलन.',
      filterAll: 'सर्व फोटो',
      filterRallies: 'जनसभा आणि रॅली',
      filterConventions: 'पक्ष संमेलने',
      filterElections: 'निवडणूक आणि अर्ज दाखल',
      filterPublicService: 'नेतृत्व बैठका',
      viewHd: 'फुल एचडी फोटो पहा',
      downloadHd: 'एचडी फोटो डाउनलोड करा',
      close: 'बंद करा',
      officialTag: 'अधिकृत मीडिया',
    },
  };

  const gt = galleryText[lang] || galleryText['HI'];

  const categories = [
    { id: 'ALL', label: gt.filterAll, icon: Sparkles },
    { id: 'RALLIES', label: gt.filterRallies, icon: Flag },
    { id: 'CONVENTIONS', label: gt.filterConventions, icon: ImageIcon },
    { id: 'ELECTIONS', label: gt.filterElections, icon: Tag },
    { id: 'PUBLIC_SERVICE', label: gt.filterPublicService, icon: Shield },
  ];

  // 100% ACCURATE IMAGE TO CONTENT MATCHING WITH FULL MULTI-LANGUAGE DESCRIPTIONS
  const galleryItems = [
    {
      id: 1,
      title: {
        HI: 'पुदुच्चेरी राज्यस्तरीय विशाल जन सम्मेलन 2026 में टीवीके अध्यक्ष सी. जोसेफ विजय',
        EN: 'TVK President C. Joseph Vijay at Puducherry People Convention 2026',
        TA: 'புதுச்சேரி மக்கள் மாநாட்டில் தமிழக வெற்றிக் கழகத் தலைவர் சி. ஜோசப் വിജய்',
        TE: 'పుదుచ్చేరి ప్రజా సదస్సులో టీవీకే అధ్యక్షుడు సి. జోసెఫ్ విజయ్',
        KN: 'ಪುದುಚೇರಿ ಜನ ಸಮಾವೇಶದಲ್ಲಿ ಟಿವಿಕೆ ಅಧ್ಯಕ್ಷ ಸಿ. ಜೋಸೆಫ್ ವಿಜಯ್',
        ML: 'പുതുച്ചേരി ജനകീയ സമ്മേളനത്തിൽ ടിവികെ പ്രസിഡന്റ് സി. ജോസഫ് വിജയ്',
        MR: 'पुडुचेरी जनसंमेलनात टीव्हीके अध्यक्ष सी. जोसेफ विजय',
      },
      category: 'RALLIES',
      categoryLabel: 'राज्यस्तरीय रैली',
      date: '10 फरवरी 2026',
      location: 'पुदुच्चेरी (Puducherry)',
      image: '/media/puducherry_campaign.jpg',
      desc: {
        HI: 'टीवीके अध्यक्ष सी. जोसेफ विजय पीले एवं लाल पार्टी दुपट्टे के साथ हजारों समर्थकों एवं जनता को संबोधित करते हुए।',
        EN: 'TVK President C. Joseph Vijay addressing tens of thousands of cadres at the historic Puducherry Convention.',
        TA: 'புதுச்சேரி மாநில மாநாட்டில் பல்லாயிரக்கணக்கான தொண்டர்கள் முன்னிலையில் உரையாற்றும் கட்சித் தலைவர்.',
        TE: 'పుదుచ్చేరి రాష్ట్ర సదస్సులో వేలాది మంది కార్యకర్తలను ఉద్దేశించి ప్రసంగిస్తున్న పార్టీ అధ్యక్షుడు.',
        KN: 'ಪುದುಚೇರಿ ರಾಜ್ಯ ಸಮಾವೇಶದಲ್ಲಿ ಸಾವಿರಾರು ಕಾರ್ಯಕರ್ತರನ್ನು ಉದ್ದೇಶಿಸಿ ಮಾತನಾಡುತ್ತಿರುವ ಪಕ್ಷದ ಅಧ್ಯಕ್ಷರು.',
        ML: 'പുതുച്ചേരി സംസ്ഥാന സമ്മേളനത്തിൽ പതിനായിരക്കണക്കിന് പ്രവർത്തകരെ അഭിസംബോധന ചെയ്യുന്ന പാർട്ടി പ്രസിഡന്റ്.',
        MR: 'पुडुचेरी राज्य संमेलनात हजारो कार्यकर्त्यांना संबोधित करताना टीव्हीके अध्यक्ष.',
      },
    },
    {
      id: 2,
      title: {
        HI: 'तिरुचिरापल्ली क्षेत्रीय कैडर महासम्मेलन एवं रैली मंच',
        EN: 'Trichy Regional Mega Conference & Cadre Rally Stage',
        TA: 'திருச்சிராப்பள்ளி மண்டல தொண்டர்கள் மாநாடு',
        TE: 'తిరుచిరాపల్లి ప్రాంతీయ కేడర్ మహాసదస్సు',
        KN: 'ತಿರುಚಿರಾಪಳ್ಳಿ ಪ್ರಾದೇಶಿಕ ಕಾರ್ಯಕರ್ತರ ಮಹಾಸಮಾವೇಶ',
        ML: 'തിരുച്ചിറപ്പള്ളി മേഖലാ കേഡർ മഹാസമ്മേളനം',
        MR: 'तिरुचिरापल्ली प्रादेशिक कार्यकर्ता महासंमेलन',
      },
      category: 'RALLIES',
      categoryLabel: 'क्षेत्रीय सम्मेलन',
      date: '28 जनवरी 2026',
      location: 'तिरुचिरापल्ली (Trichy)',
      image: '/media/trichy_campaign.jpg',
      desc: {
        HI: 'तिरुचिरापल्ली में उत्तर प्रदेश एवं तमिलनाडु कैडर विस्तार हेतु विशाल मंच से राज्य प्रभारियों का संबोधन।',
        EN: 'Stage view of Trichy regional conference focusing on organizational booth management and cadre alignment.',
        TA: 'திருச்சி மண்டல மாநாட்டில் பூத் கமிட்டி மற்றும் தொண்டர்கள் ஒருங்கிணைப்பு கூட்டம்.',
        TE: 'తిరుచి ప్రాంతీయ సదస్సులో బూత్ కమిటీల నిర్మాణం మరియు కేడర్ మార్గదర్శనం.',
        KN: 'ತಿರುಚಿ ಪ್ರಾದೇಶಿಕ ಸಮಾವೇಶದಲ್ಲಿ ಬೂತ್ ಕಮಿಟಿ ಮತ್ತು ಕಾರ್ಯಕರ್ತರ ಸಬಲೀಕರಣ.',
        ML: 'തിരുച്ചി മേഖലാ സമ്മേളനത്തിൽ ബൂത്ത് കമ്മിറ്റികളുടെ രൂപീകരണവും കേഡർ യോഗവും.',
        MR: 'तिरुचि प्रादेशिक संमेलनात बूथ कमिटी आणि कार्यकर्त्यांचे मार्गदर्शन.',
      },
    },
    {
      id: 3,
      title: {
        HI: 'कोषाध्यक्ष पी. वेंकटरमणन का औपचारिक नामांकन पत्र दाखिल समारोह',
        EN: 'Treasurer P. Venkataramanan Filing Nomination Documents',
        TA: 'பொருளாளர் ப. வேங்கடரமணன் வேட்புமனுத் தாக்கல் நிகழ்வு',
        TE: 'కోశాధికారి పి. వేంకటరమణన్ నామినేషన్ దాఖలు కార్యక్రమం',
        KN: 'ಖಜಾಂಚಿ ಪಿ. ವೆಂಕಟರಮಣನ್ ನಾಮನಿರ್ದೇಶನ ಪತ್ರ ಸಲ್ಲಿಕೆ',
        ML: 'ട്രഷറർ പി. വെങ്കിട്ടരമണൻ നാമനിർദ്ദേശ പത്രിക സമർപ്പിക്കുന്നു',
        MR: 'खजिनदार पी. व्यंकटरमणन यांचा उमेदवारी अर्ज दाखल सोहळा',
      },
      category: 'ELECTIONS',
      categoryLabel: 'नामांकन समारोह',
      date: '05 फरवरी 2026',
      location: 'पेराम्बुर चुनाव कार्यालय (Perambur RO)',
      image: '/media/perambur_nomination.jpg',
      desc: {
        HI: 'टीवीके कोषाध्यक्ष पी. वेंकटरमणन रिटर्निंग अधिकारी के समक्ष चुनाव नामांकन पत्र एवं शपथ पत्र सौंपते हुए।',
        EN: 'TVK Treasurer P. Venkataramanan submitting official election nomination papers to the Returning Officer.',
        TA: 'தேர்தல் நடத்தும் அலுவலரிடம் அதிகாரப்பூர்வ வேட்புமனுத் தாக்கல் ஆவணங்களை சமர்ப்பிக்கும் பொருளாளர்.',
        TE: 'రిటర్నింగ్ అధికారికి అధికారిక ఎన్నికల నామినేషన్ పత్రాలను సమర్పిస్తున్న టీవీకే కోశాధికారి.',
        KN: 'ಚುನಾವಣೆ ಅಧಿಕಾರಿಗೆ ಅಧಿಕೃತ ನಾಮನಿರ್ದೇಶನ ಪತ್ರಗಳನ್ನು ಸಲ್ಲಿಸುತ್ತಿರುವ ಟಿವಿಕೆ ಖಜಾಂಚಿ.',
        ML: 'വരണാധികാരിക്ക് ഔദ്യോഗിക തെരഞ്ഞെടുപ്പ് നാമനിർദ്ദേശ പത്രിക സമർപ്പിക്കുന്ന ട്രഷറർ.',
        MR: 'निवडणूक अधिकाऱ्यांकडे अधिकृत उमेदवारी अर्ज सुपूर्द करताना टीव्हीके खजिनदार.',
      },
    },
    {
      id: 4,
      title: {
        HI: 'टीवीके आधिकारिक पार्टी ध्वज एवं लाल-पीला हाथी प्रतीक चिह्न',
        EN: 'Official TVK Party Flag & Red-Yellow Elephant Emblem',
        TA: 'தமிழக வெற்றிக் கழக அதிகாரப்பூர்வ கொடி மற்றும் யானைச் சின்னம்',
        TE: 'టీవీకే అధికారిక పార్టీ జెండా మరియు ఏనుగు చిహ్నం',
        KN: 'ಟಿವಿಕೆ ಅಧಿಕೃತ ಪಕ್ಷದ ಧ್ವಜ ಮತ್ತು ಆನೆ ಲಾಂಛನ',
        ML: 'ടിവികെ ഔദ്യോഗിക പാർട്ടി പതാകയും ആന ചിഹ്നവും',
        MR: 'टीव्हीके अधिकृत पक्ष ध्वज आणि हत्ती चिन्ह',
      },
      category: 'CONVENTIONS',
      categoryLabel: 'पार्टी प्रतीक',
      date: '22 अगस्त 2024',
      location: 'केंद्रीय कार्यालय (Chennai HQ)',
      image: '/media/tvk_official_logo.jpg',
      desc: {
        HI: 'लाल एवं पीले रंगों के साथ दो हाथियों एवं वागई पुष्प से सुसज्जित टीवीके का आधिकारिक पंजीकृत ध्वज।',
        EN: 'The official registered flag of TVK featuring red and yellow bands with twin elephants and Vaagai flower.',
        TA: 'சிவப்பு மற்றும் மஞ்சள் வண்ணங்களுடன் இரண்டு யானைகள் மற்றும் வாகை மலர் பொறிக்கப்பட்ட அதிகாரப்பூர்வ கொடி.',
        TE: 'ఎరుపు మరియు పసుపు రంగులతో రెండు ఏనుగులు మరియు వాగై పువ్వుతో కూడిన అధికారిక జెండా.',
        KN: 'ಕೆಂಪು ಮತ್ತು ಹಳದಿ ಬಣ್ಣಗಳೊಂದಿಗೆ ಎರಡು ಆನೆಗಳು ಮತ್ತು ವಾಗೈ ಹೂವಿನ ಲಾಂಛನ ಹೊಂದಿರುವ ಅಧಿಕೃತ ಧ್ವಜ.',
        ML: 'ചുവപ്പും മഞ്ഞയും നിറങ്ങളിൽ രണ്ട് ആനകളും വാഗൈ പുഷ്പവും അടങ്ങിയ ഔദ്യോഗിക പതാക.',
        MR: 'लाल आणि पिवळ्या रंगांसह दोन हत्ती आणि वागई फुलाचे चिन्ह असलेला अधिकृत ध्वज.',
      },
    },
    {
      id: 5,
      title: {
        HI: 'वैचारिक मार्गदर्शक महापुरुषों का अनूठा डिजिटल कैनवास',
        EN: 'Ideological Mentors Canvas (Periyar, Kamarajar, Ambedkar)',
        TA: 'கொள்கை வழிகாட்டிகள் கலைச் சித்திரம் (பெரியார், காமராஜர், அம்பேத்கர்)',
        TE: 'సిద్ధాంత మార్గదర్శకుల డిజిటల్ క్యాన్వాస్',
        KN: 'ವೈಚಾರಿಕ ಮಾರ್ಗದರ್ಶಕರ ಡಿಜಿಟಲ್ ಕ್ಯಾನ್ವಾಸ್',
        ML: 'ആശയ മാർഗ്ഗദർശികളുടെ ഡിജിറ്റൽ ക്യാൻവാസ്',
        MR: 'वैचारिक मार्गदर्शक महापुरुषांचे डिजिटल कॅनव्हास',
      },
      category: 'CONVENTIONS',
      categoryLabel: 'वैचारिक कैनवास',
      date: '02 अक्टूबर 2024',
      location: 'राज्य मुख्यालय',
      image: '/media/ideology.jpg',
      desc: {
        HI: 'तंतै पेरियार, कामराज, डॉ. बी.आर. अंबेडकर, वेलु नाचियार एवं अंजलाई अम्मल के विचारों पर आधारित टीवीके का वैचारिक कैनवास।',
        EN: 'Official TVK ideology artwork depicting mentors Thanthai Periyar, Kamarajar, Dr. B.R. Ambedkar, Velu Nachiyar & Anjalai Ammal.',
        TA: 'தந்தை பெரியார், காமராஜர், அம்பேத்கர், வேலு நாச்சியார், அஞ்சலை அம்மாள் ஆகியோரின் கொள்கைகளை சித்தரிக்கும் ஓவியம்.',
        TE: 'తంతై పెరియార్, కామరాజ్, అంబేద్కర్, వేలు నాచియార్ మరియు అంజలై అమ్మాల్ సిద్ధాంతాల డిజిటల్ చిత్రం.',
        KN: 'ತಂದೈ ಪೆರಿಯಾರ್, ಕಾಮರಾಜ್, ಅಂಬೇಡ್ಕರ್, ವೇಲು ನಾಚಿಯಾರ್ ಮತ್ತು ಅಂಜಲೈ ಅಮ್ಮಾಳ್ ಅವರ ವೈಚಾರಿಕ ಚಿತ್ರ.',
        ML: 'തന്തൈ പെരിയാർ, കാമരാജ്, അംബേദ്കർ, വേലു നാച്ചിയാർ, അഞ്ചലൈ അമ്മാൾ എന്നിവരുടെ ആശയ ചിത്രം.',
        MR: 'पेरियार, कामराज, आंबेडकर, वेलू नाचियार आणि अंजलाई अम्मल यांच्या विचारांचे डिजिटल कॅनव्हास.',
      },
    },
    {
      id: 6,
      title: {
        HI: 'टीवीके संस्थापक एवं अध्यक्ष सी. जोसेफ विजय का विशाल जनसभा संबोधन',
        EN: 'TVK Founder & President C. Joseph Vijay Keynote Address',
        TA: 'தமிழக வெற்றிக் கழகத் தலைவர் சி. ஜோசப் விஜய் சிறப்புரை',
        TE: 'టీవీకే వ్యవస్థాపక అధ్యక్షుడు సి. జోసెఫ్ విజయ్ ప్రసంగం',
        KN: 'ಟಿವಿಕೆ ಸಂಸ್ಥಾಪಕ ಅಧ್ಯಕ್ಷ ಸಿ. ಜೋಸೆಫ್ ವಿಜಯ್ ಅವರ ಭಾಷಣ',
        ML: 'ടിവികെ സ്ഥാപക പ്രസിഡന്റ് സി. ജോസഫ് വിജയിയുടെ പ്രസംഗം',
        MR: 'टीव्हीके संस्थापक अध्यक्ष सी. जोसेफ विजय यांचे भाषण',
      },
      category: 'RALLIES',
      categoryLabel: 'अध्यक्षीय संबोधन',
      date: '27 अक्टूबर 2024',
      location: 'विक्रवांडी (Vikravandi Rally)',
      image: '/media/leadership.jpg',
      desc: {
        HI: 'विक्रवांडी के ऐतिहासिक प्रथम राज्य सम्मेलन में टीवीके अध्यक्ष द्वारा धर्मनिरपेक्ष सामाजिक न्याय का घोषणापत्र प्रस्तुत।',
        EN: 'TVK President C. Joseph Vijay delivering the landmark speech at the 1st State Conference in Vikravandi.',
        TA: 'விக்ரவாண்டி முதல் மாநில மாநாட்டில் கட்சியின் கொள்கை பிரகடனத்தை உரக்கச் சொல்லும் கழகத் தலைவர்.',
        TE: 'విక్రవాండి మొదటి రాష్ట్ర సదస్సులో పార్టీ సిద్ధాంత ప్రకటనను వెల్లడిస్తున్న టీవీకే అధ్యక్షుడు.',
        KN: 'ವಿಕ್ರವಾಂಡಿ ಪ್ರಥಮ ರಾಜ್ಯ ಸಮಾವೇಶದಲ್ಲಿ ಪಕ್ಷದ ಸಿದ್ಧಾಂತ ಘೋಷಣೆಯನ್ನು ಪ್ರಕಟಿಸುತ್ತಿರುವ ಅಧ್ಯಕ್ಷರು.',
        ML: 'വിക്രവാണ്ടി ഒന്നാം സംസ്ഥാന സമ്മേളനത്തിൽ പാർട്ടി നയപ്രഖ്യാപനം നടത്തുന്ന പ്രസിഡന്റ്.',
        MR: 'विक्रवांडी पहिल्या राज्य संमेलनात पक्षाचे धोरण जाहीर करताना अध्यक्ष.',
      },
    },
    {
      id: 7,
      title: {
        HI: 'महासचिव एन. आनंद (बुस्सी एन. आनंद) - संगठनात्मक समीक्षा एवं कैडर संवाद',
        EN: 'General Secretary N. Anand (Bussy Anand) Organizational Review',
        TA: 'பொதுச்செயலாளர் என். ஆனந்த் (புஸ்ஸி ஆனந்த்) தொண்டர்கள் சந்திப்பு',
        TE: 'ప్రధాన కార్యదర్శి ఎన్. ఆనంద్ (బుస్సీ ఆనంద్) కేడర్ సమీక్ష',
        KN: 'ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ ಎನ್. ಆನಂದ್ (ಬುಸ್ಸಿ ಆನಂದ್) ಸಂಘಟನಾ ಸಭೆ',
        ML: 'ജനറൽ സെക്രട്ടറി എൻ. ആനന്ദ് (ബുസ്സി ആനന്ദ്) ഓർഗനൈസേഷണൽ യോഗം',
        MR: 'महासचिव एन. आनंद (बुस्सी आनंद) संघटनात्मक बैठक',
      },
      category: 'PUBLIC_SERVICE',
      categoryLabel: 'महासचिव समीक्षा',
      date: '15 जनवरी 2026',
      location: 'उत्तर प्रदेश राज्य कार्यालय',
      image: '/media/leader_anand.jpg',
      desc: {
        HI: 'महासचिव एन. आनंद द्वारा 75 जनपदों एवं 403 विधानसभा क्षेत्रों में टीवीके कैडर विस्तार एवं बूथ प्रबंधन की समीक्षा।',
        EN: 'General Secretary N. Anand coordinating administrative units, booth level structures and membership drives.',
        TA: 'மாநிலம் முழுவதிலும் உள்ள மாவட்ட பொறுப்பாளர்கள் மற்றும் பூத் கமிட்டிகளை ஒருங்கிணைக்கும் பொதுச்செயலாளர்.',
        TE: 'రాష్ట్రవ్యాప్తంగా జిల్లా ఇన్ఛార్జీలు మరియు బూత్ కమిటీలను సమీక్షిస్తున్న ప్రధాన కార్యదర్శి.',
        KN: 'ರಾಜ್ಯದಾದ್ಯಂತ ಜಿಲ್ಲಾ ಉಸ್ತುವಾರಿಗಳು ಮತ್ತು ಬೂತ್ ಕಮಿಟಿಗಳನ್ನು ಸಂಘಟಿಸುತ್ತಿರುವ ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ.',
        ML: 'സംസ്ഥാനത്തുടനീളമുള്ള ജില്ലാ ഇൻചാർജുമാരുടെയും ബൂത്ത് കമ്മിറ്റികളുടെയും പ്രവർത്തന അവലോകനം.',
        MR: 'राज्यभरातील जिल्हा प्रभारी आणि बूथ कमिट्यांचे मार्गदर्शन करताना महासचिव.',
      },
    },
    {
      id: 8,
      title: {
        HI: 'कोषाध्यक्ष पी. वेंकटरमणन - प्रशासनिक एवं वित्तीय पारदर्शिता सत्र',
        EN: 'Treasurer P. Venkataramanan Administrative & Financial Session',
        TA: 'பொருளாளர் ப. வேங்கடரமணன் நிதி மேலாண்மை கூட்டம்',
        TE: 'కోశాధికారి పి. వేంకటరమణన్ ఆర్థిక పారదర్శకత సమీక్ష',
        KN: 'ಖಜಾಂಚಿ ಪಿ. ವೆಂಕಟರಮಣನ್ ಹಣಕಾಸು ಪಾರದರ್ಶಕತೆ ಸಭೆ',
        ML: 'ട്രഷറർ പി. വെങ്കിട്ടരമണൻ സാമ്പത്തിക സുതാര്യത യോഗം',
        MR: 'खजिनदार पी. व्यंकटरमणन प्रशासकीय आणि आर्थिक पारदर्शकता बैठक',
      },
      category: 'PUBLIC_SERVICE',
      categoryLabel: 'कोषाध्यक्ष सत्र',
      date: '20 जनवरी 2026',
      location: 'केंद्रीय वित्तीय अनुभाग',
      image: '/media/leader_venkataramanan.jpg',
      desc: {
        HI: 'कोषाध्यक्ष पी. वेंकटरमणन द्वारा पार्टी के 100% पारदर्शी डिजिटल चंदा एवं चुनाव आयोग अनुपालन की समीक्षा।',
        EN: 'TVK Treasurer P. Venkataramanan ensuring 100% digital transparent accounting, audits and regulatory compliance.',
        TA: 'கட்சியின் 100% டிஜிட்டல் நிதி வெளிப்படைத்தன்மை மற்றும் தணிக்கை நடைமுறைகளை கண்காணிக்கும் பொருளாளர்.',
        TE: 'పార్టీకి సంబంధించిన 100% డిజిటల్ ఆర్థిక పారదర్శకత మరియు అడిటింగ్ ప్రక్రియను పర్యవేక్షిస్తున్న కోశాధికారి.',
        KN: 'ಪಕ್ಷದ 100% ಡಿಜಿಟಲ್ ಹಣಕಾಸು ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿರುವ ಖಜಾಂಚಿ.',
        ML: 'പാർട്ടിയുടെ 100% ഡിജിറ്റൽ സാമ്പത്തിക സുതാര്യതയും ഓഡിറ്റിംഗും പരിശോധിക്കുന്ന ട്രഷറർ.',
        MR: 'पक्षाच्या 100% डिजिटल आर्थिक पारदर्शकता आणि हिशोब तपासणीची पाहणी करताना खजिनदार.',
      },
    },
    {
      id: 9,
      title: {
        HI: 'चुनाव अभियान प्रमुख आधव अर्जुन - 403 विधानसभा क्षेत्र रणनीति सत्र',
        EN: 'Campaign Management Head Aadhav Arjuna 403 Constituency Strategy',
        TA: 'தேர்தல் பிரச்சார ஒருங்கிணைப்பாளர் ஆதவ் అర్జుனா தேர்தல் உத்தி கூட்டம்',
        TE: 'ఎన్నికల ప్రచార ఇన్ఛార్జ్ అధవ్ అర్జునా వ్యూహాత్మక సమావేశం',
        KN: 'ಚುನಾವಣೆ ಪ್ರಚಾರ ಮುಖ್ಯಸ್ಥ ಆಧವ್ ಅರ್ಜುನಾ ತಂತ್ರಜ್ಞಾನ ಸಭೆ',
        ML: 'തെരഞ്ഞെടുപ്പ് പ്രചാരണ മേധാവി ആധവ് അർജുന തന്ത്രപരമായ യോഗം',
        MR: 'निवडणूक प्रचार प्रमुख आधव अर्जुन ४०३ विधानसभा रणनीती बैठक',
      },
      category: 'ELECTIONS',
      categoryLabel: 'चुनाव रणनीति',
      date: '01 फरवरी 2026',
      location: 'चुनाव वॉर रूम (Election War Room)',
      image: '/media/leader_aadhav.jpg',
      desc: {
        HI: 'चुनाव अभियान प्रबंधन प्रमुख आधव अर्जुन द्वारा 403 विधानसभा क्षेत्रों में डिजिटल कैंपेनिंग एवं सोशल मीडिया प्रबंधन।',
        EN: 'Campaign Head Aadhav Arjuna leading strategic election planning, booth analytics and digital media campaigns.',
        TA: '403 தொகுதிகளுக்கான தேர்தல் பிரச்சார உத்திகள் ಮತ್ತು டிஜிட்டல் மீடியா குழுவை வழிநடத்தும் தேர்தல் பொறுப்பாளர்.',
        TE: '403 నియోజకవర్గాలకు సంబంధించి ఎన్నికల వ్యూహాలు మరియు డిజిటల్ ప్రచారాన్ని పర్యవేక్షిస్తున్న ప్రచార ఇన్ఛార్జ్.',
        KN: '403 ಕ್ಷೇತ್ರಗಳ ಚುನಾವಣೆ ತಂತ್ರಗಳು ಮತ್ತು ಡಿಜಿಟಲ್ ಪ್ರಚಾರವನ್ನು ಮುನ್ನಡೆಸುತ್ತಿರುವ ಪ್ರಚಾರ ಮುಖ್ಯಸ್ಥರು.',
        ML: '403 മണ്ഡലങ്ങളിലെ തെരഞ്ഞെടുപ്പ് തന്ത്രങ്ങളും ഡിജിറ്റൽ പ്രചാരണവും നയിക്കുന്ന പ്രചാരണ മേധാവി.',
        MR: '४०३ विधानसभा मतदारसंघांसाठी निवडणूक रणनीती आणि डिजिटल प्रचाराचे मार्गदर्शन करताना प्रचार प्रमुख.',
      },
    },
  ];

  const filteredItems = activeCategory === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#040105] text-white font-sans relative overflow-x-hidden select-none">
      {/* UNIFIED GLOBAL HEADER WITH 7-LANGUAGE SELECTOR */}
      <Header />

      {/* 1. LAYERED DEPTH BACKGROUND: CINEMATIC RADIAL VIGNETTE & RED-GOLD ATMOSPHERIC GLOW */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#59000a]/35 via-[#080207] to-[#020003] pointer-events-none z-0" />

      {/* 2. ATMOSPHERIC RED-GOLD LASER LIGHT BEAMS */}
      <div className="fixed top-0 left-0 w-[500px] h-[900px] bg-gradient-to-br from-[#E11D48]/30 via-[#800000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed top-0 right-0 w-[600px] h-[900px] bg-gradient-to-bl from-[#E11D48]/30 via-[#A00000]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-t from-red-950/20 via-amber-500/5 to-transparent blur-[200px] pointer-events-none z-0" />

      {/* 3. SUBTLE PARTY-THEMED WATERMARK EMBLEM LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] flex items-center justify-center">
        <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg" alt="TVK Watermark" className="w-[800px] h-auto object-contain filter grayscale invert" />
      </div>

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* HERO BANNER - CINEMATIC DARK GLASS */}
        <div className="relative bg-gradient-to-r from-[#0c0307]/95 via-[#140409]/90 to-[#0c0307]/95 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.25)] overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-950/70 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
            <ImageIcon className="w-4 h-4 text-amber-400" /> {gt.heroBadge}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
            {gt.heroTitle}
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed font-medium">
            {gt.heroDesc}
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap gap-3 items-center justify-center border-b border-red-500/30 pb-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 text-white border-2 border-amber-300 scale-105 shadow-amber-400/20 uppercase tracking-wider'
                    : 'bg-red-950/60 text-slate-200 hover:text-[#FFC72C] border border-red-500/40 hover:border-[#FFC72C]'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* GALLERY ITEMS GRID (DARK GLASS CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const titleText = item.title[lang] || item.title['HI'];
            const descText = item.desc[lang] || item.desc['HI'];
            return (
              <div
                key={item.id}
                className="relative bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 backdrop-blur-xl border border-red-500/35 hover:border-amber-400/80 rounded-3xl overflow-hidden transition-all shadow-[0_10px_30px_rgba(153,0,17,0.2)] hover:shadow-[0_15px_40px_rgba(255,199,44,0.2)] flex flex-col justify-between hover:scale-[1.02] group"
              >
                <div className="space-y-4">
                  {/* Image Container with Zoom & Hover Overlay */}
                  <div
                    className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img loading="lazy" decoding="async" src={item.image}
                      alt={titleText}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="bg-[#FFC72C] text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
                        <ZoomIn className="w-4 h-4" />
                        <span>{gt.viewHd}</span>
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 bg-[#A00000] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md border border-amber-300">
                      {item.categoryLabel}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-4 text-[11px] text-[#FFC72C] font-bold">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-white group-hover:text-[#FFC72C] transition-colors leading-snug">
                      {titleText}
                    </h3>

                    <p className="text-slate-200 text-xs leading-relaxed font-medium">
                      {descText}
                    </p>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-amber-300 border border-red-500/40 text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>{gt.viewHd}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* LIGHTBOX MODAL VIEWER */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Close Lightbox"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800 text-white hover:bg-red-600 transition-colors shadow-lg border border-slate-700 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-4">
                <div className="w-full max-h-[60vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <img loading="lazy" decoding="async" src={selectedImage.image} alt={selectedImage.title[lang] || selectedImage.title['HI']} className="w-full h-full object-contain" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#A00000] text-white text-xs font-black px-3 py-1 rounded-full border border-amber-300 uppercase">
                      {selectedImage.categoryLabel}
                    </span>
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedImage.date}</span>
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedImage.location}</span>
                  </div>

                  <h2 className="text-2xl font-black text-white font-display">
                    {selectedImage.title[lang] || selectedImage.title['HI']}
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedImage.desc[lang] || selectedImage.desc['HI']}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 border-t border-slate-800">
                  <a
                    href={selectedImage.image}
                    download={`TVK_Official_Gallery_${selectedImage.id}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{gt.downloadHd}</span>
                  </a>

                  <Link
                    href="/sadasyata"
                    className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-all inline-flex items-center gap-2 border border-amber-300"
                  >
                    <span>{t('joinTVK')}</span> <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
