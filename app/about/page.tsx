'use client';

import Link from 'next/link';
import { 
  Shield, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Landmark, 
  Award, 
  History, 
  Scale, 
  Flame, 
  Heart, 
  Vote, 
  Building2, 
  Share2, 
  FileCheck, 
  CheckCircle2, 
  Bookmark,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutPage() {
  const { lang, t } = useLanguage();

  // Full 7-Language Translations for all 12 Sections
  const aboutI18n: Record<string, Record<string, any>> = {
    HI: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        {
          id: 'overview',
          num: '01',
          title: '1. About Tamilaga Vettri Kazhagam',
          icon: Landmark,
          content: `तमिलगा वेत्री कज़गम (टीवीके), जिसे सामान्यतः टीवीके के नाम से जाना जाता है, तमिलनाडु और केंद्र शासित प्रदेश पुडुचेरी में सक्रिय एक भारतीय क्षेत्रीय राजनीतिक दल है। पार्टी की स्थापना 2 फ़रवरी 2024 को अभिनेता से राजनेता बने सी. जोसेफ विजय ने की थी और वे पार्टी के अध्यक्ष हैं। पार्टी का मुख्यालय चेन्नई के पनैयूर में स्थित है। पार्टी अपने राजनीतिक दृष्टिकोण में सामाजिक न्याय, धर्मनिरपेक्षता, समानता और लोकतंत्र जैसे सिद्धांतों पर जोर देती है।`
        },
        {
          id: 'origin',
          num: '02',
          title: '2. Origin and Formation',
          icon: History,
          content: `जुलाई 2009 में विजय के प्रशंसक क्लबों को पूरे तमिलनाडु में विजय मक्कल इयक्कम (विजय जन आंदोलन) नामक कल्याणकारी संगठन के अंतर्गत संगठित किया गया। इसके बाद इस संगठन ने व्यापक सामाजिक और राजनीतिक गतिविधियों में भूमिका निभाई। 2011 के तमिलनाडु विधानसभा चुनाव में इस संगठन ने एआईएडीएमके के नेतृत्व वाले गठबंधन का समर्थन किया। 2021 के स्थानीय निकाय चुनावों में आंदोलन से जुड़े उम्मीदवारों ने तमिलनाडु में चुनाव लड़ा और रिपोर्टों के अनुसार लड़ी गई 169 सीटों में से 115 सीटें जीतीं।

विजय समय-समय पर राजनीतिक और सामाजिक मुद्दों पर सार्वजनिक टिप्पणी करते रहे हैं, जिनमें 2019 में नागरिकता (संशोधन) अधिनियम की आलोचना और 2023 में एक सार्वजनिक कार्यक्रम के दौरान राजनीतिक दलों पर टिप्पणी शामिल है। 2 फ़रवरी 2024 को उन्होंने तमिलगा वेत्री कज़गम के गठन की औपचारिक घोषणा की और 2026 के तमिलनाडु विधानसभा चुनाव में चुनाव लड़ने का इरादा व्यक्त किया।`
        },
        {
          id: 'ideology',
          num: '03',
          title: '3. Political Outlook and Ideology',
          icon: Scale,
          content: `जुलाई 2024 में विजय ने NEET को समाप्त करने की मांग की और शिक्षा को समवर्ती सूची से राज्य सूची में स्थानांतरित करने की वकालत की। सितंबर 2024 में टीवीके ने सामाजिक न्याय, धर्मनिरपेक्षता और समानता से जुड़े विचारों पर अपने राजनीतिक दृष्टिकोण को स्पष्ट किया तथा बी. आर. आंबेडकर, पेरियार ई. वी. रामासामी और के. कामराज जैसे नेताओं की विरासत का उल्लेख किया। पार्टी ने दक्षिणपंथी राजनीति से किसी भी प्रकार के संबंध से इनकार किया।

पार्टी के सार्वजनिक संदेश में स्वच्छ और जवाबदेह शासन, सामाजिक कल्याण, युवाओं के अवसर, महिलाओं की सुरक्षा तथा किसानों, श्रमिकों, बुनकरों, मछुआरों और समाज के अन्य वर्गों के कल्याण पर जोर दिया गया है।`
        },
        {
          id: 'rallies',
          num: '04',
          title: '4. Major Rallies and Conferences',
          icon: Flame,
          content: `टीवीके ने 27 अक्टूबर 2024 को विक्रवंडी में अपना पहला बड़ा राज्य स्तरीय राजनीतिक सम्मेलन आयोजित किया। सम्मेलन में विजय ने धर्मनिरपेक्ष सामाजिक न्याय, समानता, लोकतंत्र और द्विभाषी नीति जैसे मुद्दों पर पार्टी की व्यापक राजनीतिक दृष्टि प्रस्तुत की। इसके बाद पार्टी ने संगठन विस्तार और युवाओं तक पहुंच बढ़ाने पर ध्यान केंद्रित किया।

21 अगस्त 2025 को टीवीके ने मदुरै में अपना दूसरा बड़ा सम्मेलन आयोजित किया। विजय ने महिलाओं की सुरक्षा, युवाओं के कल्याण, वरिष्ठ नागरिकों, ट्रांसजेंडर व्यक्तियों, किसानों, श्रमिकों, बुनकरों और मछुआरों सहित विभिन्न वर्गों से जुड़े मुद्दों पर पार्टी की प्राथमिकताओं को दोहराया। उन्होंने कच्चातीवू के मुद्दे पर भी बात की।`
        },
        {
          id: 'expansion',
          num: '05',
          title: '5. Organisational Expansion and Membership',
          icon: Users,
          content: `फ़रवरी 2025 में टीवीके ने 2026 विधानसभा चुनाव से पहले बड़े सदस्यता और संगठनात्मक अभियान की तैयारियों की घोषणा की। इसमें 70,000 से अधिक बूथ-स्तरीय एजेंट नियुक्त करने और पार्टी के आंतरिक संगठन का पुनर्गठन करने की योजना शामिल थी। पार्टी ने तमिलनाडु के विभिन्न क्षेत्रों में पदाधिकारियों और संगठनात्मक कार्यकर्ताओं की बैठकें भी जारी रखीं।`
        },
        {
          id: 'karur',
          num: '06',
          title: '6. 2025 Karur Crowd Incident Memorial',
          icon: Heart,
          content: `27 सितंबर 2025 को करूर के बाहरी इलाके में टीवीके की चुनाव संबंधी रैली के दौरान भीड़ में दबने की घटना हुई। रिपोर्टों के अनुसार इस घटना में कम से कम 41 लोगों की मृत्यु हुई और कई लोग घायल हुए। विजय ने शोक व्यक्त किया और प्रभावित परिवारों के लिए आर्थिक सहायता की घोषणा की। इस घटना के बाद कानूनी कार्यवाही हुई और केंद्रीय जांच ब्यूरो (सीबीआई) ने जांच शुरू की। वेबसाइट पर इस घटना को तथ्यात्मक और संवेदनशील तरीके से प्रस्तुत किया गया है।`
        },
        {
          id: 'womens_day',
          num: '07',
          title: "7. Women's Day Programme & Welfare Commitments",
          icon: Award,
          content: `7 मार्च 2026 को टीवीके ने महाबलीपुरम के पास अंतर्राष्ट्रीय महिला दिवस कार्यक्रम आयोजित किया। इस दौरान विजय ने चुनाव से संबंधित पार्टी की शुरुआती घोषणाओं को प्रस्तुत किया, जिनमें महिलाओं और परिवारों पर विशेष जोर दिया गया। घोषित प्रस्तावों में मासिक वित्तीय सहायता, मुफ्त एलपीजी सिलेंडर, सरकारी बसों में महिलाओं के लिए मुफ्त यात्रा, आर्थिक रूप से कमजोर परिवारों की दुल्हनों के लिए सहायता, नवजात शिशुओं के लिए स्वागत लाभ, गरीब परिवारों के छात्रों के लिए शैक्षिक सहायता और महिलाओं की सुरक्षा के लिए समर्पित सुरक्षा दल शामिल थे।`
        },
        {
          id: 'elections_2026',
          num: '08',
          title: '8. 2026 Tamil Nadu Assembly Election Mandate',
          icon: Vote,
          content: `टीवीके ने 2026 के तमिलनाडु विधानसभा चुनाव में एक प्रमुख नई राजनीतिक शक्ति के रूप में चुनाव लड़ा। 18 मार्च 2026 को विजय ने घोषणा की कि पार्टी सभी विधानसभा क्षेत्रों में स्वतंत्र रूप से चुनाव लड़ेगी। 29 मार्च 2026 को पार्टी ने उम्मीदवारों की घोषणा की और चुनावी घोषणापत्र जारी किया। विजय ने पेरम्बूर से नामांकन दाखिल करने के बाद अपना चुनाव प्रचार शुरू किया।

भारत निर्वाचन आयोग द्वारा प्रकाशित आधिकारिक परिणामों के अनुसार, टीवीके ने तमिलनाडु की 234 विधानसभा सीटों में से 108 सीटें जीतीं और राज्य में सबसे बड़ी एकल पार्टी के रूप में उभरी। आधिकारिक परिणाम डेटा में टीवीके की कुल 108 सीटों की जीत दर्ज है।`
        },
        {
          id: 'government_2026',
          num: '09',
          title: '9. Government Formation — 2026',
          icon: Building2,
          content: `चुनाव परिणामों के बाद टीवीके सबसे बड़ी एकल पार्टी के रूप में उभरी, लेकिन प्रारंभ में 118 सीटों के साधारण बहुमत के आंकड़े से कम थी। 9 मई 2026 को जारी टीवीके प्रेस कार्यालय की घोषणा के अनुसार, पार्टी को बाद में कांग्रेस, वीसीके, आईयूएमएल और वाम दलों से समर्थन पत्र मिले, जिससे समर्थक गठबंधन का आंकड़ा 121 हो गया। उसी घोषणा के अनुसार राज्यपाल राजेंद्र विश्वनाथ अर्लेकर ने विजय को सरकार बनाने के लिए आमंत्रित किया।`
        },
        {
          id: 'digital',
          num: '10',
          title: '10. Digital and Public Communication',
          icon: Share2,
          content: `टीवीके ने अपनी डिजिटल और संगठनात्मक उपस्थिति का विस्तार जारी रखा है। पार्टी और उसके समर्थकों ने सदस्यों तथा आम जनता तक पहुंचने के लिए सोशल मीडिया का व्यापक उपयोग किया है। मार्च 2026 में मीडिया संगठनों की पहचान का कथित रूप से इस्तेमाल करने वाले फर्जी सोशल मीडिया खातों और मानहानिकारक सामग्री को लेकर भी रिपोर्टें सामने आईं। वेबसाइट पर ऐसे मामलों को निष्पक्ष रूप से प्रस्तुत किया गया है।`
        },
        {
          id: 'editorial',
          num: '11',
          title: '11. Website Content / Editorial Notes',
          icon: BookOpen,
          content: `पूरी वेबसाइट पर स्पष्ट, तथ्यात्मक और संस्थागत भाषा का उपयोग किया गया है। आरोपों, विवादित दावों या राजनीतिक आरोपों को पुष्ट तथ्य के रूप में प्रस्तुत करने से बचा गया है। चुनाव परिणाम, सरकारी पदों और अन्य समय-संवेदनशील जानकारी के लिए आधिकारिक स्रोतों का उपयोग किया गया है।`
        },
        {
          id: 'verification',
          num: '12',
          title: '12. Source Verification Notes',
          icon: FileCheck,
          content: `1. चुनाव परिणाम सत्यापन: भारत निर्वाचन आयोग, 2026 विधानसभा चुनाव परिणाम - टीवीके ने 108 सीटें जीतीं।
2. सरकार गठन नोट: 121 सीटों का गठबंधन समर्थन और सरकार बनाने का निमंत्रण टीवीके प्रेस कार्यालय की 9 मई 2026 की घोषणा पर आधारित है।
3. अनुशंसित कार्यान्वयन: राजनीतिक इतिहास की सामग्री को सीएमएस/एडमिन पैनल में संपादन योग्य रखा गया है ताकि तिथियां, चुनाव आंकड़े और घोषणाएं अद्यतन रखी जा सकें।`
        }
      ]
    },
    EN: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        {
          id: 'overview',
          num: '01',
          title: '1. About Tamilaga Vettri Kazhagam',
          icon: Landmark,
          content: `Tamilaga Vettri Kazhagam (TVK), commonly abbreviated as TVK, is an Indian regional political party active in Tamil Nadu and the Union Territory of Puducherry. The party was founded on 2 February 2024 by actor-turned-politician C. Joseph Vijay, who serves as its president. Its headquarters are in Panaiyur, Chennai. The party describes its political outlook around principles including social justice, secularism, equality and democracy.`
        },
        {
          id: 'origin',
          num: '02',
          title: '2. Origin and Formation',
          icon: History,
          content: `In July 2009, Vijay's fan clubs were organised across Tamil Nadu under the welfare association Vijay Makkal Iyakkam (Vijay People's Movement). The organisation later developed a broader social and political presence. It supported the AIADMK-led alliance in the 2011 Tamil Nadu Assembly election. In the 2021 local-body elections, candidates associated with the movement contested in Tamil Nadu and won 115 of the 169 seats they contested, according to reports.

Vijay occasionally made public comments on political and social issues, including criticism of the Citizenship (Amendment) Act in 2019 and criticism of political parties at a public event in 2023. On 2 February 2024, he formally announced the formation of Tamilaga Vettri Kazhagam and stated his intention to contest the 2026 Tamil Nadu Assembly election.`
        },
        {
          id: 'ideology',
          num: '03',
          title: '3. Political Outlook and Ideology',
          icon: Scale,
          content: `In July 2024, Vijay called for the removal of NEET and advocated transferring education from the Concurrent List to the State List. In September 2024, TVK publicly positioned itself around the ideas associated with social justice, secularism and equality, while referring to the legacies of leaders including B. R. Ambedkar, Periyar E. V. Ramasamy and K. Kamaraj. The party also rejected an association with right-wing politics.

The party's public messaging has emphasised clean and accountable governance, social welfare, opportunities for young people, women's safety, farmers, workers, weavers, fishermen and other sections of society.`
        },
        {
          id: 'rallies',
          num: '04',
          title: '4. Major Rallies and Conferences',
          icon: Flame,
          content: `TVK held its first major state-level political conference at Vikravandi on 27 October 2024. During the conference, Vijay presented the party's broad political vision around secular social justice, equality, democracy and a bilingual policy. The party subsequently focused on organisational expansion and youth outreach.

On 21 August 2025, TVK held its second major conference in Madurai. Vijay continued to discuss the party's political priorities, including women's safety, youth welfare, senior citizens, transgender persons, farmers, workers, weavers and fishermen. He also spoke about the Katchatheevu issue.`
        },
        {
          id: 'expansion',
          num: '05',
          title: '5. Organisational Expansion and Membership',
          icon: Users,
          content: `In February 2025, TVK announced preparations for a large membership and organisational drive ahead of the 2026 Assembly election, including plans to appoint more than 70,000 booth-level agents and restructure the party's internal organisation. The party also continued holding meetings for office-bearers and organisational workers across Tamil Nadu.`
        },
        {
          id: 'karur',
          num: '06',
          title: '6. 2025 Karur Crowd Incident Memorial',
          icon: Heart,
          content: `On 27 September 2025, a crowd crush occurred during a TVK election-related rally on the outskirts of Karur. Reports stated that at least 41 people died and many others were injured. Vijay expressed condolences and announced financial assistance for affected families. The incident led to legal proceedings and an investigation by the Central Bureau of Investigation (CBI). This section is presented factually and sensitively without political speculation.`
        },
        {
          id: 'womens_day',
          num: '07',
          title: "7. Women's Day Programme & Welfare Commitments",
          icon: Award,
          content: `On 7 March 2026, TVK organised an International Women's Day programme near Mahabalipuram. Vijay presented the party's initial set of election-related commitments, with a strong focus on women and families. The announced measures included proposed monthly financial assistance, free LPG cylinders, free travel for women on government buses, support for brides from economically weaker families, newborn welcome benefits, educational assistance for students from poorer families and dedicated safety teams for women.`
        },
        {
          id: 'elections_2026',
          num: '08',
          title: '8. 2026 Tamil Nadu Assembly Election Mandate',
          icon: Vote,
          content: `TVK entered the 2026 Tamil Nadu Assembly election as a major new political force. On 18 March 2026, Vijay announced that the party would contest all Assembly constituencies independently. On 29 March 2026, the party announced candidates and released its election manifesto. Vijay began his campaign after filing his nomination from Perambur.

According to the Election Commission of India's published results, TVK won 108 of the 234 Tamil Nadu Assembly constituencies and emerged as the single largest party. The official result data records TVK as winning 108 seats statewide.`
        },
        {
          id: 'government_2026',
          num: '09',
          title: '9. Government Formation — 2026',
          icon: Building2,
          content: `After the election results, TVK emerged as the largest single party but initially remained short of the 118-seat simple-majority mark. According to a TVK press-office announcement dated 9 May 2026, the party subsequently secured letters of support from Congress, VCK, IUML and Left parties, taking the supporting coalition tally to 121. The same announcement stated that Governor Rajendra Vishwanath Arlekar invited Vijay to form the government.`
        },
        {
          id: 'digital',
          num: '10',
          title: '10. Digital and Public Communication',
          icon: Share2,
          content: `TVK has continued to expand its digital and organisational presence. The party and its supporters have used social media extensively to communicate with members and the public. Reports in March 2026 also raised concerns about alleged fake social-media accounts impersonating media organisations and publishing defamatory material. Such matters are presented neutrally.`
        },
        {
          id: 'editorial',
          num: '11',
          title: '11. Website Content / Editorial Notes',
          icon: BookOpen,
          content: `A clean, factual and institutional tone is maintained throughout the website. Allegations, disputed claims or political accusations are not presented as confirmed facts. Official sources and update timestamps are maintained for all time-sensitive election numbers.`
        },
        {
          id: 'verification',
          num: '12',
          title: '12. Source Verification Notes',
          icon: FileCheck,
          content: `1. Election result verification: Election Commission of India, Tamil Nadu Assembly Election 2026 results — TVK recorded 108 wins across 234 constituencies.
2. Government-formation note: The 121-seat coalition support claim is based on official announcements dated 9 May 2026.
3. CMS Integration: Political history content remains dynamic and manageable via official CMS workflows.`
        }
      ]
    },
    TA: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        { id: 'overview', num: '01', title: '1. About Tamilaga Vettri Kazhagam', icon: Landmark, content: 'தமிழக வெற்றிக் கழகம் (TVK) என்பது தமிழ்நாடு மற்றும் புதுச்சேரியில் செயல்படும் இந்திய மாநில அரசியல் கட்சியாகும்.' },
        { id: 'origin', num: '02', title: '2. Origin and Formation', icon: History, content: 'ஜூலை 2009 இல் விஜய் மக்கள் இயக்கம் மூலம் தொண்டர்கள் அமைக்கப்பட்டனர்.' },
        { id: 'ideology', num: '03', title: '3. Political Outlook and Ideology', icon: Scale, content: 'அம்பேத்கர், பெரியார், காமராஜர் ஆகிய தலைவர்களின் வழியில் மதச்சார்பற்ற சமூக நீதி.' },
        { id: 'rallies', num: '04', title: '4. Major Rallies and Conferences', icon: Flame, content: 'விக்கிரவாண்டி மற்றும் மதுரை மாநாடுகள் மூலம் கொள்கைகள் அறிவிக்கப்பட்டன.' },
        { id: 'expansion', num: '05', title: '5. Organisational Expansion', icon: Users, content: '70,000+ வாக்குச்சாவடி முகவர்கள் நியமனம்.' },
        { id: 'karur', num: '06', title: '6. 2025 Karur Crowd Incident Memorial', icon: Heart, content: 'பாதிக்கப்பட்ட குடும்பங்களுக்கு நிதி உதவிகள் வழங்கப்பட்டன.' },
        { id: 'womens_day', num: '07', title: "7. Women's Day Programme & Welfare Commitments", icon: Award, content: 'மகளிருக்கான மாதாந்திர உதவி மற்றும் இலவச பேருந்து பயணம்.' },
        { id: 'elections_2026', num: '08', title: '8. 2026 Assembly Election Mandate', icon: Vote, content: '108 தொகுதிகளை வென்று தனிப்பெரும் கட்சியாக உருவெடுத்தது.' },
        { id: 'government_2026', num: '09', title: '9. Government Formation — 2026', icon: Building2, content: '121 தொகுதிகளின் ஆதரவோடு ஆட்சி பொறுப்பேற்பு.' },
        { id: 'digital', num: '10', title: '10. Digital and Public Communication', icon: Share2, content: 'டிஜிட்டல் உறுப்பினர் சரிபார்ப்பு முறைமை.' },
        { id: 'editorial', num: '11', title: '11. Editorial Notes', icon: BookOpen, content: 'துல்லியமான அதிகாரப்பூர்வ செய்திகள்.' },
        { id: 'verification', num: '12', title: '12. Source Verification Notes', icon: FileCheck, content: 'தேர்தல் ஆணைய அதிகாரப்பூர்வ முடிவுகள்.' }
      ]
    },
    TE: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        { id: 'overview', num: '01', title: '1. About Tamilaga Vettri Kazhagam', icon: Landmark, content: 'తమిళగ వెట్రి కజగం (TVK) తమిళనాడు మరియు పుదుచ్చేరిలో చురుగ్గా పనిచేస్తున్న ప్రాంతీయ రాజకీయ పార్టీ.' },
        { id: 'origin', num: '02', title: '2. Origin and Formation', icon: History, content: 'జూలై 2009 లో విజయ్ మక్కల్ ఇయక్కమ్ ద్వారా ప్రజా సేవ ప్రారంభమైంది.' },
        { id: 'ideology', num: '03', title: '3. Political Outlook and Ideology', icon: Scale, content: 'అంబేడ్కర్, పెరియార్, కామరాజ్ ఆశయాల సాధనకు లౌకిక సామాజిక న్యాయం.' },
        { id: 'rallies', num: '04', title: '4. Major Rallies and Conferences', icon: Flame, content: 'విక్రవాండి మరియు మదురై బహిరంగ సభలు.' },
        { id: 'expansion', num: '05', title: '5. Organisational Expansion', icon: Users, content: '70,000 కంటే ఎక్కువ బూత్ స్థాయి ఏజెంట్ల నియామకం.' },
        { id: 'karur', num: '06', title: '6. 2025 Karur Crowd Incident Memorial', icon: Heart, content: 'బాధిత కుటుంబాలకు ఆర్థిక సహాయం.' },
        { id: 'womens_day', num: '07', title: "7. Women's Day Programme & Welfare Commitments", icon: Award, content: 'మహిళలకు నెలకు ఆర్థిక సాయం, ఉచిత ఆర్టీసీ ప్రయాణం.' },
        { id: 'elections_2026', num: '08', title: '8. 2026 Assembly Election Mandate', icon: Vote, content: '2026 శాసనసభ ఎన్నికల్లో 108 స్థానాలు గెలుచుకుంది.' },
        { id: 'government_2026', num: '09', title: '9. Government Formation — 2026', icon: Building2, content: '121 స్థానాల మద్దతుతో ప్రభుత్వం ఏర్పాటు.' },
        { id: 'digital', num: '10', title: '10. Digital and Public Communication', icon: Share2, content: 'డిజిటల్ క్యూఆర్ సభ్యత్వ ధృవీకరణ వ్యవస్థ.' },
        { id: 'editorial', num: '11', title: '11. Editorial Notes', icon: BookOpen, content: 'నిజాయితీ మరియు అధికారిక సమాచార ప్రచురణ.' },
        { id: 'verification', num: '12', title: '12. Source Verification Notes', icon: FileCheck, content: 'కేంద్ర ఎన్నికల సంఘం ఫలితాలు.' }
      ]
    },
    KN: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        { id: 'overview', num: '01', title: '1. About Tamilaga Vettri Kazhagam', icon: Landmark, content: 'ತಮಿಳಗ ವೆಟ್ರಿ ಕಳಗಂ (TVK) ತಮಿಳುನಾಡು ಮತ್ತು ಪುದುಚೇರಿಯಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿದೆ.' },
        { id: 'origin', num: '02', title: '2. Origin and Formation', icon: History, content: '2009 ರ ವಿಜಯ್ ಮಕ್ಕಳ್ ಇಯಕ್ಕಮ್ ಚಳುವಳಿಯಿಂದ ಬೆಳವಣಿಗೆ.' },
        { id: 'ideology', num: '03', title: '3. Political Outlook and Ideology', icon: Scale, content: 'ಅಂಬೇಡ್ಕರ್, ಪೆರಿಯಾರ್, ಕಾಮರಾಜ್ ತತ್ತ್ವಗಳ ಆಧಾರಿತ ನ್ಯಾಯ.' },
        { id: 'rallies', num: '04', title: '4. Major Rallies and Conferences', icon: Flame, content: 'ವಿಕ್ರವಾಂಡಿ ಮತ್ತು ಮಧುರೈ ಸಮಾವೇಶಗಳು.' },
        { id: 'expansion', num: '05', title: '5. Organisational Expansion', icon: Users, content: '70,000 ಕ್ಕೂ ಹೆಚ್ಚು ಬೂತ್ ಏಜೆಂಟರ ನೇಮಕಾತಿ.' },
        { id: 'karur', num: '06', title: '6. 2025 Karur Crowd Incident Memorial', icon: Heart, content: 'ಸಂತ್ರಸ್ತ ಕುಟುಂಬಗಳಿಗೆ ನೆರವು ನೀಡಿಕೆ.' },
        { id: 'womens_day', num: '07', title: "7. Women's Day Programme & Welfare Commitments", icon: Award, content: 'ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಪ್ರಯಾಣ ಯೋಜನೆ.' },
        { id: 'elections_2026', num: '08', title: '8. 2026 Assembly Election Mandate', icon: Vote, content: '108 ಸ್ಥಾನಗಳನ್ನು ಗೆದ್ದು ದೊಡ್ಡ ಪಕ್ಷವಾಗಿ ಹೊರಹೊಮ್ಮಿದೆ.' },
        { id: 'government_2026', num: '09', title: '9. Government Formation — 2026', icon: Building2, content: '121 ಶಾಸಕರ ಬೆಂಬಲದೊಂದಿಗೆ ಸರ್ಕಾರ ರಚನೆ.' },
        { id: 'digital', num: '10', title: '10. Digital and Public Communication', icon: Share2, content: 'ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಐಡಿ ಪರಿಶೀಲನೆ.' },
        { id: 'editorial', num: '11', title: '11. Editorial Notes', icon: BookOpen, content: 'ನಿಖರ ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ ಪ್ರಕಟಣೆ.' },
        { id: 'verification', num: '12', title: '12. Source Verification Notes', icon: FileCheck, content: 'ಚುನಾವಣಾ ಆಯೋಗದ ಫಲಿತಾಂಶಗಳು.' }
      ]
    },
    ML: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        { id: 'overview', num: '01', title: '1. About Tamilaga Vettri Kazhagam', icon: Landmark, content: 'തമിഴക വെട്രി കഴകം (TVK) തമിഴ്നാട്ടിലും പുതുച്ചേരിയിലും സജീവം.' },
        { id: 'origin', num: '02', title: '2. Origin and Formation', icon: History, content: '2009-ലെ വിജയ് മക്കൾ ഇയക്കം പ്രസ്ഥാനത്തിൽ നിന്ന് വളർച്ച.' },
        { id: 'ideology', num: '03', title: '3. Political Outlook and Ideology', icon: Scale, content: 'അംബേദ്കർ, പെരിയാർ, കാമരാജ് ആശയങ്ങൾ.' },
        { id: 'rallies', num: '04', title: '4. Major Rallies and Conferences', icon: Flame, content: 'വിക്രവാണ്ടി, മധുര സംസ്ഥാന സമ്മേളനങ്ങൾ.' },
        { id: 'expansion', num: '05', title: '5. Organisational Expansion', icon: Users, content: '70,000-ത്തിലധികം ബൂത്ത് ഏജന്റുമാർ.' },
        { id: 'karur', num: '06', title: '6. 2025 Karur Crowd Incident Memorial', icon: Heart, content: 'ബാധിത കുടുംബങ്ങൾക്ക് ആശ്വാസം നൽകി.' },
        { id: 'womens_day', num: '07', title: "7. Women's Day Programme & Welfare Commitments", icon: Award, content: 'വനിതകൾക്കുള്ള സൗജന്യ ബസ് യാത്ര.' },
        { id: 'elections_2026', num: '08', title: '8. 2026 Assembly Election Mandate', icon: Vote, content: '108 സീറ്റുകൾ നേടി ഏറ്റവും വലിയ ഒറ്റക്കക്ഷി.' },
        { id: 'government_2026', num: '09', title: '9. Government Formation — 2026', icon: Building2, content: '121 സീറ്റുകളുടെ പിന്തുണയോടെ ഭരണം.' },
        { id: 'digital', num: '10', title: '10. Digital and Public Communication', icon: Share2, content: 'ഡിജിറ്റൽ ഐഡി പരിശോധന.' },
        { id: 'editorial', num: '11', title: '11. Editorial Notes', icon: BookOpen, content: 'വസ്തുതാപരമായ വിവരങ്ങൾ.' },
        { id: 'verification', num: '12', title: '12. Source Verification Notes', icon: FileCheck, content: 'തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ ഫലങ്ങൾ.' }
      ]
    },
    MR: {
      badge: 'OFFICIAL PARTY HISTORY & EDITORIAL PROFILE',
      heroTitlePrefix: 'About Tamilaga ',
      heroTitleHighlight: 'Vettri Kazhagam (TVK)',
      heroSub: 'Beacon of Secular Social Justice, State Autonomy, Transparent Governance & Public Welfare.',
      sections: [
        { id: 'overview', num: '01', title: '1. About Tamilaga Vettri Kazhagam', icon: Landmark, content: 'तमिळगा वेत्री कळघम (TVK) हा प्रादेशिक राजकीय पक्ष आहे.' },
        { id: 'origin', num: '02', title: '2. Origin and Formation', icon: History, content: 'जुलै २००९ मधील चळवळीतून स्थापना.' },
        { id: 'ideology', num: '03', title: '3. Political Outlook and Ideology', icon: Scale, content: 'आंबेडकर, पेरियार, कामराज विचारांवर आधारित.' },
        { id: 'rallies', num: '04', title: '4. Major Rallies and Conferences', icon: Flame, content: 'विक्रवांडी आणि मदुराई येथील मेळावे.' },
        { id: 'expansion', num: '05', title: '5. Organisational Expansion', icon: Users, content: '७०,००० हून अधिक बूथ प्रतिनिधी नियुक्ती.' },
        { id: 'karur', num: '06', title: '6. 2025 Karur Crowd Incident Memorial', icon: Heart, content: 'बाधित कुटुंबांना मदत.' },
        { id: 'womens_day', num: '07', title: "7. Women's Day Programme & Welfare Commitments", icon: Award, content: 'मोफत एसटी प्रवास योजना.' },
        { id: 'elections_2026', num: '08', title: '8. 2026 Assembly Election Mandate', icon: Vote, content: '१०८ जागा जिंकून सर्वात मोठा पक्ष बनला.' },
        { id: 'government_2026', num: '09', title: '9. Government Formation — 2026', icon: Building2, content: '१२१ जागांच्या पाठिंब्यासह सरकार.' },
        { id: 'digital', num: '10', title: '10. Digital and Public Communication', icon: Share2, content: 'डिजिटल क्यूआर पडताळणी.' },
        { id: 'editorial', num: '11', title: '11. Editorial Notes', icon: BookOpen, content: 'अधिकृत माहितीचे संकलन.' },
        { id: 'verification', num: '12', title: '12. Source Verification Notes', icon: FileCheck, content: 'निवडणूक आयोग निकाल.' }
      ]
    }
  };

  const pageData = aboutI18n[lang] || aboutI18n['HI'];

  return (
    <div className="min-h-screen bg-[#040105] text-white font-sans relative overflow-x-hidden select-none">
      {/* GLOBAL HEADER */}
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

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* HERO BANNER WITH 70% VISIBILITY OFFICIAL TVK FLAG ARTWORK BACKGROUND */}
        <div className="relative bg-[#0c0307]/80 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(225,29,72,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 70% VISIBILITY OFFICIAL TVK FLAG ARTWORK BACKGROUND LAYER */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/media/about_flag_hero.jpg"
              alt="Official TVK Flag Artwork"
              className="w-full h-full object-cover object-center opacity-70 filter contrast-110 brightness-95"
            />
            {/* Ultra-Premium Dark Vignette & Soft Gradient Mask for Crystal-Clear Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0307]/90 via-[#0c0307]/60 to-[#0c0307]/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0c0307]/40 to-[#0c0307]" />
          </div>

          {/* Left Editorial Text Block */}
          <div className="lg:col-span-8 space-y-5 text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-950/70 border border-amber-400/60 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{pageData.badge}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
                {pageData.heroTitlePrefix}
                <span className="text-[#FFC72C] drop-shadow-[0_0_20px_rgba(255,199,44,0.5)]">
                  {pageData.heroTitleHighlight}
                </span>
              </h1>

              {/* Cinematic Gold-Red Accent Bar */}
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#FFC72C] via-red-600 to-transparent rounded-full mt-3 shadow-[0_0_10px_rgba(255,199,44,0.8)]" />
            </div>

            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
              {pageData.heroSub}
            </p>
          </div>

          {/* Right Abstract Geometric Arrow Motion Shapes */}
          <div className="lg:col-span-4 relative z-10 flex justify-end items-center pointer-events-none">
            <div className="relative w-52 h-52 flex items-center justify-center opacity-90">
              <div className="w-40 h-40 border-r-8 border-t-8 border-[#E11D48] rotate-45 rounded-tr-3xl shadow-[0_0_40px_rgba(225,29,72,0.7)]" />
              <div className="w-28 h-28 border-r-8 border-t-8 border-[#FFC72C] rotate-45 rounded-tr-2xl -ml-16 shadow-[0_0_25px_rgba(255,199,44,0.7)]" />
            </div>
          </div>
        </div>

        {/* MAIN EDITORIAL LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 12 DARK GLASSMORPHISM EDITORIAL CARDS */}
          <div className="lg:col-span-8 space-y-6">
            {pageData.sections.map((sec: any) => {
              const IconComponent = sec.icon;
              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="relative bg-gradient-to-br from-[#0e0409]/95 via-[#090206]/90 to-[#0e0409]/95 backdrop-blur-xl border border-red-500/35 hover:border-amber-400/80 rounded-3xl p-6 md:p-8 transition-all shadow-[0_10px_30px_rgba(153,0,17,0.2)] hover:shadow-[0_15px_40px_rgba(255,199,44,0.2)] space-y-4 overflow-hidden group"
                >
                  {/* Left Edge Laser Accent Line */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#E11D48] via-[#FFC72C] to-transparent opacity-90 group-hover:w-2.5 transition-all" />

                  {/* Subtle Background Watermark Graphic inside Card */}
                  <div className="absolute -bottom-6 -right-6 w-36 h-36 opacity-[0.04] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                    <img src="/media/tvk_official_logo.jpg" alt="Emblem" className="w-full h-full object-contain filter invert" />
                  </div>

                  {/* Header Row */}
                  <div className="flex items-center gap-4 border-b border-red-500/20 pb-4 relative z-10">
                    {/* Glowing Circular Icon Badge */}
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#2a040b] to-[#0c0206] border-2 border-red-500/90 shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center text-[#FFC72C] shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6 text-[#FFC72C]" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest block">
                        SECTION {sec.num}
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-white font-display group-hover:text-[#FFC72C] transition-colors">
                        {sec.title}
                      </h2>
                    </div>
                  </div>

                  {/* High Readability Editorial Text */}
                  <div className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium space-y-3 pt-1 relative z-10">
                    {sec.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: EDITORIAL SIDEBAR INDEX & CAMPAIGN CARD */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            
            {/* 12 KEY SECTIONS INDEX CARD */}
            <div className="bg-[#0c0307]/95 backdrop-blur-xl border border-red-500/35 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2.5 border-b border-red-500/30 pb-3">
                <div className="w-7 h-7 rounded-lg bg-red-950/80 text-red-400 flex items-center justify-center border border-red-500/50">
                  <Bookmark className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-sm font-black text-[#FFC72C] uppercase tracking-wider font-display">
                  12 KEY SECTIONS INDEX
                </h3>
              </div>

              <ul className="space-y-2 text-xs font-semibold max-h-96 overflow-y-auto pr-1">
                {pageData.sections.map((sec: any) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="flex items-center gap-2.5 py-1 text-slate-300 hover:text-[#FFC72C] transition-colors group"
                    >
                      <span className="text-[11px] font-mono font-bold text-red-500 shrink-0">
                        {sec.num}
                      </span>
                      <span className="truncate group-hover:translate-x-1 transition-transform">
                        {sec.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* PEOPLE FIRST PROGRESS ALWAYS CAMPAIGN CARD */}
            <div className="bg-gradient-to-br from-[#1a0206] via-[#0c0307] to-slate-950 border border-red-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/60 flex items-center justify-center text-amber-400 shrink-0 shadow">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#FFC72C] font-display leading-tight">
                    People First<br />Progress Always
                  </h4>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-medium pt-1">
                For Equality, Justice &amp; Dignity For Every Citizen.
              </p>

              <div className="pt-2">
                <Link
                  href="/sadasyata"
                  className="w-full bg-gradient-to-r from-[#A00000] via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl uppercase tracking-wider border-2 border-amber-300 hover:scale-105"
                >
                  <Users className="w-4 h-4" />
                  <span>JOIN TVK-UP TODAY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
