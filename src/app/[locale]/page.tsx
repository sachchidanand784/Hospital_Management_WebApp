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
  MoveHorizontal,
  BadgeCheck,
  Stethoscope,
  Check,
  Zap,
  Layers
} from 'lucide-react';

import { getPublicServices, getPublicDoctors } from '@/actions/public';
import { getLiveQueueBoardSummary } from '@/actions/appointment';
import { getHospitalSettings } from '@/actions/hospital';
import { formatTo12Hour } from '@/lib/time';
import { ScrollZoomOut } from '@frontend/components/common/ScrollZoom';

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

  // Featured Common Eye Diseases & Symptoms with Real Photos
  const featuredDiseases = [
    {
      id: 'prob-6',
      name_en: 'Cloudy or Hazed Vision (Cataract)',
      name_hi: 'धुंधला या जाला सा दिखना (मोतियाबिंद)',
      image: '/images/diseases/cloudy-cataract.jpg',
      category_en: 'Cataract / Motiyabind',
      category_hi: 'मोतियाबिंद (सफेद मोतिया)',
      badgeColor: 'bg-purple-600 text-white',
      serviceId: 'srv-cataract',
      serviceName_en: 'Cataract Evaluation & Phaco Surgery',
      serviceName_hi: 'मोतियाबिंद जांच एवं फेको ऑपरेशन',
      redFlag: false,
    },
    {
      id: 'prob-2',
      name_en: 'Eye Redness & Irritation',
      name_hi: 'आंखों में लाली एवं जलन',
      image: '/images/diseases/eye-redness.jpg',
      category_en: 'Redness & Allergy',
      category_hi: 'लाली एवं एलर्जी',
      badgeColor: 'bg-rose-600 text-white',
      serviceId: 'srv-checkup',
      serviceName_en: 'General Eye Examination & Consultation',
      serviceName_hi: 'सामान्य नेत्र जांच एवं परामर्श',
      redFlag: false,
    },
    {
      id: 'prob-9',
      name_en: 'Black Spots & Floaters in Vision',
      name_hi: 'आंखों के आगे काले धब्बे (फ्लोटर्स)',
      image: '/images/diseases/eye-floaters.jpg',
      category_en: 'Vitreo-Retina',
      category_hi: 'विट्रियो-रेटिना (पर्दा)',
      badgeColor: 'bg-teal-600 text-white',
      serviceId: 'srv-retina',
      serviceName_en: 'Vitreo Retinal Laser & Surgery',
      serviceName_hi: 'विट्रियो रेटिना लेजर व शल्य चिकित्सा',
      redFlag: false,
    },
    {
      id: 'prob-10',
      name_en: 'Light Flashes / Curtain Effect',
      name_hi: 'रोशनी की लकीरें या पर्दा गिरना',
      image: '/images/diseases/flashes-curtain.jpg',
      category_en: 'Retinal Detachment Alert',
      category_hi: 'पर्दा गिरना / रेड फ्लैग',
      badgeColor: 'bg-red-600 text-white',
      serviceId: 'srv-retina',
      serviceName_en: 'Vitreo Retinal Laser & Surgery',
      serviceName_hi: 'विट्रियो रेटिना लेजर व शल्य चिकित्सा',
      redFlag: true,
    },
    {
      id: 'prob-4',
      name_en: 'Dry Eyes, Burning & Fatigue',
      name_hi: 'सूखी आंखें, जलन एवं थकावट',
      image: '/images/diseases/dry-eyes.jpg',
      category_en: 'Dry Eye Syndrome',
      category_hi: 'ड्राय आई (सूखापन)',
      badgeColor: 'bg-amber-600 text-white',
      serviceId: 'srv-checkup',
      serviceName_en: 'General Eye Examination & Consultation',
      serviceName_hi: 'सामान्य नेत्र जांच एवं परामर्श',
      redFlag: false,
    },
    {
      id: 'prob-16',
      name_en: 'Glasses Power Check & Refraction',
      name_hi: 'चश्मा नंबर जांच व दृष्टि सुधार',
      image: '/images/diseases/glass-power-check.jpg',
      category_en: 'Optometry & Glasses',
      category_hi: 'चश्मा घर (ऑप्टिकल)',
      badgeColor: 'bg-emerald-600 text-white',
      serviceId: 'srv-optometry',
      serviceName_en: 'Optometry: Eye Number Check & Glasses Fitting',
      serviceName_hi: 'ऑप्टोमेट्री: चश्मा नंबर जांच एवं फिटिंग',
      redFlag: false,
    },
  ];

  // Official Core Specialties (Authentic icons from msmemorialnetralaya.com: c1.png, c2.png, c3.png, c4.png)
  const coreSpecialties = [
    {
      id: 'cataract',
      name_en: 'Cataract & Refractive Care',
      name_hi: 'मोतियाबिंद एवं दृष्टि सुधार (फेको)',
      image: '/images/showcase/c1.png',
      desc_en: 'Clear vision, better life. Comprehensive cataract & refractive care. Expert surgeons. State-of-the-art technology.',
      desc_hi: 'स्पष्ट दृष्टि, बेहतर जीवन। सम्पूर्ण मोतियाबिंद एवं रिफ्रैक्टिव केयर। आधुनिक फेको मशीन व विश्वस्तरीय फोल्डेबल लेंस।',
      features_en: ['Micro-Incision Phaco Surgery', 'Zero Stitch & Painless', 'Foldable IOL Implantation'],
      features_hi: ['माइक्रो-इंसीजन फेको सर्जरी', 'बिना सुई, बिना टांके का ऑपरेशन', 'आधुनिक फोल्डेबल लेंस'],
      serviceId: 'srv-cataract',
      badge_en: 'Advanced Phaco',
      badge_hi: 'फेको सेंटर',
      accentColor: 'border-teal-200 hover:border-teal-400 bg-gradient-to-b from-teal-50/40 via-white to-white',
      badgeBg: 'bg-teal-600 text-white',
    },
    {
      id: 'retina',
      name_en: 'Vitreo Retina Services',
      name_hi: 'विट्रियो रेटिना एवं पर्दा जांच',
      image: '/images/showcase/c2.png',
      desc_en: 'Advanced vitreo-retina care. Expert specialists. Preserve your vision. State-of-the-art treatments.',
      desc_hi: 'अत्याधुनिक विट्रियो-रेटिना केयर। डायबिटीज पर्दा रोग, रेटिनल लेजर एवं दृष्टि सुरक्षा हेतु विशेषज्ञ उपचार।',
      features_en: ['Green Laser Photocoagulation', 'OCT 3D Macular Evaluation', 'Diabetic Retinopathy Care'],
      features_hi: ['ग्रीन लेजर फोटोकोएग्यूलेशन', 'ओसीटी 3D मैक्यूला स्कैन', 'डायबिटीज पर्दा जांच व बचाव'],
      serviceId: 'srv-retina',
      badge_en: 'Retina Laser',
      badge_hi: 'रेटिना लेजर',
      accentColor: 'border-cyan-200 hover:border-cyan-400 bg-gradient-to-b from-cyan-50/40 via-white to-white',
      badgeBg: 'bg-cyan-600 text-white',
    },
    {
      id: 'glaucoma',
      name_en: 'Glaucoma Services',
      name_hi: 'काला मोतिया (ग्लूकोमा) सेवा',
      image: '/images/showcase/c3.png',
      desc_en: 'Comprehensive glaucoma care. Experienced specialists. Protect your vision. Advanced treatments.',
      desc_hi: 'सम्पूर्ण ग्लूकोमा जांच व उपचार। आंख के आंतरिक दबाव (आईओपी) की सटीक जांच व स्थायी अंधापन रोकथाम।',
      features_en: ['Goldmann Applanation Tonometry', 'Visual Field Perimetry', 'Optic Nerve Monitoring'],
      features_hi: ['गोल्डमैन एप्लेनेशन टोनोमेट्री', 'विजुअल फील्ड पेरीमेट्री टेस्ट', 'ऑप्टिक नर्व सुरक्षा परामर्श'],
      serviceId: 'srv-glaucoma',
      badge_en: 'IOP & Nerve Care',
      badge_hi: 'काला मोतिया',
      accentColor: 'border-indigo-200 hover:border-indigo-400 bg-gradient-to-b from-indigo-50/40 via-white to-white',
      badgeBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'oculoplasty',
      name_en: 'Oculoplasty Services',
      name_hi: 'ऑकुलोप्लास्टी एवं पलक शल्य चिकित्सा',
      image: '/images/showcase/c4.png',
      desc_en: 'Enhance your eyes and face. Skilled oculoplasty specialists. Aesthetic & functional solutions.',
      desc_hi: 'आंखों व पलकों की सुंदरता और कार्यप्रणाली का सुधार। पलक का झुकना (पीटोसिस) व अश्रु नली का शल्य उपचार।',
      features_en: ['Ptosis (Drooping Eyelid) Repair', 'Tear Duct (DCR) Surgery', 'Ophthalmic Aesthetic Solutions'],
      features_hi: ['झुकी हुई पलक (पीटोसिस) सर्जरी', 'अश्रु नली (DCR) ऑपरेशन', 'नेत्र सौंदर्य व पुनर्निर्माण'],
      serviceId: 'srv-checkup',
      badge_en: 'Eyelid Care',
      badge_hi: 'पलक सर्जरी',
      accentColor: 'border-purple-200 hover:border-purple-400 bg-gradient-to-b from-purple-50/40 via-white to-white',
      badgeBg: 'bg-purple-600 text-white',
    },
  ];

  // Advanced Diagnostic Technology Platform (Authentic graphics from msmemorialnetralaya.com: circle.png, 2.png, bb.png)
  const advancedTechShowcase = [
    {
      title_en: 'Visual Field Perimetry & Tonometry',
      title_hi: 'विजुअल फील्ड पेरीमेट्री एवं टोनोमेट्री',
      image: '/images/showcase/circle.png',
      tag_en: 'Automated Diagnostic',
      tag_hi: 'स्वचालित जांच',
      desc_en: 'High precision computerized visual field evaluation for early detection of glaucoma, optic nerve abnormalities, and neurological visual loss.',
      desc_hi: 'काला मोतिया (ग्लूकोमा) एवं ऑप्टिक नर्व रोगों की प्रारंभिक पहचान हेतु विश्वस्तरीय स्वचालित विजुअल फील्ड मैपिंग।',
    },
    {
      title_en: 'Digital Retinal Laser & Fundus Imaging',
      title_hi: 'डिजिटल रेटिना लेजर एवं फंडस इमेजिंग',
      image: '/images/showcase/2.png',
      tag_en: 'Precision Retina Suite',
      tag_hi: 'सटीक रेटिना प्लेटफॉर्म',
      desc_en: 'State-of-the-art retinal lasers and high-resolution imaging to safeguard vision against diabetic retinopathy, retinal tears, and vein occlusions.',
      desc_hi: 'डायबिटीज के कारण पर्दे की क्षति, पर्दे में छेद व नसों के अवरोध का लेजर द्वारा तत्काल व सुरक्षित उपचार।',
    },
    {
      title_en: 'Modular Micro-Incision Phaco Surgical Station',
      title_hi: 'मॉड्यूलर माइक्रो-इंसीजन फेको शल्य चिकित्सा स्टेशन',
      image: '/images/showcase/bb.png',
      tag_en: 'Sterile Modular OT',
      tag_hi: 'अल्ट्रा-क्लीन ओटी',
      desc_en: 'Zero-stitch, cold-phacoemulsification technology with premium foldable intraocular lens implantation ensuring rapid visual recovery.',
      desc_hi: 'बिना सुई, बिना टांके व बिना पट्टी का आधुनिक फेको मोतियाबिंद ऑपरेशन — त्वरित रिकवरी एवं स्पष्ट दृष्टि।',
    },
  ];

  // Founder & Chief Doctor Specialized Treatments Checklist (Exact 11 treatments provided by user)
  const founderTreatments = [
    { en: 'Conjunctivitis Treatment', hi: 'कंजक्टिवाइटिस (आंख आना) उपचार' },
    { en: 'Retinal Lasers Treatment', hi: 'रेटिना लेजर व पर्दा जांच' },
    { en: 'Visual Field Test', hi: 'विजुअल फील्ड पेरीमेट्री टेस्ट' },
    { en: 'Eye Surgery', hi: 'सूक्ष्मदर्शी नेत्र शल्य चिकित्सा' },
    { en: 'Cornea Disorders Treatment', hi: 'कॉर्निया विकार एवं पुतली रोग' },
    { en: 'Eye Care Treatment', hi: 'व्यापक नेत्र स्वास्थ्य परामर्श' },
    { en: 'Foreign Body Eyes Examination', hi: 'आंख में बाहरी कण व चोट परीक्षण' },
    { en: 'Glaucoma Treatment', hi: 'काला मोतिया (ग्लूकोमा) उपचार' },
    { en: 'Vision Check Up', hi: 'कंप्यूटरीकृत नजर व चश्मा जांच' },
    { en: 'LASIK Surgery', hi: 'लेसिक एवं चश्मा मुक्ति परामर्श' },
    { en: 'Eyelid Surgery', hi: 'पलक एवं ऑकुलोप्लास्टी सर्जरी' },
  ];

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* 0. AMBIENT HOSPITAL ARCHITECTURAL BACKGROUND WATERMARK FOR LANDING PAGE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hospital-building.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-[0.25] filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F9FC]/40 to-[#F5F9FC]/70" />
      </div>

      <div className="relative z-10 space-y-12">
        {/* 1. HERO BANNER WITH DIRECT HOSPITAL BUILDING COVER BACKGROUND */}
        <section className="relative bg-[#071E3D] text-white pt-10 pb-16 px-4 overflow-hidden">
          {/* Hospital Building Landing Cover Background - High Visibility Watermark */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hospital-building.jpg"
              alt="M S Memorial Netralaya Building"
              className="w-full h-full object-cover object-center scale-105 opacity-90 filter contrast-110 brightness-90"
            />
            {/* Soft translucent medical tint so the hospital building is clearly visible while text retains high contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#071E3D]/70 via-[#0B2545]/45 to-[#071E3D]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(19,168,158,0.25),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071E3D]/80 via-transparent to-black/25" />
          </div>
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

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              {locale === 'hi' ? (hospital.name_hi || messages.home.heroTitle) : (hospital.name_en || messages.home.heroTitle)}
            </h1>

            <p className="text-sm sm:text-base text-cyan-100 font-normal leading-relaxed drop-shadow">
              {locale === 'hi'
                ? 'दिलदारनगर (गाजीपुर) का विश्वसनीय नेत्र अस्पताल — बिना टांके का फेको मोतियाबिंद ऑपरेशन, विट्रियो-रेटिना लेजर व डिजिटल टोकन परामर्श।'
                : messages.home.heroSubtitle}
            </p>

            {/* Founder & Hospital Honour Spotlight Card (Opposite to Token Display) */}
            <a
              href="#honour-founder"
              className="group block bg-gradient-to-r from-white/15 via-white/10 to-transparent hover:from-white/20 hover:to-white/15 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/20 hover:border-amber-300/60 shadow-xl transition-all max-w-xl"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-xl overflow-hidden border-2 border-amber-300/90 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/founder/dr-madhav-mukund-portrait.png"
                    alt="Dr. Madhav Mukund"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-primary/95 text-[9px] font-extrabold text-center text-amber-200 py-0.5 tracking-wider shadow">
                    HONOUR
                  </div>
                </div>
                <div className="space-y-1 text-left min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-400/40">
                    <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>{locale === 'hi' ? 'अस्पताल के मुख्य संरक्षक व संस्थापक' : 'Hospital Honour & Chief Founder'}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight group-hover:text-amber-200 transition">
                      Dr. Madhav Mukund
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-emerald-300 font-semibold bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/30">
                      MBBS, MS
                    </span>
                    <BadgeCheck className="w-4 h-4 text-emerald-400 inline shrink-0" />
                  </div>
                  <p className="text-xs text-cyan-100 font-medium leading-snug">
                    {locale === 'hi'
                      ? 'वरिष्ठ नेत्र रोग विशेषज्ञ व आई सर्जन (Varanasi / Ghazipur)'
                      : 'Renowned Senior Eye Specialist & Surgeon (Varanasi / Ghazipur)'}
                  </p>
                  <p className="text-[11px] text-gray-300 flex items-center justify-between gap-1">
                    <span>{locale === 'hi' ? 'फेको मोतियाबिंद, ग्लूकोमा व रेटिना रोग विशेषज्ञ' : 'Phaco Cataract, Glaucoma & Vitreo-Retina Specialist'}</span>
                    <span className="text-amber-300 font-bold text-[10px] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 shrink-0">
                      {locale === 'hi' ? 'विस्तार से' : 'Details'} <ChevronRight className="w-3 h-3" />
                    </span>
                  </p>
                </div>
              </div>
            </a>

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
      <ScrollZoomOut amount={0.2} scaleFrom={1.06} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
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
      </ScrollZoomOut>

      {/* 3. ABOUT HOSPITAL & WELCOME SHOWCASE */}
      <ScrollZoomOut amount={0.15} scaleFrom={1.06} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </ScrollZoomOut>

      {/* 4. HOSPITAL HONOUR & FOUNDER SHOWCASE — DR. MADHAV MUKUND */}
      <ScrollZoomOut amount={0.15} scaleFrom={1.06} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="honour-founder" className="surface-card rounded-3xl shadow-2xl border-2 border-primary/20 overflow-hidden bg-gradient-to-b from-white via-[#F8FBFE] to-white scroll-mt-28">
          {/* Top Banner Ribbon */}
          <div className="bg-gradient-to-r from-[#071E3D] via-primary to-[#071E3D] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 bg-amber-400 text-slate-900 rounded-lg shadow font-extrabold text-sm">👑</span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-200 block">
                  {locale === 'hi' ? 'अस्पताल संस्थापक एवं मुख्य सम्मान' : 'Hospital Honour & Chief Ophthalmologist'}
                </span>
                <span className="text-sm sm:text-base font-bold text-white">
                  {locale === 'hi' ? 'डॉ० माधव मुकुंद — वरिष्ठ नेत्र रोग विशेषज्ञ (आई सर्जन)' : 'Dr. Madhav Mukund — Senior Ophthalmologist & Eye Surgeon'}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-cyan-100 border border-white/20">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'hi' ? '16+ वर्षों का क्लिनिकल अनुभव' : '16+ Years Clinical Excellence'}</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Top Grid: Founder Portrait & Full Profile + Clinical Exam Photo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Direct Doctor Portrait & Bio */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/founder/dr-madhav-mukund-portrait.png"
                      alt="Dr Madhav Mukund - Hospital Founder"
                      className="w-36 h-36 sm:w-44 sm:h-44 object-cover object-top rounded-2xl border-4 border-white shadow-xl ring-2 ring-primary/30"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white" title="Verified Specialist">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="inline-flex items-center space-x-1.5 bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-extrabold">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{locale === 'hi' ? 'संस्थापक एवं मुख्य निदेशक' : 'Founder & Managing Director'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-dark">
                      Dr. Madhav Mukund <span className="text-sm font-semibold text-gray-500 block sm:inline">({locale === 'hi' ? 'डॉ० माधव मुकुंद' : 'MBBS, MS'})</span>
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-accent">
                      {locale === 'hi'
                        ? 'MBBS (KGMC लखनऊ), MS (GSVM कानपुर) • वरिष्ठ नेत्र रोग विशेषज्ञ'
                        : 'MBBS (KGMC Lucknow), MS (GSVM Kanpur) • Renowned Ophthalmologist'}
                    </p>
                    <p className="text-xs text-mutedText flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{locale === 'hi' ? 'जन सेवा अस्पताल, बड़हलगंज बाईपास, वाराणसी एवं एम एस मेमोरियल नेत्रालय, दिलदारनगर' : 'Jan Sewa Hospital, Barhalganj Bypass Rd, Varanasi & M S Memorial Netralaya'}</span>
                    </p>
                  </div>
                </div>

                {/* Complete Detailed Bio Provided by User */}
                <div className="bg-hospitalBg p-4 sm:p-5 rounded-2xl border border-gray-200 text-xs sm:text-sm text-hospitalText leading-relaxed space-y-2.5">
                  <p>
                    {locale === 'hi' ? (
                      <>
                        <strong className="text-primary-dark font-extrabold">डॉ० माधव मुकुंद (MBBS, MS)</strong> वाराणसी एवं पूर्वांचल के सुप्रसिद्ध व प्रतिष्ठित नेत्र रोग विशेषज्ञ (आई स्पेशलिस्ट) हैं। वे <strong className="text-primary-dark">जन सेवा अस्पताल</strong> (बड़हलगंज बाईपास रोड, यूनियन बैंक के पास, वाराणसी) में अपनी नियमित ओपीडी सेवाएं देते हैं तथा <strong className="text-primary-dark">एम एस मेमोरियल नेत्रालय (दिलदारनगर, गाजीपुर)</strong> के संस्थापक निदेशक हैं।
                      </>
                    ) : (
                      <>
                        <strong className="text-primary-dark font-extrabold">Dr Madhav Mukund, MBBS, MS</strong> is a Varanasi based renowned Ophthalmologist (Eye Specialist). He practices at Jan Sewa Hospital located at Barhalganj Bypass Road, Near Union Bank, Varanasi and directs M S Memorial Netralaya, Dildarnagar.
                      </>
                    )}
                  </p>
                  <p className="text-mutedText">
                    {locale === 'hi'
                      ? 'वे सभी प्रकार के नेत्र रोगों के उपचार में अत्यंत अनुभवी, प्रशिक्षित व उच्च कुशल नेत्र सर्जन हैं। उनके पास उच्च स्तरीय नेत्र चिकित्सा प्रदान करने का कई वर्षों का सफल अनुभव है। प्रमुख रोग जिनके उपचार में उन्हें विशिष्ट दक्षता प्राप्त है: नेत्र जांच, नेत्र देखभाल, काला मोतिया (ग्लूकोमा), मोतियाबिंद (फेको सर्जरी), दृष्टिहीनता निवारण, मैक्यूलर डिजनरेशन, कंजक्टिवाइटिस (आंख आना), लाली-जलन, ड्राय आई सिंड्रोम आदि।'
                      : 'He is highly experienced, trained and skilled eye specialist treating all types of eye diseases. He has many years of experience in providing famed eye treatment. Some of the top eye diseases he is specialized in treating are eye checkup, eye care, glaucoma, cataract, eye blindness, macular degeneration, conjunctivitis, irritation, dry eye syndrome, etc.'}
                  </p>
                  <p className="text-[11px] text-primary-dark font-medium pt-1 border-t border-gray-200/80">
                    {locale === 'hi'
                      ? '💡 आप डॉ० माधव मुकुंद से ऑनलाइन परामर्श व टोकन सीधे हमारे पोर्टल या Doctoriduniya.com के माध्यम से बुक कर सकते हैं।'
                      : '💡 You can book an online appointment with Dr Madhav Mukund, top Ophthalmologist in Varanasi at Doctoriduniya.com or directly via our digital token portal below.'}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={`/${locale}/appointment?doctor=doc-1`}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {locale === 'hi' ? 'डॉ० माधव मुकुंद से परामर्श बुक करें' : 'Book Appointment with Dr. Madhav Mukund'}
                  </Link>
                  <a
                    href="tel:+918004800688"
                    className="bg-gray-100 hover:bg-gray-200 text-primary-dark font-bold px-4 py-3 rounded-xl text-xs sm:text-sm border border-gray-200 transition flex items-center"
                  >
                    📞 +91 80048 00688
                  </a>
                </div>
              </div>

              {/* Right Column: In-Practice Slit Lamp Examination Photo */}
              <div className="lg:col-span-5 space-y-3">
                <div className="bg-white p-3 rounded-2xl border-2 border-primary/20 shadow-xl overflow-hidden group">
                  <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/founder/dr-madhav-mukund-exam.png"
                      alt="Dr Madhav Mukund examining patient on slit lamp"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white mr-1.5"></span>
                      {locale === 'hi' ? 'प्रत्यक्ष नेत्र जांच' : 'Clinical Slit-Lamp Exam'}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                      <p className="font-extrabold leading-tight">
                        {locale === 'hi' ? 'सूक्ष्मदर्शी परीक्षण (स्लिट-लैम्प बायोमाइक्रोस्कोपी)' : 'High Precision Slit-Lamp Biomicroscopy'}
                      </p>
                      <p className="text-[11px] text-cyan-200 mt-0.5">
                        {locale === 'hi' ? 'कॉर्निया, पुतली, लेंस एवं रेटिना की गहन सूक्ष्म जांच' : 'Cornea, lens, and retinal anterior segment examination'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Grid: 11 Specialized Treatments Checklist (Exact user list) */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-primary-dark flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-accent" />
                    {locale === 'hi' ? 'डॉ० माधव मुकुंद द्वारा विशिष्ट उपचार एवं शल्य चिकित्सा सेवाएं' : 'Specialized Treatments & Surgical Procedures by Dr. Madhav Mukund'}
                  </h4>
                  <p className="text-xs text-mutedText mt-0.5">
                    {locale === 'hi' ? 'आधुनिकतम फेको, लेजर एवं डायग्नोस्टिक विधियों से सुरक्षित व सफल उपचार' : 'Advanced ophthalmic treatments provided with international surgical standards.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  11 {locale === 'hi' ? 'विशेष उपचार' : 'Core Procedures'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {founderTreatments.map((treatment, idx) => (
                  <div
                    key={idx}
                    className="bg-white hover:bg-primary hover:text-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-accent group-hover:text-amber-300 font-mono font-extrabold text-sm shrink-0 transition">
                      &gt;&gt;
                    </span>
                    <span className="text-xs font-bold text-hospitalText group-hover:text-white transition">
                      {locale === 'hi' ? treatment.hi : treatment.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </ScrollZoomOut>

      {/* 5. OFFICIAL CORE SPECIALTIES (CARDS WITH c1.png, c2.png, c3.png, c4.png) */}
      <ScrollZoomOut amount={0.12} scaleFrom={1.05} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'प्रमुख नेत्र चिकित्सा केंद्र' : 'Official Hospital Specialties'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
              {locale === 'hi' ? 'विश्वस्तरीय सुपर-स्पेशलिटी नेत्र विभाग' : 'Key Clinical Specialties & Departments'}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              {locale === 'hi'
                ? 'एम एस मेमोरियल नेत्रालय के चार मुख्य विभाग — आयातित फेको, रेटिना लेजर, ग्लूकोमा व पलक शल्य चिकित्सा।'
                : 'Advanced sub-specialty clinics equipped with precision German lasers and micro-incision technology.'}
            </p>
          </div>

          <Link
            href={`/${locale}/services`}
            className="text-xs font-bold text-primary hover:underline flex items-center"
          >
            {messages.common.viewDetails} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreSpecialties.map((spec) => (
            <div
              key={spec.id}
              className={`rounded-2xl shadow-card hover:shadow-2xl transition-all duration-300 p-5 flex flex-col justify-between border-2 hover:-translate-y-2 group ${spec.accentColor}`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm ${spec.badgeBg}`}>
                    {locale === 'hi' ? spec.badge_hi : spec.badge_en}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-primary transition">
                    M S Netralaya
                  </span>
                </div>

                {/* Authentic Graphic Icon */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto relative flex items-center justify-center p-2 rounded-2xl bg-white/80 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={spec.image}
                    alt={locale === 'hi' ? spec.name_hi : spec.name_en}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Title and Description */}
                <div className="text-center space-y-1.5">
                  <h3 className="font-extrabold text-base text-primary-dark group-hover:text-primary transition leading-tight">
                    {locale === 'hi' ? spec.name_hi : spec.name_en}
                  </h3>
                  <p className="text-xs text-mutedText leading-relaxed">
                    {locale === 'hi' ? spec.desc_hi : spec.desc_en}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  {(locale === 'hi' ? spec.features_hi : spec.features_en).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center text-[11px] text-hospitalText">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <Link
                  href={`/${locale}/appointment?service=${spec.serviceId}`}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-xl text-xs text-center block transition shadow-sm group-hover:shadow"
                >
                  {messages.common.bookAppointment} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </ScrollZoomOut>

      {/* 6. ADVANCED OPHTHALMIC TECHNOLOGY & DIAGNOSTICS (bb.png, 2.png, circle.png) */}
      <ScrollZoomOut amount={0.12} scaleFrom={1.05} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'आधुनिकतम तकनीकी उपकरण' : 'Cutting-Edge Ophthalmic Equipment'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
              {locale === 'hi' ? 'आयातित जर्मन एवं जापानी नेत्र परीक्षण प्लेटफॉर्म' : 'State-Of-The-Art Diagnostic & Surgical Suites'}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              {locale === 'hi'
                ? 'सटीक निदान, त्वरित लेजर उपचार और सुरक्षित फेको सर्जरी हेतु विश्वस्तरीय मशीनें।'
                : 'Advanced automated visual field mapping, high-definition retinal lasers, and ultra-sterile phaco suites.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advancedTechShowcase.map((tech, tIdx) => (
            <div
              key={tIdx}
              className="surface-card rounded-2xl shadow-card hover:shadow-2xl transition-all duration-300 border border-hospitalBorder overflow-hidden group hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-900 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tech.image}
                  alt={locale === 'hi' ? tech.title_hi : tech.title_en}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-3 left-3 bg-primary-dark/90 backdrop-blur-md text-cyan-200 text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/20">
                  {locale === 'hi' ? tech.tag_hi : tech.tag_en}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    {locale === 'hi' ? tech.title_hi : tech.title_en}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white">
                <p className="text-xs text-mutedText leading-relaxed">
                  {locale === 'hi' ? tech.desc_hi : tech.desc_en}
                </p>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-accent flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {locale === 'hi' ? 'सत्यापित उपकरण' : 'Certified Equipment'}
                  </span>
                  <Link
                    href={`/${locale}/appointment`}
                    className="text-xs font-bold text-primary hover:underline flex items-center"
                  >
                    {locale === 'hi' ? 'जांच बुक करें' : 'Book Scan'} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollZoomOut>

      {/* 7. HOSPITAL EYE SERVICES (2X PASSPORT PHOTOS & AUTO-FLOATING TRACK) */}
      <ScrollZoomOut amount={0.12} scaleFrom={1.05} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
      </ScrollZoomOut>

      {/* 5. COMMON EYE DISEASES & SYMPTOM GUIDE (WITH REAL CLINICAL PHOTOS) */}
      <ScrollZoomOut amount={0.12} scaleFrom={1.05} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-rose-500/10 text-rose-600 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'आंखों की बीमारियां एवं लक्षण गाइड' : 'Eye Diseases & Symptoms Guide'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
              {locale === 'hi' ? 'क्या आपकी आंखों में कोई समस्या या लक्षण है?' : 'Identify Your Eye Symptoms & Conditions'}
            </h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              {locale === 'hi'
                ? 'सफेद मोतियाबिंद, काला मोतिया, रेटिना पर्दा, लाली, या चश्मा नंबर — अपने लक्षण अनुसार सही विशेषज्ञ चुनें।'
                : 'Explore common ophthalmic symptoms with authentic clinical photos and get the right specialist consultation.'}
            </p>
          </div>

          <Link
            href={`/${locale}/eye-problems`}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center shadow-sm"
          >
            {locale === 'hi' ? 'सभी 19 बीमारियां व लक्षण देखें' : 'Explore All 19 Eye Conditions'} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDiseases.map((dis) => (
            <div
              key={dis.id}
              className={`group surface-card rounded-2xl shadow-card hover:shadow-2xl transition-all duration-300 border flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${
                dis.redFlag
                  ? 'border-red-400 bg-gradient-to-b from-red-50/50 via-white to-white'
                  : 'border-hospitalBorder hover:border-primary/50'
              }`}
            >
              {/* Actual Real Clinical Condition Photo */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dis.image}
                  alt={locale === 'hi' ? dis.name_hi : dis.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md ${dis.badgeColor}`}>
                    {locale === 'hi' ? dis.category_hi : dis.category_en}
                  </span>

                  {dis.redFlag && (
                    <span className="bg-emergency text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-lg flex items-center animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {locale === 'hi' ? 'रेड फ्लैग' : 'Red Flag'}
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="font-extrabold text-white text-base leading-snug drop-shadow-md">
                    {locale === 'hi' ? dis.name_hi : dis.name_en}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="bg-hospitalBg p-2.5 rounded-xl border border-gray-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-mutedText tracking-wider block">
                    {locale === 'hi' ? 'सुझाई गई चिकित्सा सेवा' : 'Recommended Service'}
                  </span>
                  <span className="text-xs font-bold text-primary-dark block truncate">
                    {locale === 'hi' ? dis.serviceName_hi : dis.serviceName_en}
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {dis.redFlag ? (locale === 'hi' ? 'आपातकाल' : 'Urgent') : (locale === 'hi' ? 'ओपीडी परामर्श' : 'OPD Consult')}
                  </span>
                  {dis.redFlag ? (
                    <Link
                      href={`/${locale}/emergency`}
                      className="bg-emergency hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-emergency flex items-center transition"
                    >
                      {locale === 'hi' ? 'इमरजेंसी हेल्प' : 'Emergency Help'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/appointment?service=${dis.serviceId}`}
                      className="bg-primary hover:bg-primary-dark text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm flex items-center transition"
                    >
                      {locale === 'hi' ? 'डॉक्टर बुक करें' : 'Book Doctor'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollZoomOut>

      {/* 6. HOW DIGITAL TOKEN BOOKING WORKS */}
      <ScrollZoomOut amount={0.15} scaleFrom={1.06} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
      </ScrollZoomOut>

      {/* 7. VERIFIED SPECIALISTS DIRECTORY */}
      <ScrollZoomOut amount={0.12} scaleFrom={1.05} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
      </ScrollZoomOut>

      {/* 8. HOSPITAL PHOTO GALLERY SHOWCASE */}
      <ScrollZoomOut amount={0.12} scaleFrom={1.05} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
      </ScrollZoomOut>

      {/* 9. REAL PATIENT TESTIMONIALS */}
      <ScrollZoomOut amount={0.15} scaleFrom={1.06} duration={0.7} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
      </ScrollZoomOut>
      </div>

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
