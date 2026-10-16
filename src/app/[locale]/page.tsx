'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import {
  Eye,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
  Bot,
  ArrowRight,
  Glasses,
  HeartPulse,
  Users,
  MapPin,
  Star,
  Activity,
  Image as ImageIcon,
  ChevronLeft,
  Play,
  Pause,
  MoveHorizontal
} from 'lucide-react';

import { getPublicServices, getPublicDoctors } from '@/actions/public';
import { getLiveQueueBoardSummary } from '@/actions/appointment';
import { getHospitalSettings } from '@/actions/hospital';
import { formatTo12Hour } from '@/lib/time';

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [hospital, setHospital] = useState<any>({
    name_en: SEED_DATA.hospital.name_en,
    name_hi: SEED_DATA.hospital.name_hi,
    phone1: SEED_DATA.hospital.phones[0] || '+91 80048 00688',
    emergencyPhone: SEED_DATA.hospital.emergencyPhone || '+91 80048 00688',
    openTime: '09:00',
    closeTime: '18:00',
    closedDay: 'Sunday',
    freeCheckupDay: 'Tuesday',
    freeCheckupEnabled: true,
    emergency24x7: true,
  });

  const [services, setServices] = useState<any[]>(SEED_DATA.services);
  const [doctors, setDoctors] = useState<any[]>(SEED_DATA.doctors.filter(d => d.verificationStatus === 'VERIFIED'));
  const [queueBoard, setQueueBoard] = useState<any>({
    queueActive: true,
    totalToday: 4,
    currentServing: {
      token: 'A-014',
      doctor: 'Dr. Madhav Mukund',
      status: 'IN_CONSULTATION',
      patientName: 'Ram Kumar',
    },
    nextToken: {
      token: 'A-015',
      status: 'Waiting in Lounge',
      patientName: 'Sita Devi',
    },
    waitStats: {
      patientsAhead: 1,
      estMinutes: 12,
      timeWindow: '15-20 min',
    }
  });

  const [galleryFilter, setGalleryFilter] = useState<'all' | 'ot' | 'labs' | 'campus'>('all');
  const [isMarqueePaused, setIsMarqueePaused] = useState<boolean>(false);
  const [marqueeDirection, setMarqueeDirection] = useState<'ltr' | 'rtl'>('ltr');
  const serviceScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollServices = (direction: 'left' | 'right') => {
    if (serviceScrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      serviceScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const serviceImageMap: Record<string, { image: string; tag_en: string; tag_hi: string }> = {
    'srv-checkup': {
      image: '/images/services/general-exam.jpg',
      tag_en: 'Comprehensive OPD Checkup',
      tag_hi: 'सम्पूर्ण ओपीडी नेत्र जांच',
    },
    'srv-cataract': {
      image: '/images/services/cataract-phaco.jpg',
      tag_en: 'Micro-Incision Phaco Surgery',
      tag_hi: 'माइक्रो-इंसीजन फेको ऑपरेशन',
    },
    'srv-retina': {
      image: '/images/services/retina-laser.jpg',
      tag_en: 'Vitreo-Retina Laser & Care',
      tag_hi: 'विट्रियो-रेटिना लेजर व पर्दा जांच',
    },
    'srv-emergency': {
      image: '/images/services/emergency-ocular.jpg',
      tag_en: '24x7 Ocular Trauma & Emergency',
      tag_hi: '24 घंटे आंख की चोट व इमरजेंसी',
    },
    'srv-optometry': {
      image: '/images/services/optometry-glasses.jpg',
      tag_en: 'Computerized Refraction & Frames',
      tag_hi: 'कंप्यूटरीकृत चश्मा जांच व फिटिंग',
    },
    'srv-glaucoma': {
      image: '/images/services/glaucoma-tonometry.jpg',
      tag_en: 'Glaucoma & Eye Pressure',
      tag_hi: 'काला मोतिया व आईओपी जांच',
    },
  };

  const getServiceVisuals = (srvId: string) => {
    return serviceImageMap[srvId] || {
      image: '/images/services/general-exam.jpg',
      tag_en: 'Specialized Eye Care',
      tag_hi: 'विशिष्ट नेत्र चिकित्सा',
    };
  };

  const fetchQueueSummary = async () => {
    const qRes = await getLiveQueueBoardSummary();
    if (qRes && qRes.success) {
      setQueueBoard(qRes);
    }
  };

  React.useEffect(() => {
    async function loadData() {
      const [srvRes, docRes, hospRes] = await Promise.all([
        getPublicServices(),
        getPublicDoctors(),
        getHospitalSettings()
      ]);
      if (srvRes.success) setServices(srvRes.services);
      if (docRes.success) setDoctors(docRes.doctors);
      if (hospRes && hospRes.success && hospRes.hospital) {
        setHospital(hospRes.hospital);
      }
      await fetchQueueSummary();
    }
    loadData();

    // Auto sync live queue board every 5 seconds
    const interval = setInterval(fetchQueueSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  // Compute live open/closed timing
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = daysOfWeek[now.getDay()];
  const isClosedToday = hospital.closedDay && hospital.closedDay !== 'None' && hospital.closedDay === currentDayName;

  const [openH, openM] = (hospital.openTime || '09:00').split(':').map(Number);
  const [closeH, closeM] = (hospital.closeTime || '18:00').split(':').map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = (openH || 9) * 60 + (openM || 0);
  const closeMinutes = (closeH || 18) * 60 + (closeM || 0);
  const isTimeOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  const isOpenNow = !isClosedToday && isTimeOpen;

  const getDayLabel = (d: string) => {
    const map: Record<string, string> = {
      Sunday: 'रविवार',
      Monday: 'सोमवार',
      Tuesday: 'मंगलवार',
      Wednesday: 'बुधवार',
      Thursday: 'गुरुवार',
      Friday: 'शुक्रवार',
      Saturday: 'शनिवार',
      Daily: 'प्रतिदिन',
      None: 'कोई नहीं'
    };
    return locale === 'hi' ? (map[d] || d) : d;
  };

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([
    {
      role: 'bot',
      text: locale === 'hi'
        ? `नमस्ते! मैं ${locale === 'hi' ? hospital.name_hi || 'एम एस मेमोरियल नेत्रालय' : hospital.name_en || 'M S Memorial Netralaya'} एआई सहायक हूं। अपनी आंखों की समस्या (जैसे मोतियाबिंद, पर्दा/रेटिना, धुंधलापन, लाली) बताएं या अस्पताल के बारे में पूछें।`
        : `Hello! I am the ${hospital.name_en || 'M S Memorial Netralaya'} AI Assistant. Describe your eye symptoms (e.g. blurred vision, cataract, retinal issues, redness) or ask hospital FAQs.`
    }
  ]);

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setAiInput('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botReply = locale === 'hi'
        ? 'आपके लक्षणों के आधार पर हम "मोतियाबिंद परामर्श" या "विट्रियो रेटिना जांच" की सलाह देते हैं। ऑनलाइन टोकन बुक करने हेतु नीचे बटन दबाएं।'
        : 'Based on your description, we recommend a "Cataract Consultation" or "Vitreo-Retina Evaluation". Click below to book a digital token appointment.';

      if (lower.includes('pain') || lower.includes('splash') || lower.includes('chemical') || lower.includes('चोट') || lower.includes('दर्द')) {
        const phone = hospital.emergencyPhone || hospital.phone1 || '+91 80048 00688';
        botReply = locale === 'hi'
          ? `⚠️ अति आवश्यक: यदि आंख में गंभीर चोट, केमिकल या असहनीय दर्द है तो तुरंत हमारे 24 घंटे आपातकालीन नंबर ${phone} पर संपर्क करें या दिलदारनगर अस्पताल पहुंचे।`
          : `⚠️ URGENT: If you are experiencing severe eye pain, trauma, or chemical injury, contact our 24x7 emergency helpline ${phone} or visit our Dildarnagar center immediately.`;
      }

      setAiMessages((prev) => [...prev, { role: 'bot', text: botReply }]);
    }, 600);
  };

  // Hospital Gallery Photos from website
  const galleryPhotos = [
    { id: 1, src: '/images/gallery/gallery-1.jpg', tag: 'ot', title: 'Modular Operation Theatre' },
    { id: 2, src: '/images/gallery/gallery-2.jpg', tag: 'ot', title: 'Micro-Incision Phaco Suite' },
    { id: 3, src: '/images/gallery/gallery-3.jpg', tag: 'labs', title: 'Laser Diagnostics & OCT Scan' },
    { id: 4, src: '/images/gallery/gallery-4.jpg', tag: 'campus', title: 'Air-Conditioned Patient Lounge' },
    { id: 5, src: '/images/gallery/gallery-5.jpg', tag: 'labs', title: 'Computerized Refraction Desk' },
    { id: 6, src: '/images/gallery/gallery-6.jpg', tag: 'campus', title: 'Consultation & Examination Room' },
    { id: 7, src: '/images/gallery/gallery-7.jpg', tag: 'campus', title: 'Optical Wing (Chashma Ghar)' },
    { id: 8, src: '/images/gallery/gallery-8.jpg', tag: 'labs', title: 'Advanced Retinal Camera' },
    { id: 9, src: '/images/gallery/gallery-9.jpg', tag: 'ot', title: 'Sterile Surgical Scrub Area' },
  ];

  const filteredGallery = galleryFilter === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.tag === galleryFilter);

  // Real Patient Testimonials from website
  const testimonials = [
    {
      name: 'Dr. C.D. Dwivedi',
      comment: 'Superb clinic! You can\'t believe this type of grand ophthalmic setup exists in Dildarnagar. Even in Varanasi eye hospitals, such care is rare. Dr. Madhav Mukund is very humble, polite and excellent in his expertise. My father\'s both eye cataract surgeries were done here 2 years ago and he is doing great!',
      rating: 5,
      date: 'Patient Testimonial'
    },
    {
      name: 'Gopal Maurya',
      comment: 'I was here to get vision certification for RRB exam. Dr. Madhav Mukund (MBBS, MS) is a man like humble and so polite in nature. Best hospital in Zamania & Ghazipur region if you don\'t want to travel all the way to Varanasi. Digital tokens make it very smooth.',
      rating: 5,
      date: 'RRB Candidate & Patient'
    },
    {
      name: 'Manvendra Singh (Manav)',
      comment: 'Many congratulations and best wishes to M S Memorial Netralaya for providing world-class eye care in Dildarnagar, a small town of Ghazipur district. Top equipment, caring staff, and quick appointments.',
      rating: 5,
      date: 'Verified Patient'
    },
    {
      name: 'Mukesh Singh',
      comment: 'Very experienced and soft-spoken eye doctors in Dildarnagar, Ghazipur. Modern lasers, clean hospital, and zero waiting hassles thanks to the digital token system. Highly recommended!',
      rating: 5,
      date: 'Local Resident'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-blue-900 text-white pt-10 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(19,168,158,0.2),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-200 border border-white/20">
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span>
                {isOpenNow
                  ? `${locale === 'hi' ? 'अभी खुला है' : 'Open Now'} (${formatTo12Hour(hospital.openTime)} - ${formatTo12Hour(hospital.closeTime)})`
                  : isClosedToday
                    ? `${locale === 'hi' ? 'आज अस्पताल बंद है' : 'Hospital Closed Today'} (${getDayLabel(hospital.closedDay)} अवकाश)`
                    : `${locale === 'hi' ? 'अभी बंद है' : 'Closed Now'} (${formatTo12Hour(hospital.openTime)} बजे खुलेगा)`
                } {hospital.emergency24x7 ? `• ${locale === 'hi' ? '24x7 आपातकालीन सेवा' : '24x7 Emergency'}` : ''}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {locale === 'hi' ? (hospital.name_hi || messages.home.heroTitle) : (hospital.name_en || messages.home.heroTitle)}
            </h1>

            <p className="text-sm sm:text-base text-cyan-100 font-normal leading-relaxed">
              {locale === 'hi'
                ? 'दिलदारनगर (गाजीपुर) का विश्वसनीय नेत्र अस्पताल — बिना टांके का फेको मोतियाबिंद ऑपरेशन, विट्रियो-रेटिना लेजर व डिजिटल टोकन परामर्श।'
                : messages.home.heroSubtitle}
            </p>

            {/* Dynamic Free OPD Banner */}
            {hospital.freeCheckupEnabled !== false && (
              <div className="bg-amber-500/20 border border-amber-400/40 p-3.5 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm text-amber-200 font-semibold shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-bounce" />
                <span>
                  {locale === 'hi'
                    ? `विशेष सूचना: हर ${getDayLabel(hospital.freeCheckupDay || 'Tuesday')} को अस्पताल में विशेष नेत्र परामर्श उपलब्ध है! (समय: ${formatTo12Hour(hospital.openTime)} - ${formatTo12Hour(hospital.closeTime)})`
                    : `Special Notice: Free/Special OPD Eye Checkup available every ${hospital.freeCheckupDay || 'Tuesday'}! (Timings: ${formatTo12Hour(hospital.openTime)} - ${formatTo12Hour(hospital.closeTime)})`}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={`/${locale}/appointment`}
                className="bg-accent hover:bg-teal-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg flex items-center text-sm transition transform active:scale-95"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {messages.common.bookAppointment}
              </Link>

              <Link
                href={`/${locale}/emergency`}
                className="bg-emergency hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-emergency flex items-center text-sm transition transform active:scale-95"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                {messages.common.emergencyBtn}
              </Link>
            </div>
          </div>

          {/* Hero Quick Live Token Tracker Box */}
          <div className="lg:col-span-5">
            <div className="bg-white text-hospitalText p-6 rounded-2xl shadow-2xl border border-hospitalBorder space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-accent" /> Live Queue Board (OPD 1)
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center animate-pulse">
                  ● {queueBoard.queueActive ? (locale === 'hi' ? 'लाइव कतार सक्रिय' : 'Queue Active') : (locale === 'hi' ? 'कतार बंद' : 'Queue Closed')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200 hover:-translate-y-1 transition-transform">
                  <span className="text-xs text-mutedText font-semibold">{messages.token.currentlyServing}</span>
                  <div className="relative inline-flex items-center justify-center w-full">
                    <span className="absolute w-12 h-12 rounded-full bg-primary/20 animate-ping"></span>
                    <div className="text-3xl font-extrabold text-primary font-mono mt-1 relative z-10">
                      {queueBoard.currentServing?.token || 'A-014'}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium block truncate mt-0.5">
                    {queueBoard.currentServing?.doctor || 'Dr. Madhav Mukund'}
                  </span>
                </div>
                <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200 hover:-translate-y-1 transition-transform">
                  <span className="text-xs text-mutedText font-semibold">
                    {locale === 'hi' ? 'अगला टोकन' : 'Next Token'}
                  </span>
                  <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
                    {queueBoard.nextToken?.token || 'A-015'}
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium block truncate mt-0.5">
                    {queueBoard.nextToken?.status || (locale === 'hi' ? 'प्रतीक्षालय में' : 'Waiting in Lounge')}
                  </span>
                </div>
              </div>

              {/* Dynamic Estimated Wait Time notice */}
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-center space-y-0.5">
                <div className="text-xs font-bold text-blue-900 flex justify-center items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {locale === 'hi' ? 'अगले मरीज का अनुमानित समय (ETA)' : 'Estimated Wait Window for Next Patient'}:
                  </span>
                  <span className="text-primary font-extrabold font-mono">
                    {queueBoard.waitStats?.timeWindow} (~{queueBoard.waitStats?.estMinutes} min)
                  </span>
                </div>
                <p className="text-[10px] text-blue-700">
                  {locale === 'hi' 
                    ? `कतार में कुल ${queueBoard.waitStats?.patientsAhead || 1} मरीज आगे हैं • प्रति मरीज ~12 मिनट परामर्श` 
                    : `${queueBoard.waitStats?.patientsAhead || 1} patients in queue • ~12 mins average consult time`}
                </p>
              </div>

              <Link
                href={`/${locale}/track`}
                className="w-full bg-hospitalBg hover:bg-gray-100 text-primary-dark border border-gray-200 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center transition"
              >
                {messages.nav.trackAppointment}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TRUST STATS & HIGHLIGHTS BAR WITH FLOATING MICRO-ANIMATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface-card p-4 rounded-xl shadow-card hover:shadow-xl border border-hospitalBorder flex items-center space-x-3 animate-float-slow hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-primary-dark">Est. 2008</p>
              <p className="text-[11px] text-mutedText">{locale === 'hi' ? '16+ वर्षों का भरोसा' : '16+ Years of Trust'}</p>
            </div>
          </div>

          <div className="surface-card p-4 rounded-xl shadow-card hover:shadow-xl border border-hospitalBorder flex items-center space-x-3 animate-float-delayed hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-primary-dark">50,000+</p>
              <p className="text-[11px] text-mutedText">{locale === 'hi' ? 'सफल नेत्र उपचार' : 'Happy Patients'}</p>
            </div>
          </div>

          <div className="surface-card p-4 rounded-xl shadow-card hover:shadow-xl border border-hospitalBorder flex items-center space-x-3 animate-float-slow hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-primary-dark">{locale === 'hi' ? 'मॉड्यूलर ओटी' : 'Modular OT'}</p>
              <p className="text-[11px] text-mutedText">{locale === 'hi' ? 'विश्वस्तरीय फेको मशीन' : 'Advanced Surgical Suites'}</p>
            </div>
          </div>

          <div className="surface-card p-4 rounded-xl shadow-card hover:shadow-xl border border-hospitalBorder flex items-center space-x-3 animate-float-delayed hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-primary-dark">{locale === 'hi' ? 'डिजिटल कतार' : 'Digital Tokens'}</p>
              <p className="text-[11px] text-mutedText">{locale === 'hi' ? 'शून्य प्रतीक्षा समय' : 'Live ETA Wait Tracking'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT HOSPITAL & FOUNDER SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="surface-card rounded-2xl shadow-card border border-hospitalBorder p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              <HeartPulse className="w-4 h-4" />
              <span>{locale === 'hi' ? 'गाजीपुर का सर्वश्रेष्ठ नेत्र चिकित्सालय' : 'Best Eye Centre in Ghazipur'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark leading-tight">
              {locale === 'hi' 
                ? 'एम एस मेमोरियल नेत्रालय — एक छत के नीचे सम्पूर्ण नेत्र समाधान' 
                : 'Welcome to M S Memorial Netralaya Hospital'}
            </h2>

            <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
              {locale === 'hi'
                ? '2008 में स्थापित, एम एस मेमोरियल नेत्रालय पूर्वी उत्तर प्रदेश के दिलदारनगर में ग्रामीण व शहरी मरीजों को उच्चतम स्तर की फेको मोतियाबिंद एवं रेटिना लेजर सुविधाएं उपलब्ध कराने के लिए समर्पित है। हमारे संस्थापक डॉ० माधव मुकुंद (MBBS - KGMC लखनऊ, MS - GSVM कानपुर) के नेतृत्व में अस्पताल विश्वस्तरीय आयातित उपकरणों से सुसज्जित है।'
                : 'Established in 2008 in Dildarnagar, M S Memorial Netralaya is equipped with world-class, imported instruments for simple and complex disorders of the eye. Led by Dr. Madhaw Mukund (KGMC Lucknow & GSVM Kanpur), our hospital brings advanced micro-incision cataract surgery, German retinal lasers, and patient comfort directly to Eastern UP.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-hospitalText pt-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'hi' ? 'फेको मोतियाबिंद बिना टांके का ऑपरेशन' : 'Stitchless Micro-Incision Phaco'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'hi' ? 'उत्तर भारत के शीर्ष रेटिना विशेषज्ञ' : 'Renowned Vitreo-Retina Specialists'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'hi' ? 'वातानुकूलित ओपीडी व प्रतीक्षा लाउंज' : 'Centrally Air-Conditioned OPD & Lounge'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'hi' ? '24x7 आंख की चोट व इमरजेंसी सुविधा' : '24x7 Ocular Emergency Services'}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/about`}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center shadow-sm"
              >
                {locale === 'hi' ? 'विस्तार से जानें' : 'Read Full History'} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <a
                href={`tel:${hospital.phone1.replace(/\s/g, '')}`}
                className="bg-gray-100 hover:bg-gray-200 text-primary-dark text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center"
              >
                📞 {hospital.phone1}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hospital-building.jpg"
                alt="M S Memorial Netralaya Campus"
                className="w-full h-72 object-cover hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                <p className="text-sm font-bold">M S Memorial Netralaya</p>
                <p className="text-[11px] text-gray-200 flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-cyan-300" /> Dildarnagar Tarighat Road, Ghazipur
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. HOSPITAL EYE SERVICES (2X PASSPORT PHOTOS & AUTO-FLOATING TRACK) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '6s' }} />
              <span>{locale === 'hi' ? 'विशेषज्ञ नेत्र चिकित्सा सेवाएं' : 'Advanced Eye Care Services'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
              {messages.services.title}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              {locale === 'hi'
                ? 'मोतियाबिंद, रेटिना, ग्लूकोमा एवं चश्मा हटाने की आधुनिकतम सुविधाएं'
                : 'Comprehensive specialized ophthalmic care with imported precision equipment.'}
            </p>
          </div>

          {/* Interactive Floating Controls & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Auto-Floating Status Badge */}
            <span className="hidden sm:inline-flex items-center text-[11px] font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-xl border border-accent/20">
              <span className={`w-2 h-2 rounded-full mr-1.5 ${isMarqueePaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              {isMarqueePaused 
                ? (locale === 'hi' ? 'फ्लोटिंग थमी हुई है' : 'Floating Paused') 
                : (locale === 'hi' ? 'ऑटो-फ्लोटिंग (बाएं से दाएं)' : 'Auto-Floating (Left to Right)')}
            </span>

            {/* Pause / Play Toggle */}
            <button
              onClick={() => setIsMarqueePaused(!isMarqueePaused)}
              title={isMarqueePaused ? (locale === 'hi' ? 'चालू करें' : 'Play motion') : (locale === 'hi' ? 'रोकें' : 'Pause motion')}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-primary-dark rounded-xl transition border border-gray-200 text-xs font-bold flex items-center"
              aria-label="Toggle auto-floating"
            >
              {isMarqueePaused ? <Play className="w-4 h-4 fill-current text-emerald-600" /> : <Pause className="w-4 h-4 text-primary" />}
            </button>

            {/* Direction Toggle (Left to Right / Right to Left) */}
            <button
              onClick={() => setMarqueeDirection(marqueeDirection === 'ltr' ? 'rtl' : 'ltr')}
              title={locale === 'hi' ? 'दिशा बदलें' : 'Change direction'}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-primary-dark rounded-xl transition border border-gray-200 text-xs font-bold flex items-center"
              aria-label="Toggle direction"
            >
              <MoveHorizontal className="w-4 h-4 text-primary" />
            </button>

            {/* Manual Scroll Buttons */}
            <button
              onClick={() => scrollServices('left')}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-primary-dark rounded-xl transition border border-gray-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollServices('right')}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-primary-dark rounded-xl transition border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link href={`/${locale}/services`} className="text-xs font-bold text-primary hover:underline flex items-center ml-1">
              {messages.common.viewDetails} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Auto-Floating Continuous Carousel Track */}
        <div
          ref={serviceScrollRef}
          className="relative overflow-x-auto no-scrollbar py-3 -mx-4 px-4 select-none"
        >
          <div
            className={`marquee-track-${marqueeDirection} gap-6 ${isMarqueePaused ? 'paused' : ''}`}
            onMouseEnter={() => setIsMarqueePaused(true)}
            onMouseLeave={() => setIsMarqueePaused(false)}
          >
            {[...services, ...services].map((srv, idx) => {
              const visuals = getServiceVisuals(srv.id);

              return (
                <div
                  key={`${srv.id}-${idx}`}
                  className="w-[310px] sm:w-[350px] shrink-0 surface-card rounded-2xl shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-hospitalBorder overflow-hidden group hover:-translate-y-2 bg-white"
                >
                  {/* Photo Container: Twice passport size (h-48 = 192px), real eye procedure photo */}
                  <div className="relative w-full h-48 overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={visuals.image}
                      alt={locale === 'hi' ? srv.name_hi : srv.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                    
                    {/* Procedure Badge */}
                    <span className="absolute top-3 left-3 bg-primary-dark/85 backdrop-blur-md text-cyan-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">
                      {locale === 'hi' ? visuals.tag_hi : visuals.tag_en}
                    </span>

                    {/* Fee Status Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
                      <span className="font-bold text-white bg-emerald-600/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] shadow">
                        {srv.defaultFee > 0 ? `Fee ₹${srv.defaultFee}` : 'Free OPD'}
                      </span>
                      <span className="text-[10px] text-gray-200 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                        {messages.common.feeNotice}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Title, Untouched Descriptions, and Action Link */}
                  <div className="p-5 space-y-3 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-base text-primary-dark group-hover:text-primary transition leading-snug line-clamp-2">
                        {locale === 'hi' ? srv.name_hi : srv.name_en}
                      </h3>
                      <p className="text-xs text-mutedText leading-relaxed line-clamp-3">
                        {locale === 'hi' ? srv.desc_hi : srv.desc_en}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-accent flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-accent" />
                        {locale === 'hi' ? 'वरिष्ठ विशेषज्ञ' : 'Senior Specialist'}
                      </span>
                      <Link
                        href={`/${locale}/appointment?service=${srv.id}`}
                        className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center shadow-sm group-hover:shadow"
                      >
                        {messages.common.bookAppointment} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW DIGITAL TOKEN BOOKING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">{messages.home.howItWorksTitle}</h2>
          <p className="text-xs sm:text-sm text-mutedText">
            {locale === 'hi'
              ? 'अस्पताल में लंबी कतारों से बचें। डिजिटल टोकन से अपनी बारी का सटीक समय घर बैठे जानें।'
              : 'Avoid long queues at the hospital. Track your turn live from home with digital tokens.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="surface-card p-5 rounded-2xl shadow-card hover:shadow-xl text-center space-y-2 relative border border-hospitalBorder hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto font-bold text-lg group-hover:scale-110 transition-transform">1</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step1Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step1Desc}</p>
          </div>

          <div className="surface-card p-5 rounded-2xl shadow-card hover:shadow-xl text-center space-y-2 relative border border-hospitalBorder hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto font-bold text-lg group-hover:scale-110 transition-transform">2</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step2Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step2Desc}</p>
          </div>

          <div className="surface-card p-5 rounded-2xl shadow-card hover:shadow-xl text-center space-y-2 relative border border-hospitalBorder hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg group-hover:scale-110 transition-transform">3</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step3Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step3Desc}</p>
          </div>

          <div className="surface-card p-5 rounded-2xl shadow-card hover:shadow-xl text-center space-y-2 relative border border-hospitalBorder hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg group-hover:scale-110 transition-transform">4</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step4Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED SPECIALISTS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">
              {locale === 'hi' ? 'हमारे प्रमाणित नेत्र रोग विशेषज्ञ' : 'Group Of Certified & Experienced Doctors'}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              {locale === 'hi'
                ? 'केजीएमसी, जीएसवीएम एवं अंतरराष्ट्रीय संस्थानों से प्रशिक्षित वरिष्ठ नेत्र सर्जन'
                : 'Consult directly with experienced ophthalmic and vitreo-retinal specialists.'}
            </p>
          </div>
          <Link href={`/${locale}/doctors`} className="text-xs font-bold text-primary hover:underline flex items-center">
            {messages.common.viewDetails} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="surface-card p-6 rounded-2xl shadow-card hover:shadow-xl transition space-y-4 flex flex-col justify-between border border-hospitalBorder">
              <div className="space-y-3 text-center">
                {/* Doctor Avatar with real photo if available */}
                <div className="relative w-28 h-28 mx-auto">
                  {doc.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.photoUrl}
                      alt={doc.fullName}
                      className="w-28 h-28 object-cover rounded-full border-2 border-primary shadow"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-cyan-100 text-primary rounded-full flex items-center justify-center mx-auto border-2 border-primary/20 shadow">
                      <span className="text-2xl font-extrabold">{doc.fullName.split(' ').map((n: any) => n[0]).join('')}</span>
                    </div>
                  )}
                  <span className="absolute bottom-0 right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] shadow">
                    ✓
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-primary-dark">{doc.fullName}</h3>
                  <span className="text-xs font-semibold text-accent block mt-0.5">
                    {locale === 'hi' ? doc.specialization_hi : doc.specialization_en}
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">
                    {doc.qualification}
                  </span>
                </div>

                <p className="text-xs text-mutedText line-clamp-3 leading-relaxed">
                  {locale === 'hi' ? doc.bio_hi : doc.bio_en}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs text-mutedText">
                  <span>{doc.experienceYears} {messages.doctors.experience}</span>
                  <span className="font-bold text-primary-dark">Fee: ₹{doc.consultationFee}</span>
                </div>

                <Link
                  href={`/${locale}/appointment?doctor=${doc.id}`}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-xs font-bold text-center block transition shadow-sm"
                >
                  {messages.doctors.bookWithDoctor}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOSPITAL PHOTO GALLERY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'अस्पताल फोटो गैलरी' : 'Hospital Photo Gallery'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">
              {locale === 'hi' ? 'एम एस मेमोरियल नेत्रालय परिसर एवं सुविधाएं' : 'World-Class Facility & Infrastructure'}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              {locale === 'hi'
                ? 'हमारे अत्याधुनिक मॉड्यूलर ओटी, लेजर जांच केंद्र व वातानुकूलित लाउंज की वास्तविक झलकियां।'
                : 'A glimpse into our sterile modular OT, laser diagnostic wings, and patient waiting areas.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl text-xs font-bold mt-4 sm:mt-0">
            <button
              onClick={() => setGalleryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${galleryFilter === 'all' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-black'}`}
            >
              {locale === 'hi' ? 'सभी फोटो' : 'All'}
            </button>
            <button
              onClick={() => setGalleryFilter('ot')}
              className={`px-3 py-1.5 rounded-lg transition ${galleryFilter === 'ot' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-black'}`}
            >
              {locale === 'hi' ? 'ऑपरेशन थिएटर' : 'Operation Theatre'}
            </button>
            <button
              onClick={() => setGalleryFilter('labs')}
              className={`px-3 py-1.5 rounded-lg transition ${galleryFilter === 'labs' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-black'}`}
            >
              {locale === 'hi' ? 'निदान व लेजर' : 'Diagnostics & Laser'}
            </button>
            <button
              onClick={() => setGalleryFilter('campus')}
              className={`px-3 py-1.5 rounded-lg transition ${galleryFilter === 'campus' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:text-black'}`}
            >
              {locale === 'hi' ? 'परिसर व लाउंज' : 'Campus & Lounge'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredGallery.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden shadow-card border border-hospitalBorder bg-black h-48 sm:h-64"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-95 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <span className="text-white text-xs sm:text-sm font-bold">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. REAL PATIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{locale === 'hi' ? 'संतुष्ट मरीज' : 'Patient Reviews'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">
            {locale === 'hi' ? 'हमारे मरीज क्या कहते हैं' : 'What Our Patients Say About Us'}
          </h2>
          <p className="text-xs sm:text-sm text-mutedText">
            {locale === 'hi'
              ? 'दिलदारनगर, जमानिया, गाजीपुर एवं आसपास के हजारों मरीजों का विश्वसनीय अनुभव।'
              : 'Real feedback from patients across Dildarnagar, Zamania, and Ghazipur.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-mutedText leading-relaxed italic line-clamp-6">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="font-bold text-xs text-primary-dark">{t.name}</p>
                <p className="text-[10px] text-gray-500">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. AI CHAT FLOATING WIDGET (UNTOUCHED FUNCTIONALITY) */}
      <div className="fixed bottom-20 right-4 z-40">
        {!aiChatOpen ? (
          <button
            onClick={() => setAiChatOpen(true)}
            className="bg-primary text-white p-3.5 rounded-full shadow-floating flex items-center space-x-2 font-bold text-xs hover:bg-primary-dark transition transform active:scale-95 border border-cyan-400"
          >
            <Bot className="w-5 h-5 text-cyan-300" />
            <span className="hidden sm:inline">{messages.ai.chatTitle}</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-hospitalBorder w-80 sm:w-96 flex flex-col h-96 overflow-hidden">
            <div className="bg-primary text-white p-3.5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-300" />
                <span className="font-bold text-sm">{messages.ai.chatTitle}</span>
              </div>
              <button onClick={() => setAiChatOpen(false)} className="text-white hover:text-gray-200 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs bg-hospitalBg">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-hospitalText shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="p-2 border-t border-gray-200 flex space-x-2 bg-white">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={messages.ai.chatPlaceholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
