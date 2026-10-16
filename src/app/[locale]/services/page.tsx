'use client';

import React from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import { Eye, CheckCircle, ArrowRight, Glasses, Calendar } from 'lucide-react';

import { getPublicServices } from '@/actions/public';

export default function ServicesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [services, setServices] = React.useState<any[]>(SEED_DATA.services);

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

  React.useEffect(() => {
    async function loadData() {
      const res = await getPublicServices();
      if (res.success) setServices(res.services);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 rounded-2xl shadow-card space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-cyan-200">
          <Eye className="w-4 h-4 text-accent" />
          <span>Eye Hospital Services</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{messages.services.title}</h1>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-3xl">{messages.services.subtitle}</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => {
          const visuals = getServiceVisuals(srv.id);
          return (
            <div key={srv.id} className="surface-card p-6 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 space-y-4 border border-hospitalBorder flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Real Procedure Photo (2x passport size) */}
                <div className="relative w-full h-52 overflow-hidden rounded-xl bg-slate-900 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visuals.image}
                    alt={locale === 'hi' ? srv.name_hi : srv.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-primary-dark/85 backdrop-blur-md text-cyan-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                    {locale === 'hi' ? visuals.tag_hi : visuals.tag_en}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-primary-dark group-hover:text-primary transition">{locale === 'hi' ? srv.name_hi : srv.name_en}</h2>
                <p className="text-xs text-mutedText leading-relaxed">{locale === 'hi' ? srv.desc_hi : srv.desc_en}</p>

              <div className="pt-2">
                <span className="text-xs font-bold text-primary-dark block mb-1">
                  {locale === 'hi' ? 'प्रमुख समस्याएं एवं कारण:' : 'Key Symptoms Covered:'}
                </span>
                <ul className="space-y-1 text-xs text-hospitalText">
                  {srv.problems.map((p: any) => (
                    <li key={p.id} className="flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{locale === 'hi' ? p.name_hi : p.name_en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
                {srv.defaultFee > 0 ? `Consultation Fee ₹${srv.defaultFee}` : 'Free OPD'} ({messages.common.feeNotice})
              </span>
              <Link
                href={`/${locale}/appointment?service=${srv.id}`}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl flex items-center transition shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 mr-1" /> {messages.common.bookAppointment}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}
