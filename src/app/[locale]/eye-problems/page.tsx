'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import { Search, AlertTriangle, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';

import { getPublicServices } from '@/actions/public';

export default function EyeProblemsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [searchQuery, setSearchQuery] = useState('');
  
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

  const filteredProblems = allProblems.filter((p) =>
    p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name_hi.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 rounded-2xl shadow-card space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {messages.nav.eyeProblems} (Eye Disease Guide & Triage)
        </h1>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl">
          {locale === 'hi'
            ? 'अपनी आंखों की समस्या या लक्षण चुनें और सही विशेषज्ञ डॉक्टर से परामर्श लें।'
            : 'Explore symptoms, red flag emergency signs, and match with the right ophthalmologist.'}
        </p>

        {/* Search */}
        <div className="relative max-w-md pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'hi' ? 'समस्या खोजें (उदा. धुंधला दिखना, मोतियाबिंद, लाली)...' : 'Search eye problems (e.g. blurred vision, cataract)...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-hospitalText focus:outline-none shadow"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-5" />
        </div>
      </div>

      {/* Emergency Red Flag Notice */}
      <div className="bg-emergency/10 border border-emergency/30 p-4 rounded-2xl flex items-start space-x-3 text-xs text-emergency">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-emergency" />
        <div>
          <span className="font-extrabold block">
            {locale === 'hi' ? 'आपातकालीन लक्षण अलर्ट (Emergency Red Flags):' : 'Emergency Red Flags Notice:'}
          </span>
          <p className="mt-0.5 leading-relaxed">
            {locale === 'hi'
              ? 'यदि अचानक आंखों की रोशनी पूरी तरह चली जाए, तेज दर्द हो, या केमिकल/तेजाब की चोट लगी हो, तो तुरंत आपातकालीन फॉर्म भरें या कॉल करें।'
              : 'If experiencing sudden total vision loss, severe eye pain, or chemical splash injury, please use our 24x7 Emergency Care module immediately.'}
          </p>
        </div>
      </div>

      {/* Problems List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((prob) => (
          <div key={prob.id} className={`surface-card p-5 rounded-2xl shadow-card space-y-3 border flex flex-col justify-between ${prob.redFlag ? 'border-red-300 bg-red-50/20' : 'border-hospitalBorder'}`}>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-primary-dark">{locale === 'hi' ? prob.name_hi : prob.name_en}</h3>
                {prob.redFlag && (
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-0.5" /> Emergency Red Flag
                  </span>
                )}
              </div>

              <span className="text-[11px] text-accent font-semibold block">
                Recommended Service: {locale === 'hi' ? prob.serviceName_hi : prob.serviceName_en}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              {prob.redFlag ? (
                <Link href={`/${locale}/emergency`} className="bg-emergency text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow flex items-center">
                  Emergency Help <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              ) : (
                <Link href={`/${locale}/appointment?service=${prob.serviceId}`} className="bg-primary text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow hover:bg-primary-dark flex items-center">
                  Book Doctor <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
