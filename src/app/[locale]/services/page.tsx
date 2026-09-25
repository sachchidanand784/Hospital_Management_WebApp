'use client';

import React from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import { Eye, CheckCircle, ArrowRight, Glasses, Calendar } from 'lucide-react';

export default function ServicesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

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
        {SEED_DATA.services.map((srv) => (
          <div key={srv.id} className="surface-card p-6 rounded-2xl shadow-card space-y-4 border border-hospitalBorder flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-primary-dark">{locale === 'hi' ? srv.name_hi : srv.name_en}</h2>
              <p className="text-xs text-mutedText leading-relaxed">{locale === 'hi' ? srv.desc_hi : srv.desc_en}</p>

              <div className="pt-2">
                <span className="text-xs font-bold text-primary-dark block mb-1">
                  {locale === 'hi' ? 'प्रमुख समस्याएं एवं कारण:' : 'Key Symptoms Covered:'}
                </span>
                <ul className="space-y-1 text-xs text-hospitalText">
                  {srv.problems.map((p) => (
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
        ))}
      </div>
    </div>
  );
}
