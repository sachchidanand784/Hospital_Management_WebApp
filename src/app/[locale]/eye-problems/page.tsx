'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import {
  Search,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Eye,
  Filter
} from 'lucide-react';

import { getPublicServices } from '@/actions/public';

// Mapping each specific eye disease / problem to authentic clinical ophthalmology photos
const DISEASE_IMAGE_MAP: Record<string, { image: string; category_en: string; category_hi: string; badgeColor: string }> = {
  'prob-1': {
    image: '/images/diseases/blurred-vision.jpg',
    category_en: 'General OPD',
    category_hi: 'सामान्य नेत्र जांच',
    badgeColor: 'bg-blue-600 text-white'
  },
  'prob-2': {
    image: '/images/diseases/eye-redness.jpg',
    category_en: 'Redness & Allergy',
    category_hi: 'लाली एवं एलर्जी',
    badgeColor: 'bg-rose-600 text-white'
  },
  'prob-3': {
    image: '/images/diseases/watery-eyes.jpg',
    category_en: 'Lacrimal & Tears',
    category_hi: 'अश्रु नली व पानी गिरना',
    badgeColor: 'bg-cyan-600 text-white'
  },
  'prob-4': {
    image: '/images/diseases/dry-eyes.jpg',
    category_en: 'Dry Eye Syndrome',
    category_hi: 'ड्राय आई (सूखापन)',
    badgeColor: 'bg-amber-600 text-white'
  },
  'prob-5': {
    image: '/images/diseases/vision-headache.jpg',
    category_en: 'Asthenopia & Strain',
    category_hi: 'नजर की थकावट व सिरदर्द',
    badgeColor: 'bg-indigo-600 text-white'
  },
  'prob-6': {
    image: '/images/diseases/cloudy-cataract.jpg',
    category_en: 'Cataract (Motiyabind)',
    category_hi: 'मोतियाबिंद (सफेद मोतिया)',
    badgeColor: 'bg-purple-600 text-white'
  },
  'prob-7': {
    image: '/images/diseases/night-glare.jpg',
    category_en: 'Night Glare / Halos',
    category_hi: 'मोतियाबिंद चकाचौंध',
    badgeColor: 'bg-purple-600 text-white'
  },
  'prob-8': {
    image: '/images/diseases/frequent-glass-change.jpg',
    category_en: 'Refractive Shift',
    category_hi: 'चश्मा नंबर परिवर्तन',
    badgeColor: 'bg-purple-600 text-white'
  },
  'prob-9': {
    image: '/images/diseases/eye-floaters.jpg',
    category_en: 'Vitreo-Retina',
    category_hi: 'विट्रियो-रेटिना (पर्दा)',
    badgeColor: 'bg-teal-600 text-white'
  },
  'prob-10': {
    image: '/images/diseases/flashes-curtain.jpg',
    category_en: 'Retinal Detachment',
    category_hi: 'पर्दा गिरना / रेड फ्लैग',
    badgeColor: 'bg-red-600 text-white'
  },
  'prob-11': {
    image: '/images/diseases/diabetic-retinopathy.jpg',
    category_en: 'Diabetic Retinopathy',
    category_hi: 'डायबिटीज पर्दा जांच',
    badgeColor: 'bg-teal-600 text-white'
  },
  'prob-12': {
    image: '/images/diseases/chemical-injury.jpg',
    category_en: 'Emergency Chemical Injury',
    category_hi: 'केमिकल चोट (रेड फ्लैग)',
    badgeColor: 'bg-red-600 text-white'
  },
  'prob-13': {
    image: '/images/diseases/sudden-vision-loss.jpg',
    category_en: 'Acute Vision Loss',
    category_hi: 'अचानक रोशनी जाना',
    badgeColor: 'bg-red-600 text-white'
  },
  'prob-14': {
    image: '/images/diseases/penetrating-trauma.jpg',
    category_en: 'Ocular Trauma',
    category_hi: 'आंख में गंभीर चोट',
    badgeColor: 'bg-red-600 text-white'
  },
  'prob-15': {
    image: '/images/diseases/severe-eye-pain.jpg',
    category_en: 'Glaucoma / Severe Pain',
    category_hi: 'काला मोतिया / तेज दर्द',
    badgeColor: 'bg-red-600 text-white'
  },
  'prob-16': {
    image: '/images/diseases/glass-power-check.jpg',
    category_en: 'Optometry & Refraction',
    category_hi: 'चश्मा नंबर जांच',
    badgeColor: 'bg-emerald-600 text-white'
  },
  'prob-17': {
    image: '/images/diseases/contact-lens.jpg',
    category_en: 'Contact Lens Fitting',
    category_hi: 'कॉन्टैक्ट लेंस परामर्श',
    badgeColor: 'bg-emerald-600 text-white'
  },
  'prob-18': {
    image: '/images/diseases/reading-difficulty.jpg',
    category_en: 'Presbyopia (Near Sight)',
    category_hi: 'नजदीक पढ़ने में परेशानी',
    badgeColor: 'bg-emerald-600 text-white'
  },
  'prob-19': {
    image: '/images/diseases/computer-eye-strain.jpg',
    category_en: 'Digital Eye Strain',
    category_hi: 'कंप्यूटर विजन सिंड्रोम',
    badgeColor: 'bg-emerald-600 text-white'
  }
};

const getProblemVisual = (id: string, srvId: string) => {
  if (DISEASE_IMAGE_MAP[id]) return DISEASE_IMAGE_MAP[id];
  if (srvId === 'srv-cataract') return { image: '/images/services/cataract-phaco.jpg', category_en: 'Cataract', category_hi: 'मोतियाबिंद', badgeColor: 'bg-purple-600 text-white' };
  if (srvId === 'srv-retina') return { image: '/images/services/retina-laser.jpg', category_en: 'Retina', category_hi: 'रेटिना', badgeColor: 'bg-teal-600 text-white' };
  if (srvId === 'srv-emergency') return { image: '/images/services/emergency-ocular.jpg', category_en: 'Emergency', category_hi: 'आपातकालीन', badgeColor: 'bg-red-600 text-white' };
  if (srvId === 'srv-optometry') return { image: '/images/services/optometry-glasses.jpg', category_en: 'Optometry', category_hi: 'चश्मा घर', badgeColor: 'bg-emerald-600 text-white' };
  return { image: '/images/services/general-exam.jpg', category_en: 'General Eye', category_hi: 'सामान्य नेत्र', badgeColor: 'bg-blue-600 text-white' };
};

export default function EyeProblemsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [allProblems, setAllProblems] = useState<any[]>(
    SEED_DATA.services.flatMap((s) =>
      s.problems.map((p: any) => ({
        ...p,
        serviceName_en: s.name_en,
        serviceName_hi: s.name_hi,
        serviceId: s.id,
      }))
    )
  );

  React.useEffect(() => {
    async function loadData() {
      const res = await getPublicServices();
      if (res.success) {
        setAllProblems(
          res.services.flatMap((s: any) =>
            s.problems.map((p: any) => ({
              ...p,
              serviceName_en: s.name_en,
              serviceName_hi: s.name_hi,
              serviceId: s.id,
            }))
          )
        );
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: 'all', name_en: 'All Diseases (19)', name_hi: 'सभी बीमारियां (19)' },
    { id: 'srv-cataract', name_en: 'Cataract (Motiyabind)', name_hi: 'मोतियाबिंद' },
    { id: 'srv-retina', name_en: 'Retina & Diabetes', name_hi: 'रेटिना व पर्दा' },
    { id: 'srv-checkup', name_en: 'General & Redness', name_hi: 'सामान्य व लाली' },
    { id: 'srv-optometry', name_en: 'Glasses & Vision', name_hi: 'चश्मा व दृष्टि' },
    { id: 'emergency', name_en: 'Emergency Red Flags', name_hi: 'आपातकालीन रेड फ्लैग' },
  ];

  const filteredProblems = allProblems.filter((p) => {
    const matchesSearch =
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_hi.includes(searchQuery) ||
      (p.serviceName_en && p.serviceName_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.serviceName_hi && p.serviceName_hi.includes(searchQuery));

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'emergency') return p.redFlag === true;
    return p.serviceId === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Visual Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 sm:p-10 rounded-3xl shadow-card space-y-4">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Eye className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-cyan-200 border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{locale === 'hi' ? 'नेत्र रोग लक्षण व विशेषज्ञ परामर्श गाइड' : 'Ophthalmic Disease & Symptom Triage Guide'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {messages.nav.eyeProblems} ({locale === 'hi' ? 'आंखों की प्रमुख बीमारियां' : 'Eye Disease Guide & Triage'})
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl leading-relaxed">
            {locale === 'hi'
              ? 'अपनी आंखों की समस्या या लक्षण को पहचानें, वास्तविक मेडिकल फोटोग्राफ्स देखें और सही विशेषज्ञ नेत्र सर्जन से तत्काल परामर्श प्राप्त करें।'
              : 'Identify your eye symptoms with authentic clinical photos, check red flag emergency alerts, and connect with experienced ophthalmologists.'}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'hi' ? 'समस्या खोजें (उदा. मोतियाबिंद, लाली, पानी बहना, पर्दा, चश्मा)...' : 'Search eye problems (e.g. cataract, redness, floaters, retina)...'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm text-hospitalText focus:outline-none shadow-lg border border-white/20 bg-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-5.5" />
          </div>
        </div>
      </div>

      {/* Emergency Red Flag Notice */}
      <div className="bg-red-500/10 border-2 border-emergency/40 p-4 sm:p-5 rounded-2xl flex items-start space-x-3 text-xs sm:text-sm text-emergency shadow-sm">
        <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-emergency animate-bounce" />
        <div className="space-y-1">
          <span className="font-extrabold text-sm block text-red-900">
            {locale === 'hi' ? 'आपातकालीन लक्षण अलर्ट (Emergency Red Flags Notice):' : 'Emergency Red Flags Notice:'}
          </span>
          <p className="leading-relaxed text-red-800">
            {locale === 'hi'
              ? 'यदि अचानक आंखों की रोशनी पूरी तरह चली जाए, असहनीय तेज दर्द हो, या केमिकल/तेजाब की चोट लगी हो, तो प्रतीक्षा न करें। हमारे 24x7 आपातकालीन मॉड्यूल से तुरंत सहायता लें।'
              : 'If experiencing sudden total vision loss, severe acute eye pain, or chemical splash injury, please proceed immediately to our 24x7 Ocular Emergency Care.'}
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>{locale === 'hi' ? 'श्रेणी अनुसार फिल्टर करें:' : 'Filter by Category:'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-hospitalBorder'
              }`}
            >
              {locale === 'hi' ? cat.name_hi : cat.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List Grid with 2X Sized Real Ophthalmology Condition Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((prob) => {
          const visual = getProblemVisual(prob.id, prob.serviceId);

          return (
            <div
              key={prob.id}
              className={`group surface-card rounded-2xl shadow-card hover:shadow-2xl transition-all duration-300 border flex flex-col justify-between overflow-hidden ${
                prob.redFlag
                  ? 'border-red-400 bg-gradient-to-b from-red-50/60 via-white to-white'
                  : 'border-hospitalBorder hover:border-primary/50'
              }`}
            >
              {/* Actual Real Clinical Condition Photo */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visual.image}
                  alt={locale === 'hi' ? prob.name_hi : prob.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md ${visual.badgeColor}`}>
                    {locale === 'hi' ? visual.category_hi : visual.category_en}
                  </span>

                  {prob.redFlag && (
                    <span className="bg-emergency text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-lg flex items-center animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {locale === 'hi' ? 'रेड फ्लैग' : 'Red Flag'}
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="font-extrabold text-white text-base leading-snug drop-shadow-md">
                    {locale === 'hi' ? prob.name_hi : prob.name_en}
                  </h3>
                </div>
              </div>

              {/* Card Body & Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="bg-hospitalBg p-3 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-mutedText tracking-wider block">
                      {locale === 'hi' ? 'सुझाई गई चिकित्सा सेवा' : 'Recommended Hospital Service'}
                    </span>
                    <span className="text-xs font-extrabold text-primary-dark block">
                      {locale === 'hi' ? prob.serviceName_hi : prob.serviceName_en}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {prob.redFlag
                      ? (locale === 'hi' ? 'तत्काल ध्यान आवश्यक' : 'Immediate Care')
                      : (locale === 'hi' ? 'विशेषज्ञ परामर्श' : 'Specialist Consult')}
                  </span>

                  {prob.redFlag ? (
                    <Link
                      href={`/${locale}/emergency`}
                      className="bg-emergency hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-emergency flex items-center transition transform active:scale-95"
                    >
                      {locale === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Help'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/appointment?service=${prob.serviceId}`}
                      className="bg-primary hover:bg-primary-dark text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm hover:shadow flex items-center transition transform active:scale-95"
                    >
                      {locale === 'hi' ? 'डॉक्टर बुक करें' : 'Book Doctor'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12 surface-card rounded-2xl border border-hospitalBorder space-y-3">
          <Eye className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-sm font-bold text-gray-600">
            {locale === 'hi' ? 'कोई बीमारी या लक्षण नहीं मिला' : 'No matching eye problems found'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs text-primary font-bold hover:underline"
          >
            {locale === 'hi' ? 'सभी 19 बीमारियां देखें' : 'View all 19 conditions'}
          </button>
        </div>
      )}
    </div>
  );
}
