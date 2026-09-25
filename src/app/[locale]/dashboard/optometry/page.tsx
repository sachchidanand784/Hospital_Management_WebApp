'use client';

import React, { useState } from 'react';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Eye, FileCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function OptometryDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [sphRight, setSphRight] = useState('-1.25');
  const [cylRight, setCylRight] = useState('-0.50');
  const [axisRight, setAxisRight] = useState('90');
  const [sphLeft, setSphLeft] = useState('-1.00');
  const [cylLeft, setCylLeft] = useState('0.00');
  const [axisLeft, setAxisLeft] = useState('0');
  const [pd, setPd] = useState('62');
  const [iopRight, setIopRight] = useState('14');
  const [iopLeft, setIopLeft] = useState('15');

  const handleSendToDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    alert(locale === 'hi' ? 'नेत्र जांच (रिफ्रैक्शन) रिकॉर्ड डॉक्टर को भेज दिया गया!' : 'Eye examination & refraction sent to doctor!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-card flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Optometry & Vision Testing</span>
          <h1 className="text-2xl font-extrabold">Eye Examination & Refraction Form</h1>
        </div>
        <span className="bg-white/10 px-3 py-1 rounded-xl text-xs font-bold text-cyan-200">
          Patient: Ram Kumar (Token A-014)
        </span>
      </div>

      <form onSubmit={handleSendToDoctor} className="surface-card p-6 sm:p-8 rounded-2xl shadow-card space-y-6 border border-hospitalBorder">
        {/* Right Eye vs Left Eye Refraction Table */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-primary-dark border-b border-gray-100 pb-2">1. Computerized Refraction (SPH / CYL / AXIS / ADD)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Right Eye (OD) */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
              <span className="font-extrabold text-sm text-primary block">Right Eye (OD / दायां नेत्र)</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="font-bold text-mutedText block">SPH</label>
                  <input type="text" value={sphRight} onChange={(e) => setSphRight(e.target.value)} className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-mutedText block">CYL</label>
                  <input type="text" value={cylRight} onChange={(e) => setCylRight(e.target.value)} className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-mutedText block">AXIS</label>
                  <input type="text" value={axisRight} onChange={(e) => setAxisRight(e.target.value)} className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                </div>
              </div>
            </div>

            {/* Left Eye (OS) */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
              <span className="font-extrabold text-sm text-primary block">Left Eye (OS / बायां नेत्र)</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="font-bold text-mutedText block">SPH</label>
                  <input type="text" value={sphLeft} onChange={(e) => setSphLeft(e.target.value)} className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-mutedText block">CYL</label>
                  <input type="text" value={cylLeft} onChange={(e) => setCylLeft(e.target.value)} className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold text-mutedText block">AXIS</label>
                  <input type="text" value={axisLeft} onChange={(e) => setAxisLeft(e.target.value)} className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IOP & PD Measurements */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 text-xs">
          <div>
            <label className="font-bold text-hospitalText block mb-1">Pupillary Distance (PD mm)</label>
            <input type="text" value={pd} onChange={(e) => setPd(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono text-center font-bold" />
          </div>
          <div>
            <label className="font-bold text-hospitalText block mb-1">IOP Right (mmHg)</label>
            <input type="text" value={iopRight} onChange={(e) => setIopRight(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono text-center font-bold" />
          </div>
          <div>
            <label className="font-bold text-hospitalText block mb-1">IOP Left (mmHg)</label>
            <input type="text" value={iopLeft} onChange={(e) => setIopLeft(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono text-center font-bold" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-xs shadow flex items-center">
            <FileCheck className="w-4 h-4 mr-2" /> Send Examination to Doctor Workspace
          </button>
        </div>
      </form>
    </div>
  );
}
