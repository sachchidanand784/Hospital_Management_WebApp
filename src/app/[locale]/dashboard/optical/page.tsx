'use client';

import React, { useState } from 'react';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Glasses, Plus, CheckCircle, Package } from 'lucide-react';

export default function OpticalDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [orders, setOrders] = useState([
    { id: 'opt-ord-1', patient: 'Ram Kumar', type: 'NEW_GLASSES', status: 'MEASURED', promisedDate: '2026-09-28' },
    { id: 'opt-ord-2', patient: 'Sita Devi', type: 'FRAME_REPLACEMENT', status: 'IN_PROGRESS', promisedDate: '2026-09-27' },
  ]);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    alert(locale === 'hi' ? `आदेश स्थिति: ${nextStatus}` : `Order Status Updated: ${nextStatus}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-card flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Chashma Ghar Manager</span>
          <h1 className="text-2xl font-extrabold">{messages.optical.title} Console</h1>
        </div>
        <button onClick={() => alert('Add Optical Product Modal')} className="bg-accent hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center shadow">
          <Plus className="w-4 h-4 mr-1" /> Add New Frame / Lens
        </button>
      </div>

      <div className="surface-card p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="text-lg font-bold text-primary-dark">Active Spectacles & Lens Orders</h2>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-xl border border-gray-200 bg-white flex justify-between items-center">
              <div>
                <span className="font-bold text-sm text-primary-dark">{ord.patient}</span>
                <p className="text-xs text-mutedText">{ord.type} • Promised Date: {ord.promisedDate}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                  {ord.status}
                </span>

                {ord.status === 'MEASURED' && (
                  <button onClick={() => handleUpdateOrderStatus(ord.id, 'IN_PROGRESS')} className="bg-primary text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Start Fitting
                  </button>
                )}
                {ord.status === 'IN_PROGRESS' && (
                  <button onClick={() => handleUpdateOrderStatus(ord.id, 'READY')} className="bg-success text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    Mark Ready (Notify Patient)
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
