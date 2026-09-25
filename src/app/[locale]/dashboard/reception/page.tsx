'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import {
  QrCode,
  Search,
  UserPlus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Tv,
  Printer,
  Clock
} from 'lucide-react';

export default function ReceptionDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeQueue, setActiveQueue] = useState([
    { token: 'A-014', code: 'PRY-2026-00123', name: 'Ram Kumar', mobile: '9876543210', status: 'IN_CONSULTATION', doctor: 'Dr. Suresh Sharma' },
    { token: 'A-015', code: 'PRY-2026-00124', name: 'Sita Devi', mobile: '9876543211', status: 'WAITING', doctor: 'Dr. Suresh Sharma' },
    { token: 'A-016', code: 'PRY-2026-00125', name: 'Vikas Singh', mobile: '9876543212', status: 'CHECKED_IN', doctor: 'Dr. Ananya Srivastava' },
    { token: 'A-017', code: 'PRY-2026-00126', name: 'Meena Agarwal', mobile: '9876543213', status: 'BOOKED', doctor: 'Dr. Rajeshwar Patel' },
  ]);

  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinMobile, setWalkinMobile] = useState('');

  const handleCheckIn = (tokenCode: string) => {
    setActiveQueue(activeQueue.map(q => q.token === tokenCode ? { ...q, status: 'WAITING' } : q));
    alert(locale === 'hi' ? `टोकन ${tokenCode} का चेक-इन पूर्ण!` : `Token ${tokenCode} Checked-in successfully!`);
  };

  const handleAddWalkin = () => {
    if (!walkinName || !walkinMobile) return;
    const nextSeq = activeQueue.length + 14;
    const newToken = `W-${nextSeq.toString().padStart(3, '0')}`;
    setActiveQueue([
      ...activeQueue,
      {
        token: newToken,
        code: `PRY-2026-W${nextSeq}`,
        name: walkinName,
        mobile: walkinMobile,
        status: 'WAITING',
        doctor: 'Dr. Suresh Sharma',
      }
    ]);
    setWalkinModalOpen(false);
    setWalkinName('');
    setWalkinMobile('');
    alert(locale === 'hi' ? `वॉक-इन टोकन ${newToken} जारी किया गया!` : `Walk-in Token ${newToken} allocated!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-primary-dark text-white p-6 rounded-2xl shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Front Desk Reception</span>
          <h1 className="text-2xl font-extrabold">Reception Queue Control & Check-in Desk</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setWalkinModalOpen(true)}
            className="bg-accent hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center shadow"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Fast Walk-in Booking
          </button>

          <Link
            href={`/${locale}/display/all`}
            target="_blank"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center shadow"
          >
            <Tv className="w-4 h-4 mr-1.5" /> Launch Public TV Display
          </Link>
        </div>
      </div>

      {/* Search & Camera QR Scanner Bar */}
      <div className="surface-card p-4 rounded-2xl shadow-card flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, Mobile Number, Token (e.g. A-014), or Appointment ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        <button
          onClick={() => alert('Simulating In-Browser Camera QR Scanner Check-in...')}
          className="bg-hospitalBg hover:bg-gray-100 border border-gray-300 text-primary-dark font-bold px-4 py-2.5 rounded-xl text-xs flex items-center shrink-0"
        >
          <QrCode className="w-4 h-4 mr-1.5 text-primary" /> Camera QR Scanner
        </button>
      </div>

      {/* Queue Board Table */}
      <div className="surface-card p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="text-lg font-bold text-primary-dark">Today's Patients & Queue Control</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-mutedText uppercase tracking-wider">
                <th className="py-3 px-2">Token</th>
                <th className="py-3 px-2">Appointment ID</th>
                <th className="py-3 px-2">Patient Details</th>
                <th className="py-3 px-2">Doctor / Department</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {activeQueue.map((item) => (
                <tr key={item.token} className="hover:bg-gray-50">
                  <td className="py-3 px-2 font-bold font-mono text-primary text-sm">{item.token}</td>
                  <td className="py-3 px-2 text-mutedText font-mono">{item.code}</td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-primary-dark block">{item.name}</span>
                    <span className="text-[11px] text-mutedText">{item.mobile}</span>
                  </td>
                  <td className="py-3 px-2 text-mutedText">{item.doctor}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'IN_CONSULTATION' ? 'bg-purple-100 text-purple-800' :
                      item.status === 'WAITING' ? 'bg-amber-100 text-amber-800' :
                      item.status === 'CHECKED_IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-1">
                    {item.status === 'BOOKED' && (
                      <button
                        onClick={() => handleCheckIn(item.token)}
                        className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-[11px] hover:bg-emerald-700"
                      >
                        Check-in
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Reprint Token Slip for ${item.token}`)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded"
                      title="Print Thermal Token Slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Fast Booking Modal */}
      {walkinModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-primary-dark">Fast Walk-in Token Allocation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Patient Name *</label>
                <input
                  type="text"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="Walk-in Patient Name"
                  className="w-full p-2.5 border rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Mobile Number *</label>
                <input
                  type="text"
                  value={walkinMobile}
                  onChange={(e) => setWalkinMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-2.5 border rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setWalkinModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleAddWalkin} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                Allocate Walk-in Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
