'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { AlertTriangle, PhoneCall, CheckCircle, ShieldAlert, Clock, ArrowLeft } from 'lucide-react';
import { submitEmergencyRequest } from '@/actions/emergency';

export default function EmergencyPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [problemType, setProblemType] = useState('Chemical Splash / Acid Injury');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert(locale === 'hi' ? 'कृपया नाम एवं मोबाइल नंबर दर्ज करें' : 'Please enter name and mobile number');
      return;
    }
    
    setIsSubmitting(true);
    const result = await submitEmergencyRequest({
      name,
      mobile,
      email: email || undefined,
      problem: problemType,
      description
    });
    
    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      alert(locale === 'hi' ? 'कुछ त्रुटि हुई, कृपया पुनः प्रयास करें' : 'Something went wrong, please try again');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Urgent Safety Banner */}
      <div className="bg-emergency text-white p-6 rounded-2xl shadow-emergency space-y-3 relative overflow-hidden">
        <div className="flex items-start space-x-3">
          <ShieldAlert className="w-8 h-8 text-yellow-300 shrink-0 mt-1" />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{messages.emergency.bannerTitle}</h1>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
              {messages.emergency.bannerText}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="tel:+919876543210"
            className="bg-white text-emergency font-extrabold px-5 py-3 rounded-xl text-sm shadow-md flex items-center hover:bg-yellow-300 hover:text-black transition"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            {messages.emergency.callNow}
          </a>
        </div>
      </div>

      {/* 2. Emergency Request Form */}
      {!submitted ? (
        <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-card space-y-6 border-l-4 border-emergency">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-primary-dark">{locale === 'hi' ? 'आपातकालीन सहायता फ़ॉर्म (नो लॉगिन)' : 'Emergency Assistance Form (No Login Required)'}</h2>
            <p className="text-xs text-mutedText mt-0.5">
              {locale === 'hi'
                ? 'यह फ़ॉर्म भरते ही अस्पताल टीम एवं ऑन-कॉल डॉक्टर को तुरंत रियल-टाइम अलर्ट भेजा जाएगा।'
                : 'Submitting this form triggers an immediate real-time alert to our hospital emergency team.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">{messages.booking.patientName} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient Name"
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emergency"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">{messages.booking.mobileNumber} *</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit Mobile"
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emergency"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">
                {locale === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emergency"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {locale === 'hi' ? 'यदि उपलब्ध हो तो ईमेल दें, ताकि हम आपको अलर्ट प्राप्ति का पुष्टिकरण भेज सकें।' : 'Provide email if available so we can send you an alert confirmation.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">{messages.emergency.problemType}</label>
              <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emergency font-medium"
              >
                <option value="Chemical Splash / Acid Injury">Chemical Splash / Acid Injury (केमिकल / एसिड चोट)</option>
                <option value="Sudden Vision Loss">Sudden Vision Loss (अचानक रोशनी जाना)</option>
                <option value="Sharp Object Trauma">Sharp Object Trauma (नुकीली चीज से गंभीर चोट)</option>
                <option value="Severe Pain & Eye Swelling">Severe Pain & Swelling (असहनीय दर्द एवं सूजन)</option>
                <option value="Other Emergency">Other Emergency (अन्य आपातकालीन समस्या)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">{messages.emergency.incidentDesc}</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emergency"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emergency hover:bg-red-800 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-emergency transition transform active:scale-95 flex justify-center items-center disabled:opacity-50"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {isSubmitting ? (locale === 'hi' ? 'भेजा जा रहा है...' : 'Submitting...') : messages.emergency.submitRequest}
            </button>
          </form>
        </div>
      ) : (
        <div className="surface-card p-8 rounded-2xl shadow-2xl text-center space-y-4 border-l-8 border-emergency">
          <div className="w-16 h-16 bg-red-100 text-emergency rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-primary-dark">
            {messages.emergency.requestSubmitted}
          </h2>

          <p className="text-xs text-mutedText max-w-md mx-auto leading-relaxed">
            {locale === 'hi'
              ? 'आपकी आपातकालीन सूचना प्रयाग आई केयर अस्पताल की मेडिकल टीम को प्रेषित कर दी गई है। हमारी टीम तुरंत दिए गए नंबर पर संपर्क कर रही है।'
              : 'Your emergency alert has been broadcast to Prayag Eye Care emergency staff. Our medical team is contacting your mobile immediately.'}
          </p>

          <div className="pt-4 flex justify-center">
            <Link href={`/${locale}`} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow">
              <ArrowLeft className="w-4 h-4 mr-1 inline" /> {messages.common.back} {messages.nav.home}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
