'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import {
  Eye,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
  Bot,
  Search,
  ArrowRight,
  Glasses
} from 'lucide-react';

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([
    {
      role: 'bot',
      text: locale === 'hi'
        ? 'नमस्ते! मैं प्रयाग आई केयर एआई सहायक हूं। अपनी आंखों की समस्या (जैसे धुंधला दिखना, मोतियाबिंद, लाली) बताएं या अस्पताल के बारे में पूछें।'
        : 'Hello! I am the Prayag Eye Care AI Assistant. Describe your eye symptoms (e.g. blurred vision, cataract, redness) or ask hospital FAQs.'
    }
  ]);

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setAiInput('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botReply = locale === 'hi'
        ? 'आपके लक्षणों के आधार पर हम "सामान्य नेत्र जांच" या "मोतियाबिंद परामर्श" की सलाह देते हैं। अपॉइंटमेंट बुक करने हेतु नीचे बटन दबाएं।'
        : 'Based on your description, we recommend a "General Eye Checkup" or "Cataract Consultation". Click below to book an appointment.';

      if (lower.includes('pain') || lower.includes('splash') || lower.includes('chemical') || lower.includes('चोट') || lower.includes('दर्द')) {
        botReply = locale === 'hi'
          ? '⚠️ अति आवश्यक: यदि आंख में तेज दर्द या केमिकल की चोट है तो तुरंत हमारे 24 घंटे आपातकालीन नंबर +91 98765 43210 पर संपर्क करें या अस्पताल पहुंचे।'
          : '⚠️ URGENT: If you are experiencing severe eye pain or chemical injury, please contact our 24x7 emergency helpline +91 98765 43210 or visit immediately.';
      }

      setAiMessages((prev) => [...prev, { role: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-blue-900 text-white pt-12 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(19,168,158,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-200 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{messages.common.openNow} • {messages.common.emergency24x7}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {messages.home.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-cyan-100 font-normal leading-relaxed">
              {messages.home.heroSubtitle}
            </p>

            {/* Tuesday Free OPD Banner */}
            <div className="bg-amber-500/20 border border-amber-400/40 p-3.5 rounded-2xl flex items-center space-x-3 text-xs sm:text-sm text-amber-200 font-semibold">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{messages.home.todayFreeCheckup}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={`/${locale}/appointment`}
                className="bg-accent hover:bg-teal-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg flex items-center text-sm transition transform active:scale-95"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {messages.common.bookAppointment}
              </Link>

              <Link
                href={`/${locale}/emergency`}
                className="bg-emergency hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-emergency flex items-center text-sm transition transform active:scale-95"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                {messages.common.emergencyBtn}
              </Link>
            </div>
          </div>

          {/* Hero Quick Live Token Tracker Box */}
          <div className="lg:col-span-5">
            <div className="bg-white text-hospitalText p-6 rounded-2xl shadow-2xl border border-hospitalBorder space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-accent" /> Live Queue Board (OPD 1)
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Queue Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200">
                  <span className="text-xs text-mutedText font-semibold">{messages.token.currentlyServing}</span>
                  <div className="text-3xl font-extrabold text-primary font-mono mt-1">A-014</div>
                  <span className="text-[11px] text-gray-500 block">Dr. S. K. Sharma</span>
                </div>
                <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200">
                  <span className="text-xs text-mutedText font-semibold">Next Token</span>
                  <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1">A-015</div>
                  <span className="text-[11px] text-gray-500 block">Waiting in Lounge</span>
                </div>
              </div>

              <Link
                href={`/${locale}/track`}
                className="w-full bg-hospitalBg hover:bg-gray-100 text-primary-dark border border-gray-200 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center transition"
              >
                {messages.nav.trackAppointment}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW DIGITAL TOKEN BOOKING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">{messages.home.howItWorksTitle}</h2>
          <p className="text-xs sm:text-sm text-mutedText">
            {locale === 'hi'
              ? 'अस्पताल में लंबी कतारों से बचें। डिजिटल टोकन से अपनी बारी का सटीक समय घर बैठे जानें।'
              : 'Avoid long queues at the hospital. Track your turn live from home with digital tokens.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="surface-card p-5 rounded-2xl shadow-card text-center space-y-2 relative">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto font-bold text-lg">1</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step1Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step1Desc}</p>
          </div>

          <div className="surface-card p-5 rounded-2xl shadow-card text-center space-y-2 relative">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto font-bold text-lg">2</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step2Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step2Desc}</p>
          </div>

          <div className="surface-card p-5 rounded-2xl shadow-card text-center space-y-2 relative">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg">3</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step3Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step3Desc}</p>
          </div>

          <div className="surface-card p-5 rounded-2xl shadow-card text-center space-y-2 relative">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mx-auto font-bold text-lg">4</div>
            <h3 className="font-bold text-sm text-primary-dark">{messages.home.step4Title}</h3>
            <p className="text-xs text-mutedText leading-relaxed">{messages.home.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* 3. HOSPITAL SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">{messages.services.title}</h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">{messages.services.subtitle}</p>
          </div>
          <Link href={`/${locale}/services`} className="text-xs font-bold text-primary hover:underline flex items-center mt-2 sm:mt-0">
            {messages.common.viewDetails} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_DATA.services.map((srv) => (
            <div key={srv.id} className="surface-card p-6 rounded-2xl shadow-card hover:shadow-xl transition space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-primary-dark">{locale === 'hi' ? srv.name_hi : srv.name_en}</h3>
                <p className="text-xs text-mutedText leading-relaxed">{locale === 'hi' ? srv.desc_hi : srv.desc_en}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {srv.defaultFee > 0 ? `Fee ₹${srv.defaultFee}` : 'Free OPD'} ({messages.common.feeNotice})
                </span>
                <Link
                  href={`/${locale}/appointment?service=${srv.id}`}
                  className="font-bold text-primary hover:text-primary-dark flex items-center"
                >
                  {messages.common.bookAppointment} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VERIFIED DOCTORS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">{messages.home.featuredDoctors}</h2>
            <p className="text-xs sm:text-sm text-mutedText mt-1">{messages.doctors.subtitle}</p>
          </div>
          <Link href={`/${locale}/doctors`} className="text-xs font-bold text-primary hover:underline flex items-center">
            {messages.common.viewDetails} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {SEED_DATA.doctors.filter(d => d.verificationStatus === 'VERIFIED').map((doc) => (
            <div key={doc.id} className="surface-card p-5 rounded-2xl shadow-card hover:shadow-xl transition space-y-3 flex flex-col justify-between">
              <div className="space-y-3 text-center">
                {/* Doctor Neutral Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 text-primary rounded-full flex items-center justify-center mx-auto border-2 border-primary/20 shadow">
                  <span className="text-xl font-extrabold">{doc.fullName.split(' ').map(n => n[0]).join('')}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-primary-dark">{doc.fullName}</h3>
                  <span className="text-[11px] font-semibold text-accent block mt-0.5">
                    {locale === 'hi' ? doc.specialization_hi : doc.specialization_en}
                  </span>
                </div>

                <p className="text-xs text-mutedText line-clamp-2 leading-relaxed">
                  {locale === 'hi' ? doc.bio_hi : doc.bio_en}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-[11px] text-mutedText">
                  <span>{doc.experienceYears} {messages.doctors.experience}</span>
                  <span className="font-bold text-primary-dark">₹{doc.consultationFee}</span>
                </div>

                <Link
                  href={`/${locale}/appointment?doctor=${doc.id}`}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-xl text-xs font-bold text-center block transition shadow-sm"
                >
                  {messages.doctors.bookWithDoctor}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI CHAT FLOATING WIDGET */}
      <div className="fixed bottom-20 right-4 z-40">
        {!aiChatOpen ? (
          <button
            onClick={() => setAiChatOpen(true)}
            className="bg-primary text-white p-3.5 rounded-full shadow-floating flex items-center space-x-2 font-bold text-xs hover:bg-primary-dark transition transform active:scale-95 border border-cyan-400"
          >
            <Bot className="w-5 h-5 text-cyan-300" />
            <span className="hidden sm:inline">{messages.ai.chatTitle}</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-hospitalBorder w-80 sm:w-96 flex flex-col h-96 overflow-hidden">
            <div className="bg-primary text-white p-3.5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-300" />
                <span className="font-bold text-sm">{messages.ai.chatTitle}</span>
              </div>
              <button onClick={() => setAiChatOpen(false)} className="text-white hover:text-gray-200 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs bg-hospitalBg">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-hospitalText shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="p-2 border-t border-gray-200 flex space-x-2 bg-white">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={messages.ai.chatPlaceholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
