'use client';

import React, { useState } from 'react';
import { Navbar } from '@frontend/components/common/Navbar';
import { Footer } from '@frontend/components/common/Footer';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Eye, Shield, CheckCircle, Clock, AlertTriangle, User, Calendar, Ticket } from 'lucide-react';

export default function DevUiCatalog() {
  const [locale, setLocale] = useState<'hi' | 'en'>('en');
  const messages = locale === 'hi' ? hi : en;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar locale={locale} messages={messages} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-10">
        {/* Header Banner */}
        <div className="bg-primary text-white p-6 rounded-2xl shadow-card flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎨 Hospital Design System & Component Catalog (/dev/ui)</h1>
            <p className="text-sm text-cyan-100 mt-1">Live showcase of all reusable UI tokens, accessibility widgets, and bilingual components.</p>
          </div>
          <button
            onClick={() => setLocale(locale === 'hi' ? 'en' : 'hi')}
            className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm shadow hover:bg-gray-100 transition"
          >
            Toggle Language: {locale === 'hi' ? 'English' : 'हिन्दी'}
          </button>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary-dark">1. Color Tokens (WCAG AA Compliant)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl text-white font-bold text-xs bg-primary shadow">
              --primary<br />#0A5EB0
            </div>
            <div className="p-4 rounded-xl text-white font-bold text-xs bg-primary-dark shadow">
              --primary-dark<br />#0B2545
            </div>
            <div className="p-4 rounded-xl text-white font-bold text-xs bg-accent shadow">
              --accent<br />#13A89E
            </div>
            <div className="p-4 rounded-xl text-white font-bold text-xs bg-success shadow">
              --success<br />#2E9E6B
            </div>
            <div className="p-4 rounded-xl text-white font-bold text-xs bg-warning shadow">
              --warning<br />#F5A524
            </div>
            <div className="p-4 rounded-xl text-white font-bold text-xs bg-emergency shadow">
              --emergency<br />#C62828
            </div>
          </div>
        </section>

        {/* 2. Status Badges */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary-dark">2. Token & Appointment Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" /> {messages.token.statusBooked}
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> {messages.token.statusCheckedIn}
            </span>
            <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" /> {messages.token.statusWaiting}
            </span>
            <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs flex items-center">
              <User className="w-3.5 h-3.5 mr-1" /> {messages.token.statusInConsultation}
            </span>
            <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-xs flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> {messages.token.statusCompleted}
            </span>
            <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-xs flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {messages.token.statusCancelled}
            </span>
          </div>
        </section>

        {/* 3. Token Card Component */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary-dark">3. Digital Token Card Preview</h2>
          <div className="max-w-md surface-card p-6 rounded-2xl shadow-card border-l-4 border-accent space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-mutedText uppercase">Appointment ID: PRY-2026-00123</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {messages.token.statusCheckedIn}
              </span>
            </div>

            <div className="bg-hospitalBg p-4 rounded-xl text-center space-y-1">
              <span className="text-xs text-mutedText font-semibold">{messages.token.yourToken}</span>
              <div className="text-4xl font-extrabold text-primary tracking-wider font-mono">A-018</div>
              <span className="text-xs text-primary-dark font-medium block">Dr. S. K. Sharma (Cataract Specialist)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="text-mutedText block">{messages.token.currentlyServing}</span>
                <span className="text-base font-bold text-gray-800 font-mono">A-014</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="text-mutedText block">{messages.token.patientsAhead}</span>
                <span className="text-base font-bold text-amber-600">3 {locale === 'hi' ? 'मरीज' : 'patients'}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{messages.token.etaWindow}: 10:45 AM - 11:05 AM</span>
                <p className="text-[11px] text-blue-700 mt-0.5 leading-snug">{messages.token.etaDisclaimer}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Buttons & Form Inputs */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary-dark">4. Standard Buttons & Inputs</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="bg-primary text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow hover:bg-primary-dark transition">
              Primary Button ({messages.common.bookAppointment})
            </button>
            <button className="bg-accent text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow hover:bg-teal-700 transition">
              Secondary Button ({messages.common.viewDetails})
            </button>
            <button className="bg-emergency text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-emergency hover:bg-red-800 transition">
              Emergency Button ({messages.common.emergencyBtn})
            </button>
            <button className="border border-hospitalBorder text-hospitalText font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
              Outline Button ({messages.common.cancel})
            </button>
          </div>
        </section>
      </main>

      <Footer locale={locale} messages={messages} />
    </div>
  );
}
