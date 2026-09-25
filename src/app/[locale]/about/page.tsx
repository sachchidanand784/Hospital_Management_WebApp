'use client';

import React from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Eye, ShieldCheck, Award, Users, Clock, MapPin, Phone, CheckCircle, ArrowRight } from 'lucide-react';

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
          {locale === 'hi' ? 'अस्पताल के बारे में (हमारे बारे में)' : 'About Prayag Eye Care & Laser Centre'}
        </h1>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-3xl leading-relaxed">
          {locale === 'hi'
            ? 'प्रयागराज का अग्रणी सुपर-स्पेशलिटी नेत्र चिकित्सा संस्थान, जहां अत्याधुनिक जर्मन लेजर तकनीक, फेको मोतियाबिंद ऑपरेशन एवं अनुभवी डॉक्टरों द्वारा आंखों की देखभाल प्रदान की जाती है।'
            : 'Prayagraj’s premier super-specialty eye institute offering Phaco cataract surgery, retinal laser, advanced vision refraction, and digital token care.'}
        </p>
      </div>

      {/* Mission & Facilities Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-primary-dark">
            {locale === 'hi' ? 'हमारा उद्देश्य (Mission)' : 'Our Mission'}
          </h3>
          <p className="text-xs text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'प्रत्येक मरीज को किफायती, अंतरराष्ट्रीय स्तर की मोतियाबिंद, रेटीना एवं दृष्टि सुरक्षा सेवाएं प्रदान करना तथा लंबी कतारों से मुक्त डिजिटल टोकन अनुभव देना।'
              : 'To deliver compassionate, world-class, affordable cataract, retina, and vision care powered by zero-wait digital token management.'}
          </p>
        </div>

        <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
          <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-primary-dark">
            {locale === 'hi' ? 'अत्याधुनिक तकनीक' : 'Advanced Technology'}
          </h3>
          <p className="text-xs text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'बिना टांके का फेको मोतियाबिंद ऑपरेशन, जर्मन विजन लेजर, ओसीटी रेटीना स्कैनिंग, कंप्यूटरीकृत चश्मा नंबर जांच एवं डिजिटल टोकन डिस्प्ले।'
              : 'Stitchless Micro-Incision Phaco Cataract Surgery, German Vitreoretinal Lasers, OCT Fundus Scanning, and Digital Queue Displays.'}
          </p>
        </div>

        <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-primary-dark">
            {locale === 'hi' ? 'अनुभवी विशेषज्ञ टीम' : 'Expert Medical Team'}
          </h3>
          <p className="text-xs text-mutedText leading-relaxed">
            {locale === 'hi'
              ? 'एम्स (AIIMS) एवं प्रतिष्ठित संस्थानों से प्रशिक्षित वरिष्ठ नेत्र रोग विशेषज्ञ, रेटीना सर्जन एवं ऑप्टोमेट्रिस्ट टीम।'
              : 'Senior ophthalmologists, retina surgeons, and certified optometrists trained at premier medical institutes.'}
          </p>
        </div>
      </div>

      {/* Detailed Overview */}
      <div className="surface-card p-8 rounded-2xl shadow-card space-y-6">
        <h2 className="text-xl font-bold text-primary-dark">
          {locale === 'hi' ? 'अस्पताल की मुख्य विशेषताएं एवं सेवाएं' : 'Key Hospital Infrastructure & Patient Care'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-hospitalText">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{locale === 'hi' ? '24 घंटे आंख की चोट व आपातकालीन उपचार (Emergency Care)' : '24x7 Ocular Trauma & Eye Emergency Care Unit'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{locale === 'hi' ? 'प्रत्येक मंगलवार निःशुल्क सामान्य ओपीडी जांच' : 'Free General Eye OPD Checkup every Tuesday'}</span>
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
        </div>
      </div>
    </div>
  );
}
