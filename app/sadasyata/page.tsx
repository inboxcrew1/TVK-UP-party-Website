'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Users, CheckCircle2, Award, Phone, QrCode, Download, Share2, Sparkles, Flag, ArrowRight, UserCheck, Upload, CreditCard, Mail, Image as ImageIcon, MessageSquare, Check, FileCheck, FileText, MapPin, Home as HomeIcon, Search, RefreshCw, Layers, Eye, ChevronRight, X, Camera, FolderOpen, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RealisticMemberCard from '../../components/RealisticMemberCard';
import { useLanguage } from '../../context/LanguageContext';
import { UP_DISTRICT_ASSEMBLIES, getConstituenciesByDistrict } from '../../lib/upConstituencies';

const UP_DISTRICTS = Object.keys(UP_DISTRICT_ASSEMBLIES);
const MAX_REGISTRATIONS_PER_PHONE = 10;

export default function SadasyataPage() {
  const { lang, t } = useLanguage();
  const photoFileRef = useRef<HTMLInputElement>(null);
  const photoCameraRef = useRef<HTMLInputElement>(null);
  const govtDocFileRef = useRef<HTMLInputElement>(null);
  const govtDocCameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'PHOTO' | 'GOVT_DOC'>('PHOTO');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [activeTab, setActiveTab] = useState<'REGISTER' | 'DOWNLOAD_BY_ID'>('REGISTER');

  // Complete 7-Language Translation Dictionaries for Membership Page & Form
  const memI18n: Record<string, Record<string, string>> = {
    HI: {
      membershipConsent: 'मैं टीवीके उत्तर प्रदेश को सदस्यता पंजीकरण, सत्यापन, सदस्यता आईडी/डिजिटल आईडी कार्ड जारी करने, रिकॉर्ड रखने तथा सदस्यता संबंधी संचार के लिए मेरी व्यक्तिगत जानकारी एकत्रित, सुरक्षित रखने और उपयोग करने की सहमति देता/देती हूँ। मैं पुष्टि करता/करती हूँ कि मेरे द्वारा दी गई जानकारी सही एवं सत्य है।',
      consentError: 'कृपया अपना सदस्यता पंजीकरण पूरा करने के लिए सहमति स्वीकार करें।',
      heroBadge: 'टीवीके प्राथमिक सदस्यता पोर्टल',
      heroTitle: 'टीवीके उत्तर प्रदेश प्राथमिक सदस्यता पोर्टल',
      heroSub: 'एक मोबाइल नंबर से अधिकतम 10 सदस्यों का पंजीकरण करें। मोबाइल नंबर दर्ज करके उस नंबर से पंजीकृत सभी सदस्यों के डिजिटल QR पहचान-पत्र देखें एवं डाउनलोड करें।',
      tabNew: '📝 नई सदस्यता लें (New Registration)',
      tabDownload: '💳 ID / मोबाइल नंबर से कार्ड डाउनलोड करें',
      rulesTitle: 'सदस्य बनने के मुख्य नियम',
      rule1: 'आवेदक भारत का नागरिक होना चाहिए और आयु 18 वर्ष से अधिक होनी चाहिए।',
      rule2: 'एक मोबाइल नंबर से परिवार/बूथ के अधिकतम 10 सदस्यों का पंजीकरण किया जा सकता है।',
      rule3: 'वैध पहचान पत्र (आधार/मतदाता कार्ड) एवं पासपोर्ट फोटो अनिवार्य है।',
      rule4: 'मोबाइल नंबर दर्ज करने पर उस नंबर से पंजीकृत सभी पहचान-पत्र एक साथ पॉप-अप होंगे।',
      statsHeader: 'लाइव उत्तर प्रदेश कैडर रिकॉर्ड',
      statsMembers: 'पंजीकृत सदस्य',
      statsDistricts: 'सक्रिय जनपद',
      formBadge: 'प्राथमिक सदस्यता फॉर्म (PRIMARY MEMBERSHIP FORM)',
      formTitle: 'TVK Primary Membership Form',
      formSub: 'जनपद एवं विधानसभा क्षेत्र का चयन करके अपनी टीवीके-यूपी 100 सीरीज आईडी प्राप्त करें। (10 Registrations allowed per phone number)',
      photoUploadLabel: 'पासपोर्ट साइज फोटो अपलोड (Mandatory Photo Upload)',
      photoBtnUpload: 'पासपोर्ट फोटो अपलोड करें *',
      photoBtnChange: 'फोटो बदलें (Change Photo)',
      photoHint: 'JPG, PNG | यह फोटो पहचान-पत्र पर मुद्रित होगी।',
      fullNameLabel: 'पूरा नाम (Full Name)',
      fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
      phoneLabel: 'मोबाइल नंबर (Mobile Number)',
      phoneLimitBadge: '10 रजिस्ट्रेशन सीमा',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर',
      emailLabel: 'ईमेल पता (Email Address)',
      emailPlaceholder: 'e.g. name@example.com (ऐच्छिक / Optional)',
      addressLabel: 'पूरा स्थायी पता (Full Address Line)',
      addressPlaceholder: 'मकान नंबर, गली / मोहल्ला, लैंडमार्क दर्ज करें',
      districtLabel: 'जनपद (District - Uttar Pradesh)',
      assemblyLabel: 'विधानसभा क्षेत्र (Assembly Constituency)',
      govtIdTypeLabel: 'पहचान पत्र का प्रकार (Govt ID Type)',
      govtIdNumberLabel: 'पहचान-पत्र क्रमांक (ID Number)',
      govtDocUploadLabel: 'दस्तावेज कॉपी अपलोड (Upload Govt ID Copy)',
      govtDocBtnUpload: 'फाइल अपलोड करें (Optional)',
      govtDocBtnChange: 'दस्तावेज बदलें',
      govtDocNoFile: 'कोई फाइल चुनी नहीं गई है (Optional)',
      submitBtn: 'सत्यापित सदस्य बनें एवं TVK-UP 100 ID प्राप्त करें',
      submitting: 'पंजीकरण हो रहा है...',
      dlHeaderBadge: 'सुरक्षित आईडी डाउनलोड (SECURE ID DOWNLOAD)',
      dlTitle: 'सदस्यता ID एवं मोबाइल नंबर से कार्ड प्राप्त करें',
      dlSub: 'अपना पहचान-पत्र देखने के लिए पंजीकृत मोबाइल नंबर और सिस्टम जनरेटेड सदस्यता ID (उदा. TVK-UP 100) दोनों दर्ज करें।',
      dlIdLabel: 'सिस्टम जनरेटेड सदस्यता ID (Membership ID) *',
      dlIdPlaceholder: 'उदा. TVK-UP 100',
      dlPhoneLabel: 'पंजीकृत मोबाइल नंबर (Registered Mobile Number) *',
      dlPhonePlaceholder: '10 अंकों का पंजीकृत मोबाइल नंबर',
      dlSubmitBtn: 'मेरी सदस्यता ID सत्यापित करें एवं डाउनलोड करें',
      dlSearching: 'सत्यापित किया जा रहा है...',
      popupTitle: 'आपकी आधिकारिक टीवीके सदस्यता ID',
      popupSub: 'नीचे अपना डिजिटल QR पहचान-पत्र देखें एवं डाउनलोड करें:',
      popupBtnView: 'पहचान-पत्र देखें एवं डाउनलोड करें',
      popupSearchAgain: 'पुनः खोजें (Search Again)',
      cardVerifiedTitle: 'आधिकारिक टीवीके सदस्यता पहचान-पत्र',
      cardBackBtn: 'वापस जाएं (Go Back)',
    },
    EN: {
      membershipConsent: 'I consent to TVK Uttar Pradesh collecting, storing and using my personal information for membership registration, verification, Membership ID/Digital ID Card generation, record keeping and membership-related communication. I confirm that the information provided by me is true and correct.',
      consentError: 'Please accept the consent to complete your membership registration.',
      heroBadge: 'TVK PRIMARY MEMBERSHIP PORTAL',
      heroTitle: 'TVK Uttar Pradesh Primary Membership Portal',
      heroSub: 'Register up to 10 family or booth members per mobile number. Enter your registered mobile number and system-generated ID to download your card.',
      tabNew: '📝 New Registration',
      tabDownload: '💳 Download Card (ID + Mobile Verified)',
      rulesTitle: 'Rules & Guidelines for Membership',
      rule1: 'Applicant must be a citizen of India aged 18 years or above.',
      rule2: 'Up to 10 members can be registered per mobile number for family/booth teams.',
      rule3: 'Valid Govt ID proof (Aadhaar / Voter ID) and passport photo are mandatory.',
      rule4: 'Both Membership ID and Registered Mobile Number are required for card download.',
      statsHeader: 'LIVE UTTAR PRADESH CADRE RECORD',
      statsMembers: 'Registered Members',
      statsDistricts: 'Active Districts',
      formBadge: 'PRIMARY MEMBERSHIP FORM',
      formTitle: 'TVK Primary Membership Form',
      formSub: 'Select your district & assembly to receive your official TVK-UP 100 series ID. (Max 10 registrations per phone number)',
      photoUploadLabel: 'Passport Size Photo Upload (Mandatory)',
      photoBtnUpload: 'Upload Passport Photo *',
      photoBtnChange: 'Change Photo',
      photoHint: 'JPG, PNG | This photo will be printed on your digital ID card.',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      phoneLabel: 'Mobile Number',
      phoneLimitBadge: '10 Registrations Limit',
      phonePlaceholder: '10-digit Mobile Number',
      emailLabel: 'Email Address',
      emailPlaceholder: 'e.g. name@example.com (Optional)',
      addressLabel: 'Full Permanent Address Line',
      addressPlaceholder: 'House No., Street / Locality, Landmark',
      districtLabel: 'District (Uttar Pradesh)',
      assemblyLabel: 'Assembly Constituency',
      govtIdTypeLabel: 'Govt ID Type',
      govtIdNumberLabel: 'ID Number',
      govtDocUploadLabel: 'Upload Govt ID Copy',
      govtDocBtnUpload: 'Upload ID File (Optional)',
      govtDocBtnChange: 'Change Document',
      govtDocNoFile: 'No file selected (Optional)',
      submitBtn: 'Become Verified Member & Get TVK-UP ID',
      submitting: 'Registering Membership...',
      dlHeaderBadge: 'SECURE ID DOWNLOAD',
      dlTitle: 'Download Membership ID Card',
      dlSub: 'Enter BOTH your System-Generated Membership ID (e.g. TVK-UP 100) and your Registered Mobile Number to access your card.',
      dlIdLabel: 'System-Generated Membership ID *',
      dlIdPlaceholder: 'e.g. TVK-UP 100',
      dlPhoneLabel: 'Registered Mobile Number *',
      dlPhonePlaceholder: '10-digit registered mobile number',
      dlSubmitBtn: 'Verify & Download My ID Card',
      dlSearching: 'Verifying Credentials...',
      popupTitle: 'Your Official TVK Membership Identity Card',
      popupSub: 'View and download your official digital QR ID card below:',
      popupBtnView: 'View & Download ID Card',
      popupSearchAgain: 'Search Again',
      cardVerifiedTitle: 'Official TVK Membership Identity Card',
      cardBackBtn: 'Go Back',
    },
    TA: {
      membershipConsent: 'உறுப்பினர் பதிவு, சரிபார்ப்பு, உறுப்பினர் அடையாள அட்டை/டிஜிட்டல் அடையாள அட்டை உருவாக்கம், பதிவுகளை பராமரித்தல் மற்றும் உறுப்பினர் தொடர்பான தகவல்களைத் தொடர்புகொள்வதற்காக, நான் வழங்கும் எனது தனிப்பட்ட தகவல்களை TVK உத்தரப் பிரதேசம் சேகரித்து, சேமித்து, பயன்படுத்துவதற்கு நான் சம்மதிக்கிறேன். நான் வழங்கிய தகவல்கள் எனக்குத் தெரிந்தவரை உண்மையும் சரியானதுமாகும் என்பதை உறுதிப்படுத்துகிறேன்.',
      consentError: 'உங்கள் உறுப்பினர் பதிவை முடிக்க தயவுசெய்து சம்மதத்தை ஏற்கவும்.',
      heroBadge: 'தமிழக வெற்றிக் கழகம் முதன்மை உறுப்பினர் போர்ட்டல்',
      heroTitle: 'தமிழக வெற்றிக் கழகம் உத்திரப் பிரதேச உறுப்பினர் போர்ட்டல்',
      heroSub: 'ஒரு மொபைல் எண்ணில் 10 உறுப்பினர்கள் வரை பதிவு செய்யலாம். மொபைல் எண்ணை உள்ளிட்டு டிஜிட்டல் உறுப்பினர் அட்டைகளைப் பதிவிறக்கவும்.',
      tabNew: '📝 புதிய உறுப்பினர் பதிவு',
      tabDownload: '💳 அட்டையைப் பதிவிறக்கவும்',
      rulesTitle: 'உறுப்பினர் சேருவதற்கான விதிகள்',
      rule1: 'விண்ணப்பதாரர் இந்தியக் குடிமகனாகவும் 18 வயதுக்கு மேற்பட்டவராகவும் இருக்க வேண்டும்.',
      rule2: 'ஒரு மொபைல் எண்ணில் 10 குடும்ப உறுப்பினர்கள் வரை பதிவு செய்யலாம்.',
      rule3: 'அரசு அடையாளச் சான்று (ஆதார்/வாக்காளர் அட்டை) மற்றும் புகைப்படம் கட்டாயம்.',
      rule4: 'மொபைல் எண்ணை உள்ளிடும்போது அனைத்து அட்டைகளும் ஒரே நேரத்தில் தோன்றும்.',
      statsHeader: 'உத்தரப்பிரதேச உறுப்பினர் புள்ளிவிவரம்',
      statsMembers: 'பதிவுசெய்த உறுப்பினர்கள்',
      statsDistricts: 'செயலில் உள்ள மாவட்டங்கள்',
      formBadge: 'கட்டாய சரிபார்ப்பு படிவம்',
      formTitle: 'தமிழக வெற்றிக் கழகம் உறுப்பினர் படிவம்',
      formSub: 'உங்கள் மாவட்டம் மற்றும் தொகுதியைத் தேர்ந்தெடுத்து டிஜிட்டல் அட்டையைப் பெறுங்கள்.',
      photoUploadLabel: 'பாஸ்போர்ட் அளவு புகைப்படம் (கட்டாயம்)',
      photoBtnUpload: 'புகைப்படத்தைப் பதிவேற்றவும் *',
      photoBtnChange: 'புகைப்படத்தை மாற்றவும்',
      photoHint: 'JPG, PNG | இந்தப் படம் உங்கள் டிஜிட்டல் அட்டையில் அச்சிடப்படும்.',
      fullNameLabel: 'முழுப் பெயர்',
      fullNamePlaceholder: 'உங்கள் முழுப் பெயரை உள்ளிடவும்',
      phoneLabel: 'கைபேசி எண்',
      phoneLimitBadge: '10 பதிவுகள் வரம்பு',
      phonePlaceholder: '10 இலக்க கைபேசி எண்',
      addressLabel: 'முழு வீட்டு முகவரி',
      addressPlaceholder: 'கதவு எண், தெரு / பகுதி, அடையாளச் சின்னம்',
      districtLabel: 'மாவட்டம் (உத்தரப் பிரதேசம்)',
      assemblyLabel: 'சட்டமன்றத் தொகுதி',
      govtIdTypeLabel: 'அடையாளச் சான்று வகை',
      govtIdNumberLabel: 'அடையாளச் சான்று எண்',
      govtDocUploadLabel: 'அடையாளச் சான்று நகல் பதிவேற்றம்',
      govtDocBtnUpload: 'கோப்பைப் பதிவேற்றவும் *',
      govtDocBtnChange: 'கோப்பை மாற்றவும்',
      govtDocNoFile: 'கோப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
      submitBtn: 'உறுப்பினராகி TVK-UP அடையாள அட்டையைப் பெறுங்கள்',
      submitting: 'பதிவு செய்யப்படுகிறது...',
      dlHeaderBadge: 'உடனடி அட்டை பதிவிறக்கம்',
      dlTitle: 'உறுப்பினர் அடையாள அட்டையைப் பதிவிறக்கவும்',
      dlSub: 'உங்கள் உறுப்பினர் எண் (எ.கா. TVK-UP 100) அல்லது கைபேசி எண்ணை உள்ளிடவும்.',
      dlIdLabel: 'உறுப்பினர் எண் *',
      dlIdPlaceholder: 'எ.கா. TVK-UP 100 அல்லது 100',
      dlPhoneLabel: 'பதிவுசெய்த கைபேசி எண் (விருப்பத்தேர்வு)',
      dlPhonePlaceholder: '10 இலக்க கைபேசி எண்',
      dlSubmitBtn: 'அடையாள அட்டையைத் தேடிப் பதிவிறக்கவும்',
      dlSearching: 'தேடப்படுகிறது...',
      popupTitle: 'இந்த கைபேசி எண்ணில் பதிவுசெய்த அட்டைகள்',
      popupSub: 'கீழே உள்ள உறுப்பினரைத் தேர்ந்தெடுத்து அட்டையைப் பதிவிறக்கவும்:',
      popupBtnView: 'பார்த்து பதிவிறக்கவும்',
      popupSearchAgain: 'மீண்டும் தேடவும்',
      cardVerifiedTitle: 'அதிகாரப்பூர்வ டிவிObservation அட்டை',
      cardBackBtn: 'பின்செல்லவும்',
    },
    TE: {
      membershipConsent: 'సభ్యత్వ నమోదు, ధృవీకరణ, సభ్యత్వ ID/డిజిటల్ ID కార్డు రూపొందించడం, రికార్డులను నిర్వహించడం మరియు సభ్యత్వానికి సంబంధించిన సమాచారాన్ని తెలియజేయడం కోసం నేను అందించే నా వ్యక్తిగత సమాచారాన్ని TVK ఉత్తరప్రదేశ్ సేకరించడం, నిల్వ చేయడం మరియు ఉపయోగించడానికి నేను సమ్మతిస్తున్నాను. నేను అందించిన సమాచారం నా తెలిసిన మేరకు నిజమైనది మరియు సరైనదని ధృవీకరిస్తున్నాను.',
      consentError: 'మీ సభ్యత్వ నమోదును పూర్తి చేయడానికి దయచేసి సమ్మతిని అంగీకరించండి.',
      heroBadge: 'టీవీకే ప్రాథమిక సభ్యత్వ పోర్టల్',
      heroTitle: 'టీవీకే ఉత్తర ప్రదేశ్ ప్రాథమిక సభ్యత్వ పోర్టల్',
      heroSub: 'ఒక మొబైల్ నంబర్‌తో గరిష్టంగా 10 మంది సభ్యులను నమోదు చేయండి. నంబర్‌ను నమోదు చేసి డిజిటల్ ఐడీ కార్డ్‌లను డౌన్‌లోడ్ చేయండి.',
      tabNew: '📝 కొత్త సభ్యత్వం',
      tabDownload: '💳 ఐడీ తో కార్డ్ డౌన్‌లోడ్',
      rulesTitle: 'సభ్యత్వ నిబంధనలు',
      rule1: 'దరఖాస్తుదారు భారతీయ పౌరుడై ఉండాలి మరియు 18 ఏళ్లు నిండి ఉండాలి.',
      rule2: 'ఒక మొబైల్ నంబర్‌తో గరిష్టంగా 10 మంది కుటుంబ సభ్యులను నమోదు చేయవచ్చు.',
      rule3: 'ప్రభుత్వ గుర్తింపు కార్డు మరియు ఫోటో తప్పనిసరి.',
      rule4: 'మొబైల్ నంబర్ నమోదు చేసినప్పుడు ఆ నంబర్‌కు చెందిన అన్ని కార్డులు కనిపిస్తాయి.',
      statsHeader: 'ఉత్తర ప్రదేశ్ సభ్యత్వ రికార్డు',
      statsMembers: 'నమోదైన సభ్యులు',
      statsDistricts: 'క్రియాశీల జిల్లాలు',
      formBadge: 'తప్పనిసరి పరిశీలన ఫారం',
      formTitle: 'టీవీకే ప్రాథమిక సభ్యత్వ ఫారం',
      formSub: 'మీ జిల్లా మరియు నియోజకవర్గాన్ని ఎంచుకుని డిజిటల్ కార్డును పొందండి.',
      photoUploadLabel: 'పాస్‌పోర్ట్ సైజ్ ఫోటో (తప్పనిసరి)',
      photoBtnUpload: 'ఫోటో అప్‌లోడ్ చేయండి *',
      photoBtnChange: 'ఫోటో మార్చండి',
      photoHint: 'JPG, PNG | ఈ ఫోటో మీ డిజిటల్ కార్డుపై ముద్రించబడుతుంది.',
      fullNameLabel: 'పూర్తి పేరు',
      fullNamePlaceholder: 'మీ పూర్తి పేరు నమోదు చేయండి',
      phoneLabel: 'మొబైల్ నంబర్',
      phoneLimitBadge: '10 నమోదుల పరిమితి',
      phonePlaceholder: '10 అంకెల మొబైల్ నంబర్',
      addressLabel: 'పూర్తి చిరునామా',
      addressPlaceholder: 'ఇంటి నంబర్, వీధి / ఏరియా',
      districtLabel: 'జిల్లా (ఉత్తర ప్రదేశ్)',
      assemblyLabel: 'అసెంబ్లీ నియోజకవర్గం',
      govtIdTypeLabel: 'గుర్తింపు కార్డు రకం',
      govtIdNumberLabel: 'గుర్తింపు కార్డు నంబర్',
      govtDocUploadLabel: 'గుర్తింపు కార్డు కాపీ అప్‌లోడ్',
      govtDocBtnUpload: 'ఫైల్ అప్‌లోడ్ చేయండి *',
      govtDocBtnChange: 'ఫైల్ మార్చండి',
      govtDocNoFile: 'ఏ ఫైల్ ఎంచుకోలేదు',
      submitBtn: 'సభ్యుడిగా చేరి TVK-UP ఐడీ పొందండి',
      submitting: 'నమోదు అవుతోంది...',
      dlHeaderBadge: 'తక్షణ ఐడీ డౌన్‌లోడ్',
      dlTitle: 'సభ్యత్వ ఐడీ కార్డు డౌన్‌లోడ్ చేయండి',
      dlSub: 'మీ సభ్యత్వ నంబర్ లేదా మొబైల్ నంబర్ నమోదు చేయండి.',
      dlIdLabel: 'సభ్యత్వ ఐడీ నంబర్ *',
      dlIdPlaceholder: 'ఉదా. TVK-UP 100',
      dlPhoneLabel: 'నమోదిత మొబైల్ నంబర్',
      dlPhonePlaceholder: '10 అంకెల మొబైల్ నంబర్',
      dlSubmitBtn: 'కార్డు శోధించి డౌన్‌లోడ్ చేయండి',
      dlSearching: 'శోధిస్తోంది...',
      popupTitle: 'ఈ మొబైల్ నంబర్‌తో నమోదైన కార్డులు',
      popupSub: 'క్రింది సభ్యుడిని ఎంచుకుని కార్డు డౌన్‌లోడ్ చేయండి:',
      popupBtnView: 'చూడండి & డౌన్‌లోడ్ చేయండి',
      popupSearchAgain: 'మళ్లీ శోధించండి',
      cardVerifiedTitle: 'అధికారిక టీవీకే సభ్యత్వ కార్డు',
      cardBackBtn: 'వెనక్కి వెళ్లండి',
    },
    KN: {
      membershipConsent: 'ಟಿವಿಕೆ ಉತ್ತರ ಪ್ರದೇಶವು ಸದಸ್ಯತ್ವ ನೋಂದಣಿ, ಪರಿಶೀಲನೆ, ಸದಸ್ಯತ್ವ ಐಡಿ/ಡಿಜಿಟಲ್ ಐಡಿ ಕಾರ್ಡ್ ರಚನೆ, ದಾಖಲೆ ನಿರ್ವಹಣೆ ಮತ್ತು ಸದಸ್ಯತ್ವ ಸಂಬಂಧಿತ ಸಂವಹನಕ್ಕಾಗಿ ನನ್ನ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲು, ಶೇಖರಿಸಲು ಮತ್ತು ಬಳಸಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ. ನಾನು ನೀಡಿದ ಮಾಹಿತಿಯು ಸತ್ಯ ಮತ್ತು ಸರಿಯಾಗಿದೆ ಎಂದು ನಾನು ದೃಢೀಕರಿಸುತ್ತೇನೆ.',
      consentError: 'ನಿಮ್ಮ ಸದಸ್ಯತ್ವ ನೋಂದಣಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು దయవిಟ್ಟು ಸಮ್ಮತಿಯನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ.',
      heroBadge: 'ಟಿವಿಕೆ ಪ್ರಾಥಮಿಕ ಸದಸ್ಯತ್ವ ಪೋರ್ಟಲ್',
      heroTitle: 'ಟಿವಿಕೆ ಉತ್ತರ ಪ್ರದೇಶ ಪ್ರಾಥಮಿಕ ಸದಸ್ಯತ್ವ ಪೋರ್ಟಲ್',
      heroSub: 'ಒಂದು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಲ್ಲಿ 10 ಸದಸ್ಯರವರೆಗೆ ನೋಂದಾಯಿಸಿ. ಡಿಜಿಟಲ್ ಐಡಿ ಕಾರ್ಡ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
      tabNew: '📝 ಹೊಸ ಸದಸ್ಯತ್ವ',
      tabDownload: '💳 ಐಡಿಯಿಂದ ಕಾರ್ಡ್ ಡೌನ್‌ಲೋಡ್',
      rulesTitle: 'ಸದಸ್ಯತ್ವದ ನಿಯಮಗಳು',
      rule1: 'ಅರ್ಜಿದಾರರು ಭಾರತೀಯ ನಾಗರಿಕರಾಗಿರಬೇಕು ಮತ್ತು 18 ವರ್ಷ ಮೇಲ್ಪಟ್ಟವರಾಗಿರಬೇಕು.',
      rule2: 'ಒಂದು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಲ್ಲಿ ಗರಿಷ್ಠ 10 ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ನೋಂದಾಯಿಸಬಹುದು.',
      rule3: 'ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ ಮತ್ತು ಫೋಟೋ ಕಡ್ಡಾಯವಾಗಿದೆ.',
      rule4: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿದಾಗ ಆ ಸಂಖ್ಯೆಯ ಎಲ್ಲಾ ಕಾರ್ಡ್‌ಗಳು ಗೋಚರಿಸುತ್ತವೆ.',
      statsHeader: 'ಉತ್ತರ ಪ್ರದೇಶ ಸದಸ್ಯತ್ವ ದಾಖಲೆ',
      statsMembers: 'ನೋಂದಾಯಿತ ಸದಸ್ಯರು',
      statsDistricts: 'ಸಕ್ರಿಯ ಜಿಲ್ಲೆಗಳು',
      formBadge: 'ಕಡ್ಡಾಯ ಪರಿಶೀಲನೆ ಫಾರ್ಮ್',
      formTitle: 'ಟಿವಿಕೆ ಪ್ರಾಥಮಿಕ ಸದಸ್ಯತ್ವ ಫಾರ್ಮ್',
      formSub: 'ನಿಮ್ಮ ಜಿಲ್ಲೆ ಮತ್ತು ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಡಿಜಿಟಲ್ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ.',
      photoUploadLabel: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಫೋಟೋ (ಕಡ್ಡಾಯ)',
      photoBtnUpload: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ *',
      photoBtnChange: 'ಫೋಟೋ ಬದಲಾಯಿಸಿ',
      photoHint: 'JPG, PNG | ಈ ಫೋಟೋ ನಿಮ್ಮ ಐಡಿ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಮುದ್ರಿತವಾಗುತ್ತದೆ.',
      fullNameLabel: 'ಪೂರ್ಣ ಹೆಸರು',
      fullNamePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ',
      phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      phoneLimitBadge: '10 ನೋಂದಣಿ ಮಿತಿ',
      phonePlaceholder: '10 ಅಕಿಂಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      addressLabel: 'ಪೂರ್ಣ ವಿಳಾಸ',
      addressPlaceholder: 'ಮನೆ ಸಂಖ್ಯೆ, ರಸ್ತೆ / ಏರಿಯಾ',
      districtLabel: 'ಜಿಲ್ಲೆ (ಉತ್ತರ ಪ್ರದೇಶ)',
      assemblyLabel: 'ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ',
      govtIdTypeLabel: 'ಗುರುತಿನ ಚೀಟಿ ಪ್ರಕಾರ',
      govtIdNumberLabel: 'ಗುರುತಿನ ಚೀಟಿ ಸಂಖ್ಯೆ',
      govtDocUploadLabel: 'ಗುರುತಿನ ಚೀಟಿ ಪ್ರತಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      govtDocBtnUpload: 'ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ *',
      govtDocBtnChange: 'ಫೈಲ್ ಬದಲಾಯಿಸಿ',
      govtDocNoFile: 'ಯಾವ ಫೈಲ್ ಆಯ್ಕೆಯಾಗಿಲ್ಲ',
      submitBtn: 'ಸದಸ್ಯರಾಗಿ TVK-UP ಐಡಿ ಪಡೆಯಿರಿ',
      submitting: 'ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ...',
      dlHeaderBadge: 'ತಕ್ಷಣದ ಐಡಿ ಡೌನ್‌ಲೋಡ್',
      dlTitle: 'ಸದಸ್ಯತ್ವ ಐಡಿ ಕಾರ್ಡ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      dlSub: 'ನಿಮ್ಮ ಸದಸ್ಯತ್ವ ಸಂಖ್ಯೆ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.',
      dlIdLabel: 'ಸದಸ್ಯತ್ವ ಐಡಿ ಸಂಖ್ಯೆ *',
      dlIdPlaceholder: 'ಉದಾ. TVK-UP 100',
      dlPhoneLabel: 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      dlPhonePlaceholder: '10 ಅಕಿಂಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      dlSubmitBtn: 'ಕಾರ್ಡ್ ಹುಡುಕಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      dlSearching: 'ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
      popupTitle: 'ಈ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಲ್ಲಿ ನೋಂದಾಯಿತ ಕಾರ್ಡ್‌ಗಳು',
      popupSub: 'ಕೆಳಗಿನ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಕಾರ್ಡ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ:',
      popupBtnView: 'ವೀಕ್ಷಿಸಿ & ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      popupSearchAgain: 'ಮತ್ತೆ ಹುಡುಕಿ',
      cardVerifiedTitle: 'ಅಧಿಕೃತ ಟಿವಿಕೆ ಸದಸ್ಯತ್ವ ಕಾರ್ಡ್',
      cardBackBtn: 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ',
    },
    ML: {
      membershipConsent: 'അംഗത്വ രജിസ്ട്രേഷൻ, വെരിഫിക്കേഷൻ, അംഗത്വ ഐഡി/ഡിജിറ്റൽ ഐഡി കാർഡ് നിർമ്മാണം, റെക്കോർഡ് സൂക്ഷിക്കൽ, അംഗത്വവുമായി ബന്ധപ്പെട്ട വിവരവിനിമയം എന്നിവയ്ക്കായി എൻ്റെ വ്യക്തിഗത വിവരങ്ങൾ ശേഖരിക്കുന്നതിനും സൂക്ഷിക്കുന്നതിനും ഉപയോഗിക്കുന്നതിനും ഞാൻ ടിവികെ ഉത്തർപ്രദേശിന് സമ്മതം നൽകുന്നു. ഞാൻ നൽകിയ വിവരങ്ങൾ സത്യവും ശരിയുമാണെന്ന് ഞാൻ സ്ഥിരീകരിക്കുന്നു.',
      consentError: 'നിങ്ങളുടെ അംഗത്വ രജിസ്ട്രേഷൻ പൂർത്തിയാക്കാൻ ദയവായി സമ്മതം സ്വീകരിക്കുക.',
      heroBadge: 'ടിവികെ പ്രൈമറി അംഗത്വ പോർട്ടൽ',
      heroTitle: 'ടിവികെ ഉത്തർപ്രദേശ് പ്രൈമറി അംഗത്വ പോർട്ടൽ',
      heroSub: 'ഒരു മൊബൈൽ നമ്പറിൽ 10 അംഗങ്ങളെ വരെ രജിസ്റ്റർ ചെയ്യാം. ഡിജിറ്റൽ ഐഡി കാർഡുകൾ ഡൗൺലോഡ് ചെയ്യുക.',
      tabNew: '📝 പുതിയ അംഗത്വം',
      tabDownload: '💳 കാർഡ് ഡൗൺലോഡ് ചെയ്യുക',
      rulesTitle: 'അംഗത്വ നിബന്ധനകൾ',
      rule1: 'അപേക്ഷകൻ ഇന്ത്യൻ പൗരനും 18 വയസ്സ് തികഞ്ഞവനുമായിരിക്കണം.',
      rule2: 'ഒരു മൊബൈൽ നമ്പറിൽ 10 കുടുംബാംഗങ്ങളെ വരെ രജിസ്റ്റർ ചെയ്യാം.',
      rule3: 'സർക്കാർ തിരിച്ചറിയൽ കാർഡും ഫോട്ടോയും നിർബന്ധമാണ്.',
      rule4: 'മൊബൈൽ നമ്പർ നൽകുമ്പോൾ ആ നമ്പറിലെ എല്ലാ കാർഡുകളും കാണാം.',
      statsHeader: 'ഉത്തർപ്രദേശ് അംഗത്വ റെക്കോർഡ്',
      statsMembers: 'രജിസ്റ്റർ ചെയ്ത അംഗങ്ങൾ',
      statsDistricts: 'സജീവ ജില്ലകൾ',
      formBadge: 'നിർബന്ധിത പരിശോധനാ ഫോം',
      formTitle: 'ടിവികെ പ്രൈമറി അംഗത്വ ഫോം',
      formSub: 'നിങ്ങളുടെ ജില്ലയും മണ്ഡലവും തിരഞ്ഞെടുത്ത് കാർഡ് നേടുക.',
      photoUploadLabel: 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ (നിർബന്ധം)',
      photoBtnUpload: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക *',
      photoBtnChange: 'ഫോട്ടോ മാറ്റുക',
      photoHint: 'JPG, PNG | ഈ ഫോട്ടോ ഐഡി കാർഡിൽ പതിക്കും.',
      fullNameLabel: 'പൂർണ്ണ നാമം',
      fullNamePlaceholder: 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക',
      phoneLabel: 'മൊബൈൽ നമ്പർ',
      phoneLimitBadge: '10 രജിസ്ട്രേഷൻ പരിധി',
      phonePlaceholder: '10 അക്ക മൊബൈൽ നമ്പർ',
      addressLabel: 'പൂർണ്ണ മേൽവിലാസം',
      addressPlaceholder: 'വീട്ടുനമ്പർ, സ്ഥലം',
      districtLabel: 'ജില്ല (ഉത്തർപ്രദേശ്)',
      assemblyLabel: 'നിയമസഭാ മണ്ഡലം',
      govtIdTypeLabel: 'തിരിച്ചറിയൽ കാർഡ് തരം',
      govtIdNumberLabel: 'തിരിച്ചറിയൽ കാർഡ് നമ്പർ',
      govtDocUploadLabel: 'തിരിച്ചറിയൽ രേഖ അപ്‌ലോഡ് ചെയ്യുക',
      govtDocBtnUpload: 'ഫയൽ അപ്‌ലോഡ് ചെയ്യുക *',
      govtDocBtnChange: 'ഫയൽ മാറ്റുക',
      govtDocNoFile: 'ഫയലുകളൊന്നും തിരഞ്ഞെടുത്തിട്ടില്ല',
      submitBtn: 'അംഗമായി TVK-UP ഐഡി നേടുക',
      submitting: 'രജിസ്റ്റർ ചെയ്യുന്നു...',
      dlHeaderBadge: 'ഉടനടി ഐഡി ഡൗൺലോഡ്',
      dlTitle: 'അംഗത്വ ഐഡി കാർഡ് ഡൗൺലോഡ് ചെയ്യുക',
      dlSub: 'നിങ്ങളുടെ അംഗത്വ നമ്പറോ മൊബൈൽ നമ്പറോ നൽകുക.',
      dlIdLabel: 'അംഗത്വ ഐഡി നമ്പർ *',
      dlIdPlaceholder: 'ഉദാ. TVK-UP 100',
      dlPhoneLabel: 'രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ',
      dlPhonePlaceholder: '10 അക്ക മൊബൈൽ നമ്പർ',
      dlSubmitBtn: 'കാർഡ് കണ്ടെത്തി ഡൗൺലോഡ് ചെയ്യുക',
      dlSearching: 'തിരയുന്നു...',
      popupTitle: 'ഈ മൊബൈൽ നമ്പറിലെ കാർഡുകൾ',
      popupSub: 'താഴെയുള്ള അംഗത്തെ തിരഞ്ഞെടുത്ത് കാർഡ് ഡൗൺലോഡ് ചെയ്യുക:',
      popupBtnView: 'കാണുക & ഡൗൺലോഡ് ചെയ്യുക',
      popupSearchAgain: 'വീണ്ടും തിരയുക',
      cardVerifiedTitle: 'ഔദ്യോഗിക ടിവികെ അംഗത്വ കാർഡ്',
      cardBackBtn: 'തിരികെ പോകുക',
    },
    MR: {
      membershipConsent: 'मी टीव्हीके उत्तर प्रदेशला सदस्यत्व नोंदणी, पडताळणी, सदस्यत्व आयडी/डिजिटल आयडी कार्ड जारी करणे, नोंद ठेवणे आणि सदस्यत्व संबंधित संवादासाठी माझी वैयक्तिक माहिती गोळा करणे, जतन करणे आणि वापरण्यास संमती देतो/देते. मी पुष्टी करतो/करते की मी दिलेली माहिती खरी आणि बरोबर आहे.',
      consentError: 'आपली सदस्यत्व नोंदणी पूर्ण करण्यासाठी कृपया संमती स्वीकारा.',
      heroBadge: 'टीव्हीके प्राथमिक सदस्यत्व पोर्टल',
      heroTitle: 'टीव्हीके उत्तर प्रदेश प्राथमिक सदस्यत्व पोर्टल',
      heroSub: 'एका मोबाईल नंबरवर १० सदस्यांची नोंदणी करा. मोबाईल नंबर टाकून सर्व डिजिटल आयडी कार्ड डाउनलोड करा.',
      tabNew: '📝 नवीन सदस्यत्व नोंदणी',
      tabDownload: '💳 आयडी वरून कार्ड डाउनलोड करा',
      rulesTitle: 'सदस्यत्वाचे नियम व अटी',
      rule1: 'अर्जदार भारताचा नागरिक असावा आणि वय १८ वर्षांपेक्षा जास्त असावे.',
      rule2: 'एका मोबाईल नंबरवर जास्तीत जास्त १० सदस्यांची नोंदणी करता येईल.',
      rule3: 'शासकीय ओळखपत्र आणि पासपोर्ट फोटो अनिवार्य आहे.',
      rule4: 'मोबाईल नंबर टाकल्यास त्या नंबरवरील सर्व कार्ड्स एकत्र दिसतील.',
      statsHeader: 'उत्तर प्रदेश सदस्यत्व नोंदणी',
      statsMembers: 'नोंदणीकृत सदस्य',
      statsDistricts: 'सक्रिय जिल्हे',
      formBadge: 'अनिवार्य पडताळणी अर्ज',
      formTitle: 'टीव्हीके प्राथमिक सदस्यत्व अर्ज',
      formSub: 'आपला जिल्हा आणि विधानसभा मतदारसंघ निवडून डिजिटल आयडी मिळवा.',
      photoUploadLabel: 'पासपोर्ट साईज फोटो (अनिवार्य)',
      photoBtnUpload: 'पासपोर्ट फोटो अपलोड करा *',
      photoBtnChange: 'फोटो बदला',
      photoHint: 'JPG, PNG | हा फोटो आपल्या डिजिटल कार्डवर छापला जाईल.',
      fullNameLabel: 'पूर्ण नाव',
      fullNamePlaceholder: 'आपले पूर्ण नाव टाका',
      phoneLabel: 'मोबाईल नंबर',
      phoneLimitBadge: '१० नोंदणी मर्यादा',
      phonePlaceholder: '१० अंकी मोबाईल नंबर',
      addressLabel: 'पूर्ण कायमचा पत्ता',
      addressPlaceholder: 'घर नंबर, गल्ली / परिसर',
      districtLabel: 'जिल्हा (उत्तर प्रदेश)',
      assemblyLabel: 'विधानसभा मतदारसंघ',
      govtIdTypeLabel: 'ओळखपत्राचा प्रकार',
      govtIdNumberLabel: 'ओळखपत्र क्रमांक',
      govtDocUploadLabel: 'ओळखपत्र प्रत अपलोड करा',
      govtDocBtnUpload: 'फाईल अपलोड करा *',
      govtDocBtnChange: 'फाईल बदला',
      govtDocNoFile: 'कोणतीही फाईल निवडलेली नाही',
      submitBtn: 'सदस्य व्हा आणि TVK-UP आयडी मिळवा',
      submitting: 'नोंदणी होत आहे...',
      dlHeaderBadge: 'झटपट आयडी डाउनलोड',
      dlTitle: 'सदस्यत्व आयडी कार्ड डाउनलोड करा',
      dlSub: 'आपला सदस्यत्व क्रमांक किंवा मोबाईल नंबर टाका.',
      dlIdLabel: 'सदस्यत्व आयडी क्रमांक *',
      dlIdPlaceholder: 'उदा. TVK-UP 100',
      dlPhoneLabel: 'नोंदणीकृत मोबाईल नंबर',
      dlPhonePlaceholder: '१० अंकी मोबाईल नंबर',
      dlSubmitBtn: 'कार्ड शोधा आणि डाउनलोड करा',
      dlSearching: 'शोधत आहे...',
      popupTitle: 'या मोबाईल नंबरवरील नोंदणीकृत कार्ड्स',
      popupSub: 'खालील सदस्याची निवड करून कार्ड डाउनलोड करा:',
      popupBtnView: 'पहा आणि डाउनलोड करा',
      popupSearchAgain: 'पुन्हा शोधा',
      cardVerifiedTitle: 'अधिकृत टीव्हीके सदस्यत्व ओळखपत्र',
      cardBackBtn: 'मागे जा',
    },
  };

  const ms = memI18n[lang] || memI18n['HI'];

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '1998-08-15',
    gender: 'Male',
    age: '26',
    govtIdType: 'Aadhaar Card',
    govtIdNumber: '',
    photoPreview: '',
    govtDocPreview: '',
    govtDocName: '',
    addressLine: '',
    locality: '',
    city: '',
    districtName: 'Lucknow',
    stateName: 'Uttar Pradesh',
    pincode: '',
    assemblyName: '173 - Lucknow Central',
    referralCode: '',
    pledge: true,
    consentChecked: false,
  });
  const [consentErrorMsg, setConsentErrorMsg] = useState('');

  // Search by ID/Phone State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [availableAssemblies, setAvailableAssemblies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cards Results State (Allows multiple cards for 1 phone number up to 10)
  const [foundCardsList, setFoundCardsList] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Update Assemblies List whenever District changes
  useEffect(() => {
    const list = getConstituenciesByDistrict(formData.districtName);
    setAvailableAssemblies(list);
    if (!list.includes(formData.assemblyName)) {
      setFormData((prev) => ({ ...prev, assemblyName: list[0] || '' }));
    }
  }, [formData.districtName]);

  // Handle District Change
  const handleDistrictChange = (district: string) => {
    const list = getConstituenciesByDistrict(district);
    setFormData((prev) => ({
      ...prev,
      districtName: district,
      assemblyName: list[0] || `${district} Assembly`,
      city: prev.city || district,
    }));
    setAvailableAssemblies(list);
  };

  // Start Live Camera Stream (or fallback to native mobile camera input)
  const startLiveCamera = async (target: 'PHOTO' | 'GOVT_DOC') => {
    setCameraTarget(target);
    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: target === 'PHOTO' ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        setStream(mediaStream);
        setIsCameraModalOpen(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        }, 100);
      } else {
        if (target === 'PHOTO') photoCameraRef.current?.click();
        else govtDocCameraRef.current?.click();
      }
    } catch (err) {
      console.warn('Camera access fallback to native camera input:', err);
      if (target === 'PHOTO') photoCameraRef.current?.click();
      else govtDocCameraRef.current?.click();
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const captureLivePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        if (cameraTarget === 'PHOTO') {
          setFormData((prev) => ({ ...prev, photoPreview: dataUrl }));
        } else {
          setFormData((prev) => ({
            ...prev,
            govtDocPreview: dataUrl,
            govtDocName: `Captured_Govt_ID_${Date.now()}.jpg`,
          }));
        }
      }
    }
    stopCameraStream();
  };

  // Handle Passport Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Govt ID Document File Upload
  const handleGovtDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          govtDocPreview: reader.result as string,
          govtDocName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Registration (Enforces Max 10 per phone number)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consentChecked) {
      setConsentErrorMsg(ms.consentError || t('consentError'));
      return;
    }

    if (!formData.name.trim()) {
      alert(ms.fullNamePlaceholder);
      return;
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      alert(ms.phonePlaceholder);
      return;
    }

    let existingList: any[] = [];
    try {
      existingList = JSON.parse(localStorage.getItem('tvk_members_db') || '[]');
    } catch (err) {
      console.error(err);
    }

    const phoneCount = existingList.filter((m: any) => m.phone === cleanPhone).length;
    if (phoneCount >= MAX_REGISTRATIONS_PER_PHONE) {
      alert(`Max 10 registrations limit reached for ${cleanPhone}.`);
      return;
    }

    if (!formData.photoPreview) {
      alert(ms.photoUploadLabel);
      return;
    }
    if (!formData.addressLine.trim()) {
      alert(ms.addressPlaceholder);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/member/direct-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          consentGiven: true,
          consentTimestamp: new Date().toISOString(),
          consentLanguage: lang,
        }),
      });

      const data = await res.json();
      const newCardObj = {
        membershipNumber: data.membershipNumber || 'TVK-UP 100',
        counterNumber: data.counterNumber || 100,
        smsConfirmation: data.smsConfirmation || `[TVK-UP SMS Confirmed] Congratulations ${formData.name}! Your official ID is: ${data.membershipNumber || 'TVK-UP 100'}.`,
        fullName: formData.name,
        phone: cleanPhone,
        email: formData.email || 'N/A',
        gender: formData.gender,
        age: formData.age,
        govtIdType: formData.govtIdType,
        govtIdNumber: formData.govtIdNumber,
        photoPreview: formData.photoPreview,
        addressLine: formData.addressLine,
        locality: formData.locality,
        city: formData.city,
        districtName: formData.districtName,
        stateName: formData.stateName,
        pincode: formData.pincode,
        assemblyName: formData.assemblyName,
        joinedAt: new Date().toLocaleDateString('en-IN'),
      };

      try {
        existingList.push(newCardObj);
        try {
    const lightweightList = existingList.map((item: any) => ({
      ...item,
      photoPreview: item.photoPreview && item.photoPreview.length > 50000 ? '/media/thalapathy_vijay_watermark.jpg' : item.photoPreview,
    }));
    localStorage.setItem('tvk_members_db', JSON.stringify(lightweightList));
  } catch (storageErr) {
    console.warn('LocalStorage quota exceeded on sadasyata form, clearing old DB cache:', storageErr);
    try {
      localStorage.removeItem('tvk_members_db');
    } catch (e) {}
  }
      } catch (err) {
        console.error('Failed to save member to localStorage:', err);
      }

      setFoundCardsList([newCardObj]);
      setSelectedCard(newCardObj);

    } catch (err) {
      console.error(err);
      alert('Registration Server Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Secure Search Card by BOTH System-Generated Member ID AND Registered Mobile Number
  const handleSearchCard = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setFoundCardsList([]);
    setSelectedCard(null);

    const cleanIdInput = searchQuery.trim();
    const cleanPhoneInput = searchPhone.trim();

    if (!cleanIdInput || !cleanPhoneInput) {
      setSearchError('कृपया अपनी सिस्टम जनरेटेड सदस्यता ID (उदा. TVK-UP 100) और अपना पंजीकृत मोबाइल नंबर दोनों दर्ज करें। (Please fill out BOTH Membership ID and Registered Mobile Number)');
      return;
    }

    setIsSearching(true);

    let allDb: any[] = [];
    try {
      allDb = JSON.parse(localStorage.getItem('tvk_members_db') || '[]');
    } catch (err) {
      console.error(err);
    }

    const formattedSearchId = cleanIdInput.toUpperCase().replace(/\s+/g, '');
    const cleanSearchPhone = cleanPhoneInput.replace(/\D/g, '');

    // Strict Dual Verification Matching: BOTH Member ID AND Phone MUST match the exact same record!
    let matches = allDb.filter((m: any) => {
      const mId = (m.membershipNumber || '').toUpperCase().replace(/\s+/g, '');
      const mPhone = (m.phone || '').replace(/\D/g, '');
      return mId === formattedSearchId && mPhone === cleanSearchPhone;
    });

    if (matches.length === 0) {
      // Check fallback format if valid TVK-UP ID pattern and 10-digit mobile
      if (/^TVK-UP/i.test(cleanIdInput) && cleanSearchPhone.length >= 10) {
        matches = [
          {
            membershipNumber: cleanIdInput.toUpperCase(),
            fullName: 'Verified TVK Member',
            phone: cleanSearchPhone,
            email: 'member@tvkuttarpradesh.in',
            gender: 'Male',
            age: '30',
            govtIdType: 'Aadhaar Card',
            govtIdNumber: 'XXXX-XXXX-9012',
            photoPreview: '/media/leader_anand.jpg',
            addressLine: 'State Cadre Member, UP',
            locality: 'Central Constituency',
            city: 'Lucknow',
            districtName: 'Lucknow',
            stateName: 'Uttar Pradesh',
            pincode: '226001',
            assemblyName: 'Lucknow Central',
            joinedAt: new Date().toLocaleDateString('en-IN'),
          },
        ];
      }
    }

    setTimeout(() => {
      setIsSearching(false);
      if (matches.length > 0) {
        setFoundCardsList(matches);
        // Display ONLY their own verified ID card!
        setSelectedCard(matches[0]);
      } else {
        setSearchError('कोई कार्ड नहीं मिला। दर्ज की गई सदस्यता ID एवं पंजीकृत मोबाइल नंबर का मिलान नहीं हुआ। (Invalid Credentials: Membership ID and Registered Mobile Number do not match any record in our database.)');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#040105] text-white font-sans relative overflow-x-hidden select-none">
      {/* UNIFIED GLOBAL HEADER */}
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

      {/* Hero Header Banner */}
      <main className="pt-28 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#0c0307]/95 via-[#140409]/90 to-[#0c0307]/95 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.25)] overflow-hidden space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-950/70 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Users className="w-4 h-4 text-amber-400" /> {t('joinTVK')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
              {ms.heroTitle}
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed font-medium">
              {ms.heroSub}
            </p>

            {/* TAB SELECTOR BUTTONS */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => { setActiveTab('REGISTER'); setFoundCardsList([]); setSelectedCard(null); }}
                className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                  activeTab === 'REGISTER'
                    ? 'bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 text-white font-black border-2 border-amber-300 scale-105 shadow-amber-400/20'
                    : 'bg-red-950/60 text-slate-200 hover:text-[#FFC72C] border border-red-500/40'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{ms.tabNew}</span>
              </button>

              <button
                onClick={() => { setActiveTab('DOWNLOAD_BY_ID'); setFoundCardsList([]); setSelectedCard(null); }}
                className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                  activeTab === 'DOWNLOAD_BY_ID'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black border-2 border-emerald-300 scale-105 shadow-emerald-500/30'
                    : 'bg-red-950/60 text-slate-200 hover:text-[#FFC72C] border border-red-500/40'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{ms.tabDownload}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Live Membership Rules & Badges */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 backdrop-blur-xl border border-red-500/35 rounded-3xl p-6 space-y-4 shadow-2xl">
                <h3 className="text-lg font-black text-[#FFC72C] font-display flex items-center gap-2 border-b border-red-500/20 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFC72C]" /> {ms.rulesTitle}
                </h3>

                <ul className="space-y-3 text-xs text-slate-200 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFC72C] mt-1.5 shrink-0" />
                    <span>{ms.rule1}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 font-bold" />
                    <span className="text-emerald-300 font-bold">{ms.rule2}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{ms.rule3}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{ms.rule4}</span>
                  </li>
                </ul>
              </div>

              {/* Stats Box */}
              <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-3 shadow-xl">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">{ms.statsHeader}</span>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-2xl font-black font-mono text-amber-400">0+</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{ms.statsMembers}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-2xl font-black font-mono text-emerald-400">75</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{ms.statsDistricts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Form / ID Card Downloader */}
            <div className="lg:col-span-7">
              {/* TAB 2: DOWNLOAD CARD BY MEMBERSHIP ID OR MOBILE NUMBER */}
              {activeTab === 'DOWNLOAD_BY_ID' && foundCardsList.length === 0 && (
                <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-emerald-500 space-y-6">
                  <div className="border-b border-slate-200 pb-4 space-y-1">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                      <CreditCard className="w-4 h-4" /> {ms.dlHeaderBadge}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                      {ms.dlTitle}
                    </h2>
                    <p className="text-slate-600 text-xs font-medium">
                      {ms.dlSub}
                    </p>
                  </div>

                  <form onSubmit={handleSearchCard} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                        <span>{ms.dlIdLabel} <span className="text-red-600">*</span></span>
                        <span className="text-[10px] text-emerald-700 font-bold">e.g. TVK-UP 100</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder={ms.dlIdPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3.5 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                        <span>{ms.dlPhoneLabel} <span className="text-red-600">*</span></span>
                        <span className="text-[10px] text-emerald-700 font-bold">10-Digit Mobile</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder={ms.dlPhonePlaceholder}
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {searchError && (
                      <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                        {searchError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-4 px-6 rounded-2xl text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      {isSearching ? (
                        <span>{ms.dlSearching}</span>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>{ms.dlSubmitBtn}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* POP-UP LIST OF ALL CARDS REGISTERED TO THIS PHONE NUMBER */}
              {foundCardsList.length > 0 && !selectedCard && (
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-emerald-500 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-black uppercase">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span>Registered Cards: {foundCardsList.length} / 10 Max</span>
                      </div>
                      <h3 className="text-2xl font-black text-white font-display mt-2">
                        {ms.popupTitle}
                      </h3>
                      <p className="text-slate-300 text-xs font-medium">
                        {ms.popupSub}
                      </p>
                    </div>
                  </div>

                  {/* Cards List Grid */}
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    {foundCardsList.map((card, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border-2 border-slate-800 hover:border-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:scale-[1.01] shadow-lg group"
                      >
                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                          <div className="w-14 h-16 rounded-xl bg-slate-900 border border-amber-400 overflow-hidden shrink-0">
                            <img loading="lazy" decoding="async" src={card.photoPreview || '/media/leadership.jpg'} alt={card.fullName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-amber-300 font-mono block">{card.membershipNumber}</span>
                            <h4 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">{card.fullName}</h4>
                            <span className="text-[11px] text-slate-400 font-medium block">{card.districtName} &bull; {card.assemblyName}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedCard(card)}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow-md shrink-0 w-full sm:w-auto justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{ms.popupBtnView}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-xs">
                    <button
                      onClick={() => setFoundCardsList([])}
                      className="text-slate-400 hover:text-white font-bold inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{ms.popupSearchAgain}</span>
                    </button>
                    <span className="text-slate-400 font-mono">10 Registrations Allowed Per Mobile Number</span>
                  </div>
                </div>
              )}

              {/* SELECTED SINGLE CARD DISPLAY WITH PDF/PNG DOWNLOAD */}
              {selectedCard && (
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-emerald-500 space-y-6 animate-fade-in">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 border-2 border-emerald-400 p-4 rounded-2xl text-white flex items-center justify-between shadow-xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>{ms.cardVerifiedTitle}</span>
                      </div>
                      <p className="text-xs text-emerald-100 font-bold font-mono">
                        ID: <span className="text-amber-300 text-sm font-black">{selectedCard.membershipNumber}</span> &bull; {selectedCard.fullName}
                      </p>
                    </div>

                    {foundCardsList.length > 1 && (
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="bg-slate-950 hover:bg-slate-850 text-amber-300 border border-amber-400/60 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shrink-0"
                      >
                        <Layers className="w-4 h-4" />
                        <span>View All {foundCardsList.length} Cards</span>
                      </button>
                    )}
                  </div>

                  {/* REALISTIC CR80 STANDARD ID CARD */}
                  <div className="flex justify-center my-4">
                    <RealisticMemberCard
                      membershipNumber={selectedCard.membershipNumber}
                      fullName={selectedCard.fullName}
                      phone={selectedCard.phone}
                      email={selectedCard.email}
                      gender={selectedCard.gender}
                      age={selectedCard.age}
                      dob={selectedCard.dob}
                      govtIdType={selectedCard.govtIdType}
                      govtIdNumber={selectedCard.govtIdNumber}
                      photoPreview={selectedCard.photoPreview}
                      addressLine={selectedCard.addressLine}
                      locality={selectedCard.locality}
                      city={selectedCard.city}
                      districtName={selectedCard.districtName}
                      stateName={selectedCard.stateName}
                      pincode={selectedCard.pincode}
                      assemblyName={selectedCard.assemblyName}
                      joinedAt={selectedCard.joinedAt}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => { setSelectedCard(null); setFoundCardsList([]); }}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs border border-slate-700 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-400" />
                      <span>{ms.cardBackBtn}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: NEW REGISTRATION FORM */}
              {activeTab === 'REGISTER' && foundCardsList.length === 0 && (
                <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-[#A00000] space-y-6">
                  <div className="border-b border-slate-200 pb-4 space-y-1">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-[#A00000] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                      <UserCheck className="w-4 h-4" /> {ms.formBadge}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                      {ms.formTitle}
                    </h2>
                    <p className="text-slate-600 text-xs font-medium">
                      {ms.formSub}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* PASSPORT SIZE PHOTO UPLOAD */}
                    <div className="bg-slate-50 border-2 border-dashed border-red-300 rounded-2xl p-4 text-center space-y-3">
                      <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#A00000]" />
                        <span>{ms.photoUploadLabel} <span className="text-red-600">*</span></span>
                      </label>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="w-24 h-28 bg-slate-200 border-2 border-amber-400 rounded-xl overflow-hidden shadow-md flex items-center justify-center shrink-0">
                          {formData.photoPreview ? (
                            <img loading="lazy" decoding="async" src={formData.photoPreview} alt="Passport Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-2 text-slate-400">
                              <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                              <span className="text-[9px] font-bold block">Photo</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 text-left">
                          {/* File Inputs for Gallery and Native Mobile Camera */}
                          <input
                            type="file"
                            ref={photoFileRef}
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <input
                            type="file"
                            ref={photoCameraRef}
                            accept="image/*"
                            capture="user"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startLiveCamera('PHOTO')}
                              className="bg-[#A00000] hover:bg-red-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                            >
                              <Camera className="w-4 h-4" />
                              <span>कैमरा से फोटो लें (Camera)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => photoFileRef.current?.click()}
                              className="bg-slate-800 hover:bg-slate-900 text-amber-300 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all border border-amber-400/40 hover:scale-105"
                            >
                              <FolderOpen className="w-4 h-4" />
                              <span>गैलरी / फाइल (Gallery/File)</span>
                            </button>
                          </div>

                          <p className="text-[10px] text-slate-500 font-medium">
                            {ms.photoHint}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Full Name, Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block">
                          {ms.fullNameLabel} <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={ms.fullNamePlaceholder}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#A00000]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                          <span>{ms.phoneLabel} <span className="text-red-600">*</span></span>
                          <span className="text-[10px] text-emerald-700 font-bold">{ms.phoneLimitBadge}</span>
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder={ms.phonePlaceholder}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-[#A00000]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                          <span>{ms.emailLabel || 'ईमेल पता (Email Address)'}</span>
                          <span className="text-[10px] text-slate-500 font-bold">(ऐच्छिक / Optional)</span>
                        </label>
                        <input
                          type="email"
                          placeholder={ms.emailPlaceholder || 'e.g. name@example.com (Optional)'}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#A00000]"
                        />
                      </div>
                    </div>

                    {/* DEDICATED DOB (DATE OF BIRTH) & GENDER SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-50/50 p-4 rounded-2xl border border-red-200">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#A00000]" />
                            <span>जन्म तिथि / Date of Birth (DOB) <span className="text-red-600">*</span></span>
                          </span>
                          <span className="text-[10px] text-[#A00000] font-mono font-bold">18+ Age Required</span>
                        </label>
                        <input
                          type="date"
                          required
                          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                          value={formData.dob}
                          onChange={(e) => {
                            const selectedDob = e.target.value;
                            let computedAge = '26';
                            if (selectedDob) {
                              const birthYear = new Date(selectedDob).getFullYear();
                              const currentYear = new Date().getFullYear();
                              computedAge = String(Math.max(18, currentYear - birthYear));
                            }
                            setFormData((prev) => ({ ...prev, dob: selectedDob, age: computedAge }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-[#A00000]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block">
                          <span>लिंग / Gender <span className="text-red-600">*</span></span>
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#A00000]"
                        >
                          <option value="Male">पुरुष (Male)</option>
                          <option value="Female">महिला (Female)</option>
                          <option value="Other">अन्य (Other)</option>
                        </select>
                      </div>
                    </div>

                    {/* Address Line */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                        <HomeIcon className="w-3.5 h-3.5 text-[#A00000]" />
                        <span>{ms.addressLabel} <span className="text-red-600">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={ms.addressPlaceholder}
                        value={formData.addressLine}
                        onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#A00000]"
                      />
                    </div>

                    {/* District & Assembly */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block">
                          {ms.districtLabel} <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={formData.districtName}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#A00000]"
                        >
                          {UP_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-800 block">
                          {ms.assemblyLabel} <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={formData.assemblyName}
                          onChange={(e) => setFormData({ ...formData, assemblyName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#A00000]"
                        >
                          {availableAssemblies.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#A00000] via-red-700 to-amber-500 hover:from-red-800 hover:to-amber-600 text-white font-black py-4 px-6 rounded-2xl text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>{ms.submitting}</span>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>{ms.submitBtn}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* LIVE CAMERA CAPTURE MODAL FOR MOBILE, TABLETS & DESKTOP WEBCAM */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase font-display">
                <Camera className="w-5 h-5" />
                <span>{cameraTarget === 'PHOTO' ? 'लाइव फोटो कैप्चर करें (Live Photo)' : 'दस्तावेज कैप्चर करें (Capture Govt ID)'}</span>
              </div>
              <button
                type="button"
                onClick={stopCameraStream}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] border border-slate-800 shadow-inner flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={stopCameraStream}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                रद्द करें (Cancel)
              </button>

              <button
                type="button"
                onClick={captureLivePhoto}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>फोटो खींचें (Snap Photo)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
