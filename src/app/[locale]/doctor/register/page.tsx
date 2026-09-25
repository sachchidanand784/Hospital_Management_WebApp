'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { UserPlus, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';

export default function DoctorRegisterPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('Cataract & Refractive Surgery');
  const [experienceYears, setExperienceYears] = useState('10');
  const [fee, setFee] = useState('400');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobile || !password) {
      alert(locale === 'hi' ? 'कृपया सभी अनिवार्य जानकारी भरें' : 'Please fill all required fields');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-card space-y-6 border-t-4 border-primary">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2 text-primary font-bold text-sm">
            <UserPlus className="w-5 h-5" />
            <span>{messages.doctors.registerHeading}</span>
          </div>
          <p className="text-xs text-mutedText mt-1">{messages.doctors.registerNotice}</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Full Name (डॉक्टर का नाम) *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Email (ईमेल) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Mobile Number (मोबाइल) *</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Qualification (योग्यता) *</label>
                <input
                  type="text"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. MBBS, MS (Ophthalmology)"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Specialization (विशेषज्ञता) *</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Cataract & Refractive Surgery">Cataract & Refractive Surgery (मोतियाबिंद)</option>
                  <option value="Vitreoretinal Diseases & Surgery">Vitreoretinal Diseases (रेटीना पर्दा)</option>
                  <option value="Glaucoma & Intraocular Pressure">Glaucoma (काला मोतिया)</option>
                  <option value="Pediatric Ophthalmology & Squint">Pediatric & Squint (बाल नेत्र रोग)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Years Experience (अनुभव वर्ष)</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Consultation Fee (शुल्क ₹)</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Account Password (पासवर्ड) *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 10 characters"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">Short Bio (संक्षिप्त परिचय)</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Medical experience background..."
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs shadow transition"
            >
              Submit Doctor Registration Request
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-bold text-primary-dark">
              {locale === 'hi' ? 'आवेदन सफलतापूर्वक जमा किया गया!' : 'Registration Application Submitted!'}
            </h2>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 max-w-md mx-auto space-y-1 text-left">
              <span className="font-bold block">Status: PENDING ADMIN VERIFICATION</span>
              <p className="text-[11px] leading-relaxed">
                {locale === 'hi'
                  ? 'अस्पताल मालिक (ऑनर) को आपके आवेदन की सूचना भेज दी गई है। सत्यापन पूर्ण होने के बाद आपका प्रोफाइल सार्वजनिक रूप से दृश्यमान और बुक करने योग्य होगा।'
                  : 'Hospital Owner has been notified. Once verified, your doctor profile will be publicly active and bookable.'}
              </p>
            </div>

            <Link href={`/${locale}`} className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow">
              <ArrowLeft className="w-4 h-4 mr-1 inline" /> Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
