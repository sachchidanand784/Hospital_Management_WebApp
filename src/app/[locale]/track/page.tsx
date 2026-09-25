'use client';

import React, { useState } from 'react';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Clock, Search, CheckCircle, Download, Share2, QrCode, AlertCircle } from 'lucide-react';

export default function TrackPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [appointmentCode, setAppointmentCode] = useState('PRY-2026-00123');
  const [searched, setSearched] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Search Bar */}
      <div className="surface-card p-6 rounded-2xl shadow-card space-y-4">
        <h1 className="text-xl font-bold text-primary-dark">{messages.nav.trackAppointment}</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            value={appointmentCode}
            onChange={(e) => setAppointmentCode(e.target.value)}
            placeholder="Enter Appointment ID (e.g. PRY-2026-00123) or Mobile Number"
            className="flex-1 p-3 border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => setSearched(true)}
            className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-bold shadow hover:bg-primary-dark flex items-center"
          >
            <Search className="w-4 h-4 mr-1" /> {messages.common.search}
          </button>
        </div>
      </div>

      {/* Live Token Status Result */}
      {searched && (
        <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-card space-y-6 border-l-4 border-accent">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <span className="text-xs font-bold text-mutedText">APPOINTMENT ID: {appointmentCode}</span>
              <h2 className="text-lg font-bold text-primary-dark mt-0.5">Ram Kumar (Age: 45)</h2>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">
              ● {messages.token.statusCheckedIn}
            </span>
          </div>

          {/* Main Token Display Box */}
          <div className="bg-hospitalBg p-6 rounded-2xl border border-hospitalBorder text-center space-y-3 shadow-inner">
            <span className="text-xs text-mutedText font-semibold">{messages.token.yourToken}</span>
            <div className="text-5xl font-extrabold text-primary font-mono tracking-wider">A-018</div>
            <span className="text-xs text-primary-dark font-bold block">Dr. Suresh Kumar Sharma (Cataract Specialist)</span>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-mutedText block">{messages.token.currentlyServing}</span>
              <span className="text-xl font-bold text-primary font-mono">A-014</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-mutedText block">{messages.token.patientsAhead}</span>
              <span className="text-xl font-bold text-amber-600 font-mono">3 {locale === 'hi' ? 'मरीज' : 'patients'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 col-span-2 sm:col-span-1">
              <span className="text-mutedText block">OPD Room</span>
              <span className="text-xl font-bold text-emerald-700">Room 102 (1st Floor)</span>
            </div>
          </div>

          {/* ETA Disclaimer Box */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-1">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold">{messages.token.etaWindow}: 10:45 AM - 11:05 AM</span>
            </div>
            <p className="text-[11px] text-blue-700 leading-snug">{messages.token.etaDisclaimer}</p>
          </div>

          {/* Status Timeline */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold text-primary-dark block mb-2">Visit Progress Timeline:</span>
            <div className="flex justify-between items-center text-[11px] font-semibold text-center text-gray-500">
              <div className="text-emerald-700">✓ Booked</div>
              <div className="text-emerald-700 font-bold">✓ Checked-in</div>
              <div className="text-primary font-bold">● Waiting in Lounge</div>
              <div>In Consultation</div>
              <div>Completed</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => alert('PDF Token Downloaded')} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow">
              <Download className="w-4 h-4 mr-1.5" /> {messages.booking.downloadPdf}
            </button>
            <button onClick={() => alert('WhatsApp Link Shared')} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow">
              <Share2 className="w-4 h-4 mr-1.5" /> {messages.booking.shareWhatsapp}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
