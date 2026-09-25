'use client';

import React, { useState } from 'react';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Pill, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PharmacyDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx-1',
      patient: 'Ram Kumar (Token A-014)',
      medicines: ['Refresh Tears Drops (1 drop, 3x daily)', 'Ciprofloxacin Drops (1 drop, 4x daily)'],
      status: 'RECEIVED',
    },
    {
      id: 'rx-2',
      patient: 'Sita Devi (Token A-015)',
      medicines: ['Prednisolone Acetate Drops (1 drop, 2x daily)'],
      status: 'PREPARING',
    },
  ]);

  const handleUpdateStatus = (rxId: string, nextStatus: string) => {
    setPrescriptions(
      prescriptions.map((rx) => (rx.id === rxId ? { ...rx, status: nextStatus } : rx))
    );
    alert(locale === 'hi' ? `स्थिति अद्यतन: ${nextStatus}` : `Prescription Status Updated: ${nextStatus}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-card flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Hospital Pharmacy Desk</span>
          <h1 className="text-2xl font-extrabold">{messages.pharmacy.title}</h1>
        </div>
        <span className="bg-white/10 px-3 py-1 rounded-xl text-xs font-bold text-cyan-200">
          {messages.pharmacy.payAtCounter}
        </span>
      </div>

      <div className="surface-card p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="text-lg font-bold text-primary-dark">Incoming Prescriptions Queue</h2>

        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="font-bold text-sm text-primary-dark">{rx.patient}</span>
                <ul className="text-xs text-mutedText list-disc pl-4 space-y-0.5">
                  {rx.medicines.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  {rx.status}
                </span>

                {rx.status === 'RECEIVED' && (
                  <button onClick={() => handleUpdateStatus(rx.id, 'PREPARING')} className="bg-primary text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Start Preparing
                  </button>
                )}
                {rx.status === 'PREPARING' && (
                  <button onClick={() => handleUpdateStatus(rx.id, 'READY')} className="bg-success text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Mark Ready (Notify Patient)
                  </button>
                )}
                {rx.status === 'READY' && (
                  <button onClick={() => handleUpdateStatus(rx.id, 'COLLECTED')} className="bg-gray-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Mark Collected
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
