'use client';

import React from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Eye, ShieldCheck, Award, Users, CheckCircle, ArrowRight, HeartPulse } from 'lucide-react';

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 rounded-2xl shadow-card space-y-3">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-cyan-200">
          <Eye className="w-4 h-4 text-accent" />
          <span>{messages.common.hospitalName}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {locale === 'hi' ? 'एम एस मेमोरियल नेत्रालय के बारे में' : 'About M S Memorial Netralaya'}
        </h1>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-3xl leading-relaxed">
          {locale === 'hi'
            ? 'दिलदारनगर (गाजीपुर) का प्रमुख सुपर-स्पेशलिटी नेत्र संस्थान। 2008 में स्थापित, जहां अत्याधुनिक फेको मोतियाबिंद ऑपरेशन, विट्रियो-रेटिना लेजर एवं अनुभवी डॉक्टरों द्वारा विश्वस्तरीय नेत्र उपचार प्रदान किया जाता है।'
            : 'Premier eye care hospital established in 2008 in Dildarnagar, Ghazipur. Bringing state-of-the-art technology, modular OT facilities, and expert surgeons to Eastern UP.'}
        </p>
      </div>

      {/* Hospital Story & Building Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center surface-card p-6 sm:p-8 rounded-2xl shadow-card border border-hospitalBorder">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>{locale === 'hi' ? 'स्थापना 2008 से विश्वसनीय सेवा' : 'Trusted Eye Care Since 2008'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary-dark">
            {locale === 'hi' ? 'ग्रामीण एवं क्षेत्रीय मरीजों के लिए उच्चस्तरीय नेत्र सेवा' : 'Dedicated to World-Class Eye Care in Eastern U.P.'}
          </h2>
          <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'एम एस मेमोरियल नेत्रालय की स्थापना 2008 में पूर्वी उत्तर प्रदेश के दिलदारनगर में ग्रामीण और क्षेत्रीय मरीजों को उच्चस्तरीय नेत्र चिकित्सा सुलभ कराने के उद्देश्य से की गई थी। डॉ० माधव मुकुंद के नेतृत्व में हमारा अस्पताल विश्वस्तरीय फेको मोतियाबिंद, रेटिना लेजर और आधुनिक निदान उपकरणों से सुसज्जित है।'
              : 'Established in 2008, M S Memorial Netralaya is located in Dildarnagar in eastern U.P. Our core mission is to serve communities that previously had little access to specialised eyecare. Led by Dr. Madhaw Mukund, our team brings sophisticated tools, modern lasers, and high clinical standards right to your doorstep.'}
          </p>
          <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'अस्पताल में पूर्णतः वातानुकूलित ओपीडी, आधुनिक जांच केंद्र, प्रतीक्षा लाउंज तथा अंतरराष्ट्रीय मानकों के अनुरूप तैयार मॉड्यूलर ऑपरेशन थिएटर कॉम्प्लेक्स मौजूद है।'
              : 'Equipped with world-class, imported instruments for simple and complex disorders of the eye, our facility features a state-of-the-art operation theater complex and centrally air-conditioned OPD, investigation, and waiting lounge.'}
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hospital-building.jpg"
              alt="M S Memorial Netralaya Hospital Building"
              className="w-full h-80 object-cover hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs font-semibold">
              M S Memorial Netralaya — Dildarnagar, Ghazipur
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Facilities Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-primary-dark">
            {locale === 'hi' ? 'हमारा उद्देश्य (Our Mission)' : 'Our Core Mission'}
          </h3>
          <p className="text-xs text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'प्रत्येक मरीज को किफायती, उच्च गुणवत्ता वाली मोतियाबिंद, रेटीना एवं दृष्टि सुरक्षा सेवाएं प्रदान करना तथा डिजिटल टोकन द्वारा कतार-मुक्त अनुभव देना।'
              : 'To deliver compassionate, world-class, affordable cataract, retina, and vision care powered by zero-wait digital token management.'}
          </p>
        </div>

        <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
          <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-primary-dark">
            {locale === 'hi' ? 'अत्याधुनिक जर्मन तकनीक' : 'Advanced Technology'}
          </h3>
          <p className="text-xs text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'बिना टांके का फेको मोतियाबिंद ऑपरेशन, जर्मन विट्रियो-रेटिना लेजर, ओसीटी फंडस स्कैनिंग, कंप्यूटरीकृत दृष्टि जांच एवं डिजिटल टोकन डिस्प्ले।'
              : 'Stitchless Micro-Incision Phaco Cataract Surgery, German Vitreoretinal Lasers, OCT Fundus Scanning, and Digital Queue Displays.'}
          </p>
        </div>

        <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-primary-dark">
            {locale === 'hi' ? 'प्रतिष्ठित विशेषज्ञ टीम' : 'Expert Medical Team'}
          </h3>
          <p className="text-xs text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'केजीएमसी (KGMC लखनऊ) एवं जीएसवीएम (GSVM कानपुर) से प्रशिक्षित वरिष्ठ नेत्र विशेषज्ञ डॉ० माधव मुकुंद एवं फेलोशिप प्राप्त रेटिना सर्जन।'
              : 'Led by Dr. Madhaw Mukund (KGMC Lucknow & GSVM Kanpur) alongside premier UK-fellowship retina specialists.'}
          </p>
        </div>
      </div>

      {/* Key Doctors Showcase */}
      <div className="surface-card p-8 rounded-2xl shadow-card space-y-6 border border-hospitalBorder">
        <h2 className="text-xl font-bold text-primary-dark">
          {locale === 'hi' ? 'अस्पताल के मुख्य चिकित्सक' : 'Leadership & Medical Specialists'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor 1 */}
          <div className="p-4 bg-hospitalBg rounded-xl border border-gray-200 space-y-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/doctors/dr-madhav-mukund.jpg"
              alt="Dr. Madhaw Mukund"
              className="w-28 h-28 object-cover rounded-full mx-auto border-2 border-primary shadow"
            />
            <div>
              <h3 className="font-bold text-sm text-primary-dark">Dr. Madhaw Mukund</h3>
              <p className="text-[11px] font-semibold text-accent">MBBS (KGMC), MS (GSVM)</p>
              <p className="text-[10px] text-mutedText mt-0.5">{locale === 'hi' ? 'संस्थापक एवं मुख्य नेत्र रोग विशेषज्ञ' : 'Founder & Chief Eye Surgeon'}</p>
            </div>
            <p className="text-xs text-mutedText leading-relaxed">
              {locale === 'hi'
                ? 'फेको मोतियाबिंद शल्य चिकित्सा, ग्लूकोमा एवं आधुनिक नेत्र उपचार में 16+ वर्षों का अनुभव।'
                : '16+ years of expertise in advanced Phaco cataract surgery, glaucoma, and ocular lasers.'}
            </p>
          </div>

          {/* Doctor 2 */}
          <div className="p-4 bg-hospitalBg rounded-xl border border-gray-200 space-y-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/doctors/dr-kshitij-aaditya.jpg"
              alt="Dr. Kshitij Aaditya"
              className="w-28 h-28 object-cover rounded-full mx-auto border-2 border-primary shadow"
            />
            <div>
              <h3 className="font-bold text-sm text-primary-dark">Dr. Kshitij Aaditya</h3>
              <p className="text-[11px] font-semibold text-accent">MBBS, DNB, FVRS (Retina), FICO (London)</p>
              <p className="text-[10px] text-mutedText mt-0.5">{locale === 'hi' ? 'वरिष्ठ रेटिना एवं ROP स्पेशलिस्ट' : 'Senior Vitreo-Retina & ROP Specialist'}</p>
            </div>
            <p className="text-xs text-mutedText leading-relaxed">
              {locale === 'hi'
                ? 'डायबिटीज पर्दा रोग, रेटिना लेजर एवं जटिल पर्दा शल्य चिकित्सा के अंतरराष्ट्रीय विशेषज्ञ।'
                : 'Expert in diabetic retinopathy, retinal laser surgery, and complex vitreoretinal disorders.'}
            </p>
          </div>

          {/* Doctor 3 */}
          <div className="p-4 bg-hospitalBg rounded-xl border border-gray-200 space-y-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/doctors/dr-arvind-gautam.jpg"
              alt="Dr. Arvind Gautam"
              className="w-28 h-28 object-cover rounded-full mx-auto border-2 border-primary shadow"
            />
            <div>
              <h3 className="font-bold text-sm text-primary-dark">Dr. Arvind Gautam</h3>
              <p className="text-[11px] font-semibold text-accent">MBBS, MS (Ophthalmology)</p>
              <p className="text-[10px] text-mutedText mt-0.5">{locale === 'hi' ? 'वरिष्ठ नेत्र रोग विशेषज्ञ' : 'Senior Consultant Ophthalmologist'}</p>
            </div>
            <p className="text-xs text-mutedText leading-relaxed">
              {locale === 'hi'
                ? 'ग्लूकोमा (काला मोतिया), कॉर्निया एवं सम्पूर्ण नेत्र स्वास्थ्य के कुशल सर्जन।'
                : 'Renowned eye surgeon specializing in glaucoma management and comprehensive eye care.'}
            </p>
          </div>
        </div>
      </div>

      {/* Facilities Checklist & Call to action */}
      <div className="surface-card p-8 rounded-2xl shadow-card space-y-6 border border-hospitalBorder">
        <h2 className="text-xl font-bold text-primary-dark">
          {locale === 'hi' ? 'अस्पताल की मुख्य सुविधाएं' : 'Hospital Facilities & Infrastructure'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-hospitalText">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{locale === 'hi' ? '24 घंटे आंख की चोट व आपातकालीन उपचार (24x7 Ocular Emergency)' : '24x7 Ocular Trauma & Eye Emergency Care Unit'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{locale === 'hi' ? 'विश्वस्तरीय मॉड्यूलर ऑपरेशन थिएटर एवं फेको मशीन' : 'World-Class Modular OT Complex with Modern Phaco Systems'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{locale === 'hi' ? 'डिजिटल टोकन ट्रैकिंग एवं मोबाइल से लाइव स्थिति देखने की सुविधा' : 'Live Mobile Token & Queue Tracking System'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{locale === 'hi' ? 'इन-हाउस चश्मा घर (ब्रांडेड फ्रेम एवं एंटी-ग्लेयर लेंस)' : 'In-House Optical Shop (Chashma Ghar) with Quality Lenses'}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4">
          <Link
            href={`/${locale}/appointment`}
            className="bg-primary text-white font-bold px-6 py-3 rounded-xl text-xs shadow hover:bg-primary-dark transition flex items-center"
          >
            {messages.common.bookAppointment} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            href={`/${locale}/doctors`}
            className="bg-accent text-white font-bold px-6 py-3 rounded-xl text-xs shadow hover:bg-teal-600 transition flex items-center"
          >
            {messages.nav.doctors} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="bg-gray-100 hover:bg-gray-200 text-primary-dark font-bold px-6 py-3 rounded-xl text-xs transition flex items-center"
          >
            {messages.nav.contact} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
