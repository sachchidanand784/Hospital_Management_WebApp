'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  locale: 'hi' | 'en';
  messages: any;
  hospital?: any;
}

export const Footer: React.FC<FooterProps> = ({ locale, messages, hospital }) => {
  const hospitalName = hospital 
    ? (locale === 'hi' ? (hospital.name_hi || hospital.name_en) : (hospital.name_en || hospital.name_hi)) 
    : messages.common.hospitalName;

  const address = hospital?.address_en || 'Dildarnagar Tarighat Road, Bangalapar, Dildarnagar, Ghazipur, Uttar Pradesh 232326';
  const openTime = hospital?.openTime || '09:00';
  const closeTime = hospital?.closeTime || '18:00';
  const closedDay = hospital?.closedDay || 'Sunday';
  const freeCheckupDay = hospital?.freeCheckupDay || 'Tuesday';
  const phoneText = [hospital?.phone1, hospital?.phone2].filter(Boolean).join(' / ') || '+91 80048 00688 / 80048 00699';
  const emailText = hospital?.email || 'info@msmemorialnetralaya.com';

  return (
    <footer className="bg-primary-dark text-white pt-12 pb-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Hospital Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt={hospitalName}
              className="h-10 w-auto object-contain bg-white/90 p-1 rounded-lg"
            />
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            {locale === 'hi'
              ? 'एम एस मेमोरियल नेत्रालय — दिलदारनगर (गाजीपुर) का प्रमुख सुपर-स्पेशलिटी नेत्र संस्थान। अत्याधुनिक फेको मोतियाबिंद, रेटिना लेजर एवं डिजिटल टोकन प्रणाली।'
              : 'M S Memorial Netralaya — Premier eye institute in Dildarnagar, Ghazipur equipped with advanced Phaco cataract surgery, vitreoretinal care, and digital token tracking.'}
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Certified Eye Care Centre</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-accent mb-3 uppercase tracking-wider">
            {locale === 'hi' ? 'त्वरित लिंक्स' : 'Quick Links'}
          </h3>
          <ul className="space-y-2 text-xs text-gray-300 font-medium">
            <li><Link href={`/${locale}/services`} className="hover:text-white transition">{messages.nav.services}</Link></li>
            <li><Link href={`/${locale}/doctors`} className="hover:text-white transition">{messages.nav.doctors}</Link></li>
            <li><Link href={`/${locale}/optical`} className="hover:text-white transition">{messages.nav.optical}</Link></li>
            <li><Link href={`/${locale}/eye-problems`} className="hover:text-white transition">{messages.nav.eyeProblems}</Link></li>
            <li><Link href={`/${locale}/track`} className="hover:text-white transition">{messages.nav.trackAppointment}</Link></li>
          </ul>
        </div>

        {/* Column 3: Timings & Hours */}
        <div>
          <h3 className="text-sm font-bold text-accent mb-3 uppercase tracking-wider">
            {locale === 'hi' ? 'अस्पताल समय' : 'Hospital Hours'}
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {locale === 'hi' 
                  ? `ओपीडी समय: सुबह ${openTime} - शाम ${closeTime}` 
                  : `OPD Hours: ${openTime} - ${closeTime}`}
              </span>
            </li>
            {closedDay && closedDay !== 'None' && (
              <li className="text-red-300 text-[11px] font-semibold pl-6">
                {locale === 'hi' ? `साप्ताहिक अवकाश: ${closedDay}` : `Weekly Holiday: ${closedDay}`}
              </li>
            )}
            {freeCheckupDay && freeCheckupDay !== 'None' && (
              <li className="text-amber-300 font-semibold pl-6">
                {locale === 'hi' ? `${freeCheckupDay}: निःशुल्क ओपीडी जांच` : `${freeCheckupDay}: Free General OPD Day`}
              </li>
            )}
            <li className="flex items-center space-x-2 text-emerald-400 font-bold pt-1">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{messages.common.emergency24x7}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Address & Contact */}
        <div>
          <h3 className="text-sm font-bold text-accent mb-3 uppercase tracking-wider">
            {locale === 'hi' ? 'संपर्क एवं पता' : 'Contact & Location'}
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{phoneText}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{emailText}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400">
        <p>© 2026 {messages.common.hospitalName}. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link href={`/${locale}/privacy`} className="hover:text-white">Privacy Policy</Link>
          <Link href={`/${locale}/terms`} className="hover:text-white">Terms of Service</Link>
          <Link href={`/${locale}/auth/login`} className="hover:text-white text-cyan-300 font-bold">{messages.nav.login}</Link>
        </div>
      </div>
    </footer>
  );
};
