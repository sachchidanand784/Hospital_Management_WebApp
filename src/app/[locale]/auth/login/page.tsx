'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Eye, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;
  const router = useRouter();

  const [email, setEmail] = useState('owner@hospital.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('OWNER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'OWNER') router.push(`/${locale}/dashboard/owner`);
    else if (selectedRole === 'DOCTOR') router.push(`/${locale}/dashboard/doctor`);
    else if (selectedRole === 'RECEPTION') router.push(`/${locale}/dashboard/reception`);
    else if (selectedRole === 'OPTOMETRIST') router.push(`/${locale}/dashboard/optometry`);
    else if (selectedRole === 'PHARMACY') router.push(`/${locale}/dashboard/pharmacy`);
    else if (selectedRole === 'OPTICAL') router.push(`/${locale}/dashboard/optical`);
    else if (selectedRole === 'OT') router.push(`/${locale}/dashboard/ot`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="surface-card p-8 rounded-2xl shadow-2xl border-t-4 border-primary space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Eye className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-primary-dark">{messages.nav.login}</h1>
          <p className="text-xs text-mutedText">Prayag Eye Care Hospital Staff Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-hospitalText block mb-1">Select Staff Role / रोल चुनें</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setEmail(`${e.target.value.toLowerCase()}@hospital.com`);
              }}
              className="w-full p-3 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
            >
              <option value="OWNER">Hospital Owner / Admin</option>
              <option value="DOCTOR">Doctor (Ophthalmologist)</option>
              <option value="RECEPTION">Reception & Front Desk</option>
              <option value="OPTOMETRIST">Eye Technician / Optometrist</option>
              <option value="PHARMACY">Pharmacy Staff</option>
              <option value="OPTICAL">Optical (Chashma Ghar) Staff</option>
              <option value="OT">Surgery & OT Staff</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-hospitalText block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-hospitalText block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs shadow-md transition flex justify-center items-center"
          >
            Sign In to {selectedRole} Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </form>

        <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200 text-[11px] text-mutedText space-y-1">
          <span className="font-bold text-primary-dark block">Demo Credentials (Password: password123):</span>
          <p>• Owner: owner@hospital.com</p>
          <p>• Doctor: doctor@hospital.com</p>
          <p>• Reception: reception@hospital.com</p>
        </div>
      </div>
    </div>
  );
}
