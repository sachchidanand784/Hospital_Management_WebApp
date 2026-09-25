'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle,
  PhoneCall,
  MessageSquare,
  Navigation,
} from 'lucide-react';

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    subject: 'general',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo submission — in production connect to API
    setSubmitted(true);
  };

  const CONTACT_INFO = {
    address_hi: '12/4, सिविल लाइंस, एमजी मार्ग के पास, प्रयागराज, उत्तर प्रदेश — 211001',
    address_en: '12/4, Civil Lines, Near MG Marg, Prayagraj, Uttar Pradesh — 211001',
    phones: [
      { label_hi: 'मुख्य हेल्पलाइन', label_en: 'Main Helpline', number: '+91 98765 43210' },
      { label_hi: 'ओपीडी काउंटर', label_en: 'OPD Counter', number: '0532-2400112' },
      { label_hi: 'आपातकालीन (24x7)', label_en: 'Emergency (24×7)', number: '+91 98765 43210', isEmergency: true },
    ],
    email: 'info@prayageyecare.com',
    mapUrl: 'https://maps.google.com/?q=Civil+Lines,+Prayagraj,+UP+211001',
    hours: [
      { day_hi: 'सोमवार — शनिवार', day_en: 'Monday — Saturday', time: '9:00 AM – 5:00 PM' },
      { day_hi: 'मंगलवार (निःशुल्क ओपीडी)', day_en: 'Tuesday (Free OPD)', time: '9:00 AM – 12:00 PM', highlight: true },
      { day_hi: 'रविवार', day_en: 'Sunday', time_hi: 'बंद (केवल आपातकाल)', time_en: 'Closed (Emergency Only)' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 rounded-2xl shadow-card space-y-3">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-cyan-200">
          <MessageSquare className="w-4 h-4 text-accent" />
          <span>{locale === 'hi' ? 'संपर्क करें' : 'Contact Us'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {locale === 'hi' ? 'हमसे संपर्क करें' : 'Get In Touch With Us'}
        </h1>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl leading-relaxed">
          {locale === 'hi'
            ? 'अपॉइंटमेंट, जांच की जानकारी या किसी भी प्रश्न के लिए नीचे फ़ॉर्म भरें या सीधे कॉल करें।'
            : 'For appointments, queries about our services, or any feedback, fill the form below or call us directly.'}
        </p>
      </div>

      {/* Emergency Alert Strip */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 text-xs text-red-800">
        <AlertTriangle className="w-5 h-5 text-emergency shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block">
            {locale === 'hi' ? '⚠️ आपातकालीन स्थिति में:' : '⚠️ For Eye Emergency:'}
          </span>
          <p className="mt-0.5 leading-relaxed">
            {locale === 'hi'
              ? 'आंख में तेज दर्द, चोट, केमिकल गिरने या अचानक रोशनी जाने पर देर न करें — तुरंत '
              : 'For sudden vision loss, severe eye pain, or chemical injury — call immediately: '}
            <a href="tel:+919876543210" className="font-extrabold text-emergency hover:underline">
              +91 98765 43210
            </a>
            {locale === 'hi' ? ' पर कॉल करें या ' : ' or '}
            <Link href={`/${locale}/emergency`} className="font-extrabold text-emergency hover:underline">
              {locale === 'hi' ? 'आपातकालीन फ़ॉर्म भरें' : 'use Emergency Form'}
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Contact Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Address Card */}
          <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-primary-dark">
                {locale === 'hi' ? 'हमारा पता' : 'Our Address'}
              </h3>
            </div>
            <p className="text-xs text-hospitalText leading-relaxed">
              {locale === 'hi' ? CONTACT_INFO.address_hi : CONTACT_INFO.address_en}
            </p>
            <a
              href={CONTACT_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              <Navigation className="w-3.5 h-3.5 mr-1" />
              {locale === 'hi' ? 'Google Maps पर देखें' : 'Open in Google Maps'}
            </a>
          </div>

          {/* Phone Numbers */}
          <div className="surface-card p-6 rounded-2xl shadow-card space-y-4 border border-hospitalBorder">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-primary-dark">
                {locale === 'hi' ? 'फ़ोन नंबर' : 'Phone Numbers'}
              </h3>
            </div>
            <div className="space-y-3">
              {CONTACT_INFO.phones.map((ph, i) => (
                <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl text-xs ${ph.isEmergency ? 'bg-red-50 border border-red-200' : 'bg-hospitalBg border border-gray-100'}`}>
                  <span className={`font-semibold ${ph.isEmergency ? 'text-emergency' : 'text-mutedText'}`}>
                    {locale === 'hi' ? ph.label_hi : ph.label_en}
                  </span>
                  <a
                    href={`tel:${ph.number.replace(/\s/g, '')}`}
                    className={`font-extrabold hover:underline ${ph.isEmergency ? 'text-emergency' : 'text-primary-dark'}`}
                  >
                    {ph.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-primary-dark">
                {locale === 'hi' ? 'ईमेल' : 'Email'}
              </h3>
            </div>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-xs font-bold text-primary hover:underline"
            >
              {CONTACT_INFO.email}
            </a>
          </div>

          {/* Working Hours */}
          <div className="surface-card p-6 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-primary-dark">
                {locale === 'hi' ? 'अस्पताल समय' : 'Hospital Hours'}
              </h3>
            </div>
            <ul className="space-y-2">
              {CONTACT_INFO.hours.map((h, i) => (
                <li key={i} className={`flex justify-between items-center text-xs py-1.5 border-b border-gray-100 last:border-0 ${h.highlight ? 'text-amber-700 font-bold' : 'text-hospitalText'}`}>
                  <span>{locale === 'hi' ? h.day_hi : h.day_en}</span>
                  <span className="font-semibold">
                    {h.time || (locale === 'hi' ? h.time_hi : h.time_en)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-2 text-xs text-red-700 font-bold bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{messages.common.emergency24x7}</span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-3">
          <div className="surface-card p-7 rounded-2xl shadow-card border border-hospitalBorder space-y-5">
            <div>
              <h2 className="text-lg font-bold text-primary-dark">
                {locale === 'hi' ? 'संदेश भेजें' : 'Send Us a Message'}
              </h2>
              <p className="text-xs text-mutedText mt-1">
                {locale === 'hi'
                  ? 'नीचे फ़ॉर्म भरें, हम 1-2 कार्यदिवस में आपसे संपर्क करेंगे।'
                  : 'Fill the form below and we\'ll get back to you within 1–2 working days.'}
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-emerald-800 text-base">
                  {locale === 'hi' ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs text-emerald-700">
                  {locale === 'hi'
                    ? 'धन्यवाद! हमारी टीम शीघ्र ही आपसे संपर्क करेगी।'
                    : 'Thank you! Our team will reach out to you soon.'}
                </p>
                <Link
                  href={`/${locale}/appointment`}
                  className="inline-flex items-center bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-primary-dark transition"
                >
                  {messages.common.bookAppointment}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-primary-dark mb-1.5">
                    {locale === 'hi' ? 'विषय' : 'Subject'}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="general">{locale === 'hi' ? 'सामान्य पूछताछ' : 'General Inquiry'}</option>
                    <option value="appointment">{locale === 'hi' ? 'अपॉइंटमेंट संबंधी' : 'Appointment Related'}</option>
                    <option value="feedback">{locale === 'hi' ? 'फ़ीडबैक / शिकायत' : 'Feedback / Complaint'}</option>
                    <option value="billing">{locale === 'hi' ? 'शुल्क / बिलिंग' : 'Fees / Billing'}</option>
                    <option value="other">{locale === 'hi' ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-primary-dark mb-1.5">
                      {locale === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={locale === 'hi' ? 'आपका नाम दर्ज करें' : 'Enter your full name'}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-primary-dark mb-1.5">
                      {locale === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-primary-dark mb-1.5">
                    {locale === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={locale === 'hi' ? 'आपका ईमेल पता' : 'your@email.com'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-primary-dark mb-1.5">
                    {locale === 'hi' ? 'आपका संदेश *' : 'Your Message *'}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={locale === 'hi'
                      ? 'अपनी समस्या या प्रश्न यहां लिखें...'
                      : 'Describe your query or concern here...'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center shadow-md transition transform active:scale-95"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {locale === 'hi' ? 'संदेश भेजें' : 'Send Message'}
                  </button>
                  <Link
                    href={`/${locale}/appointment`}
                    className="flex-1 bg-accent hover:bg-teal-600 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center shadow-md transition"
                  >
                    {messages.common.bookAppointment}
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Google Map Embed Placeholder */}
          <div className="mt-5 rounded-2xl overflow-hidden shadow-card border border-hospitalBorder">
            <iframe
              title="Prayag Eye Care Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.3!2d81.8461!3d25.4358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCivil%20Lines%2C%20Prayagraj!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
