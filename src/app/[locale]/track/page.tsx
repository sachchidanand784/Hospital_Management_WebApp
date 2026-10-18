'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import {
  Clock,
  Search,
  CheckCircle,
  Download,
  Share2,
  AlertCircle,
  Bell,
  Sparkles,
  RefreshCw,
  Printer,
  Calendar,
  User,
  Phone,
  MapPin,
  X,
  ShieldCheck
} from 'lucide-react';
import { getAppointmentByCodeOrMobile } from '@/actions/appointment';
import { formatTo12Hour } from '@/lib/time';

function TrackContent({ locale }: { locale: 'hi' | 'en' }) {
  const messages = locale === 'hi' ? hi : en;
  const searchParams = useSearchParams();

  const [appointmentCode, setAppointmentCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [liveQueue, setLiveQueue] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleSearch = useCallback(async (query?: string, isSilentRefresh = false) => {
    const q = (query || appointmentCode).trim();
    if (!q) return;

    if (!isSilentRefresh) {
      setLoading(true);
      setErrorMsg('');
    } else {
      setIsRefreshing(true);
    }

    try {
      const res = await getAppointmentByCodeOrMobile(q);
      if (res.success && res.appointment) {
        setAppointmentData(res.appointment);
        setLiveQueue(res.liveQueue);
        setSearched(true);
        setErrorMsg('');
      } else {
        if (!isSilentRefresh) {
          setAppointmentData(null);
          setLiveQueue(null);
          setSearched(true);
          setErrorMsg(
            locale === 'hi'
              ? 'अपॉइंटमेंट नहीं मिला। कृपया टोकन नंबर (उदा. A-001), अपॉइंटमेंट आईडी या मोबाइल नंबर जांचें।'
              : 'No appointment found with this Token, ID, or Mobile number.'
          );
        }
      }
    } catch (err) {
      if (!isSilentRefresh) {
        setErrorMsg(locale === 'hi' ? 'डेटा लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Failed to fetch appointment details.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [appointmentCode, locale]);

  // Read URL query parameter e.g. /track?code=A-001 or ?token=A-001
  useEffect(() => {
    const paramCode = searchParams.get('code') || searchParams.get('token') || searchParams.get('id');
    if (paramCode) {
      setAppointmentCode(paramCode);
      handleSearch(paramCode, false);
    }
  }, [searchParams, handleSearch]);

  // Live Auto-Polling: Refresh live queue status every 5 seconds silently
  useEffect(() => {
    if (!searched || !appointmentData) return;

    const queryKey = appointmentData.tokenLabel || appointmentData.appointmentCode;
    const interval = setInterval(() => {
      handleSearch(queryKey, true);
    }, 5000);

    return () => clearInterval(interval);
  }, [searched, appointmentData, handleSearch]);

  // Handle WhatsApp Share
  const handleWhatsAppShare = () => {
    if (!appointmentData) return;
    const trackingUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/${locale}/track?code=${appointmentData.tokenLabel || appointmentData.appointmentCode}`
      : `https://hospital1anagementwebapp.vercel.app/${locale}/track?code=${appointmentData.tokenLabel}`;

    const text = locale === 'hi'
      ? `नमस्ते! एम एस मेमोरियल नेत्रालय में मेरा अपॉइंटमेंट टोकन: *${appointmentData.tokenLabel}* (ID: ${appointmentData.appointmentCode}) है।\nवर्तमान स्थिति: *${appointmentData.status}*\nलाइव कतार स्थिति यहां देखें:\n${trackingUrl}`
      : `Hello! My appointment token at M S Memorial Netralaya is *${appointmentData.tokenLabel}* (ID: ${appointmentData.appointmentCode}).\nStatus: *${appointmentData.status}*\nTrack live queue progress here:\n${trackingUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500 animate-pulse',
          text: locale === 'hi' ? 'परामर्श जारी (In Consultation)' : 'In Consultation'
        };
      case 'WAITING':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-500 animate-pulse',
          text: locale === 'hi' ? 'प्रतीक्षालय में (Waiting in Lounge)' : 'Waiting in Lounge'
        };
      case 'CHECKED_IN':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          text: locale === 'hi' ? 'अस्पताल उपस्थिति (Checked In)' : 'Checked In'
        };
      case 'COMPLETED':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          text: locale === 'hi' ? 'परामर्श पूर्ण (Completed)' : 'Completed'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          text: locale === 'hi' ? 'रद्द (Cancelled)' : 'Cancelled'
        };
      default:
        return {
          bg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
          dot: 'bg-cyan-600',
          text: locale === 'hi' ? 'टोकन बुक हुआ (Booked)' : 'Booked'
        };
    }
  };

  const statusBadge = appointmentData ? getStatusBadge(appointmentData.status) : null;

  // Compute 5-step visit timeline
  const getTimelineSteps = () => {
    if (!appointmentData) return [];
    const status = appointmentData.status;

    return [
      {
        id: 'BOOKED',
        title_hi: 'टोकन बुक हुआ',
        title_en: 'Token Booked',
        desc: appointmentData.appointmentCode,
        isDone: true,
        isActive: status === 'BOOKED',
      },
      {
        id: 'CHECKED_IN',
        title_hi: 'अस्पताल आगमन',
        title_en: 'Checked In',
        desc: locale === 'hi' ? 'रिसेप्शन उपस्थिति' : 'Reception Verified',
        isDone: ['CHECKED_IN', 'WAITING', 'IN_CONSULTATION', 'COMPLETED'].includes(status),
        isActive: status === 'CHECKED_IN',
      },
      {
        id: 'WAITING',
        title_hi: 'प्रतीक्षालय में',
        title_en: 'In Lounge',
        desc: locale === 'hi' ? 'ओपीडी प्रतीक्षा' : 'Waiting Area',
        isDone: ['WAITING', 'IN_CONSULTATION', 'COMPLETED'].includes(status),
        isActive: status === 'WAITING',
      },
      {
        id: 'IN_CONSULTATION',
        title_hi: 'परामर्श जारी',
        title_en: 'In Consultation',
        desc: locale === 'hi' ? 'डॉक्टर के कक्ष में' : 'With Doctor',
        isDone: ['IN_CONSULTATION', 'COMPLETED'].includes(status),
        isActive: status === 'IN_CONSULTATION',
      },
      {
        id: 'COMPLETED',
        title_hi: 'परामर्श पूर्ण',
        title_en: 'Completed',
        desc: locale === 'hi' ? 'दवा व चश्मा' : 'Prescription Ready',
        isDone: status === 'COMPLETED',
        isActive: status === 'COMPLETED',
      },
    ];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 1. SEARCH BAR WITH QUICK CHIPS */}
      <div className="surface-card p-6 sm:p-7 rounded-2xl shadow-card space-y-4 border border-hospitalBorder">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary-dark flex items-center">
              <Clock className="w-5 h-5 mr-2 text-accent" />
              {messages.nav.trackAppointment}
            </h1>
            <p className="text-xs text-mutedText mt-0.5">
              {locale === 'hi'
                ? 'अपना टोकन नंबर (उदा. A-001), अपॉइंटमेंट कोड या मोबाइल नंबर दर्ज करके लाइव स्थिति देखें।'
                : 'Enter your Token (e.g. A-001), Appointment Code, or Mobile Number for real-time tracking.'}
            </p>
          </div>

          {searched && appointmentData && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                {locale === 'hi' ? 'लाइव सिंक चालू' : 'Live Sync Active'}
              </span>
              <button
                onClick={() => handleSearch(appointmentData.tokenLabel || appointmentData.appointmentCode, true)}
                disabled={isRefreshing}
                title="Refresh Live Status"
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-primary-dark rounded-lg transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={appointmentCode}
              onChange={(e) => setAppointmentCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={locale === 'hi' ? 'टोकन नंबर (उदा. A-001), आईडी (MSM-...) या मोबाइल नंबर' : 'Token (e.g. A-001), ID (MSM-...) or Mobile'}
              className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl text-sm font-extrabold shadow flex items-center justify-center transition active:scale-95 shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {loading ? (locale === 'hi' ? 'खोज रहे हैं...' : 'Searching...') : messages.common.search}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* 2. LIVE APPOINTMENT & TOKEN TRACKING RESULT */}
      {searched && appointmentData && liveQueue && (
        <div className="space-y-6">
          {/* URGENT NOTIFICATION BANNER: YOUR TURN / NEXT UP */}
          {liveQueue.isYourTurn && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-xl flex items-center space-x-4 animate-pulse border-2 border-emerald-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-yellow-300 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-base sm:text-lg tracking-wide">
                  {locale === 'hi' ? '🔔 आपकी बारी आ गई है! (YOUR TURN)' : '🔔 IT IS YOUR TURN NOW!'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                  {locale === 'hi'
                    ? `कृपया तुरंत ${liveQueue.opdRoom} में डॉक्टर से मिलने हेतु प्रवेश करें।`
                    : `Please proceed immediately to ${liveQueue.opdRoom} for consultation.`}
                </p>
              </div>
            </div>
          )}

          {liveQueue.isNext && !liveQueue.isYourTurn && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex items-center space-x-3.5 border border-amber-300">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm sm:text-base">
                  {locale === 'hi' ? '⚡ आप कतार में अगले हैं! (Next in Line)' : '⚡ You Are Next in Line!'}
                </h3>
                <p className="text-xs text-amber-100">
                  {locale === 'hi'
                    ? `आपके आगे 0 मरीज हैं। कृपया ${liveQueue.opdRoom} के सामने लाउंज में तैयार रहें।`
                    : `0 patients ahead of you. Please be ready in front of ${liveQueue.opdRoom}.`}
                </p>
              </div>
            </div>
          )}

          {liveQueue.isCompleted && (
            <div className="bg-gradient-to-r from-blue-700 to-primary-dark text-white p-4 sm:p-5 rounded-2xl shadow-lg flex items-center space-x-3.5">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">
                  {locale === 'hi' ? '✓ परामर्श पूर्ण हुआ (Consultation Completed)' : '✓ Consultation Completed'}
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  {locale === 'hi'
                    ? 'आपका डॉक्टर परामर्श समाप्त हो चुका है। दवा व चश्मे हेतु अस्पताल काउंटर पर संपर्क करें।'
                    : 'Your consultation is complete. Please visit the pharmacy/optical counter for prescribed items.'}
                </p>
              </div>
            </div>
          )}

          {/* MAIN TRACKING CARD */}
          <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-card space-y-6 border border-hospitalBorder border-l-4 border-l-primary">
            {/* Header: ID, Patient Details, Status Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-mutedText tracking-wider uppercase">
                    APPOINTMENT ID:
                  </span>
                  <span className="text-xs font-mono font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {appointmentData.appointmentCode}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-primary-dark mt-1 flex items-center">
                  <User className="w-4 h-4 mr-1.5 text-accent" />
                  {appointmentData.patient?.name}
                  <span className="text-xs font-semibold text-mutedText ml-2">
                    (Age: {appointmentData.patient?.age || 'N/A'}, {appointmentData.patient?.gender || 'N/A'})
                  </span>
                </h2>
              </div>

              {statusBadge && (
                <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center shadow-sm ${statusBadge.bg}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${statusBadge.dot}`} />
                  {statusBadge.text}
                </div>
              )}
            </div>

            {/* BIG TOKEN HERO BOX */}
            <div className="bg-gradient-to-b from-hospitalBg to-blue-50/50 p-6 sm:p-8 rounded-2xl border border-hospitalBorder text-center space-y-3 relative overflow-hidden shadow-inner">
              <span className="text-xs text-mutedText font-bold uppercase tracking-wider block">
                {messages.token.yourToken}
              </span>

              <div className="text-5xl sm:text-7xl font-black text-primary font-mono tracking-wider drop-shadow-sm">
                {appointmentData.tokenLabel}
              </div>

              <div className="space-y-1">
                <span className="text-sm font-extrabold text-primary-dark block">
                  {appointmentData.doctor?.fullName || 'Senior Eye Surgeon'}
                </span>
                <span className="text-xs text-accent font-semibold block">
                  {locale === 'hi' ? appointmentData.service?.name_hi : appointmentData.service?.name_en}
                </span>
                <div className="inline-flex items-center text-[11px] text-mutedText space-x-2 pt-1 font-mono">
                  <span>📅 {new Date(appointmentData.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>⏰ Slot: {formatTo12Hour(appointmentData.slotStart || appointmentData.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* REAL LIVE STATS (CURRENT SERVING, PATIENTS AHEAD, ROOM) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center text-xs">
              {/* Card 1: Currently Serving */}
              <div className="bg-hospitalBg p-4 rounded-xl border border-hospitalBorder space-y-1 hover:shadow-sm transition">
                <span className="text-mutedText font-bold uppercase tracking-wider text-[10px] block">
                  {messages.token.currentlyServing}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-primary font-mono block">
                  {liveQueue.currentlyServingToken}
                </span>
                <span className="text-[11px] text-gray-600 font-medium truncate block">
                  {liveQueue.currentlyServingDoctor}
                </span>
              </div>

              {/* Card 2: Patients Ahead */}
              <div className="bg-hospitalBg p-4 rounded-xl border border-hospitalBorder space-y-1 hover:shadow-sm transition">
                <span className="text-mutedText font-bold uppercase tracking-wider text-[10px] block">
                  {messages.token.patientsAhead}
                </span>
                <span className={`text-2xl sm:text-3xl font-black font-mono block ${liveQueue.patientsAhead === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {liveQueue.patientsAhead} {locale === 'hi' ? 'मरीज' : 'patients'}
                </span>
                <span className="text-[11px] text-gray-600 font-medium block">
                  {liveQueue.isYourTurn
                    ? (locale === 'hi' ? 'परामर्श जारी है' : 'In Consultation')
                    : liveQueue.isNext
                      ? (locale === 'hi' ? 'अगला नंबर आपका है' : 'You are next')
                      : (locale === 'hi' ? 'कतार में प्रतीक्षा करें' : 'Waiting in queue')}
                </span>
              </div>

              {/* Card 3: OPD Room */}
              <div className="bg-hospitalBg p-4 rounded-xl border border-hospitalBorder space-y-1 hover:shadow-sm transition">
                <span className="text-mutedText font-bold uppercase tracking-wider text-[10px] block">
                  OPD Consultation Room
                </span>
                <span className="text-sm font-black text-emerald-800 block leading-snug">
                  {liveQueue.opdRoom}
                </span>
                <span className="text-[11px] text-gray-500 font-medium block">
                  M S Memorial Netralaya
                </span>
              </div>
            </div>

            {/* REAL DYNAMIC ETA BOX */}
            <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <div className="flex items-center space-x-2 font-bold text-sm text-blue-950">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{messages.token.etaWindow}:</span>
                  <span className="text-primary font-mono font-extrabold">{liveQueue.etaWindow}</span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full font-semibold">
                  ~12 min / consult
                </span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                {locale === 'hi'
                  ? 'लाइव कतार स्थिति हर 5 सेकंड में स्वतः अपडेट होती है। कृपया समय पर अस्पताल ओपीडी में उपस्थित रहें।'
                  : 'Live queue updates automatically every 5 seconds. Please remain near the OPD lounge for token call.'}
              </p>
            </div>

            {/* REAL PROGRESS TIMELINE */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-primary-dark uppercase tracking-wider block">
                {locale === 'hi' ? 'अपॉइंटमेंट प्रगति टाइमलाइन (Live Progress):' : 'Live Visit Progress Timeline:'}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {getTimelineSteps().map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all ${
                      step.isActive
                        ? 'bg-primary text-white border-primary shadow-md scale-105'
                        : step.isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-center space-x-1">
                      {step.isDone && !step.isActive && <span className="text-emerald-600 font-bold">✓</span>}
                      {step.isActive && <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse mr-1" />}
                      <span>{idx + 1}. {locale === 'hi' ? step.title_hi : step.title_en}</span>
                    </div>
                    <span className={`text-[10px] block mt-0.5 ${step.isActive ? 'text-cyan-100' : 'text-gray-500'}`}>
                      {step.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowPrintModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center shadow transition active:scale-95"
              >
                <Printer className="w-4 h-4 mr-2" />
                {locale === 'hi' ? 'डिजिटल टोकन पर्ची प्रिंट करें' : 'Print Digital Token Slip'}
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center shadow transition active:scale-95"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {locale === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}
              </button>

              <Link
                href={`/${locale}/appointment`}
                className="bg-gray-100 hover:bg-gray-200 text-primary-dark px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center ml-auto"
              >
                {locale === 'hi' ? 'नया टोकन बुक करें' : 'Book Another Token'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. DIGITAL TOKEN SLIP PRINT MODAL */}
      {showPrintModal && appointmentData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-gray-200 print:p-0 print:border-none print:shadow-none">
            {/* Close Button (Hidden in Print) */}
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Content Area */}
            <div className="space-y-4 text-center border-b border-dashed border-gray-300 pb-4">
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h3 className="font-extrabold text-lg text-primary-dark">
                  M S MEMORIAL NETRALAYA
                </h3>
              </div>
              <p className="text-[11px] text-gray-500">
                Dildarnagar Tarighat Road, Ghazipur (U.P.) 232326<br />
                24x7 Emergency & Token Helpline: +91 80048 00688
              </p>
            </div>

            {/* Token Badge */}
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-primary/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Official OPD Consultation Token
              </span>
              <div className="text-5xl font-black font-mono text-primary">
                {appointmentData.tokenLabel}
              </div>
              <span className="text-xs font-bold text-gray-700 block">
                ID: {appointmentData.appointmentCode}
              </span>
            </div>

            {/* Patient & Doctor Details Table */}
            <div className="text-xs space-y-2 bg-hospitalBg p-4 rounded-xl border border-gray-100 text-left">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Patient:</span>
                <span className="font-bold text-primary-dark">{appointmentData.patient?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Age / Gender:</span>
                <span className="font-medium text-gray-800">{appointmentData.patient?.age || 'N/A'} yrs / {appointmentData.patient?.gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Doctor:</span>
                <span className="font-bold text-primary-dark">{appointmentData.doctor?.fullName || 'General Specialist'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">OPD Room:</span>
                <span className="font-bold text-emerald-800">{liveQueue?.opdRoom || 'Room 101'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Date & Time:</span>
                <span className="font-mono font-medium text-gray-800">
                  {new Date(appointmentData.date).toLocaleDateString()} | {formatTo12Hour(appointmentData.slotStart || appointmentData.createdAt)}
                </span>
              </div>
            </div>

            {/* Print Instructions */}
            <div className="text-[11px] text-gray-500 text-center leading-relaxed">
              ⚠️ कृपया परामर्श कक्ष के बाहर डिस्प्ले बोर्ड पर अपना टोकन नंबर देखें। कतार में किसी भी सहायता हेतु रिसेप्शन काउंटर पर संपर्क करें।
            </div>

            {/* Action Buttons (Hidden in Print) */}
            <div className="flex space-x-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center shadow"
              >
                <Printer className="w-4 h-4 mr-2" />
                {locale === 'hi' ? 'प्रिंट पर्ची निकालें' : 'Print Slip'}
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
              >
                {locale === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';

  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
        <p className="text-xs text-mutedText">Loading Live Tracking System...</p>
      </div>
    }>
      <TrackContent locale={locale} />
    </Suspense>
  );
}
