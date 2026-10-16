'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Eye, Globe, Menu, X, PhoneCall, AlertTriangle, Calendar,
  Home, Info, Stethoscope, Activity, Users, Glasses, Phone, Lock,
} from 'lucide-react';
import { A11yControls } from '../a11y/A11yControls';

interface NavbarProps {
  locale: 'hi' | 'en';
  messages: any;
  hospital?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ locale, messages, hospital }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === 'hi' ? 'en' : 'hi';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(newPath || `/${nextLocale}`);
  };

  const navLinks = [
    { href: `/${locale}`,              label: messages.nav.home,        icon: Home },
    { href: `/${locale}/about`,        label: messages.nav.about,       icon: Info },
    { href: `/${locale}/services`,     label: messages.nav.services,    icon: Stethoscope },
    { href: `/${locale}/eye-problems`, label: messages.nav.eyeProblems, icon: Activity },
    { href: `/${locale}/doctors`,      label: messages.nav.doctors,     icon: Users },
    { href: `/${locale}/optical`,      label: messages.nav.optical,     icon: Glasses },
    { href: `/${locale}/contact`,      label: messages.nav.contact,     icon: Phone },
  ];

  // Dynamic Hospital Name & Phone from DB
  const hospitalName = hospital 
    ? (locale === 'hi' ? (hospital.name_hi || hospital.name_en) : (hospital.name_en || hospital.name_hi)) 
    : messages.common.hospitalName;

  const primaryPhone = hospital?.phone1 || hospital?.emergencyPhone || '+91 98765 43210';

  // Dynamic Open / Closed Status Calculation based on settings
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = daysOfWeek[now.getDay()];
  const isWeeklyHoliday = hospital?.closedDay && hospital.closedDay !== 'None' && hospital.closedDay === todayDayName;

  const currentH = now.getHours();
  const currentM = now.getMinutes();
  const currentTimeVal = currentH * 60 + currentM;

  const [openH, openM] = (hospital?.openTime || '09:00').split(':').map(Number);
  const [closeH, closeM] = (hospital?.closeTime || '18:00').split(':').map(Number);
  const openTimeVal = openH * 60 + (openM || 0);
  const closeTimeVal = closeH * 60 + (closeM || 0);

  const isTimingOpen = !isWeeklyHoliday && currentTimeVal >= openTimeVal && currentTimeVal <= closeTimeVal;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-hospitalBorder shadow-sm">

      {/* ─── Row 1: Top Info Bar ─── */}
      <div className="bg-primary-dark text-white px-4 py-1 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center font-medium px-2 py-0.5 rounded-full text-[11px] ${
            isTimingOpen ? 'bg-emerald-600' : 'bg-red-600'
          }`}>
            ● {isTimingOpen ? messages.common.openNow : (locale === 'hi' ? `अभी बंद है (${hospital?.openTime || '09:00'} बजे खुलेगा)` : `Closed Now (Opens at ${hospital?.openTime || '09:00 AM'})`)}
          </span>
          {isWeeklyHoliday && (
            <span className="bg-amber-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded hidden sm:inline">
              {locale === 'hi' ? 'आज साप्ताहिक अवकाश है' : 'Today is Weekly Holiday'}
            </span>
          )}
          <a href={`tel:${primaryPhone.replace(/\s/g, '')}`} className="hidden sm:inline-flex items-center hover:underline text-cyan-300">
            <PhoneCall className="w-3 h-3 mr-1" /> {primaryPhone}
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <A11yControls locale={locale} />
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition text-cyan-200"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'hi' ? 'EN' : 'हि'}</span>
          </button>
        </div>
      </div>

      {/* ─── Row 2: Brand + CTA Buttons ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center space-x-2.5 shrink-0">
          <div className="h-10 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt={hospitalName}
              className="h-9 w-auto object-contain max-w-[150px] sm:max-w-[200px]"
            />
          </div>
          <div className="border-l border-gray-200 pl-2 hidden lg:block">
            <span className="text-sm font-extrabold text-primary-dark tracking-tight block leading-tight max-w-[240px] sm:max-w-sm truncate">
              {hospitalName}
            </span>
            <span className="text-[10px] text-mutedText block font-medium leading-none">
              {messages.common.tagline}
            </span>
          </div>
        </Link>

        {/* CTA Buttons (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href={`/${locale}/emergency`}
            className="bg-emergency hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow transition active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            {messages.common.emergencyBtn}
          </Link>
          <Link
            href={`/${locale}/appointment`}
            className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow transition active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {messages.common.bookAppointment}
          </Link>
          <Link
            href={`/${locale}/auth/login`}
            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow transition active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 mr-1" />
            {messages.nav.login}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-hospitalText hover:text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ─── Row 3: Desktop Nav Buttons (full-width dedicated row) ─── */}
      <div className="hidden lg:block border-t border-gray-100 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-hospitalText hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-hospitalBorder px-4 pt-3 pb-5 space-y-3 shadow-xl">
          {/* 2-col button grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition border ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow'
                      : 'bg-white text-hospitalText border-gray-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA Buttons */}
          <div className="flex gap-2 pt-1">
            <Link
              href={`/${locale}/emergency`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-emergency text-white py-2.5 rounded-xl font-bold flex justify-center items-center text-xs"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              {messages.common.emergencyBtn}
            </Link>
            <Link
              href={`/${locale}/appointment`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold flex justify-center items-center text-xs"
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              {messages.common.bookAppointment}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
