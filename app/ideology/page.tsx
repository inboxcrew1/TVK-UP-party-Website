'use client';

import Link from 'next/link';
import { Shield, BookOpen, Target, CheckCircle2, Award, HeartHandshake, Crown, Sparkles, Scale, Globe, Compass, Leaf, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function IdeologyPage() {
  const { lang, t } = useLanguage();

  // 1. GUIDANCE LEADERS LOCALIZED FOR 7 LANGUAGES
  const guidanceLeaders = [
    {
      name: 'Thanthai Periyar',
      hindiName: lang === 'HI' ? 'तंतै पेरियार' : lang === 'TA' ? 'தந்தை பெரியார்' : lang === 'TE' ? 'తந்தை పెరియార్' : lang === 'KN' ? 'ತந்தை ಪೆರಿಯಾರ್' : lang === 'ML' ? 'തന്തൈ പെരിയാർ' : lang === 'MR' ? 'तंतै पेरियार' : 'Thanthai Periyar',
      role: lang === 'HI' ? 'सामाजिक न्याय एवं तर्कवाद के जनक' : lang === 'TA' ? 'பகுத்தறிவு மற்றும் சமூக நீதியின் தந்தை' : 'Father of Rationalism & Social Justice',
      bio: lang === 'HI'
        ? 'तर्कवादी विचार, जातिगत भेदभाव का उन्मूलन, आत्मसम्मान आंदोलन और पूर्ण लैंगिक समानता के प्रणेता।'
        : lang === 'TA'
        ? 'பகுத்தறிவுச் சிந்தனை, சாதி ஒழிப்பு, சுயமரியாதை இயக்கம் மற்றும் முழுமையான பாலின சமத்துவத்திற்கு வித்திட்டவர்.'
        : 'Pioneered rationalist thought, eradication of caste discrimination, self-respect movement, and complete gender equality.',
      image: '/media/leader_periyar.png',
    },
    {
      name: 'Perunthalaivar K. Kamarajar',
      hindiName: lang === 'HI' ? 'के. कामराज' : lang === 'TA' ? 'பெருந்தலைவர் கே. காமராஜர்' : lang === 'TE' ? 'కె. కామరాజ్' : lang === 'KN' ? 'ಕೆ. ಕಾಮರಾಜ್' : lang === 'ML' ? 'കെ. കാമരാജ്' : lang === 'MR' ? 'के. कामराज' : 'K. Kamarajar',
      role: lang === 'HI' ? 'मुफ्त शिक्षा योजना एवं ईमानदारी के शिल्पी' : lang === 'TA' ? 'இலவசக் கல்வி மற்றும் நேர்மையின் சிற்பி' : 'Architect of Free Education & Integrity',
      bio: lang === 'HI'
        ? 'मुफ्त दोपहर के भोजन, स्कूलों के विस्तार, औद्योगिक विकास और सार्वजनिक जीवन में अद्वितीय सत्यनिष्ठा के प्रतीक।'
        : lang === 'TA'
        ? 'மதிய உணவுத் திட்டம், பள்ளி விரிவாக்கம், தொழில் வளர்ச்சி மற்றும் ஒப்பற்ற நேர்மையால் மக்கள் மனங்களை வென்றவர்.'
        : 'Revolutionized public education with free midday meal schemes, school expansion, industrial growth, and unmatched integrity.',
      image: '/media/leader_kamarajar.png',
    },
    {
      name: 'Dr. B.R. Ambedkar',
      hindiName: lang === 'HI' ? 'डॉ. बी.आर. अंबेडकर' : lang === 'TA' ? 'டாக்டர் பி.ஆர். அம்பேத்கர்' : lang === 'TE' ? 'డాక్టర్ బి.ఆర్. அంబేడ్కర్' : lang === 'KN' ? 'ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್' : lang === 'ML' ? 'ഡോ. ബി.ആർ. അംബേദ്കർ' : lang === 'MR' ? 'डॉ. बी.आर. आंबेडकर' : 'Dr. B.R. Ambedkar',
      role: lang === 'HI' ? 'संविधान निर्माता एवं समता के प्रतीक' : lang === 'TA' ? 'அரசியலமைப்புச் சிற்பி மற்றும் சமத்துவ நாயகர்' : 'Architect of the Constitution & Equal Rights',
      bio: lang === 'HI'
        ? 'संवैधानिक लोकतंत्र, मानवाधिकारों, सामाजिक लोकतंत्र और वंचित वर्गों के अधिकारों के अमर संरक्षक।'
        : lang === 'TA'
        ? 'அரசியலமைப்பு ஜனநாயகம், மனித உரிமைகள் மற்றும் பிற்படுத்தப்பட்ட மக்களுக்கான பாதுகாப்பு அரண்.'
        : 'Champion of constitutional democracy, human rights, social democracy, and constitutional safeguards for all marginalized communities.',
      image: '/media/leader_ambedkar.png',
    },
    {
      name: 'Veeramangai Velu Nachiyar',
      hindiName: lang === 'HI' ? 'वीरमंगई वेलु नाचियार' : lang === 'TA' ? 'வீரமங்கை வேலு நாச்சியார்' : lang === 'TE' ? 'వీరమంగై వేలు నాచియార్' : lang === 'KN' ? 'ವೀರಮಂಗೈ ವೇಲು ನಾಚಿಯಾರ್' : lang === 'ML' ? 'വീരമംഗൈ വേലു നാച്ചിയാർ' : lang === 'MR' ? 'वीरमंगई वेलु नाचियार' : 'Velu Nachiyar',
      role: lang === 'HI' ? 'शौर्य एवं स्वतंत्रता संग्राम की प्रतीक' : lang === 'TA' ? 'வீரத்தின் அடையாளம் மற்றும் முதன்மை விடுதலைப் போராளி' : 'Icon of Valour & Anti-Colonial Resistance',
      bio: lang === 'HI'
        ? 'औपनिवेशिक शासन के खिलाफ सशस्त्र युद्ध लड़ने वाली प्रथम महारानी, जो अदम्य साहस और महिला नेतृत्व की मिसाल हैं।'
        : lang === 'TA'
        ? 'ஆங்கிலேய ஆட்சிக்கு எதிராக ஆயுதம் ஏந்திப் போரிட்ட முதல் அரசி, பெண்கள் வீரத்தின் மகுடம்.'
        : 'First queen to wage armed war against colonial rule, symbolizing courage, women leadership, and unyielding self-respect.',
      image: '/media/leader_velunachiyar.png',
    },
    {
      name: 'Anjalai Ammal',
      hindiName: lang === 'HI' ? 'अंजलाई अम्मल' : lang === 'TA' ? 'அஞ்சலை அம்மாள்' : lang === 'TE' ? 'అంజలై అమ్మాల్' : lang === 'KN' ? 'ಅಂಜಲೈ ಅಮ್ಮಾಲ್' : lang === 'ML' ? 'അഞ്ചലൈ അമ്മാൾ' : lang === 'MR' ? 'अंजलाई अम्मल' : 'Anjalai Ammal',
      role: lang === 'HI' ? 'स्वतंत्रता सेनानी एवं समाज सुधारक' : lang === 'TA' ? 'விடுதலைப் போராளி மற்றும் சமூக சீர்திருத்தவாதி' : 'Freedom Fighter & Grassroots Reformer',
      bio: lang === 'HI'
        ? 'निस्वार्थ जनसेवा, महिला सशक्तिकरण और सामाजिक न्याय के लिए समर्पित महान स्वतंत्रता सेनानी।'
        : lang === 'TA'
        ? 'தன்னலமற்ற மக்கள் சேவை, பெண் விடுதலை மற்றும் சமூக நீதிக்காகப் பாடுபட்ட தியாகச் சுடர்.'
        : 'Legendary social worker and freedom activist dedicated to selfless community service, women empowerment, and social justice.',
      image: '/media/leader_anjalai.png',
    },
  ];

  // 2. 10 CORE IDEOLOGICAL PILLARS MATCHED WITH OFFICIAL TVK ILLUSTRATIONS
  const getIdeologyPillars = () => {
    switch (lang) {
      case 'HI':
        return [
          {
            title: 'समतामूलक सामाजिक न्याय',
            sub: 'Equitable Social Justice',
            desc: 'जाति, धर्म या पृष्ठभूमि के बिना गुणवत्तापूर्ण शिक्षा, स्वास्थ्य सेवा, आर्थिक विकास और सम्मान का समान अवसर।',
            icon: Scale,
            color: 'from-red-600 to-amber-600',
            image: '/media/official_pillar_justice.png',
            fallback: 'https://tvkassets.minsky.studio/media/Equitable%20Social%20Justice.png',
          },
          {
            title: 'धर्मनिरपेक्ष सामाजिक सौहार्द',
            sub: 'Secular Social Harmony',
            desc: 'उत्तर प्रदेश और भारत में सभी धार्मिक एवं सांस्कृतिक समुदायों के बीच धर्मनिरपेक्षता और भाईचारे को बढ़ावा देना।',
            icon: Globe,
            color: 'from-amber-500 to-yellow-600',
            image: '/media/official_pillar_secularism.png',
            fallback: 'https://tvkassets.minsky.studio/media/Secularism.png',
          },
          {
            title: 'राज्य स्वायत्तता अधिकार',
            sub: 'Right to State Autonomy',
            desc: 'संवैधानिक ढांचे के भीतर मजबूत संघवाद, वित्तीय शक्तियों का हस्तांतरण और क्षेत्रीय सशक्तिकरण।',
            icon: Crown,
            color: 'from-[#A00000] to-red-900',
            image: '/media/official_pillar_autonomy.png',
            fallback: 'https://tvkassets.minsky.studio/media/Right%20to%20State%20Autonomy.png',
          },
          {
            title: 'भ्रष्टाचार उन्मूलन एवं पारदर्शिता',
            sub: 'Zero Corruption & Governance',
            desc: 'डिजिटल ई-गवर्नेंस, प्रत्यक्ष लाभ हस्तांतरण और हर नागरिक के लिए उत्तरदायी एवं पारदर्शी प्रशासन।',
            icon: Target,
            color: 'from-emerald-600 to-teal-700',
            image: '/media/official_pillar_democracy.png',
            fallback: 'https://tvkassets.minsky.studio/media/DEmocracy.png',
          },
          {
            title: 'द्विभाषा नीति एवं जनभाषा सम्मान',
            sub: 'Two-Language Policy',
            desc: 'मातृभाषा और राजकीय भाषा के संरक्षण के साथ आधुनिक वैश्विक अंग्रेजी शिक्षा का अधिकार।',
            icon: BookOpen,
            color: 'from-indigo-600 to-purple-700',
            image: '/media/official_pillar_language.png',
            fallback: 'https://tvkassets.minsky.studio/media/2%20Language.png',
          },
          {
            title: 'वैज्ञानिक एवं प्रगतिशील सोच',
            sub: 'Rationalist Mindset',
            desc: 'वैज्ञानिक दृष्टिकोण, आलोचनात्मक सोच, अंधविश्वास का उन्मूलन और साक्ष्य-आधारित शासन।',
            icon: Compass,
            color: 'from-blue-600 to-cyan-700',
            image: '/media/official_pillar_rationalist.png',
            fallback: 'https://tvkassets.minsky.studio/media/Rationalist%20Mindset.png',
          },
          {
            title: 'छुआछूत एवं भेदभाव का अंत',
            sub: 'Prohibition of Untouchability',
            desc: 'हर गाँव और शहर में जातिगत भेदभाव, छुआछूत और सामाजिक बहिष्कार के खिलाफ कड़ा कानून।',
            icon: ShieldAlert,
            color: 'from-red-700 to-rose-800',
            image: '/media/official_pillar_untouchability.png',
            fallback: 'https://tvkassets.minsky.studio/media/Untouchability.png',
          },
          {
            title: 'राजनीतिक हस्तक्षेप से मुक्त प्रशासन',
            sub: 'Unbiased Administration',
            desc: 'प्रशासनिक सेवाओं, पुलिस प्रणाली और कल्याणकारी योजनाओं का राजनीतिक दबाव से मुक्त संचालन।',
            icon: Award,
            color: 'from-amber-600 to-orange-700',
            image: '/media/official_pillar_admin.png',
            fallback: 'https://tvkassets.minsky.studio/media/Administration%20Upholding%20Fundamental%20Rights%20without%20Political%20Interference.png',
          },
          {
            title: 'पर्यावरण संरक्षण एवं सतत विकास',
            sub: 'Environmental Sustainability',
            desc: 'जल स्रोतों का संरक्षण, हरित कृषि, जलवायु सुरक्षा और जनपदों का टिकाऊ इंफ्रास्ट्रक्चर।',
            icon: Leaf,
            color: 'from-emerald-700 to-green-800',
            image: '/media/official_pillar_environment.png',
            fallback: 'https://tvkassets.minsky.studio/media/Environmental%20Protection.png',
          },
          {
            title: 'नशा-मुक्त समाज एवं युवा सुरक्षा',
            sub: 'Drug-Free Youth Empowerment',
            desc: 'मादक पदार्थों पर पूर्ण प्रतिबंध, खेल अकादमियाँ, कौशल केंद्र और युवाओं के लिए रोजगार का अधिकार।',
            icon: HeartHandshake,
            color: 'from-violet-700 to-purple-800',
            image: '/media/official_pillar_drugfree.png',
            fallback: 'https://tvkassets.minsky.studio/media/Drug%20Free%20TN.png',
          },
        ];
      case 'TA':
        return [
          {
            title: 'சமத்துவ சமூக நீதி',
            sub: 'Equitable Social Justice',
            desc: 'சாதி, மதம், பின்னணி வேறுபாடின்றி தரமான கல்வி, மருத்துவம், பொருளாதாரம் மற்றும் தன்னாட்சி மரியாதை.',
            icon: Scale,
            color: 'from-red-600 to-amber-600',
            image: '/media/official_pillar_justice.png',
            fallback: 'https://tvkassets.minsky.studio/media/Equitable%20Social%20Justice.png',
          },
          {
            title: 'மதச்சார்பற்ற சமூக நல்லிணக்கம்',
            sub: 'Secular Social Harmony',
            desc: 'அனைத்து சமூகங்களுக்கும் இடையே மதச்சார்பின்மை, நல்லிணக்கம் மற்றும் சகோதரத்துவத்தைப் பேணுதல்.',
            icon: Globe,
            color: 'from-amber-500 to-yellow-600',
            image: '/media/official_pillar_secularism.png',
            fallback: 'https://tvkassets.minsky.studio/media/Secularism.png',
          },
          {
            title: 'மாநில தன்னாட்சி உரிமை',
            sub: 'Right to State Autonomy',
            desc: 'மாநிலங்களின் நிதி தன்னாட்சி, வலுவான கூட்டாட்சி மற்றும் மாநில அதிகார உரிமைகள் பாதுகாப்பு.',
            icon: Crown,
            color: 'from-[#A00000] to-red-900',
            image: '/media/official_pillar_autonomy.png',
            fallback: 'https://tvkassets.minsky.studio/media/Right%20to%20State%20Autonomy.png',
          },
          {
            title: 'ஊழலற்ற வெளிப்படையான நிர்வாகம்',
            sub: 'Zero Corruption & Governance',
            desc: 'டிஜிட்டல் மின்-நிர்வாகம், நேரடி நிதி மாற்றம் மற்றும் மக்களின் நம்பிக்கைக்குரிய வெளிப்படைத்தன்மை.',
            icon: Target,
            color: 'from-emerald-600 to-teal-700',
            image: '/media/official_pillar_democracy.png',
            fallback: 'https://tvkassets.minsky.studio/media/DEmocracy.png',
          },
          {
            title: 'இருமொழிக் கொள்கை & தாய்மொழி மரியாதை',
            sub: 'Two-Language Policy',
            desc: 'தாய்மொழி பாதுகாப்பு மற்றும் நவீன உலகளாவிய ஆங்கிலக் கல்வி உரிமை.',
            icon: BookOpen,
            color: 'from-indigo-600 to-purple-700',
            image: '/media/official_pillar_language.png',
            fallback: 'https://tvkassets.minsky.studio/media/2%20Language.png',
          },
          {
            title: 'பகுத்தறிவு & முற்போக்கு சிந்தனை',
            sub: 'Rationalist Mindset',
            desc: 'அறிவியல் மனப்பான்மை, பகுத்தறிவு, மூடநம்பிக்கை ஒழிப்பு மற்றும் சான்றுகளின் அடிப்படையிலான ஆட்சி.',
            icon: Compass,
            color: 'from-blue-600 to-cyan-700',
            image: '/media/official_pillar_rationalist.png',
            fallback: 'https://tvkassets.minsky.studio/media/Rationalist%20Mindset.png',
          },
          {
            title: 'தீண்டாமை மற்றும் பாகுபாடு ஒழிப்பு',
            sub: 'Prohibition of Untouchability',
            desc: 'சாதிய பாகுபாடு, தீண்டாமை மற்றும் சமூகப் புறக்கணிப்புக்கு எதிரான கடுமையான சட்ட அமலாக்கம்.',
            icon: ShieldAlert,
            color: 'from-red-700 to-rose-800',
            image: '/media/official_pillar_untouchability.png',
            fallback: 'https://tvkassets.minsky.studio/media/Untouchability.png',
          },
          {
            title: 'அரசியல் தலையீடற்ற நேர்மையான நிர்வாகம்',
            sub: 'Unbiased Administration',
            desc: 'காவல்துறை மற்றும் அரசுத் துறைகள் அரசியல் குறுக்கீடின்றி நேர்மையாகச் செயல்படுவதை உறுதிசெய்தல்.',
            icon: Award,
            color: 'from-amber-600 to-orange-700',
            image: '/media/official_pillar_admin.png',
            fallback: 'https://tvkassets.minsky.studio/media/Administration%20Upholding%20Fundamental%20Rights%20without%20Political%20Interference.png',
          },
          {
            title: 'சுற்றுச்சூழல் பாதுகாப்பு & பசுமை வளர்ச்சி',
            sub: 'Environmental Sustainability',
            desc: 'நீர்நிலைகள் பாதுகாப்பு, பசுமை விவசாயம் மற்றும் நிலையான உள்கட்டமைப்பு மேம்பாடு.',
            icon: Leaf,
            color: 'from-emerald-700 to-green-800',
            image: '/media/official_pillar_environment.png',
            fallback: 'https://tvkassets.minsky.studio/media/Environmental%20Protection.png',
          },
          {
            title: 'போதைப்பொருள் அற்ற சமூகம் & இளைஞர் பாதுகாப்பு',
            sub: 'Drug-Free Youth Empowerment',
            desc: 'போதைப்பொருள் ஒழிப்பு, விளையாட்டு அகாடமிகள் மற்றும் இளைஞர்களுக்கான வேலைவாய்ப்பு உறுதி.',
            icon: HeartHandshake,
            color: 'from-violet-700 to-purple-800',
            image: '/media/official_pillar_drugfree.png',
            fallback: 'https://tvkassets.minsky.studio/media/Drug%20Free%20TN.png',
          },
        ];
      default:
        return [
          {
            title: 'Equitable Social Justice',
            sub: 'समतामूलक सामाजिक न्याय',
            desc: 'Ensuring equal access to quality education, healthcare, economic growth, and dignity regardless of caste, religion, or background.',
            icon: Scale,
            color: 'from-red-600 to-amber-600',
            image: '/media/official_pillar_justice.png',
            fallback: 'https://tvkassets.minsky.studio/media/Equitable%20Social%20Justice.png',
          },
          {
            title: 'Secular Social Harmony',
            sub: 'धर्मनिरपेक्ष सामाजिक सौहार्द',
            desc: 'Promoting secularism, communal brotherhood, and unity across all religious and cultural communities in Uttar Pradesh and India.',
            icon: Globe,
            color: 'from-amber-500 to-yellow-600',
            image: '/media/official_pillar_secularism.png',
            fallback: 'https://tvkassets.minsky.studio/media/Secularism.png',
          },
          {
            title: 'Right to State Autonomy',
            sub: 'राज्य स्वायत्तता अधिकार',
            desc: 'Advocating strong federalism, devolution of financial powers to states, and regional empowerment within constitutional framework.',
            icon: Crown,
            color: 'from-[#A00000] to-red-900',
            image: '/media/official_pillar_autonomy.png',
            fallback: 'https://tvkassets.minsky.studio/media/Right%20to%20State%20Autonomy.png',
          },
          {
            title: 'Zero Corruption & Governance',
            sub: 'भ्रष्टाचार उन्मूलन एवं पारदर्शिता',
            desc: 'Implementing digital e-governance, direct benefit transfers, public auditing, and accountable administration for every citizen.',
            icon: Target,
            color: 'from-emerald-600 to-teal-700',
            image: '/media/official_pillar_democracy.png',
            fallback: 'https://tvkassets.minsky.studio/media/DEmocracy.png',
          },
          {
            title: 'Two-Language Policy & Vernacular Respect',
            sub: 'द्विभाषा नीति एवं जनभाषा सम्मान',
            desc: 'Protecting state language heritage, mother tongue instruction, and modern global English education without linguistic imposition.',
            icon: BookOpen,
            color: 'from-indigo-600 to-purple-700',
            image: '/media/official_pillar_language.png',
            fallback: 'https://tvkassets.minsky.studio/media/2%20Language.png',
          },
          {
            title: 'Rationalist & Progressive Mindset',
            sub: 'वैज्ञानिक एवं प्रगतिशील सोच',
            desc: 'Fostering scientific temper, critical thinking, elimination of superstitious practices, and evidence-based governance.',
            icon: Compass,
            color: 'from-blue-600 to-cyan-700',
            image: '/media/official_pillar_rationalist.png',
            fallback: 'https://tvkassets.minsky.studio/media/Rationalist%20Mindset.png',
          },
          {
            title: 'Prohibition of Untouchability & Discrimination',
            sub: 'छुआछूत एवं भेदभाव का अंत',
            desc: 'Strict legal enforcement against caste discrimination, untouchability, and social exclusion in every village and city block.',
            icon: ShieldAlert,
            color: 'from-red-700 to-rose-800',
            image: '/media/official_pillar_untouchability.png',
            fallback: 'https://tvkassets.minsky.studio/media/Untouchability.png',
          },
          {
            title: 'Administration Free from Political Interference',
            sub: 'राजनीतिक हस्तक्षेप से मुक्त प्रशासन',
            desc: 'Ensuring civil services, police administration, and welfare delivery operate independently without political corruption or bias.',
            icon: Award,
            color: 'from-amber-600 to-orange-700',
            image: '/media/official_pillar_admin.png',
            fallback: 'https://tvkassets.minsky.studio/media/Administration%20Upholding%20Fundamental%20Rights%20without%20Political%20Interference.png',
          },
          {
            title: 'Environmental Protection & Sustainability',
            sub: 'पर्यावरण संरक्षण एवं सतत विकास',
            desc: 'Protecting water bodies, promoting green agriculture, climate resilience, and sustainable urban infrastructure across districts.',
            icon: Leaf,
            color: 'from-emerald-700 to-green-800',
            image: '/media/official_pillar_environment.png',
            fallback: 'https://tvkassets.minsky.studio/media/Environmental%20Protection.png',
          },
          {
            title: 'Drug-Free Society & Youth Protection',
            sub: 'नशा-मुक्त समाज एवं युवा सुरक्षा',
            desc: 'Strict eradication of illicit liquor and narcotics, establishing sports academies, skill development centers, and youth employment.',
            icon: HeartHandshake,
            color: 'from-violet-700 to-purple-800',
            image: '/media/official_pillar_drugfree.png',
            fallback: 'https://tvkassets.minsky.studio/media/Drug%20Free%20TN.png',
          },
        ];
    }
  };

  const ideologyPillars = getIdeologyPillars();

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

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-20">
        {/* HERO BANNER WITH 70% VISIBILITY 5 IDEOLOGICAL MENTORS ARTWORK BACKGROUND */}
        <div className="relative bg-[#0c0307]/80 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 70% VISIBILITY 5 IDEOLOGICAL MENTORS ARTWORK BACKGROUND LAYER */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/media/ideology_mentors_hero.jpg"
              alt="TVK 5 Ideological Guidance Mentors Artwork"
              className="w-full h-full object-cover object-top opacity-70 filter contrast-110 brightness-95"
            />
            {/* Ultra-Premium Dark Vignette & Soft Gradient Mask for Crystal-Clear Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0307]/90 via-[#0c0307]/60 to-[#0c0307]/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0c0307]/40 to-[#0c0307]" />
          </div>

          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-5 text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-950/70 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <BookOpen className="w-4 h-4 text-amber-400" /> {t('ideologyTitle')}
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
                {t('ideologyTitle')} &amp; <span className="text-[#FFC72C] drop-shadow-[0_0_20px_rgba(255,199,44,0.5)]">Core Principles</span>
              </h1>
              <p className="text-lg sm:text-xl font-extrabold text-[#FFC72C] font-display tracking-wide">
                &ldquo;Pirappokkum Ella Uyirkkum&rdquo; &bull; जन्म से सभी जीव समान हैं (All Born Equal)
              </p>
            </div>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed bg-[#0c0307]/80 p-5 rounded-2xl border border-red-500/35 backdrop-blur-xl shadow-2xl font-medium max-w-2xl">
              {t('ideologyDesc')}
            </p>

            <div className="pt-2">
              <Link
                href="/sadasyata"
                className="bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-xs px-8 py-4 rounded-2xl shadow-xl transition-all border-2 border-amber-300 hover:scale-105 inline-flex items-center gap-2 uppercase tracking-wider"
              >
                <span>JOIN TVK-UP TODAY</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Featured Mentors Card Frame */}
          <div className="lg:col-span-4 flex justify-center relative z-10">
            <div className="relative rounded-3xl overflow-hidden border-4 border-[#FFC72C] shadow-[0_0_40px_rgba(255,199,44,0.4)] bg-slate-950 group max-w-md">
              <img
                src="/media/ideology_mentors_hero.jpg"
                alt="TVK Ideological Guidance Leaders Banner"
                className="w-full h-auto object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4 text-center space-y-1">
                <span className="text-xs font-black text-[#FFC72C] uppercase tracking-widest block">वैचारिक मार्गदर्शन मार्गदर्शक</span>
                <span className="text-[10px] text-slate-300 font-bold block">Thanthai Periyar &bull; Kamarajar &bull; Ambedkar &bull; Velu Nachiyar &bull; Anjalai Ammal</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: 5 IDEOLOGICAL GUIDANCE LEADERS (ADVANCED ULTRA-PREMIUM GOLD SPOTLIGHT STAGE) */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-950/80 text-amber-400 border border-amber-400/70 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Crown className="w-4 h-4 text-amber-400 drop-shadow-md" /> {lang === 'HI' ? 'वैचारिक मार्गदर्शक नेता' : 'IDEOLOGICAL GUIDANCE LEADERS'}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
              Ideological Mentors &amp; Icons
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#FFC72C] via-red-600 to-transparent rounded-full mx-auto shadow-[0_0_15px_rgba(255,199,44,0.8)]" />
            <p className="text-slate-200 text-xs md:text-sm font-medium leading-relaxed">
              Our principles are inspired by the timeless philosophies of social reform, constitutional equality, and self-respect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {guidanceLeaders.map((leader, i) => (
              <div
                key={i}
                className="relative bg-gradient-to-b from-[#18050e]/95 via-[#0e0208]/95 to-[#1c0512]/95 backdrop-blur-2xl border-2 border-amber-400/60 hover:border-amber-300 rounded-3xl p-5 transition-all duration-500 shadow-[0_15px_40px_rgba(225,29,72,0.25)] hover:shadow-[0_20px_60px_rgba(255,199,44,0.4)] flex flex-col justify-between hover:-translate-y-2 group overflow-hidden"
              >
                {/* Top Gold Laser Light Accent Line */}
                <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#FFC72C] to-transparent shadow-[0_0_12px_#FFC72C]" />

                <div className="space-y-4">
                  {/* Top Row: Numbering Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-[#FFC72C] bg-red-950/90 px-3 py-1 rounded-full border border-amber-400/60 shadow-md flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" /> MENTOR 0{i + 1}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#FFC72C]" />
                  </div>

                  {/* Golden Radiant Spotlight Portrait Stage */}
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-[#3d0812] via-[#21040a] to-[#0d0205] border-2 border-[#FFC72C] shadow-[0_0_30px_rgba(255,199,44,0.35)] p-2 flex items-center justify-center group-hover:border-amber-300 transition-colors">
                    {/* Glowing Gold Sunburst Halo Backdrop */}
                    <div className="absolute w-32 h-32 rounded-full bg-amber-400/25 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:bg-amber-400/40 transition-all duration-500" />
                    
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-110 group-hover:brightness-105 transition-all duration-700 relative z-10"
                    />

                    {/* Bottom Gradient Fade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0205] via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
                  </div>

                  {/* Leader Titles & Role Badge */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-lg text-white group-hover:text-[#FFC72C] transition-colors leading-tight font-display">
                      {leader.name}
                    </h3>
                    <span className="text-xs font-bold text-amber-300 block tracking-wide">
                      {leader.hindiName}
                    </span>
                    <div>
                      <span className="inline-block text-[10px] font-black text-red-300 uppercase tracking-wider bg-red-950/90 border border-red-500/50 px-2.5 py-1 rounded-md shadow-md mt-1">
                        {leader.role}
                      </span>
                    </div>
                  </div>

                  {/* Glassmorphic Bio Quote Container with Gold Accent Line */}
                  <div className="relative bg-[#0c0307]/75 p-3.5 rounded-xl border border-white/10 border-l-4 border-l-[#FFC72C] shadow-inner space-y-1 backdrop-blur-sm">
                    <p className="text-slate-200 text-xs leading-relaxed font-medium">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: 10 CORE IDEOLOGICAL PILLARS MATCHED WITH OFFICIAL TVK ILLUSTRATIONS */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-950/80 text-amber-400 border border-amber-400/70 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" /> {lang === 'HI' ? '10 वैचारिक स्तंभ' : '10 CORE IDEOLOGICAL PILLARS'}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
              10 Fundamental Principles of TVK
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#FFC72C] via-red-600 to-transparent rounded-full mx-auto shadow-[0_0_15px_rgba(255,199,44,0.8)]" />
            <p className="text-slate-200 text-xs md:text-sm font-medium leading-relaxed">
              Explore the core constitutional, social, and administrative resolutions of Tamilaga Vettri Kazhagam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideologyPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-gradient-to-br from-[#0e0409]/95 via-[#13050c]/90 to-[#0e0409]/95 backdrop-blur-2xl border-2 border-red-500/40 hover:border-amber-400 rounded-3xl p-6 transition-all shadow-[0_10px_35px_rgba(225,29,72,0.2)] hover:shadow-[0_15px_50px_rgba(255,199,44,0.35)] space-y-5 flex flex-col justify-between hover:scale-[1.02] group overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header Row: Icon & Pillar Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${pillar.color} text-white flex items-center justify-center shadow-xl border-2 border-amber-300/60 group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-7 h-7 text-white drop-shadow-md" />
                      </div>
                      <span className="text-xs font-mono font-black text-[#FFC72C] bg-red-950/90 px-3.5 py-1.5 rounded-full border border-amber-400/60 shadow-md">
                        PILLAR 0{idx + 1}
                      </span>
                    </div>

                    {/* PROMINENT BRIGHT OFFICIAL TVK PILLAR ILLUSTRATION IMAGE */}
                    {pillar.image && (
                      <div className="w-full h-48 md:h-52 rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-slate-950 shadow-xl relative group-hover:border-amber-300 transition-colors flex items-center justify-center p-2">
                        <img
                          src={pillar.image}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = pillar.fallback;
                          }}
                          alt={pillar.title}
                          className="w-full h-full object-contain filter contrast-110 brightness-110 drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 text-right pointer-events-none">
                          <span className="text-[10px] font-black text-[#FFC72C] uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-amber-400/40 backdrop-blur-sm">
                            OFFICIAL TVK RESOLUTION
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Titles */}
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xl text-white group-hover:text-[#FFC72C] transition-colors leading-tight font-display">
                        {pillar.title}
                      </h3>
                      <span className="text-xs font-black text-[#FFC72C] block tracking-wide">
                        {pillar.sub}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium bg-[#0c0307]/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-sm">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
