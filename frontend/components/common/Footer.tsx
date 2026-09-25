'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  locale: 'hi' | 'en';
  messages: any;
}

export const Footer: React.FC<FooterProps> = ({ locale, messages }) => {
  return (
    <footer className="bg-primary-dark text-white pt-12 pb-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Hospital Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="bg-accent text-white p-2 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">{messages.common.hospitalName}</span>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            {locale === 'hi'
              ? 'प्रयागराज का प्रतिष्ठित नेत्र अस्पताल — अत्याधुनिक लेजर तकनीक, फेको मोतियाबिंद ऑपरेशन एवं डिजिटल टोकन सुविधा।'
              : 'Prayagraj\'s trusted eye care hospital offering Phaco cataract surgery, laser vision correction, and digital token tracking.'}
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>NABH Accredited Standard Care</span>
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
              <span>{locale === 'hi' ? 'सोमवार - शनिवार: सुबह 9:00 - शाम 5:00' : 'Mon - Sat: 9:00 AM - 5:00 PM'}</span>
            </li>
            <li className="text-amber-300 font-semibold pl-6">
              {locale === 'hi' ? 'मंगलवार: निःशुल्क ओपीडी जांच' : 'Tuesday: Free General OPD Day'}
            </li>
            <li className="flex items-center space-x-2 text-red-400 font-bold pt-1">
              <Clock className="w-4 h-4 text-red-400 shrink-0" />
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
              <span>12/4 Civil Lines, Near MG Marg, Prayagraj, Uttar Pradesh 211001</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>+91 98765 43210 / 0532-2400112</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>info@prayageyecare.com</span>
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
