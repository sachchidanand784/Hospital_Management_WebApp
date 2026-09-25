'use client';

import React, { useState } from 'react';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Calendar, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

export default function OtDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [surgeries, setSurgeries] = useState([
    {
      id: 'surg-1',
      patient: 'Ram Kumar',
      type: 'Phaco Cataract Surgery + Foldable IOL',
      eye: 'RIGHT',
      surgeon: 'Dr. Suresh Kumar Sharma',
      date: '2026-09-28',
      room: 'OT 1',
      status: 'SCHEDULED',
      preOpDone: false,
    },
  ]);

  const handlePreOpDone = (surgId: string) => {
    setSurgeries(surgeries.map(s => s.id === surgId ? { ...s, preOpDone: true, status: 'PRE_OP_DONE' } : s));
    alert(locale === 'hi' ? 'प्री-ऑप सुरक्षा जांच पूर्ण घोषित!' : 'Pre-Op Safety Checklist Marked Complete!');
  };

  const handleSurgeryComplete = (surgId: string) => {
    setSurgeries(surgeries.map(s => s.id === surgId ? { ...s, status: 'COMPLETED' } : s));
    alert(locale === 'hi' ? 'ऑपरेशन पूर्ण! ऑटोमेटिक फॉलो-अप समय सारणी (Day 1, Week 1, Month 1) जनरेट की गई।' : 'Surgery Completed! Auto follow-up schedule (Day 1, Week 1, Month 1) generated.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-card flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Operation Theatre Workspace</span>
          <h1 className="text-2xl font-extrabold">{messages.ot.title} Console</h1>
        </div>
        <span className="bg-white/10 px-3 py-1 rounded-xl text-xs font-bold text-cyan-200">
          OT Room 1 & 2 Available
        </span>
      </div>

      <div className="surface-card p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="text-lg font-bold text-primary-dark">Surgery Schedule & Safety Checklists</h2>

        <div className="space-y-4">
          {surgeries.map((surg) => (
            <div key={surg.id} className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="font-bold text-sm text-primary-dark">{surg.patient} ({surg.eye} EYE)</span>
                <p className="text-xs text-mutedText">{surg.type} • Surgeon: {surg.surgeon}</p>
                <span className="text-[11px] text-gray-500 block">Date: {surg.date} | {surg.room}</span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                  {surg.status}
                </span>

                {!surg.preOpDone && (
                  <button onClick={() => handlePreOpDone(surg.id)} className="bg-accent text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Complete Pre-Op Checklist
                  </button>
                )}
                {surg.preOpDone && surg.status !== 'COMPLETED' && (
                  <button onClick={() => handleSurgeryComplete(surg.id)} className="bg-success text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Mark Surgery Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
