'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import { Search, Calendar, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export default function DoctorsDirectoryPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [selectedSpec, setSelectedSpec] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const verifiedDoctors = SEED_DATA.doctors.filter((d) => d.verificationStatus === 'VERIFIED');

  const filteredDoctors = verifiedDoctors.filter((doc) => {
    const matchesSpec = selectedSpec === 'ALL' || doc.specialization_en === selectedSpec;
    const matchesSearch =
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 rounded-2xl shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin-Verified Doctors Only</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{messages.doctors.title}</h1>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-xl">{messages.doctors.subtitle}</p>
        </div>

        <Link
          href={`/${locale}/doctor/register`}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center border border-white/20 transition shrink-0"
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> {messages.doctors.registerHeading}
        </Link>
      </div>

      {/* Filters */}
      <div className="surface-card p-4 rounded-2xl shadow-card flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setSelectedSpec('ALL')}
            className={`px-3 py-2 rounded-xl transition ${selectedSpec === 'ALL' ? 'bg-primary text-white shadow' : 'bg-gray-100 text-hospitalText'}`}
          >
            All Specializations
          </button>
          {SEED_DATA.specializations.slice(0, 4).map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSelectedSpec(sp.name_en)}
              className={`px-3 py-2 rounded-xl transition ${selectedSpec === sp.name_en ? 'bg-primary text-white shadow' : 'bg-gray-100 text-hospitalText'}`}
            >
              {locale === 'hi' ? sp.name_hi : sp.name_en}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="surface-card p-6 rounded-2xl shadow-card hover:shadow-xl transition space-y-4 flex flex-col justify-between border border-hospitalBorder">
            <div className="space-y-3 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 text-primary rounded-full flex items-center justify-center mx-auto border-2 border-primary/20 shadow">
                <span className="text-xl font-extrabold">{doc.fullName.split(' ').map((n) => n[0]).join('')}</span>
              </div>

              <div>
                <h2 className="font-bold text-base text-primary-dark">{doc.fullName}</h2>
                <span className="text-xs font-semibold text-accent block mt-0.5">
                  {locale === 'hi' ? doc.specialization_hi : doc.specialization_en}
                </span>
              </div>

              <p className="text-xs text-mutedText line-clamp-3 leading-relaxed">
                {locale === 'hi' ? doc.bio_hi : doc.bio_en}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs text-mutedText font-semibold">
                <span>{doc.experienceYears} {messages.doctors.experience}</span>
                <span className="text-primary-dark font-bold">Fee: ₹{doc.consultationFee}</span>
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
    </div>
  );
}
