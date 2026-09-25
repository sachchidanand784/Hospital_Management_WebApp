'use client';

import React, { useState } from 'react';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Mic,
  Plus,
  Sparkles,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function DoctorDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'CONSULTATION' | 'SCHEDULE'>('QUEUE');
  const [currentPatient, setCurrentPatient] = useState<any>({
    token: 'A-014',
    name: 'Ram Kumar',
    age: 45,
    gender: 'Male',
    service: 'General Eye Examination',
    refraction: 'Right: SPH -1.25 / CYL -0.50 AXIS 90 | Left: SPH -1.00',
  });

  const [findings, setFindings] = useState('Bilateral mild early nuclear cataract cataract; intraocular pressure normal.');
  const [diagnosis, setDiagnosis] = useState('Early Cataract (Nuclear Sclerosis Grade 1)');
  const [treatmentPlan, setTreatmentPlan] = useState('Glasses prescribed for near vision; follow up after 6 months.');
  const [medicines, setMedicines] = useState([
    { name: 'Lubricating Eye Drops (Refresh Tears)', dosage: '1 drop', freq: '3 times daily', eye: 'BOTH' }
  ]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2026-10-05');

  const handleAiScribe = () => {
    alert(locale === 'hi' ? 'एआई स्क्रैब: आवाज/नोट्स से क्लिनिकल ड्राफ्ट तैयार किया गया।' : 'AI Scribe: Drafted clinical notes from voice dictation.');
    setFindings('Patient complains of mild glare during night driving. Slit lamp exam shows nuclear sclerosis grade 1.');
    setDiagnosis('Early Nuclear Cataract & Presbyopia');
  };

  const handleCompleteConsultation = () => {
    alert(locale === 'hi' ? 'परामर्श पूर्ण! पर्ची मेडिकल स्टोर और चश्मा घर को भेज दी गई।' : 'Consultation Completed! Prescription sent to Pharmacy & Optical.');
    setActiveTab('QUEUE');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-primary text-white p-6 rounded-2xl shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Doctor OPD Workspace</span>
          <h1 className="text-2xl font-extrabold">Dr. Suresh Kumar Sharma</h1>
          <p className="text-xs text-cyan-100 mt-0.5">Senior Ophthalmologist — Cataract & Refractive Care</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/10 p-1 rounded-xl text-xs font-bold space-x-1">
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'QUEUE' ? 'bg-white text-primary shadow' : 'text-white hover:bg-white/20'}`}
          >
            Today's Queue (12)
          </button>
          <button
            onClick={() => setActiveTab('CONSULTATION')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'CONSULTATION' ? 'bg-white text-primary shadow' : 'text-white hover:bg-white/20'}`}
          >
            Consultation Screen
          </button>
          <button
            onClick={() => setActiveTab('SCHEDULE')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'SCHEDULE' ? 'bg-white text-primary shadow' : 'text-white hover:bg-white/20'}`}
          >
            Schedule & Leaves
          </button>
        </div>
      </div>

      {/* TAB 1: Queue Board */}
      {activeTab === 'QUEUE' && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-primary-dark">Active Queue Board (Room 102)</h2>
            <button
              onClick={() => setActiveTab('CONSULTATION')}
              className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-teal-600 flex items-center"
            >
              Call Next Patient (A-014) <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { token: 'A-014', name: 'Ram Kumar', age: 45, status: 'IN_CONSULTATION', service: 'General Checkup' },
              { token: 'A-015', name: 'Sita Devi', age: 62, status: 'WAITING', service: 'Cataract Follow-up' },
              { token: 'A-016', name: 'Vikas Singh', age: 28, status: 'CHECKED_IN', service: 'Vision Test' },
              { token: 'A-017', name: 'Meena Agarwal', age: 54, status: 'WAITING', service: 'Retina Checkup' },
            ].map((pt) => (
              <div key={pt.token} className="p-4 rounded-xl border border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-extrabold font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                    {pt.token}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-primary-dark">{pt.name} ({pt.age} yrs)</h3>
                    <span className="text-xs text-mutedText">{pt.service}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    pt.status === 'IN_CONSULTATION' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pt.status}
                  </span>
                  <button
                    onClick={() => setActiveTab('CONSULTATION')}
                    className="bg-primary text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-primary-dark"
                  >
                    Open Consult
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Consultation Screen */}
      {activeTab === 'CONSULTATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Details & Optometry Refraction Side Box */}
          <div className="lg:col-span-4 surface-card p-5 rounded-2xl shadow-card space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-primary font-mono">{currentPatient.token}</span>
              <h2 className="text-lg font-bold text-primary-dark">{currentPatient.name} ({currentPatient.age} {currentPatient.gender})</h2>
              <span className="text-xs text-mutedText">{currentPatient.service}</span>
            </div>

            <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200 space-y-2 text-xs">
              <span className="font-bold text-primary-dark block flex items-center">
                <FileText className="w-4 h-4 mr-1 text-accent" /> Optometrist Eye Refraction:
              </span>
              <p className="text-mutedText leading-relaxed bg-white p-2 rounded border border-gray-200 font-mono text-[11px]">
                {currentPatient.refraction}
              </p>
            </div>
          </div>

          {/* Clinical Consultation Form */}
          <div className="lg:col-span-8 surface-card p-6 rounded-2xl shadow-card space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-primary-dark">Clinical Notes & Prescription</h2>
              <button
                onClick={handleAiScribe}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center shadow"
              >
                <Sparkles className="w-4 h-4 mr-1" /> {messages.ai.scribeDraft}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Clinical Findings (जांच निष्कर्ष)</label>
                <textarea
                  rows={2}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Diagnosis (बीमारी का नाम)</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-hospitalText block mb-1">Treatment Plan & Advice</label>
                <textarea
                  rows={2}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              {/* Medicine Builder */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <span className="text-xs font-bold text-primary-dark block">Prescription Medicine Builder:</span>
                {medicines.map((med, idx) => (
                  <div key={idx} className="bg-hospitalBg p-3 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-primary-dark">{med.name}</span>
                      <p className="text-[11px] text-mutedText">{med.dosage} • {med.freq} ({med.eye})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={handleCompleteConsultation}
                className="bg-success hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow"
              >
                Save & Complete Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Schedule & Leave Manager */}
      {activeTab === 'SCHEDULE' && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-primary-dark">Weekly OPD Schedule & Leave Manager</h2>
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="bg-emergency text-white font-bold px-4 py-2 rounded-xl text-xs shadow hover:bg-red-700"
            >
              Apply Leave / Unavailable Date
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
              <span className="font-bold text-primary-dark">Monday - Saturday</span>
              <p className="text-mutedText">09:00 AM - 05:00 PM (Slot: 20 min, Cap: 3/slot)</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-amber-50 space-y-1">
              <span className="font-bold text-amber-900">Tuesday Free OPD</span>
              <p className="text-amber-800">Special Free Checkup Day</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
              <span className="font-bold text-gray-700">Sunday</span>
              <p className="text-gray-500">CLOSED (Emergency 24x7 On-call)</p>
            </div>
          </div>
        </div>
      )}

      {/* Leave Conflict Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-primary-dark">Doctor Leave & Conflict Handler</h3>
            <p className="text-xs text-mutedText">Selecting a leave date will check existing appointments and trigger automatic patient rescheduling notifications.</p>

            <div>
              <label className="text-xs font-bold text-hospitalText block mb-1">Leave Date:</label>
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Notice: 5 appointments exist on this date. Confirming leave will mark them NEEDS_RESCHEDULE and send magic links to patients.</span>
            </div>

            <div className="flex justify-end space-x-2">
              <button onClick={() => setLeaveModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setLeaveModalOpen(false);
                  alert(locale === 'hi' ? 'छुट्टी दर्ज! प्रभावित मरीजों को रीशेड्यूल लिंक भेज दिए गए।' : 'Leave applied! Rescheduling notifications sent to affected patients.');
                }}
                className="bg-emergency text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
              >
                Confirm Leave & Notify Patients
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
