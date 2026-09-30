'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';

import { getPublicServices, getPublicDoctors } from '@/actions/public';
import { sendEmailOtp, bookAppointment } from '@/actions/appointment';
import { calculateETAWindow } from '@backend/engines/eta-engine';
import { computeSlots } from '@backend/engines/availability-engine';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertTriangle,
  FileText,
  Share2,
  Download,
  ArrowRight,
  ArrowLeft,
  QrCode
} from 'lucide-react';

export default function AppointmentPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<any[]>([]);
  const [verifiedDoctors, setVerifiedDoctors] = useState<any[]>([]);

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [doctorPreference, setDoctorPreference] = useState<'SPECIFIC' | 'GENERAL'>('SPECIFIC');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  React.useEffect(() => {
    async function loadData() {
      const [srvRes, docRes] = await Promise.all([getPublicServices(), getPublicDoctors()]);
      if (srvRes.success && srvRes.services.length > 0) {
        setServices(srvRes.services);
        setSelectedService(srvRes.services[0].id);
      }
      if (docRes.success && docRes.doctors.length > 0) {
        setVerifiedDoctors(docRes.doctors);
        setSelectedDoctor(docRes.doctors[0].id);
      }
    }
    loadData();
  }, []);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-26');
  const [selectedSlot, setSelectedSlot] = useState<string>('09:20');
  
  // Patient details
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('Male');
  const [patientMobile, setPatientMobile] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientAddress, setPatientAddress] = useState<string>('Prayagraj');
  const [consent, setConsent] = useState<boolean>(true);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [expectedOtp, setExpectedOtp] = useState<string>('');
  const [isMockOtp, setIsMockOtp] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Result state
  const [appointmentCode, setAppointmentCode] = useState<string>('');
  const [allocatedToken, setAllocatedToken] = useState<string>('');
  const [etaResult, setEtaResult] = useState<any>(null);

  const activeServiceObj = services.find(s => s.id === selectedService) || (services.length > 0 ? services[0] : null);

  const availableSlots = computeSlots({
    startTime: '09:00',
    endTime: '17:00',
    slotDurationMin: 20,
    capacityPerSlot: 3,
    breakStart: '13:00',
    breakEnd: '14:00',
  });

  const handleSendOtp = async () => {
    if (!patientName || !patientEmail) {
      alert(locale === 'hi' ? 'कृपया नाम एवं ईमेल दर्ज करें' : 'Please enter patient name and email');
      return;
    }
    const res = await sendEmailOtp(patientEmail);
    if (res.success) {
      setExpectedOtp(res.otp || '');
      setIsMockOtp(res.isMock || false);
      setOtpSent(true);
      if (res.isMock) {
        alert(`Demo Mode: Your OTP is ${res.otp}`);
      }
    }
  };

  const handleConfirmBooking = async () => {
    const res = await bookAppointment({
      serviceId: selectedService,
      problemId: selectedProblem,
      doctorId: selectedDoctor,
      doctorPreference,
      date: selectedDate,
      slotStart: selectedSlot,
      patientName,
      patientAge,
      patientGender,
      patientMobile,
      patientEmail,
    });

    if (res.success) {
      setAppointmentCode(res.appointmentCode!);
      setAllocatedToken(res.allocatedToken!);
      setEtaResult(res.etaResult);
      setBookingConfirmed(true);
      setStep(8);
    } else {
      alert(locale === 'hi' ? 'बुकिंग विफल रही, कृपया पुनः प्रयास करें' : 'Booking failed, please try again');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Stepper Progress Bar */}
      <div className="surface-card p-4 rounded-2xl shadow-card space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-primary">
          <span>{locale === 'hi' ? 'चरण' : 'Step'} {step} / 10</span>
          <span>{bookingConfirmed ? (locale === 'hi' ? 'बुक हो गया!' : 'Confirmed!') : `${Math.round((step / 10) * 100)}% Complete`}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(step / 10) * 100}%` }}></div>
        </div>
      </div>

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <h2 className="text-xl font-bold text-primary-dark">{messages.booking.step1}: {messages.services.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${
                  selectedService === srv.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm text-primary-dark">{locale === 'hi' ? srv.name_hi : srv.name_en}</h3>
                  <p className="text-xs text-mutedText mt-0.5">{srv.defaultFee > 0 ? `Fee ₹${srv.defaultFee}` : 'Free OPD'}</p>
                </div>
                {selectedService === srv.id && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(2)}
              className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow hover:bg-primary-dark transition flex items-center"
            >
              {messages.common.next} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Problem / Reason */}
      {step === 2 && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <h2 className="text-xl font-bold text-primary-dark">{messages.booking.step2}</h2>
          <div className="space-y-3">
            {activeServiceObj?.problems?.map((prob: any) => (
              <div
                key={prob.id}
                onClick={() => setSelectedProblem(prob.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${
                  selectedProblem === prob.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {prob.redFlag && <AlertTriangle className="w-4 h-4 text-emergency shrink-0" />}
                  <span className="font-semibold text-xs sm:text-sm">{locale === 'hi' ? prob.name_hi : prob.name_en}</span>
                </div>
                {selectedProblem === prob.id && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button onClick={() => setStep(1)} className="border border-gray-300 font-bold px-5 py-2.5 rounded-xl text-sm">
              {messages.common.back}
            </button>
            <button onClick={() => setStep(3)} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow">
              {messages.common.next} <ArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Doctor Preference */}
      {step === 3 && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <h2 className="text-xl font-bold text-primary-dark">{messages.booking.step3}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setDoctorPreference('SPECIFIC')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${doctorPreference === 'SPECIFIC' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <h3 className="font-bold text-sm">{locale === 'hi' ? 'विशिष्ट डॉक्टर चुनें' : 'Choose Specific Doctor'}</h3>
              <p className="text-xs text-mutedText mt-1">{locale === 'hi' ? 'सत्यापित विशेषज्ञों की सूची में से चुनें' : 'Select from verified eye specialists'}</p>
            </div>

            <div
              onClick={() => setDoctorPreference('GENERAL')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${doctorPreference === 'GENERAL' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <h3 className="font-bold text-sm">{locale === 'hi' ? 'सामान्य अपॉइंटमेंट (अस्पताल आवंटित करेगा)' : 'General Appointment (Hospital Assigns)'}</h3>
              <p className="text-xs text-mutedText mt-1">{locale === 'hi' ? 'उपलब्धता अनुसार डॉक्टर आवंटित किया जाएगा' : 'Doctor will be assigned at check-in'}</p>
            </div>
          </div>

          {doctorPreference === 'SPECIFIC' && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-primary-dark block">Select Doctor:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {verifiedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.id)}
                    className={`p-3 rounded-xl border cursor-pointer ${selectedDoctor === doc.id ? 'border-primary bg-primary/5 font-bold' : 'border-gray-200'}`}
                  >
                    <div className="text-xs font-bold">{doc.fullName}</div>
                    <span className="text-[11px] text-mutedText block">{locale === 'hi' ? doc.specialization_hi : doc.specialization_en}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button onClick={() => setStep(2)} className="border border-gray-300 font-bold px-5 py-2.5 rounded-xl text-sm">
              {messages.common.back}
            </button>
            <button onClick={() => setStep(4)} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow">
              {messages.common.next} <ArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 & 5: Date and Time Slot Picker */}
      {(step === 4 || step === 5) && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <h2 className="text-xl font-bold text-primary-dark">{messages.booking.step4} & {messages.booking.step5}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-primary-dark block mb-2">{messages.booking.step4}:</label>
              <input
                type="date"
                value={selectedDate}
                min="2026-09-25"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
              />
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block mt-2">
                ✓ Free OPD Checkup Day: Tuesday
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-primary-dark block mb-2">{messages.booking.step5}:</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.slotStart}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.slotStart)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                      selectedSlot === slot.slotStart
                        ? 'bg-primary text-white border-primary'
                        : slot.available
                        ? 'bg-white hover:bg-gray-50 border-gray-200 text-hospitalText'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {slot.slotStart} - {slot.slotEnd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button onClick={() => setStep(3)} className="border border-gray-300 font-bold px-5 py-2.5 rounded-xl text-sm">
              {messages.common.back}
            </button>
            <button onClick={() => setStep(6)} className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow">
              {messages.common.next} <ArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6 & 7: Patient Details & Mobile OTP Verification */}
      {(step === 6 || step === 7) && !bookingConfirmed && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <h2 className="text-xl font-bold text-primary-dark">{messages.booking.step6} & {messages.booking.step7}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">{messages.booking.patientName} *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ram Kumar"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">{messages.booking.patientAge} *</label>
              <input
                type="text"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 45"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">{messages.booking.gender}</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:border-primary focus:outline-none"
              >
                <option value="Male">Male / पुरुष</option>
                <option value="Female">Female / महिला</option>
                <option value="Other">Other / अन्य</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">Email *</label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* OTP Section */}
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              className="bg-accent text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow hover:bg-teal-600 transition"
            >
              {locale === 'hi' ? 'ईमेल OTP भेजें' : 'Send Email OTP'}
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold text-primary block">
                {locale === 'hi' ? 'ईमेल ओटीपी दर्ज करें' : 'Enter Email OTP'}
                {isMockOtp && <span className="text-red-500 ml-2">(Demo OTP: {expectedOtp})</span>}
              </span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono w-36 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (otpInput === expectedOtp) {
                      handleConfirmBooking();
                    } else {
                      alert(locale === 'hi' ? 'गलत ओटीपी, कृपया पुनः प्रयास करें' : 'Invalid OTP, please try again');
                    }
                  }}
                  className="bg-success text-white px-5 py-2 rounded-xl text-xs font-bold shadow hover:bg-green-700"
                >
                  {messages.booking.verifyOtp}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button onClick={() => setStep(4)} className="border border-gray-300 font-bold px-5 py-2.5 rounded-xl text-sm">
              {messages.common.back}
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION & DIGITAL TOKEN (STEPS 8, 9, 10) */}
      {bookingConfirmed && (
        <div className="surface-card p-8 rounded-2xl shadow-2xl space-y-6 text-center border-l-8 border-success">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-primary-dark">
              {locale === 'hi' ? 'अपॉइंटमेंट की पुष्टि हो गई!' : 'Appointment Successfully Confirmed!'}
            </h2>
            <p className="text-xs text-mutedText mt-1">Appointment ID: <span className="font-mono font-bold text-hospitalText">{appointmentCode}</span></p>
          </div>

          {/* Token Card */}
          <div className="bg-hospitalBg p-6 rounded-2xl border border-hospitalBorder max-w-md mx-auto space-y-4 shadow-inner">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-mutedText uppercase">{messages.token.yourToken}</span>
              <div className="text-5xl font-extrabold text-primary font-mono tracking-wider">{allocatedToken}</div>
              <span className="text-xs text-primary-dark font-bold block">{selectedDate} ({selectedSlot})</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs text-left space-y-1">
              <div className="flex justify-between"><span className="text-mutedText">Patient:</span> <span className="font-bold">{patientName}</span></div>
              <div className="flex justify-between"><span className="text-mutedText">Hospital:</span> <span className="font-bold">Prayag Eye Care, Prayagraj</span></div>
              <div className="flex justify-between"><span className="text-mutedText">Fee Notice:</span> <span className="font-bold text-emerald-700">{messages.common.feeNotice}</span></div>
            </div>

            {/* ETA Window */}
            {etaResult && (
              <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-900 border border-blue-200 text-left space-y-1">
                <span className="font-bold block">{messages.token.etaWindow}: {etaResult.windowStart} - {etaResult.windowEnd}</span>
                <p className="text-[11px] text-blue-700 leading-snug">{messages.token.etaDisclaimer}</p>
              </div>
            )}

            {/* QR Code Placeholder */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl inline-block shadow-sm">
              <QrCode className="w-24 h-24 mx-auto text-primary-dark" />
              <span className="text-[10px] text-mutedText mt-1 block">{messages.token.scanQrAtReception}</span>
            </div>
          </div>

          {/* Download & Share Actions */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a 
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Token: ${allocatedToken}\nAppointment ID: ${appointmentCode}\nPatient: ${patientName}\nDate: ${selectedDate}\nTime: ${selectedSlot}`)}`} 
              download={`token-${allocatedToken}.txt`}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center shadow hover:bg-primary-dark"
            >
              <Download className="w-4 h-4 mr-1.5" /> {messages.booking.downloadPdf}
            </a>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Hi ${patientName}, your appointment at Prayag Eye Care is confirmed. Token: ${allocatedToken}. Time: ${selectedDate} ${selectedSlot}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center shadow hover:bg-emerald-700"
            >
              <Share2 className="w-4 h-4 mr-1.5" /> {messages.booking.shareWhatsapp}
            </a>
            <Link href={`/${locale}/track`} className="bg-accent text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center shadow">
              {messages.booking.trackLive}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
