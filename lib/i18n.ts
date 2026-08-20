export type LanguageCode = 'HI' | 'EN' | 'TA' | 'TE' | 'KN' | 'ML' | 'MR';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const LanguageOptions: LanguageOption[] = [
  { code: 'HI', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'EN', label: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'TA', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'TE', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'KN', label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ML', label: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'MR', label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  HI: {
    home: 'होम',
    about: 'हमारे बारे में',
    leader: 'नेतृत्व',
    org: 'संगठन',
    districts: 'जनपद',
    news: 'समाचार',
    events: 'कार्यक्रम',
    gallery: 'गैलरी',
    membership: 'सदस्यता',
    contact: 'संपर्क',
    joinTVK: 'TVK-UP से जुड़ें',
    verifyMembership: 'सदस्यता सत्यापित करें',
    onlineMembership: 'ऑनलाइन सदस्यता लें',
    checkId: 'अपना सदस्यता ID जाँचें',

    motto: 'जन सेवा • जन अधिकार • जन सम्मान',
    titleMain: 'टीवीके',
    titleSub: 'उत्तर प्रदेश',
    heroDesc: 'समाज के अंतिम व्यक्ति के उत्थान और स्वाभिमानी, सशक्त एवं समृद्ध उत्तर प्रदेश के निर्माण हेतु हमारा संकल्प, हमारा संगठन, हमारा परिवार।',
    scrollDown: 'नीचे देखें',

    totalMembersUP: 'उत्तर प्रदेश में कुल सदस्य',
    activeMembers: 'सक्रिय सदस्य',
    totalDistricts: 'कुल जनपद',
    totalAssemblies: 'कुल विधानसभा',
    verifiedBooths: 'सत्यापित बूथ',
    liveCountNotice: 'लाइव पंजीकृत सदस्य (TVK-UP 100 सीरीज से शुरू)',

    smsTitle: 'एसएमएस टेक्स्ट पुष्टि (SMS Text Confirmation)',
    smsMessagePrefix: 'अभिनंदन! आपकी टीवीके सदस्यता सक्रिय है। आपकी आधिकारिक आईडी है:',
    smsNotice: 'आपके पंजीकृत मोबाइल नंबर पर एसएमएस संदेश भेजा गया है।',

    introBadge: 'संगठन परिचय',
    introTitle: 'टीवीके उत्तर प्रदेश: समर्पित जनसेवा एवं सशक्त संगठन',
    introDesc: 'तमिलग वेत्रि कषगम (TVK) उत्तर प्रदेश में पारदर्शी, कल्याणकारी एवं धर्मनिरपेक्ष राजनीति के संकल्प के साथ आगे बढ़ रहा है।',
    readMore: 'और जानें',
    stateRallyTitle: 'राज्यस्तरीय जन सम्मेलन',
    stateRallySub: 'धर्मनिरपेक्ष सामाजिक न्याय का आह्वान',

    orgBadge: 'सुव्यवस्थित कार्यप्रणाली',
    orgTitle: 'हमारा संगठन',
    orgDesc: 'एक सशक्त संगठन, जनभागीदारी और सुव्यवस्थित कार्यप्रणाली के साथ उत्तर प्रदेश के हर जनपद में सक्रिय।',
    viewAllOrg: 'संपूर्ण संगठन देखें',
    viewCompleteStructure: 'संपूर्ण संगठन देखें',

    orgCard1Title: 'जनपद संगठन',
    orgCard1Sub: '75 जनपद संगठन समिति',
    orgCard1Desc: 'समस्त जनपदों में संगठनात्मक इकाइयाँ',

    orgCard2Title: 'विधानसभा संगठन',
    orgCard2Sub: '403 विधानसभा क्षेत्र',
    orgCard2Desc: 'विधानसभा स्तर पर जनसंपर्क एवं कार्य',

    orgCard3Title: 'मंडल संगठन',
    orgCard3Sub: '18 मंडल स्तरीय निकाय',
    orgCard3Desc: 'मंडलीय समीक्षा एवं प्रबंधन',

    orgCard4Title: 'मोर्चा एवं प्रकोष्ठ',
    orgCard4Sub: 'युवा, महिला, किसान मोर्चा',
    orgCard4Desc: 'विशिष्ट सामाजिक वर्गों का प्रतिनिधित्व',

    orgCard5Title: 'विभाग एवं प्रभाग',
    orgCard5Sub: 'आईटी, मीडिया, कानून सेल',
    orgCard5Desc: 'तकनीकी एवं प्रशासनिक संचालन',

    orgCard6Title: 'सदस्यता अभियान',
    orgCard6Sub: 'घर-घर पहुँच, डिजिटल जुड़ाव',
    orgCard6Desc: 'पारदर्शी एवं सत्यापन योग्य सदस्यता',

    districtBadge: 'उत्तर प्रदेश में हमारा संगठन',
    districtTitle: 'जनपद-वार संगठन एवं सक्रिय सदस्य',
    districtDesc: 'उत्तर प्रदेश के 75 जनपदों में टीवीके डिजिटल संगठन की स्थिति देखें।',
    selectDistrict: 'जनपद चुनें',
    activeDistrict: 'सक्रिय जनपद',
    districtDetails: 'संगठनात्मक विवरण एवं गतिविधियाँ',
    viewAllDistricts: 'संपूर्ण जनपद सूची देखें',

    stepBadge: 'सदस्यता प्रक्रिया',
    stepTitle: 'टीवीके-यूपी परिवार का हिस्सा बनें',
    stepDesc: 'डिजिटल सदस्यता के माध्यम से केवल 3 सरल चरणों में संगठन से जुड़ें।',
    step1Title: '01 आवेदन करें',
    step1Desc: 'अपना विवरण दर्ज करें और टीवीके-यूपी 100 सीरीज आईडी प्राप्त करें।',
    step2Title: '02 जानकारी सत्यापित करें',
    step2Desc: 'सरकारी पहचान-पत्र एवं फोटो दर्ज करके प्रोफाइल पूर्ण करें।',
    step3Title: '03 डिजिटल कार्ड प्राप्त करें',
    step3Desc: 'अद्वितीय क्यूआर कोड युक्त डिजिटल पहचान-पत्र डाउनलोड करें।',
    joinNow: 'अभी सदस्य बनें',

    cardBadge: 'आपकी डिजिटल सदस्यता पहचान',
    cardTitle: 'डिजिटल सदस्यता पहचान-पत्र',
    cardDesc: 'सदस्यता स्वीकृत होने के बाद आपका डिजिटल सदस्यता पहचान-पत्र स्वतः तैयार किया जाएगा।',
    feat1: 'अद्वितीय सदस्यता क्रमांक (TVK-UP 100+)',
    feat2: 'क्यूआर सत्यापन प्रणाली',
    feat3: 'डिजिटल पहचान-पत्र (CR80 Standard)',
    feat4: 'सुरक्षित सदस्य डैशबोर्ड',
    learnMembership: 'सदस्यता के बारे में जानें',

    qrBadge: 'त्वरित सत्यापन प्रणाली',
    qrTitle: 'सदस्यता सत्यापित करें',
    qrDesc: 'सदस्यता पहचान-पत्र पर दिए गए क्यूआर कोड या सदस्यता आईडी दर्ज करके स्थिति सत्यापित करें।',
    enterId: 'सदस्यता क्रमांक दर्ज करें (उदा. TVK-UP 100)',
    verifying: 'सत्यापित हो रहा है...',
    verifyBtn: 'सत्यापित करें',

    leadershipBadge: 'शीर्ष नेतृत्व',
    leadershipTitle: 'नेतृत्व एवं मार्गदर्शन',
    viewAllBearers: 'सभी पदाधिकारी देखें',

    newsBadge: 'ताजा अपडेट',
    newsTitle: 'समाचार एवं घोषणाएँ',
    viewAllNews: 'सभी समाचार देखें',

    galleryBadge: 'फोटो एवं मीडिया गैलरी',
    galleryTitle: 'गैलरी एवं झलकियाँ',

    finalCtaTitle: 'टीवीके-यूपी परिवार से जुड़ें (Join TVK-UP Today)',
    finalCtaDesc: 'उत्तर प्रदेश के स्वर्णिम भविष्य के निर्माण में अपनी सहभागिता दर्ज करें। अभी डिजिटल सदस्यता लें।',

    aboutTitle: 'तमिलग वेत्रि कषगम (TVK) के बारे में',
    aboutSub: 'धर्मनिरपेक्ष सामाजिक न्याय, लोक कल्याण और पारदर्शी शासन का प्रतीक',
    aboutDesc: 'तमिलग वेत्रि कषगम (TVK) का गठन 2 फ़रवरी 2024 को पार्टी संस्थापक सी. जोसेफ विजय द्वारा किया गया।',

    leaderTitle: 'हमारे नेता: सी. जोसेफ विजय',
    leaderRole: 'संस्थापक एवं अध्यक्ष, तमिलग वेत्रि कषगम',
    leaderBio: 'हमारे नेता की यात्रा बाधाओं को सीढ़ियों में बदलने की कहानी है। 1992 से सामाजिक सेवा, विजय मक्कल इयक्कम और अब टीवीके।',

    historyTitle: 'पार्टी का इतिहास एवं मील के पत्थर',
    historySub: '1992 के सामाजिक सेवा आंदोलन से 2026 की ऐतिहासिक चुनावी विजय तक',

    ideologyTitle: 'विचारधारा एवं सिद्धांत',
    ideologySub: 'பிறப்பொக்கும் எல்லா உயிர்க்கும் - जन्म से सभी जीव समान हैं',
    ideologyDesc: 'डॉ. बी.आर. अंबेडकर, तंतै पेरियार, के. कामराज के आदर्शों पर आधारित।',

    electionsTitle: 'चुनावी प्रदर्शन एवं जनादेश',
    electionsSub: '2026 विधानसभा चुनाव में 108 सीटों पर ऐतिहासिक विजय',

    wingsTitle: 'मोर्चा एवं प्रकोष्ठ',
    wingsSub: 'युवा, महिला, छात्र, किसान एवं आईटी सेल संगठन',

    footerRights: 'सर्वाधिकार सुरक्षित। तमिलग वेत्रि कषगम (TVK उत्तर प्रदेश)।',
  },

  EN: {
    home: 'Home',
    about: 'About Us',
    leader: 'Leadership',
    org: 'Organisation',
    districts: 'Districts',
    news: 'News',
    events: 'Events',
    gallery: 'Gallery',
    membership: 'Membership',
    contact: 'Contact',
    joinTVK: 'Join TVK-UP',
    verifyMembership: 'Verify Membership',
    onlineMembership: 'Online Membership',
    checkId: 'Check Your Member ID',

    motto: 'People Service • People Rights • People Respect',
    titleMain: 'TVK',
    titleSub: 'UTTAR PRADESH',
    heroDesc: 'Our pledge, our organization, and our family for the empowerment of every citizen and the construction of a prosperous Uttar Pradesh.',
    scrollDown: 'Scroll Down',

    totalMembersUP: 'Total Members in UP',
    activeMembers: 'Active Members',
    totalDistricts: 'Total Districts',
    totalAssemblies: 'Total Assemblies',
    verifiedBooths: 'Verified Booths',
    liveCountNotice: 'Live Registered Members (Starting from TVK-UP 100 series)',

    smsTitle: 'SMS Text Confirmation',
    smsMessagePrefix: 'Congratulations! Your TVK Membership is Active. Your official ID is:',
    smsNotice: 'An SMS confirmation message has been sent to your registered mobile number.',

    introBadge: 'Organization Overview',
    introTitle: 'TVK Uttar Pradesh: Dedicated Public Service & Strong Leadership',
    introDesc: 'Tamilaga Vettri Kazhagam (TVK) is advancing in Uttar Pradesh with transparent, welfare-oriented, and secular political leadership.',
    readMore: 'Read More',
    stateRallyTitle: 'State Level Convention',
    stateRallySub: 'Call for Secular Social Justice',

    orgBadge: 'Systematic Operations',
    orgTitle: 'Our Organisation Structure',
    orgDesc: 'A powerful organization active across every district of Uttar Pradesh with public participation and systematic operations.',
    viewAllOrg: 'View Complete Structure',
    viewCompleteStructure: 'View Complete Structure',

    orgCard1Title: 'District Units',
    orgCard1Sub: '75 District Committees',
    orgCard1Desc: 'Organizational units operational across all districts',

    orgCard2Title: 'Assembly Units',
    orgCard2Sub: '403 Assembly Constituencies',
    orgCard2Desc: 'Public outreach & operations at assembly level',

    orgCard3Title: 'Divisional Bodies',
    orgCard3Sub: '18 Divisional Bodies',
    orgCard3Desc: 'Divisional review & strategic management',

    orgCard4Title: 'Wings & Fronts',
    orgCard4Sub: 'Youth, Women, Farmers Fronts',
    orgCard4Desc: 'Representation for specialized social sectors',

    orgCard5Title: 'Departments & Cells',
    orgCard5Sub: 'IT, Media, Legal Cells',
    orgCard5Desc: 'Technical & administrative operations',

    orgCard6Title: 'Membership Drive',
    orgCard6Sub: 'Door-to-door, Digital Engagement',
    orgCard6Desc: 'Transparent & verifiable digital membership',

    districtBadge: 'Our Presence in UP',
    districtTitle: 'District-Wise Organisation & Active Members',
    districtDesc: 'Explore TVK digital organization footprint across all 75 districts of Uttar Pradesh.',
    selectDistrict: 'Select District',
    activeDistrict: 'Active District',
    districtDetails: 'Organizational Metrics & Activities',
    viewAllDistricts: 'View Full District List',

    stepBadge: 'Membership Process',
    stepTitle: 'Join the TVK Family',
    stepDesc: 'Become part of TVK digital membership in just 3 simple steps.',
    step1Title: '01 Fill Application',
    step1Desc: 'Enter your details and receive your assigned TVK-UP 100 series ID.',
    step2Title: '02 Verify Identity',
    step2Desc: 'Upload valid Government ID and passport photo to complete profile.',
    step3Title: '03 Get Digital Card',
    step3Desc: 'Download your digital membership ID card embedded with scannable QR.',
    joinNow: 'Join Now',

    cardBadge: 'Your Digital Membership Credentials',
    cardTitle: 'Digital Membership ID Card',
    cardDesc: 'Your digital membership ID card is generated instantly upon verification.',
    feat1: 'Unique Membership ID (TVK-UP 100+)',
    feat2: 'Scannable QR Verification System',
    feat3: 'CR80 Standard Digital ID Card',
    feat4: 'Secure Member Credentials',
    learnMembership: 'Learn About Membership',

    qrBadge: 'Instant Verification System',
    qrTitle: 'Verify Member Credentials',
    qrDesc: 'Enter Member ID or scan QR code on card to verify official membership status.',
    enterId: 'Enter Membership ID (e.g. TVK-UP 100)',
    verifying: 'Verifying Credentials...',
    verifyBtn: 'Verify Status',

    leadershipBadge: 'Central Leadership',
    leadershipTitle: 'Leadership & Vision',
    viewAllBearers: 'View All Bearers',

    newsBadge: 'Latest Updates',
    newsTitle: 'News & Announcements',
    viewAllNews: 'View All News',

    galleryBadge: 'Photo & Media Gallery',
    galleryTitle: 'Gallery Highlights',

    finalCtaTitle: 'Join TVK-UP Today',
    finalCtaDesc: 'Contribute to building a bright and prosperous future for Uttar Pradesh.',

    aboutTitle: 'About Tamilaga Vettri Kazhagam (TVK)',
    aboutSub: 'Beacon of Secular Social Justice, Public Welfare & Transparent Governance',
    aboutDesc: 'Tamilaga Vettri Kazhagam (TVK) was founded on February 2, 2024 by Party Founder C. Joseph Vijay.',

    leaderTitle: 'Our Leader: C. Joseph Vijay',
    leaderRole: 'Founder & President, TVK',
    leaderBio: 'Our leader’s journey is an inspiration of transforming challenges into milestones. Dedicated to public service since 1992.',

    historyTitle: 'Party History & Milestones',
    historySub: 'From 1992 Social Movement to 2026 Mandate',

    ideologyTitle: 'Ideology & Principles',
    ideologySub: 'Pirappokkum Ella Uyirkkum - All Human Beings Are Equal by Birth',
    ideologyDesc: 'Rooted in the philosophies of Dr. B.R. Ambedkar, Thanthai Periyar, and K. Kamaraj.',

    electionsTitle: 'Electoral Performance & Mandate',
    electionsSub: 'Historic Mandate in 2026 Assembly Elections',

    wingsTitle: 'Fronts & Wings',
    wingsSub: 'Youth, Women, Student, Farmer & IT Wings',

    footerRights: 'All Rights Reserved. Tamilaga Vettri Kazhagam (TVK Uttar Pradesh).',
  },

  TA: {
    home: 'முகப்பு',
    about: 'எங்களைப் பற்றி',
    leader: 'தலைமை',
    org: 'அமைப்பு',
    districts: 'மாவட்டங்கள்',
    news: 'செய்திகள்',
    events: 'நிகழ்வுகள்',
    gallery: 'கேலரி',
    membership: 'உறுப்பினர் சேர்க்கை',
    contact: 'தொடர்பு',
    joinTVK: 'TVK-வில் இணையுங்கள்',
    verifyMembership: 'உறுப்பினர் சான்றிதழ் சரிபார்ப்பு',
    onlineMembership: 'ஆன்லைன் உறுப்பினர் சேர்ப்பு',
    checkId: 'உறுப்பினர் ID சரிபார்க்கவும்',

    motto: 'மக்கள் சேவை • மக்கள் உரிமை • மக்கள் மரியாதை',
    titleMain: 'TVK',
    titleSub: 'உத்தரப் பிரதேசம்',
    heroDesc: 'உத்தரப் பிரதேசத்தின் ஒவ்வொரு குடிமக்களின் நல்வாழ்வுக்கும் வளர்ச்சிக்கும் நமது வாக்குறுதி.',
    scrollDown: 'கீழே பார்க்கவும்',

    totalMembersUP: 'மொத்த உறுப்பினர்கள்',
    activeMembers: 'செயல்பாட்டு உறுப்பினர்கள்',
    totalDistricts: 'மொத்த மாவட்டங்கள்',
    totalAssemblies: 'மொத்த தொகுதிகள்',
    verifiedBooths: 'சரிபார்க்கப்பட்ட வாக்குச்சாவடிகள்',
    liveCountNotice: 'நேரலை உறுப்பினர் எண்ணிக்கை (TVK-UP 100 தொடர்)',

    smsTitle: 'எஸ்எம்எஸ் உறுதிப்படுத்தல்',
    smsMessagePrefix: 'வாழ்த்துகள்! உங்கள் TVK உறுப்பினர் சேர்க்கை உறுதி செய்யப்பட்டது. உங்கள் ID:',
    smsNotice: 'உங்கள் மொபைல் எண்ணிற்கு குறுஞ்செய்தி அனுப்பப்பட்டுள்ளது.',

    introBadge: 'கட்சி அறிமுகம்',
    introTitle: 'TVK உத்தரப் பிரதேசம்: மக்கள் சேவை மற்றும் வலிமையான தலைமை',
    introDesc: 'தமிழக வெற்றிக் கழகம் உத்தரப் பிரதேசத்தில் வெளிப்படையான, நலன்புரி மற்றும் மதச்சார்பற்ற அரசியலை முன்னெடுக்கிறது.',
    readMore: 'மேலும் படிக்க',
    stateRallyTitle: 'மாநில அளவிலான மாநாடு',
    stateRallySub: 'சமூக நீதி மற்றும் சமத்துவ முழக்கம்',

    orgBadge: 'முறையான கட்டமைப்பு',
    orgTitle: 'நமது கட்சி அமைப்பு',
    orgDesc: 'உத்தரப் பிரதேசத்தின் அனைத்து மாவட்டங்களிலும் மக்கள் பங்கேற்புடன் இயங்கும் வலிமையான அமைப்பு.',
    viewAllOrg: 'அனைத்து அமைப்பையும் காண்க',
    viewCompleteStructure: 'அனைத்து அமைப்பையும் காண்க',

    orgCard1Title: 'மாவட்ட அமைப்புகள்',
    orgCard1Sub: '75 மாவட்டக் குழுக்கள்',
    orgCard1Desc: 'அனைத்து மாவட்டங்களிலும் செயல்படும் அமைப்புகள்',

    orgCard2Title: 'தொகுதி அமைப்புகள்',
    orgCard2Sub: '403 சட்டமன்றத் தொகுதிகள்',
    orgCard2Desc: 'தொகுதி அளவிலான மக்கள் தொடர்புப் பணிகள்',

    orgCard3Title: 'மண்டல அமைப்புகள்',
    orgCard3Sub: '18 மண்டலக் குழுக்கள்',
    orgCard3Desc: 'மண்டல மேலாண்மை மற்றும் ஆய்வுகள்',

    orgCard4Title: 'அணிகள் மற்றும் பிரிவுகள்',
    orgCard4Sub: 'இளைஞர், மகளிர், விவசாயிகள் அணி',
    orgCard4Desc: 'சமூகப் பிரிவுகளுக்கான பிரதிநிதித்துவம்',

    orgCard5Title: 'தொழில்நுட்ப மற்றும் ஊடகப் பிரிவு',
    orgCard5Sub: 'ஐடி, ஊடகம், சட்டப் பிரிவு',
    orgCard5Desc: 'தொழில்நுட்பம் மற்றும் நிர்வாகச் செயல்பாடுகள்',

    orgCard6Title: 'உறுப்பினர் சேர்க்கை இயக்கம்',
    orgCard6Sub: 'வீடு வீடாகச் சேர்க்கை, டிஜிட்டல் இணைப்பு',
    orgCard6Desc: 'வெளிப்படையான மற்றும் சரிபார்க்கத்தக்க உறுப்பினர் சேர்க்கை',

    districtBadge: 'மாவட்டப் பங்களிப்பு',
    districtTitle: 'மாவட்ட வாரியாக உறுப்பினர் விபரம்',
    districtDesc: 'உத்தரப் பிரதேசத்தின் 75 மாவட்டங்களிலும் TVK டிஜிட்டல் அமைப்பின் நிலவரம்.',
    selectDistrict: 'மாவட்டம் தேர்ந்தெடுக்கவும்',
    activeDistrict: 'செயல்பாட்டு மாவட்டம்',
    districtDetails: 'அமைப்பு மற்றும் செயல்பாடுகள்',
    viewAllDistricts: 'அனைத்து மாவட்டப் பட்டியல்',

    stepBadge: 'உறுப்பினர் சேர்க்கை வழிமுறை',
    stepTitle: 'TVK குடும்பத்தில் இணையுங்கள்',
    stepDesc: 'வெறும் 3 எளிய படிகளில் டிஜிட்டல் உறுப்பினராக இணையுங்கள்.',
    step1Title: '01 விண்ணப்பிக்கவும்',
    step1Desc: 'உங்கள் விபரங்களை உள்ளிட்டு TVK-UP 100 தொடர் ID பெறவும்.',
    step2Title: '02 சரிபார்க்கவும்',
    step2Desc: 'அரசு அடையாளச் சான்று மற்றும் புகைப்படம் பதிவேற்றவும்.',
    step3Title: '03 டிஜிட்டல் கார்டு பெறவும்',
    step3Desc: 'QR குறியீட்டுடன் கூடிய டிஜிட்டல் அடையாள அட்டையைப் பதிவிறக்கவும்.',
    joinNow: 'இப்போதே இணையுங்கள்',

    cardBadge: 'டிஜிட்டல் அடையாளச் சான்று',
    cardTitle: 'டிஜிட்டல் உறுப்பினர் அடையாள அட்டை',
    cardDesc: 'உறுப்பினர் சான்று சரிபார்க்கப்பட்டதும் அடையாள அட்டை உடனடியாக உருவாக்கப்படும்.',
    feat1: 'தனித்துவ உறுப்பினர் எண் (TVK-UP 100+)',
    feat2: 'QR குறியீடு சரிபார்ப்பு முறை',
    feat3: 'CR80 தரநிலை டிஜிட்டல் கார்டு',
    feat4: 'பாதுகாப்பான உறுப்பினர் விபரம்',
    learnMembership: 'உறுப்பினர் சேர்க்கை பற்றி அறிய',

    qrBadge: 'உடனடி சரிபார்ப்பு',
    qrTitle: 'உறுப்பினர் சான்றிதழ் சரிபார்ப்பு',
    qrDesc: 'உறுப்பினர் ID அல்லது QR குறியீட்டைப் பயன்படுத்தி சான்றிதழைச் சரிபார்க்கவும்.',
    enterId: 'உறுப்பினர் ID உள்ளிடவும் (எ.கா. TVK-UP 100)',
    verifying: 'சரிபார்க்கப்படுகிறது...',
    verifyBtn: 'சரிபார்க்கவும்',

    leadershipBadge: 'தலைமைத்துவம்',
    leadershipTitle: 'தலைமை மற்றும் வழிகாட்டல்',
    viewAllBearers: 'அனைத்து நிர்வாகிகளையும் காண்க',

    newsBadge: 'செய்திகள்',
    newsTitle: 'செய்திகள் மற்றும் அறிவிப்புகள்',
    viewAllNews: 'அனைத்துச் செய்திகளையும் காண்க',

    galleryBadge: 'புகைப்பட கேலரி',
    galleryTitle: 'படங்கள் மற்றும் நிகழ்வுகள்',

    finalCtaTitle: 'TVK குடும்பத்தில் இணையுங்கள்',
    finalCtaDesc: 'உத்தரப் பிரதேசத்தின் சிறந்த எதிர்காலத்தை உருவாக்க இன்றே உறுப்பினராகுங்கள்.',

    aboutTitle: 'தமிழக வெற்றிக் கழகம் பற்றி',
    aboutSub: 'சமூக நீதி, மக்கள் நலன் மற்றும் வெளிப்படையான நிர்வாகத்தின் அடையாளம்',
    aboutDesc: 'தமிழக வெற்றிக் கழகம் பிப்ரவரி 2, 2024 அன்று தலைவர் சி. ஜோசப் விஜய் அவர்களால் தொடங்கப்பட்டது.',

    leaderTitle: 'நமது தலைவர்: சி. ஜோசப் விஜய்',
    leaderRole: 'தலைவர் மற்றும் நிறுவனர், TVK',
    leaderBio: '1992 முதல் மக்கள் சேவை மற்றும் சமூகப் பணிகளில் ஈடுபட்டு வரும் நமது தலைவரின் அரசியல் பயணம்.',

    historyTitle: 'கட்சியின் வரலாறு',
    historySub: '1992 சமூகச் சேவையிலிருந்து 2026 வெற்றிப் பயணம் வரை',

    ideologyTitle: 'கொள்கை மற்றும் கோட்பாடு',
    ideologySub: 'பிறப்பொக்கும் எல்லா உயிர்க்கும் - பிறப்பால் மனிதர்கள் அனைவரும் சமம்',
    ideologyDesc: 'டாக்டர் பி.ஆர். அம்பேத்கர், தந்தை பெரியார், பெருந்தலைவர் காமராஜர் ஆகியோரின் வழியில்.',

    electionsTitle: 'தேர்தல் வெற்றிகள்',
    electionsSub: '2026 சட்டமன்றத் தேர்தலில் மகத்தான வெற்றி',

    wingsTitle: 'அணிகள்',
    wingsSub: 'இளைஞர், மகளிர், மாணவர், விவசாயிகள் மற்றும் ஐடி அணிகள்',

    footerRights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. தமிழக வெற்றிக் கழகம் (TVK உத்தரப் பிரதேசம்).',
  },

  TE: {
    home: 'హోమ్',
    about: 'మా గురించి',
    leader: 'నాయకత్వం',
    org: 'వ్యవస్థ',
    districts: 'జిల్లాలు',
    news: 'వార్తలు',
    events: 'కార్యక్రమాలు',
    gallery: 'గ్యాలరీ',
    membership: 'సభ్యత్వం',
    contact: 'సంప్రదించండి',
    joinTVK: 'TVK లో చేరండి',
    verifyMembership: 'సభ్యత్వం ధృవీకరించండి',
    onlineMembership: 'ఆన్‌లైన్ సభ్యత్వం',
    checkId: 'మీ సభ్యత్వ ID తనిఖీ చేయండి',

    motto: 'ప్రజా సేవ • ప్రజా హక్కులు • ప్రజా గౌరవం',
    titleMain: 'TVK',
    titleSub: 'ఉత్తరప్రదేశ్',
    heroDesc: 'ఉత్తరప్రదేశ్ ప్రజల సంక్షేమం మరియు ప్రగతి కోసం మన సంకల్పం.',
    scrollDown: 'కిందకి చూడండి',

    totalMembersUP: 'మొత్తం సభ్యులు',
    activeMembers: 'క్రియాశీల సభ్యులు',
    totalDistricts: 'మొత్తం జిల్లాలు',
    totalAssemblies: 'మొత్తం నియోజకవర్గాలు',
    verifiedBooths: 'ధృవీకరించబడిన బూత్‌లు',
    liveCountNotice: 'లైవ్ సభ్యత్వ నమోదు (TVK-UP 100 సిరీస్)',

    smsTitle: 'SMS నిర్ధారణ',
    smsMessagePrefix: 'అభినందనలు! మీ TVK సభ్యత్వం క్రియాశీలంగా ఉంది. మీ అధికారిక ID:',
    smsNotice: 'మీ నమోదిత మొబైల్ సంఖ్యకు SMS పంపబడింది.',

    introBadge: 'సంస్థ పరిచయం',
    introTitle: 'TVK ఉత్తరప్రదేశ్: ప్రజా సేవ మరియు దృఢ నాయకత్వం',
    introDesc: 'తమిళగ వెట్రి కజగం ఉత్తరప్రదేశ్‌లో సుపరిపాలన మరియు లౌకిక రాజకీయాలను అందిస్తోంది.',
    readMore: 'మరిన్ని వివరాలు',
    stateRallyTitle: 'రాష్ట్ర స్థాయి మహాసభ',
    stateRallySub: 'సామాజిక న్యాయం మరియు సమానత్వ పిలుపు',

    orgBadge: 'వ్యవస్థాగత పనితీరు',
    orgTitle: 'మన వ్యవస్థాగత నిర్మాణం',
    orgDesc: 'ఉత్తరప్రదేశ్‌లోని ప్రతి జిల్లాలో ప్రజల భాగస్వామ్యంతో పనిచేస్తున్న వ్యవస్థ.',
    viewAllOrg: 'మొత్తం నిర్మాణం చూడండి',
    viewCompleteStructure: 'మొత్తం నిర్మాణం చూడండి',

    orgCard1Title: 'జిల్లా విభాగాలు',
    orgCard1Sub: '75 జిల్లా కమిటీలు',
    orgCard1Desc: 'అన్ని జిల్లాల్లో క్రియాశీల విభాగాలు',

    orgCard2Title: 'నియోజకవర్గ విభాగాలు',
    orgCard2Sub: '403 అసెంబ్లీ నియోజకవర్గాలు',
    orgCard2Desc: 'నియోజకవర్గ స్థాయిలో ప్రజా సంబంధాలు',

    orgCard3Title: 'డివిజన్ విభాగాలు',
    orgCard3Sub: '18 డివిజన్ బాడీలు',
    orgCard3Desc: 'డివిజన్ స్థాయి సమీక్షలు',

    orgCard4Title: 'విభాగాలు మరియు మోర్చాలు',
    orgCard4Sub: 'యువజన, మహిళా, రైతు మోర్చాలు',
    orgCard4Desc: 'సామాజిక వర్గాలకు ప్రాతినిధ్యం',

    orgCard5Title: 'సాంకేతిక సేవలు',
    orgCard5Sub: 'IT, మీడియా, లీగల్ సెల్స్',
    orgCard5Desc: 'సాంకేతిక మరియు నిర్వహణ సేవలు',

    orgCard6Title: 'సభ్యత్వ నమోదు సమరాయం',
    orgCard6Sub: 'ఇంటింటికీ డిజిటల్ సభ్యత్వం',
    orgCard6Desc: 'పారదర్శకమైన మరియు ధృవీకరించదగిన సభ్యత్వం',

    districtBadge: 'రాష్ట్రంలో మన ఉనికి',
    districtTitle: 'జిల్లా వారీగా సభ్యుల వివరాలు',
    districtDesc: 'ఉత్తరప్రదేశ్‌లోని 75 జిల్లాల్లో TVK డిజిటల్ నెట్‌వర్క్ వివరాలు.',
    selectDistrict: 'జిల్లా ఎంచుకోండి',
    activeDistrict: 'క్రియాశీల జిల్లా',
    districtDetails: 'వ్యవస్థాగత సమాచారం',
    viewAllDistricts: 'మొత్తం జిల్లాల జాబితా',

    stepBadge: 'సభ్యత్వ ప్రక్రియ',
    stepTitle: 'TVK కుటుంబంలో చేరండి',
    stepDesc: 'కేవలం 3 సులభమైన దశల్లో డిజిటల్ సభ్యత్వాన్ని పొందండి.',
    step1Title: '01 దరఖాస్తు చేయండి',
    step1Desc: 'మీ వివరాలను నమోదు చేసి TVK-UP 100 సిరీస్ ID పొందండి.',
    step2Title: '02 వివరాలు ధృవీకరించండి',
    step2Desc: 'ప్రభుత్వ గుర్తింపు కార్డు మరియు ఫోటో అప్‌లోడ్ చేయండి.',
    step3Title: '03 డిజిటల్ కార్డ్ పొందండి',
    step3Desc: 'QR కోడ్‌తో కూడిన డిజిటల్ సభ్యత్వ కార్డును డౌన్‌లోడ్ చేసుకోండి.',
    joinNow: 'ఇప్పుడే చేరండి',

    cardBadge: 'డిజిటల్ గుర్తింపు',
    cardTitle: 'డిజిటల్ సభ్యత్వ గుర్తింపు కార్డు',
    cardDesc: 'సభ్యత్వం ధృవీకరించబడిన వెంటనే డిజిటల్ ఐడీ కార్డ్ అందుబాటులోకి వస్తుంది.',
    feat1: 'ప్రత్యేక సభ్యత్వ సంఖ్య (TVK-UP 100+)',
    feat2: 'QR కోడ్ ధృవీకరణ వ్యవస్థ',
    feat3: 'CR80 స్టాండర్డ్ డిజిటల్ ఐడీ',
    feat4: 'భద్రపరచబడిన సభ్యత్వ వివరాలు',
    learnMembership: 'సభ్యత్వం గురించి తెలుసుకోండి',

    qrBadge: 'త్వరిత ధృవీకరణ',
    qrTitle: 'సభ్యత్వం ధృవీకరించండి',
    qrDesc: 'సభ్యత్వ ID లేదా QR కోడ్ ద్వారా గుర్తింపును తనిఖీ చేయండి.',
    enterId: 'సభ్యత్వ ID నమోదు చేయండి (ఉదా. TVK-UP 100)',
    verifying: 'ధృవీకరించబడుతోంది...',
    verifyBtn: 'ధృవీకరించండి',

    leadershipBadge: 'ముఖ్య నాయకత్వం',
    leadershipTitle: 'నాయకత్వం మరియు మార్గదర్శకత్వం',
    viewAllBearers: 'నాయకుల వివరాలు చూడండి',

    newsBadge: 'తాజా సమాచారం',
    newsTitle: 'వార్తలు మరియు ప్రకటనలు',
    viewAllNews: 'అన్ని వార్తలు చూడండి',

    galleryBadge: 'ఫోటో గ్యాలరీ',
    galleryTitle: 'చిత్రాలు మరియు విశేషాలు',

    finalCtaTitle: 'TVK కుటుంబంలో భాగస్వాములు అవ్వండి',
    finalCtaDesc: 'ఉత్తరప్రదేశ్ బంగారు భవిష్యత్తు నిర్మాణంలో మీ భాగస్వామ్యాన్ని నమోదు చేసుకోండి.',

    aboutTitle: 'తమిళగ వెట్రి కజగం గురించి',
    aboutSub: 'సామాజిక న్యాయం మరియు సుపరిపాలనకు చిహ్నం',
    aboutDesc: 'TVK పార్టీని ఫిబ్రవరి 2, 2024న అధ్యక్షుడు సి. జోసెఫ్ విజయ్ స్థాపించారు.',

    leaderTitle: 'మన నాయకుడు: సి. జోసెఫ్ విజయ్',
    leaderRole: 'అధ్యక్షుడు మరియు వ్యవస్థాపకుడు, TVK',
    leaderBio: '1992 నుండి ప్రజా సేవలో నిరంతరం నిమగ్నమైన నాయకుని ప్రస్థానం.',

    historyTitle: 'పార్టీ చరిత్ర',
    historySub: '1992 సామాజిక సేవల నుండి 2026 విజయాల వరకు',

    ideologyTitle: 'సిద్ధాంతాలు',
    ideologySub: 'జన్మతః మానవులందరూ సమానమే',
    ideologyDesc: 'డాక్టర్ బి.ఆర్. అంబేద్కర్, తంతై పెరియార్, కామరాజ్ ఆశయాల సాధన.',

    electionsTitle: 'ఎన్నికల విజయాలు',
    electionsSub: '2026 ఎన్నికల్లో చారిత్రాత్మక విజయం',

    wingsTitle: 'విభాగాలు',
    wingsSub: 'యువజన, మహిళా, విద్యార్థి, రైతు మరియు IT విభాగాలు',

    footerRights: 'అన్ని హక్కులు రక్షించబడ్డాయి. తమిళగ వెట్రి కజగం (TVK ఉత్తరప్రదేశ్).',
  },

  KN: {
    home: 'ముఖ్య పుట',
    about: 'నమ్మ గురించి',
    leader: 'నాయకత్వ',
    org: 'సంగఠనెలిన వివర',
    districts: 'జిల్ログインగళు',
    news: 'సుద్దిగళు',
    events: 'కార్యక్రమగళు',
    gallery: 'గ్యాలరి',
    membership: 'సదస్యతె',
    contact: 'సంపర్కిసి',
    joinTVK: 'TVK సీరిరి',
    verifyMembership: 'సదస్యతె ఖాతరిపడిసి',
    onlineMembership: 'ఆన్‌లైన్ సదస్యతె',
    checkId: 'సదస్యత్వ ID తపాసిసి',

    motto: 'జన సేవె • జన హక్కు • జన గౌరవ',
    titleMain: 'TVK',
    titleSub: 'ఉత్తర ప్రదేశ',
    heroDesc: 'ఉత్తర ప్రదేశద సమగ్ర అభివృద్ధిగాగి నమ్మ సంకల్ప, నమ్మ కుటుంబ.',
    scrollDown: 'కళగె నోడిరి',

    totalMembersUP: 'ఒట్టు సదస్యరు',
    activeMembers: 'సక్రియ సదస్యరు',
    totalDistricts: 'ఒట్టు జిల్ログインగళు',
    totalAssemblies: 'ఒట్టు విధానసభెగళు',
    verifiedBooths: 'ఖాతరిపడిసిద బూత్‌గళు',
    liveCountNotice: 'లైవ్ నమోదిత సదస్యరు (TVK-UP 100 సిరీస్)',

    smsTitle: 'SMS సందేశ ఖాతరిపడేకె',
    smsMessagePrefix: 'అభినందనెగళు! నిమ్మ TVK సదస్యతె సక్రియవాగిదె. నిమ్మ ID:',
    smsNotice: 'నిమ్మ మోబైల్ సంఖ్యెగె SMS సందేశ కలూహిసలాగిదె.',

    introBadge: 'సంగఠనె పరిచయ',
    introTitle: 'TVK ఉత్తర ప్రదేశ: సమర్పిత జనసేవె మత్తు సశక్త సంగఠనె',
    introDesc: 'తమిళగ వెట్రి కజగం పారదర్శక మత్తు సమాజకల్యాణ రాజకీయాత్మక నాయకత్వవన్న్యు ప్రమోట్ మాడుత్తిదె.',
    readMore: 'మత్తిష్టు ఒదిరి',
    stateRallyTitle: 'రాజ్యమట్టద మహాసభె',
    stateRallySub: 'సామాజిక నారాయణ మత్తు సమానతెయ కెరె',

    orgBadge: 'వ్యవస్థిత కార్యవైఖరి',
    orgTitle: 'నమ్మ సంగఠనాత్మక రచనె',
    orgDesc: 'ఉత్తర ప్రదేశద ప్రతి జిల్ログインయల్లు జనభాగీదారిత్యదొందిగె సక్రియవాగిరువ సంగఠనె.',
    viewAllOrg: 'సంపూర్ణ సంగఠనె నోడిరి',
    viewCompleteStructure: 'సంపూర్ణ సంగఠనె నోడిరి',

    orgCard1Title: 'జిల్లా విభాగాగళు',
    orgCard1Sub: '75 జిల్లా సమీతిగళు',
    orgCard1Desc: 'ఎల్లా జిల్ログインగళల్లు సక్రియ విభాగాగళు',

    orgCard2Title: 'విధానసభా విభాగాగళు',
    orgCard2Sub: '403 విధానసభా క్షెత్రగళు',
    orgCard2Desc: 'విధానసభా మట్టదల్లి జనసంపర్క',

    orgCard3Title: 'విభాగాత్మక నికాయగళు',
    orgCard3Sub: '18 విభాగీయ నికాయగళు',
    orgCard3Desc: 'విభాగాత్మక సమాలొచనెగళు',

    orgCard4Title: 'మోర్చాగళు మత్తు ప్రకొష్ఠగళు',
    orgCard4Sub: 'యువ, మహిళా, రైత మోర్చాగళు',
    orgCard4Desc: 'విశిష్ట సామాజిక వర్గగళ ప్రాతినిధ్య',

    orgCard5Title: 'తంత్రజ్ఞాన మత్తు సేవాగళు',
    orgCard5Sub: 'IT, మీడియా, లీగల్ సెల్',
    orgCard5Desc: 'తాంత్రిక మత్తు యాంత్రిక కార్యచరణెగళు',

    orgCard6Title: 'సదస్యతా అభ్యాన',
    orgCard6Sub: 'మనె మనెగె డిజిటల్ సదస్యతె',
    orgCard6Desc: 'పారదర్శక మత్తు ఖాతరిపడిసబహుదాద సదస్యతె',

    districtBadge: 'రాజ్యదల్లి నమ్మ ఉనికి',
    districtTitle: 'జిల్లా వారు సదస్యర వివర',
    districtDesc: 'ఉత్తర ప్రదేశద 75 జిల్ログインగళల్లి TVK డిజిటల్ జాలతానద వివర.',
    selectDistrict: 'జిల్ログイン ఆయిసిరి',
    activeDistrict: 'సక్రియ జిల్లా',
    districtDetails: 'సంగఠనాత్మక వివరగళు',
    viewAllDistricts: 'ఒట్టు జిల్ログインగళ పట్టి నోడిరి',

    stepBadge: 'సదస్యతా ప్రక్రియె',
    stepTitle: 'TVK కుటుంబద భాగవాగిరి',
    stepDesc: 'కేవల 3 సరళ హంతగళల్లి డిజిటల్ సదస్యతె పొదెయిరి.',
    step1Title: '01 అర్జి సల్లిసిరి',
    step1Desc: 'వివరగళన్యు నమూదిసి TVK-UP 100 సిరీస్ ID పొదెయిరి.',
    step2Title: '02 ద్రుడీకరిసిరి',
    step2Desc: 'సర్కారీ గురుతిన చీటి మత్తు ఫోటో అప్‌లోడ్ మాడిరి.',
    step3Title: '03 డిజిటల్ కార్డ్ పొదెయిరి',
    step3Desc: 'QR కోడ్ హొందిరువ డిజిటల్ ఐడీ కార్డ్ డౌన్‌లోడ్ మాడిరి.',
    joinNow: 'ఈగలె సీరిరి',

    cardBadge: 'డిజిటల్ గుర్తిసికార్డ్',
    cardTitle: 'డిజిటల్ సదస్యతా గుర్తిసికార్డ్',
    cardDesc: 'సదస్యతె ఖాతరియాదాక్షణవే డిజిటల్ ఐడీ కార్డ్ లభ్యవాగుత్తదె.',
    feat1: 'అనన్య సదస్యతా సంఖ్యె (TVK-UP 100+)',
    feat2: 'QR కోడ్ ఖాతరిపడేకె విధాన',
    feat3: 'CR80 మానదండద డిజిటల్ ఐడీ',
    feat4: 'సురక్షిత సదస్యతా వివరగళు',
    learnMembership: 'సదస్యతెయ బగ్గె తిళియిరి',

    qrBadge: 'త్వరిత ఖాతరిపడేకె',
    qrTitle: 'సదస్యతె ఖాతరిపడిసిరి',
    qrDesc: 'సదస్యతా ID అథవా QR కోడ్ గురుతించి పరిశీలిసిరి.',
    enterId: 'సదస్యతా ID నమూదిసిరి (ఉదా. TVK-UP 100)',
    verifying: 'ఖాతరిపడిసలాగుత్తిదె...',
    verifyBtn: 'ఖాతరిపడిసిరి',

    leadershipBadge: 'ముఖ్య నాయకత్వ',
    leadershipTitle: 'నాయకత్వ మత్తు మార్గదర్శన',
    viewAllBearers: 'ఎల్లా పదాధికారిగళన్యు నోడిరి',

    newsBadge: 'తాజా సుద్దిగళు',
    newsTitle: 'సుద్ది మత్తు ప్రకటనెగళు',
    viewAllNews: 'ఎల్లా సుద్దిగళన్యు నోడిరి',

    galleryBadge: 'ఫొటో గ్యాలరి',
    galleryTitle: 'చిత్రగళు మత్తు నెనపుగళు',

    finalCtaTitle: 'TVK కుటుంబదల్లి భాగవాగిరి',
    finalCtaDesc: 'ఉత్తర ప్రదేశద అనికేతన భవిష్యత్తిన నిర్మాణాత్మక హెజ్జెయల్లి భాగవాగిరి.',

    aboutTitle: 'తమిళగ వెట్రి కజగం బగ్గె',
    aboutSub: 'సామాజిక నారాయణ మత్తు సుపరిపాలనెయ ప్రతీక',
    aboutDesc: 'TVK పక్షవన్యు ఫెబ్రవరి 2, 2024 రందు సి. జోసెఫ్ విజయ్ ప్రారంభించిదారు.',

    leaderTitle: 'నమ్మ నాయక: సి. జోసెఫ్ విజయ్',
    leaderRole: 'అధ్యక్షరు మత్తు సంస్థాపకరు, TVK',
    leaderBio: '1992 రించలూ జనసేవెయల్లి నిరతరాగిరువ నమ్మ నాయకర పయణ.',

    historyTitle: 'పక్షద ఇతిహాస',
    historySub: '1992 ర సామాజిక చళువళియించ 2026 ర చునావణా గెలువినవరెగె',

    ideologyTitle: 'సిద్ధాంతగళు',
    ideologySub: 'హిట్టువినింద ఎల్లా మానవరూ సమానరు',
    ideologyDesc: 'డా. బి.ఆర్. అంబేడ్కర్, పెరియార్, కామరాజ్ అవర ఆదర్శగళల్లి.',

    electionsTitle: 'చునావణా గెలువు',
    electionsSub: '2026 చునావణెయల్లి చారిత్రాత్మక గెలువు',

    wingsTitle: 'విభాగాగళు',
    wingsSub: 'యువ, మహిళా, విద్యార్థి మత్తు రైత విభాగాగళు',

    footerRights: 'ఎల్లా హక్కుగళూ సురక్షిత. తమిళగ వెట్రి కజగం (TVK ఉత్తర ప్రదేశ).',
  },

  ML: {
    home: 'ഹോം',
    about: 'ഞങ്ങളെക്കുറിച്ച്',
    leader: 'നേതൃത്വം',
    org: 'സംഘടന',
    districts: 'ജില്ലകൾ',
    news: 'വാർത്തകൾ',
    events: 'പരിപാടികൾ',
    gallery: 'ഗാലറി',
    membership: 'അംഗത്വം',
    contact: 'ബന്ധപ്പെടുക',
    joinTVK: 'TVK-യിൽ ചേരൂ',
    verifyMembership: 'അംഗത്വം ഉറപ്പാക്കുക',
    onlineMembership: 'ഓൺലൈൻ അംഗത്വം',
    checkId: 'അംഗത്വ ID പരിശോധിക്കൂ',

    motto: 'ജനസേവനം • ജനാവകാശം • ജനബഹുമാനം',
    titleMain: 'TVK',
    titleSub: 'ഉത്തർപ്രദേശ്',
    heroDesc: 'ഉത്തർപ്രദേശിന്റെ സമഗ്ര വികസനത്തിനും ജനങ്ങളുടെ ക്ഷേമത്തിനുമായുള്ള നമ്മുടെ പ്രതിജ്ഞ.',
    scrollDown: 'താഴേക്ക് നോക്കുക',

    totalMembersUP: 'ആകെ അംഗങ്ങൾ',
    activeMembers: 'സജീവ അംഗങ്ങൾ',
    totalDistricts: 'ആകെ ജില്ലകൾ',
    totalAssemblies: 'ആകെ മണ്ഡലങ്ങൾ',
    verifiedBooths: 'ഉറപ്പാക്കിയ ബൂത്തുകൾ',
    liveCountNotice: 'തത്സമയ അംഗത്വ രജിസ്ട്രേഷൻ (TVK-UP 100 പരമ്പര)',

    smsTitle: 'SMS സ്ഥിരീകരണം',
    smsMessagePrefix: 'അഭിനന്ദനങ്ങൾ! താങ്കളുടെ TVK അംഗത്വം സജീവമാണ്. താങ്കളുടെ ഔദ്യോഗിക ID:',
    smsNotice: 'രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പറിലേക്ക് SMS അയച്ചിട്ടുണ്ട്.',

    introBadge: 'സംഘടനാ പ്രൊഫൈൽ',
    introTitle: 'TVK ഉത്തർപ്രദേശ്: സുതാര്യവും ശക്തവുമായ നേതൃത്വം',
    introDesc: 'തമിഴക വെട്രി കഴകം ഉത്തർപ്രദേശിൽ ജനക്ഷേമത്തിലും മതേതരത്വത്തിലും അധിഷ്ഠിതമായ രാഷ്ട്രീയം നയിക്കുന്നു.',
    readMore: 'കൂടുതൽ വായിക്കൂ',
    stateRallyTitle: 'സംസ്ഥാനതല സമ്മേളനം',
    stateRallySub: 'സാമൂഹിക നീതിക്കായുള്ള ആഹ്വാനം',

    orgBadge: 'വ്യവസ്ഥാപിത പ്രവർത്തനം',
    orgTitle: 'നമ്മുടെ സംഘടനാ ഘടന',
    orgDesc: 'ഉത്തർപ്രദേശിലെ എല്ലാ ജില്ലകളിലും ജനപങ്കാളിത്തത്തോടെ പ്രവർത്തിക്കുന്ന ശക്തമായ സംഘടന.',
    viewAllOrg: 'പൂർണ്ണ ഘടന കാണുക',
    viewCompleteStructure: 'പൂർണ്ണ ഘടന കാണുക',

    orgCard1Title: 'ജില്ലാ ഘടകങ്ങൾ',
    orgCard1Sub: '75 ജില്ലാ കമ്മിറ്റികൾ',
    orgCard1Desc: 'എല്ലാ ജില്ലകളിലും സജീവമായി പ്രവർത്തിക്കുന്ന ഘടകങ്ങൾ',

    orgCard2Title: 'മണ്ഡലം ഘടകങ്ങൾ',
    orgCard2Sub: '403 നിയമസഭാ മണ്ഡലങ്ങൾ',
    orgCard2Desc: 'മണ്ഡലം തലത്തിലുള്ള ജനസമ്പർക്ക പ്രവർത്തനങ്ങൾ',

    orgCard3Title: 'ഡിവിഷൻ ഘടകങ്ങൾ',
    orgCard3Sub: '18 ഡിവിഷണൽ ബോഡികൾ',
    orgCard3Desc: 'മേഖലാ തലത്തിലുള്ള വിലയിരുത്തലുകൾ',

    orgCard4Title: 'പോഷക സംഘടനകൾ',
    orgCard4Sub: 'യുവജന, മഹിളാ, കർഷക മോർച്ചകൾ',
    orgCard4Desc: 'വിവിധ സാമൂഹിക വിഭാഗങ്ങളുടെ പ്രാതിനിധ്യം',

    orgCard5Title: 'സാങ്കേതിക വിഭാഗങ്ങൾ',
    orgCard5Sub: 'IT, മീഡിയ, ലീഗൽ സെല്ലുകൾ',
    orgCard5Desc: 'സാങ്കേതികവും ഭരണപരവുമായ പ്രവർത്തനങ്ങൾ',

    orgCard6Title: 'അംഗത്വ പ്രചാരണം',
    orgCard6Sub: 'വീടുവീടാന്തര ഡിജിറ്റൽ അംഗത്വം',
    orgCard6Desc: 'സുതാര്യവും ഉറപ്പാക്കാവുന്നതുമായ അംഗത്വം',

    districtBadge: 'സംസ്ഥാനത്തെ സാന്നിധ്യം',
    districtTitle: 'ജില്ല തിരിച്ചുള്ള അംഗത്വ വിവരങ്ങൾ',
    districtDesc: 'ഉത്തർപ്രദേശിലെ 75 ജില്ലകളിലെയും TVK ഡിജിറ്റൽ നെറ്റ്‌വർക്ക് വിവരങ്ങൾ.',
    selectDistrict: 'ജില്ല തിരഞ്ഞെടുക്കുക',
    activeDistrict: 'സജീവ ജില്ല',
    districtDetails: 'സംഘടനാ വിവരങ്ങൾ',
    viewAllDistricts: 'പൂർണ്ണ ജില്ലാ പട്ടിക കാണുക',

    stepBadge: 'അംഗത്വ നടപടിക്രമം',
    stepTitle: 'TVK കുടുംബത്തിൽ അംഗമാകൂ',
    stepDesc: 'വെറും 3 ലളിതമായ ഘട്ടങ്ങളിലൂടെ ഡിജിറ്റൽ അംഗത്വം നേടൂ.',
    step1Title: '01 അപേക്ഷിക്കുക',
    step1Desc: 'വിവരങ്ങൾ നൽകി TVK-UP 100 പരമ്പര ID നേടൂ.',
    step2Title: '02 ഉറപ്പാക്കുക',
    step2Desc: 'തിരിച്ചറിയൽ രേഖയും ഫോട്ടോയും അപ്‌ലോഡ് ചെയ്യുക.',
    step3Title: '03 ഡിജിറ്റൽ കാർഡ് നേടൂ',
    step3Desc: 'QR കോഡുള്ള ഡിജിറ്റൽ കാർഡ് ഡൗൺലോഡ് ചെയ്യുക.',
    joinNow: 'ഇപ്പോൾ ചേരൂ',

    cardBadge: 'ഡിജിറ്റൽ ഐഡന്റിറ്റി',
    cardTitle: 'ഡിജിറ്റൽ അംഗത്വ കാർഡ്',
    cardDesc: 'അംഗത്വം അംഗീകരിച്ചാലുടൻ ഡിജിറ്റൽ കാർഡ് ലഭ്യമാകും.',
    feat1: 'സവിശേഷ അംഗത്വ നമ്പർ (TVK-UP 100+)',
    feat2: 'QR കോഡ് വഴി ഉറപ്പാക്കൽ രീതി',
    feat3: 'CR80 സ്റ്റാൻഡേർഡ് ഡിജിറ്റൽ കാർഡ്',
    feat4: 'സുരക്ഷിതമായ അംഗത്വ വിവരങ്ങൾ',
    learnMembership: 'അംഗത്വത്തെക്കുറിച്ച് അറിയുക',

    qrBadge: 'തത്സമയ പരിശോധന',
    qrTitle: 'അംഗത്വം പരിശോധിക്കുക',
    qrDesc: 'അംഗത്വ ID അല്ലെങ്കിൽ QR കോഡ് ഉപയോഗിച്ച് പരിശോധിക്കുക.',
    enterId: 'അംഗത്വ ID നൽകുക (ഉദാ. TVK-UP 100)',
    verifying: 'പരിശോധിക്കുന്നു...',
    verifyBtn: 'പരിശോധിക്കൂ',

    leadershipBadge: 'പ്രധാന നേതൃത്വം',
    leadershipTitle: 'നേതൃത്വവും കാഴ്ചപ്പാടും',
    viewAllBearers: 'എല്ലാ ഭാരവാഹികളെയും കാണുക',

    newsBadge: 'പുതിയ വിവരങ്ങൾ',
    newsTitle: 'വാർത്തകളും പ്രഖ്യാപനങ്ങളും',
    viewAllNews: 'എല്ലാ വാർത്തകളും കാണുക',

    galleryBadge: 'ഫോട്ടോ ഗാലറി',
    galleryTitle: 'ചിത്രങ്ങളും ഓർമ്മകളും',

    finalCtaTitle: 'TVK കുടുംബത്തിൽ കണ്ണിയാകൂ',
    finalCtaDesc: 'ഉത്തർപ്രദേശിന്റെ ശോഭനമായ ഭാവി നിർമ്മിതിയിൽ പങ്കാളിയാകൂ.',

    aboutTitle: 'തമിഴക വെട്രി കഴകത്തെക്കുറിച്ച്',
    aboutSub: 'സാമൂഹിക നീതിയുടെയും ജനക്ഷേമത്തിന്റെയും പ്രതീകം',
    aboutDesc: '2024 ഫെബ്രുവരി 2-നാണ് സി. ജോസഫ് വിജയ് TVK പാർട്ടി സ്ഥാപിച്ചത്.',

    leaderTitle: 'നമ്മുടെ നേതാവ്: സി. ജോസഫ് വിജയ്',
    leaderRole: 'പ്രസിഡന്റും സ്ഥാപകനും, TVK',
    leaderBio: '1992 മുതൽ ജനസേവന രംഗത്ത് സജീവമായി പ്രവർത്തിക്കുന്ന നേതാവിന്റെ യാത്ര.',

    historyTitle: 'പാർട്ടി ചരിത്രം',
    historySub: '1992-ലെ സാമൂഹിക സേവനം മുതൽ 2026-ലെ ചരിത്ര വിജയം വരെ',

    ideologyTitle: 'ആദർശങ്ങൾ',
    ideologySub: 'ജനനത്താൽ എല്ലാ മനുഷ്യരും തുല്യരാണ്',
    ideologyDesc: 'ഡോ. ബി.ആർ. അംബേദ്കർ, തന്തൈ പെരിയാർ, കാമരാജ് എന്നിവരുടെ വഴിയെ.',

    electionsTitle: 'തിരഞ്ഞെടുപ്പ് വിജയം',
    electionsSub: '2026 നിയമസഭാ തിരഞ്ഞെടുപ്പിലെ ചരിത്ര വിജയം',

    wingsTitle: 'പോഷക സംഘടനകൾ',
    wingsSub: 'യുവജന, മഹിളാ, വിദ്യാർത്ഥി, കർഷക, ഐടി വിഭാഗങ്ങൾ',

    footerRights: 'എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം. തമിഴക വെട്രി കഴകം (TVK ഉത്തർപ്രദേശ്).',
  },

  MR: {
    home: 'मुख्यपृष्ठ',
    about: 'आमच्याबद्दल',
    leader: 'नेतृत्व',
    org: 'संघटन',
    districts: 'जिल्हे',
    news: 'बातम्या',
    events: 'कार्यक्रम',
    gallery: 'गॅलरी',
    membership: 'सदस्यत्व',
    contact: 'संपर्क',
    joinTVK: 'TVK मध्ये सामील व्हा',
    verifyMembership: 'सदस्यत्व सत्यापित करा',
    onlineMembership: 'ऑनलाइन सदस्यत्व घ्या',
    checkId: 'आपला सदस्य ID तपासा',

    motto: 'जनसेवा • जनअधिकार • जनसन्मान',
    titleMain: 'TVK',
    titleSub: 'उत्तर प्रदेश',
    heroDesc: 'उत्तर प्रदेशातील प्रत्येक नागरिकाच्या उद्धारासाठी आणि समृद्धीसाठी आमचा संकल्प.',
    scrollDown: 'खाली पहा',

    totalMembersUP: 'उत्तर प्रदेशात एकूण सदस्य',
    activeMembers: 'सक्रिय सदस्य',
    totalDistricts: 'एकूण जिल्हे',
    totalAssemblies: 'एकूण विधानसभा',
    verifiedBooths: 'सत्यापित बूथ',
    liveCountNotice: 'लाइव्ह नोंदणीकृत सदस्य (TVK-UP 100 मालिका)',

    smsTitle: 'SMS संदेश हमी',
    smsMessagePrefix: 'अभिनंदन! आपले TVK सदस्यत्व सक्रिय आहे. आपला अधिकृत ID आहे:',
    smsNotice: 'आपल्या नोंदणीकृत मोबाईल क्रमांकावर SMS संदेश पाठवण्यात आला आहे.',

    introBadge: 'संघटन परिचय',
    introTitle: 'TVK उत्तर प्रदेश: समर्पित जनसेवा आणि मजबूत नेतृत्व',
    introDesc: 'तमिळग वेत्री कषगम उत्तर प्रदेशात पारदर्शक आणि लोककल्याणकारी राजकारणाचा संकल्प घेऊन पुढे जात आहे.',
    readMore: 'अधिक वाचा',
    stateRallyTitle: 'राज्यस्तरीय महामेळावा',
    stateRallySub: 'सामाजिक न्यायाची हाक',

    orgBadge: 'सुव्यवस्थित कार्यप्रणाली',
    orgTitle: 'आमची संघटना रचना',
    orgDesc: 'उत्तर प्रदेशातील प्रत्येक जिल्ह्यात जनसहभागासह सक्रिय असणारी मजबूत संघटना.',
    viewAllOrg: 'संपूर्ण रचना पहा',
    viewCompleteStructure: 'संपूर्ण रचना पहा',

    orgCard1Title: 'जिल्हा संघटन',
    orgCard1Sub: '75 जिल्हा समित्या',
    orgCard1Desc: 'सर्व जिल्ह्यांमध्ये सक्रिय असणाऱ्या संघटनात्मक पाठबळ समित्या',

    orgCard2Title: 'विधानसभा संघटन',
    orgCard2Sub: '403 विधानसभा मतदारसंघ',
    orgCard2Desc: 'विधानसभा स्तरावर जनसंपर्क आणि कार्य',

    orgCard3Title: 'मंंडळ संघटन',
    orgCard3Sub: '18 मंडळ संस्था',
    orgCard3Desc: 'विभाग स्तरावरील पुनरावलोकन आणि व्यवस्थापन',

    orgCard4Title: 'आघाड्या आणि कक्ष',
    orgCard4Sub: 'युवा, महिला, शेतकरी आघाड्या',
    orgCard4Desc: 'विशेष सामाजिक घटकांचे प्रतिनिधित्व',

    orgCard5Title: 'विभाग आणि कक्ष',
    orgCard5Sub: 'आयटी, मीडिया, कायदेशीर कक्ष',
    orgCard5Desc: 'तांत्रिक आणि प्रशासकीय कामकाज',

    orgCard6Title: 'सदस्यत्व मोहीम',
    orgCard6Sub: 'घरोघरी डिजिटल संपर्क',
    orgCard6Desc: 'पारदर्शक आणि पडताळणीयोग्य सदस्यत्व',

    districtBadge: 'उत्तर प्रदेशातील आमचे अस्तित्व',
    districtTitle: 'जिल्हानिहाय संघटन आणि सक्रिय सदस्य',
    districtDesc: 'उत्तर प्रदेशातील 75 जिल्ह्यांमध्ये TVK डिजिटल नेटवर्कची माहिती.',
    selectDistrict: 'जिल्हा निवडा',
    activeDistrict: 'सक्रिय जिल्हा',
    districtDetails: 'संघटन तपशील आणि उपक्रम',
    viewAllDistricts: 'संपूर्ण जिल्हा यादी पहा',

    stepBadge: 'सदस्यत्व प्रक्रिया',
    stepTitle: 'TVK कुटुंबाचा भाग बना',
    stepDesc: 'केवळ 3 सोप्या टप्प्यात डिजिटल सदस्यत्व मिळवा.',
    step1Title: '01 अर्ज करा',
    step1Desc: 'आपला तपशील भरा आणि TVK-UP 100 मालिका ID मिळवा.',
    step2Title: '02 पडताळणी करा',
    step2Desc: 'सरकारी ओळखपत्र आणि फोटो अपलोड करून प्रोफाईल पूर्ण करा.',
    step3Title: '03 डिजिटल कार्ड मिळवा',
    step3Desc: 'QR कोड असलेले डिजिटल ओळखपत्र डाउनलोड करा.',
    joinNow: 'आत्ताच सामील व्हा',

    cardBadge: 'आपली डिजिटल ओळख',
    cardTitle: 'डिजिटल सदस्यत्व ओळखपत्र',
    cardDesc: 'सदस्यत्व मंजूर झाल्यावर आपले डिजिटल ओळखपत्र त्वरित तयार केले जाते.',
    feat1: 'अद्वितीय सदस्यत्व क्रमांक (TVK-UP 100+)',
    feat2: 'QR कोड पडताळणी प्रणाली',
    feat3: 'CR80 मानकाचे डिजिटल आयडी कार्ड',
    feat4: 'सुरक्षित सदस्य तपशील',
    learnMembership: 'सदस्यत्वाबद्दल अधिक जाणून घ्या',

    qrBadge: 'त्वरित पडताळणी',
    qrTitle: 'सदस्यत्व पडताळा',
    qrDesc: 'सदस्य ID किंवा QR कोड स्कॅन करून स्थिती तपासा.',
    enterId: 'सदस्य ID प्रविष्ट करा (उदा. TVK-UP 100)',
    verifying: 'पडताळणी होत आहे...',
    verifyBtn: 'पडताळा',

    leadershipBadge: 'प्रमुख नेतृत्व',
    leadershipTitle: 'नेतृत्व आणि मार्गदर्शन',
    viewAllBearers: 'सर्व पदाधिकारी पहा',

    newsBadge: 'ताज्या घडामोडी',
    newsTitle: 'बातम्या आणि घोषणा',
    viewAllNews: 'सर्व बातम्या पहा',

    galleryBadge: 'फोटो गॅलरी',
    galleryTitle: 'छायाचित्रे आणि क्षणचित्रे',

    finalCtaTitle: 'TVK कुटुंबात सामील व्हा',
    finalCtaDesc: 'उत्तर प्रदेशाच्या उज्ज्वल भविष्यासाठी आपले योगदान द्या.',

    aboutTitle: 'तमिळग वेत्री कषगम बद्दल',
    aboutSub: 'सामाजिक न्याय आणि सुशासनाचे प्रतीक',
    aboutDesc: 'TVK ची स्थापना 2 फेब्रुवारी 2024 रोजी पक्षाध्यक्ष सी. जोसेफ विजय यांनी केली.',

    leaderTitle: 'आमचे नेते: सी. जोसेफ विजय',
    leaderRole: 'संस्थापक आणि अध्यक्ष, TVK',
    leaderBio: '1992 पासून जनसेवेत निरंतर कार्यरत असणाऱ्या आमच्या नेत्याचा राजकीय प्रवास.',

    historyTitle: 'पक्षाचा इतिहास',
    historySub: '1992 च्या सामाजिक सेवेपासून 2026 च्या ऐतिहासिक विजयापर्यंत',

    ideologyTitle: 'विचारसरणी आणि तत्त्वे',
    ideologySub: 'जन्माने सर्व मानवी जीव समान आहेत',
    ideologyDesc: 'डॉ. बी.आर. आंबेडकर, तंथै पेरियार, के. कामराज यांच्या विचारांवर आधारित.',

    electionsTitle: 'निवडणूक यश',
    electionsSub: '2026 च्या विधानसभा निवडणुकीत ऐतिहासिक विजय',

    wingsTitle: 'आघाड्या',
    wingsSub: 'युवा, महिला, विद्यार्थी, शेतकरी आणि आयटी कक्ष',

    footerRights: 'सर्व हक्क राखीव. तमिळग वेत्री कषगम (TVK उत्तर प्रदेश).',
  },
};
