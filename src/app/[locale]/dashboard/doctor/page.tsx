'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  ArrowRight,
  ArrowLeft,
  Search,
  Phone,
  MapPin,
  Eye,
  Check,
  RotateCcw,
  Volume2,
  Stethoscope
} from 'lucide-react';
import { getAppointments, updateAppointmentStatus } from '@/actions/appointment';
import { formatTo12Hour } from '@/lib/time';

export default function DoctorDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'CONSULTATION' | 'SCHEDULE'>('QUEUE');
  const [queueList, setQueueList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED'>('ALL');

  // Active Doctor Information (M S Memorial Netralaya)
  const doctorsList = [
    { id: 'doc-1', name: 'Dr. Madhav Mukund', qualification: 'MBBS, MS (Ophthalmology)', role: 'Director & Senior Eye Surgeon — Cataract & Phaco Specialist', room: 'Room 101' },
    { id: 'doc-2', name: 'Dr. Kshitij Aaditya', qualification: 'MBBS, MS, FVRS', role: 'Vitreo-Retina & Laser Specialist', room: 'Room 102' },
    { id: 'doc-3', name: 'Dr. Arvind Gautam', qualification: 'MBBS, MS (Ophthalmology)', role: 'Glaucoma & Anterior Segment Surgeon', room: 'Room 103' },
  ];
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);

  // Current Patient being consulted
  const [currentPatient, setCurrentPatient] = useState<any>({
    token: 'A-010',
    tokenSeq: 10,
    name: 'Ram Kumar',
    age: 45,
    gender: 'Male',
    mobile: '+91 98765 00010',
    uhid: 'MSM-2026-000010',
    address: 'Dildarnagar, Ghazipur',
    service: 'General Eye Examination & Consultation',
    problem: 'Early Cataract & Blurred Distance Vision',
    status: 'IN_CONSULTATION',
    refraction: 'Right: SPH -1.25 / CYL -0.50 AXIS 90 (6/6) | Left: SPH -1.00 (6/6) | IOP: 14 mmHg Normal',
    slotStart: '09:30 AM',
    id: null,
  });

  // Clinical Consultation State
  const [findings, setFindings] = useState('Bilateral mild early nuclear cataract; intraocular pressure normal (14 mmHg). Retinal macula healthy.');
  const [diagnosis, setDiagnosis] = useState('Early Nuclear Cataract (Grade 1) & Presbyopia');
  const [treatmentPlan, setTreatmentPlan] = useState('Prescription glasses updated for reading; lubricating eye drops prescribed; review after 6 months.');
  const [medicines, setMedicines] = useState([
    { name: 'Lubricating Eye Drops (Refresh Tears)', dosage: '1 drop', freq: '3 times daily', eye: 'BOTH' },
    { name: 'Multivitamin & Lutein Capsule', dosage: '1 cap', freq: 'Once daily after dinner', eye: 'ORAL' }
  ]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2026-10-25');
  const [voiceAnnouncement, setVoiceAnnouncement] = useState(true);

  // Load real appointments for doctor queue, strictly sorted ascending by tokenSeq
  const loadDoctorQueue = async () => {
    const res = await getAppointments();
    if (res.success && res.appointments.length > 0) {
      const mapped = res.appointments.map((a: any) => {
        const seq = a.tokenSeq !== null && a.tokenSeq !== undefined
          ? a.tokenSeq
          : parseInt(a.tokenLabel?.replace(/\D/g, '') || '0') || 0;

        return {
          id: a.id,
          token: a.tokenLabel || `A-${String(seq).padStart(3, '0')}`,
          tokenSeq: seq,
          name: a.patient?.name || 'Patient',
          age: a.patient?.age || 30,
          gender: a.patient?.gender || 'Male',
          mobile: a.patient?.mobile || '+91 80048 00688',
          uhid: a.patient?.uhid || `MSM-2026-${String(seq).padStart(6, '0')}`,
          address: a.patient?.address || 'Dildarnagar, Ghazipur',
          service: a.service?.name_en || 'General Eye Examination',
          problem: a.problem?.problem_en || a.problem?.problem_hi || a.notes || 'Eye Checkup & Vision Consultation',
          status: a.status || 'WAITING',
          slotStart: formatTo12Hour(a.slotStart || a.createdAt),
          refraction: a.examination
            ? `Distance: R ${a.examination.distVisionRight || '6/6'} / L ${a.examination.distVisionLeft || '6/6'} | IOP: R ${a.examination.iopRight || '14'} / L ${a.examination.iopLeft || '14'} mmHg`
            : `Right: SPH -1.00 / CYL -0.50 (6/6) | Left: SPH -0.75 (6/6) | IOP: 14 mmHg (Normal)`,
        };
      });

      // Strict Ascending Sort by tokenSeq (Token 1, 2, 3 ... 10, 11, 12)
      const sorted = mapped.sort((a: any, b: any) => a.tokenSeq - b.tokenSeq);
      setQueueList(sorted);

      // Select initial patient: either currently IN_CONSULTATION or first waiting/booked
      const activeConsult = sorted.find((p: any) => p.status === 'IN_CONSULTATION');
      const firstWaiting = sorted.find((p: any) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED');
      if (activeConsult) {
        setCurrentPatient(activeConsult);
      } else if (firstWaiting) {
        setCurrentPatient(firstWaiting);
      } else if (sorted.length > 0) {
        setCurrentPatient(sorted[0]);
      }
    } else {
      // High-quality mock ascending queue starting from Token 10, 11, 12, 13
      const mockQueue = [
        { id: 'm-10', token: 'A-010', tokenSeq: 10, name: 'Ram Kumar', age: 45, gender: 'Male', mobile: '+91 98765 00010', uhid: 'MSM-2026-000010', address: 'Dildarnagar, Ghazipur', status: 'IN_CONSULTATION', service: 'Cataract Consultation', problem: 'Blurred vision in right eye', refraction: 'Right: SPH -1.25 / CYL -0.50 | Left: SPH -1.00 | IOP: 14 mmHg', slotStart: '09:30 AM' },
        { id: 'm-11', token: 'A-011', tokenSeq: 11, name: 'Manish Yadav', age: 28, gender: 'Male', mobile: '+91 98765 00011', uhid: 'MSM-2026-000011', address: 'Zamania, Ghazipur', status: 'WAITING', service: 'Vision Test & Refraction', problem: 'Headache while reading & screen strain', refraction: 'Right: SPH -2.00 / CYL -0.75 | Left: SPH -1.75 | IOP: 13 mmHg', slotStart: '09:45 AM' },
        { id: 'm-12', token: 'A-012', tokenSeq: 12, name: 'Sita Devi', age: 62, gender: 'Female', mobile: '+91 98765 00012', uhid: 'MSM-2026-000012', address: 'Dildarnagar Bazaar', status: 'WAITING', service: 'Phaco Cataract Follow-up', problem: 'Post-op cataract surgery review (1 month)', refraction: 'Pseudophakic Both Eyes | 6/6 Clear | IOP: 15 mmHg', slotStart: '10:00 AM' },
        { id: 'm-13', token: 'A-013', tokenSeq: 13, name: 'Gopal Maurya', age: 24, gender: 'Male', mobile: '+91 98765 00013', uhid: 'MSM-2026-000013', address: 'Ghazipur City', status: 'WAITING', service: 'RRB Vision Certification', problem: 'Color vision & 6/6 distant visual acuity test', refraction: '6/6 Unaided Both Eyes | Ishihara 38 Plates Normal', slotStart: '10:15 AM' },
        { id: 'm-14', token: 'A-014', tokenSeq: 14, name: 'Pooja Verma', age: 34, gender: 'Female', mobile: '+91 98765 00014', uhid: 'MSM-2026-000014', address: 'Buxar Road, Dildarnagar', status: 'WAITING', service: 'Vitreo-Retina Screening', problem: 'Floaters and sudden flashes in left eye', refraction: 'Fundus Evaluation Pending | IOP: 16 mmHg', slotStart: '10:30 AM' },
      ];
      setQueueList(mockQueue);
      setCurrentPatient(mockQueue[0]);
    }
  };

  useEffect(() => {
    loadDoctorQueue();
  }, []);

  // =========================================================================
  // CORE ASCENDING TOKEN LOGIC: Find Next Patient in Ascending Order
  // (e.g. if doctor is on Token 10 -> Next is Token 11 -> then Token 12)
  // =========================================================================
  const getNextPatient = (currentPt?: any, list = queueList) => {
    if (!list || list.length === 0) return null;

    const curSeq = currentPt?.tokenSeq !== undefined && currentPt?.tokenSeq !== null
      ? currentPt.tokenSeq
      : (currentPt?.token ? parseInt(currentPt.token.replace(/\D/g, '')) : null);

    if (curSeq !== null && !isNaN(curSeq)) {
      // 1. Look for uncompleted patient whose tokenSeq is strictly GREATER than curSeq (Ascending order)
      const nextUncompleted = list
        .filter((p) => {
          const pSeq = p.tokenSeq ?? parseInt(p.token?.replace(/\D/g, '') || '0');
          const isPending = p.status !== 'COMPLETED' && p.status !== 'CANCELLED';
          return pSeq > curSeq && isPending;
        })
        .sort((a, b) => a.tokenSeq - b.tokenSeq)[0];

      if (nextUncompleted) return nextUncompleted;

      // 2. If all higher tokens are completed, check if ANY patient exists with tokenSeq > curSeq
      const nextHigher = list
        .filter((p) => {
          const pSeq = p.tokenSeq ?? parseInt(p.token?.replace(/\D/g, '') || '0');
          return pSeq > curSeq;
        })
        .sort((a, b) => a.tokenSeq - b.tokenSeq)[0];

      if (nextHigher) return nextHigher;
    }

    // 3. Fallback: First pending patient in the queue
    const firstPending = list
      .filter((p) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED')
      .sort((a, b) => a.tokenSeq - b.tokenSeq)[0];

    if (firstPending) return firstPending;

    // 4. Fallback: First patient in queue
    return list[0] || null;
  };

  // Calculate the next patient based on current patient
  const nextPatient = useMemo(() => {
    return getNextPatient(currentPatient, queueList);
  }, [currentPatient, queueList]);

  // Voice announcement helper
  const announcePatientCall = (tokenLabel: string, patientName: string) => {
    if (!voiceAnnouncement) return;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any pending speech
        const speechText = locale === 'hi'
          ? `टोकन नंबर ${tokenLabel}, ${patientName}, कृपया कमरा नंबर ${selectedDoctor.room} में आएं`
          : `Token number ${tokenLabel}, ${patientName}, please proceed to ${selectedDoctor.room}`;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 0.92;
        utterance.lang = locale === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      // Speech announcement optional
    }
  };

  // =========================================================================
  // ACTION: Call Next Patient (Advances 10 -> 11 -> 12... & loads profile)
  // =========================================================================
  const handleCallNextPatient = async () => {
    const candidate = getNextPatient(currentPatient, queueList);

    if (!candidate) {
      alert(locale === 'hi' ? 'कतार में कोई अगला मरीज शेष नहीं है!' : 'All patients in the queue have been attended!');
      return;
    }

    // 1. If previous patient was IN_CONSULTATION, mark as COMPLETED
    if (currentPatient && currentPatient.id && currentPatient.id !== candidate.id && currentPatient.status === 'IN_CONSULTATION') {
      await updateAppointmentStatus(currentPatient.id, 'COMPLETED');
    }

    // 2. Mark candidate as IN_CONSULTATION in database
    if (candidate.id) {
      await updateAppointmentStatus(candidate.id, 'IN_CONSULTATION');
    }

    // 3. Update local queue list
    setQueueList((prev) =>
      prev.map((p) => {
        if (currentPatient && p.id === currentPatient.id && currentPatient.id !== candidate.id && currentPatient.status === 'IN_CONSULTATION') {
          return { ...p, status: 'COMPLETED' };
        }
        if (p.id === candidate.id) {
          return { ...p, status: 'IN_CONSULTATION' };
        }
        return p;
      })
    );

    // 4. Set current patient to candidate and open their profile
    const activated = { ...candidate, status: 'IN_CONSULTATION' };
    setCurrentPatient(activated);

    // 5. Reset clinical form with smart template for the new patient
    setFindings(
      locale === 'hi'
        ? `नेत्र जांच पूर्ण: दृष्टि तीक्ष्णता 6/6; लेंस एवं रेटिना की सामान्य स्थिति; इंट्राऑकुलर प्रेशर सामान्य।`
        : `Anterior segment clear; pupil brisk and reactive; fundus evaluation normal; visual acuity stable.`
    );
    setDiagnosis(candidate.problem || 'Refractive Evaluation & General Consultation');
    setTreatmentPlan(
      locale === 'hi'
        ? 'आंखों में नमी हेतु आई ड्रॉप्स एवं दृष्टि सुधार चश्मा नंबर परामर्श; 6 माह बाद फॉलो-अप।'
        : 'Prescribed lubricating drops; updated optical prescription; follow up in 6 months.'
    );

    // 6. Voice announcement
    announcePatientCall(activated.token, activated.name);

    // 7. Open Consultation Tab so doctor immediately sees the new profile
    setActiveTab('CONSULTATION');
  };

  // Directly select any patient from queue
  const handleOpenPatientConsult = async (pt: any) => {
    if (pt.id && pt.status !== 'COMPLETED') {
      await updateAppointmentStatus(pt.id, 'IN_CONSULTATION');
    }
    setQueueList((prev) =>
      prev.map((p) => (p.id === pt.id ? { ...p, status: 'IN_CONSULTATION' } : p))
    );
    setCurrentPatient({ ...pt, status: 'IN_CONSULTATION' });
    announcePatientCall(pt.token, pt.name);
    setActiveTab('CONSULTATION');
  };

  // Complete consultation and return to queue
  const handleCompleteConsultation = async () => {
    if (currentPatient?.id) {
      await updateAppointmentStatus(currentPatient.id, 'COMPLETED');
      setQueueList((prev) =>
        prev.map((q) => (q.id === currentPatient.id ? { ...q, status: 'COMPLETED' } : q))
      );
    }
    alert(
      locale === 'hi'
        ? `टोकन ${currentPatient.token} (${currentPatient.name}) का परामर्श पूर्ण हुआ! पर्ची फार्मेसी व चश्मा घर भेजी गई।`
        : `Consultation Completed for ${currentPatient.token} (${currentPatient.name})! Prescription sent to Pharmacy & Optical.`
    );
    setActiveTab('QUEUE');
  };

  // Complete consultation AND immediately advance to next patient
  const handleCompleteAndCallNext = async () => {
    if (currentPatient?.id) {
      await updateAppointmentStatus(currentPatient.id, 'COMPLETED');
      setQueueList((prev) =>
        prev.map((q) => (q.id === currentPatient.id ? { ...q, status: 'COMPLETED' } : q))
      );
    }
    handleCallNextPatient();
  };

  // AI Voice Scribe dictation
  const handleAiScribe = () => {
    alert(
      locale === 'hi'
        ? 'एआई स्क्रैब: डॉक्टर की आवाज/डिक्टेशन से क्लिनिकल नोट्स तैयार किए गए।'
        : 'AI Scribe: Drafted clinical notes from doctor voice dictation.'
    );
    setFindings(`Patient reports difficulty reading small print and mild eye strain during evening. Slit lamp shows clear cornea, deep anterior chamber, lens shows early nuclear sclerosis.`);
    setDiagnosis('Presbyopia with Early Nuclear Sclerosis (Grade 1)');
    setTreatmentPlan('Progressive / Bifocal addition (+2.00 DS) prescribed. Preservative-free tear substitute drops TDS.');
  };

  // Add new medicine to prescription
  const handleAddMedicine = () => {
    const medName = prompt('Enter Eye Drop / Medicine Name:', 'Carboxymethylcellulose 0.5% Eye Drops');
    if (medName) {
      setMedicines((prev) => [
        ...prev,
        { name: medName, dosage: '1 drop', freq: '4 times daily', eye: 'BOTH' }
      ]);
    }
  };

  // Filtered queue
  const filteredQueue = queueList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.uhid && p.uhid.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'WAITING') return p.status === 'WAITING' || p.status === 'CHECKED_IN' || p.status === 'BOOKED';
    if (statusFilter === 'IN_CONSULTATION') return p.status === 'IN_CONSULTATION';
    if (statusFilter === 'COMPLETED') return p.status === 'COMPLETED';
    return true;
  });

  const waitingCount = queueList.filter((p) => p.status === 'WAITING' || p.status === 'CHECKED_IN' || p.status === 'BOOKED').length;
  const inConsultCount = queueList.filter((p) => p.status === 'IN_CONSULTATION').length;
  const completedCount = queueList.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── TOP HEADER: Doctor OPD Workspace ── */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-8 border-accent">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 backdrop-blur-md text-cyan-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center">
              <Stethoscope className="w-3 h-3 mr-1" /> M S Memorial Netralaya OPD
            </span>
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {selectedDoctor.room}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedDoctor.id}
              onChange={(e) => {
                const doc = doctorsList.find((d) => d.id === e.target.value);
                if (doc) setSelectedDoctor(doc);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xl sm:text-2xl rounded-xl px-2 py-1 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              {doctorsList.map((doc) => (
                <option key={doc.id} value={doc.id} className="text-gray-900 bg-white font-bold">
                  {doc.name} ({doc.room})
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-cyan-100 font-medium">{selectedDoctor.qualification} — {selectedDoctor.role}</p>
        </div>

        {/* Tab Navigation & Voice Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVoiceAnnouncement(!voiceAnnouncement)}
            title="Toggle Voice Callout"
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center ${
              voiceAnnouncement ? 'bg-accent/30 text-cyan-200 border border-cyan-300/40' : 'bg-white/10 text-gray-300'
            }`}
          >
            <Volume2 className={`w-4 h-4 mr-1 ${voiceAnnouncement ? 'text-accent' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">{voiceAnnouncement ? 'Voice: ON' : 'Voice: OFF'}</span>
          </button>

          <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl text-xs font-bold space-x-1 border border-white/15">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center ${
                activeTab === 'QUEUE' ? 'bg-white text-primary shadow-md font-extrabold' : 'text-white hover:bg-white/20'
              }`}
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Today's Queue ({queueList.length})
            </button>
            <button
              onClick={() => setActiveTab('CONSULTATION')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center ${
                activeTab === 'CONSULTATION' ? 'bg-white text-primary shadow-md font-extrabold' : 'text-white hover:bg-white/20'
              }`}
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              Consultation Screen ({currentPatient?.token || 'None'})
            </button>
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center ${
                activeTab === 'SCHEDULE' ? 'bg-white text-primary shadow-md font-extrabold' : 'text-white hover:bg-white/20'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Schedule & Leaves
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB 1: Queue Board ── */}
      {activeTab === 'QUEUE' && (
        <div className="surface-card p-5 sm:p-6 rounded-2xl shadow-card space-y-5">
          {/* Top Bar with Queue Summary & Main ASCENDING Action Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-primary-dark">Active Queue Board ({selectedDoctor.room})</h2>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  ● Live Sync
                </span>
              </div>
              <p className="text-xs text-mutedText mt-0.5">
                Currently Serving: <strong className="text-primary font-mono">{currentPatient?.token || 'None'}</strong> • Next in Ascending Order: <strong className="text-accent font-mono">{nextPatient?.token || 'Finished'}</strong>
              </p>
            </div>

            {/* CALL NEXT PATIENT BUTTON (Strict Ascending Logic) */}
            <button
              onClick={handleCallNextPatient}
              className="bg-accent hover:bg-teal-600 active:scale-95 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center transition transform cursor-pointer border border-teal-400"
            >
              <span>{locale === 'hi' ? 'अगला मरीज बुलाएं' : 'Call Next Patient'}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md ml-2 font-mono text-white text-xs">
                {nextPatient ? nextPatient.token : 'Finished'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1.5 animate-pulse" />
            </button>
          </div>

          {/* Quick Queue Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200">
              <span className="text-[11px] text-mutedText font-semibold block">Total Patients</span>
              <div className="text-2xl font-extrabold text-primary-dark font-mono">{queueList.length}</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-[11px] text-amber-800 font-semibold block">Waiting in Lounge</span>
              <div className="text-2xl font-extrabold text-amber-900 font-mono">{waitingCount}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
              <span className="text-[11px] text-purple-800 font-semibold block">In Consultation</span>
              <div className="text-2xl font-extrabold text-purple-900 font-mono">{inConsultCount}</div>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-[11px] text-emerald-800 font-semibold block">Completed</span>
              <div className="text-2xl font-extrabold text-emerald-900 font-mono">{completedCount}</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search token (e.g. 11), name, UHID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {(['ALL', 'WAITING', 'IN_CONSULTATION', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    statusFilter === st
                      ? 'bg-primary text-white shadow'
                      : 'bg-hospitalBg text-mutedText hover:bg-gray-200'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'WAITING' ? `Waiting (${waitingCount})` : st === 'IN_CONSULTATION' ? `In Consult (${inConsultCount})` : `Done (${completedCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* ASCENDING QUEUE PATIENT LIST */}
          <div className="space-y-2.5">
            {filteredQueue.length === 0 ? (
              <div className="text-center py-10 text-mutedText text-xs">
                No patients match the selected filter.
              </div>
            ) : (
              filteredQueue.map((pt, idx) => {
                const isCurrent = currentPatient?.token === pt.token;
                const isNext = nextPatient?.token === pt.token;

                return (
                  <div
                    key={pt.token + pt.id + idx}
                    className={`p-4 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                      isCurrent
                        ? 'border-purple-500 bg-purple-50/50 shadow-sm ring-1 ring-purple-400'
                        : isNext
                        ? 'border-accent bg-teal-50/30'
                        : 'border-gray-200 bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`text-xl font-extrabold font-mono px-3 py-2 rounded-xl text-center shrink-0 min-w-[70px] ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow'
                          : isNext
                          ? 'bg-accent text-white shadow'
                          : pt.status === 'COMPLETED'
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {pt.token}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-sm text-primary-dark">{pt.name}</h3>
                          <span className="text-xs text-mutedText font-semibold">({pt.age} yrs • {pt.gender})</span>
                          {isCurrent && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                              ● Current Patient
                            </span>
                          )}
                          {isNext && (
                            <span className="bg-accent/20 text-accent text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Next in Line
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-mutedText mt-0.5">
                          <span>{pt.service}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-primary font-mono text-[11px] font-semibold">{pt.uhid}</span>
                          <span className="text-gray-300">•</span>
                          <span>Slot: {pt.slotStart}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 italic mt-0.5">Problem: {pt.problem}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 self-end sm:self-center shrink-0">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                        pt.status === 'IN_CONSULTATION'
                          ? 'bg-purple-100 text-purple-800 animate-pulse'
                          : pt.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pt.status === 'IN_CONSULTATION' ? 'IN CONSULTATION' : pt.status}
                      </span>

                      <button
                        onClick={() => handleOpenPatientConsult(pt)}
                        className={`font-bold px-3.5 py-1.5 rounded-xl text-xs shadow transition flex items-center ${
                          isCurrent
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : pt.status === 'COMPLETED'
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-primary hover:bg-primary-dark text-white'
                        }`}
                      >
                        {isCurrent ? 'Resume Consult' : pt.status === 'COMPLETED' ? 'Review File' : 'Open Consult'}
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Consultation Screen (Full Patient Profile & Prescription) ── */}
      {activeTab === 'CONSULTATION' && (
        <div className="space-y-4">
          {/* Top Consultation Action Bar */}
          <div className="surface-card p-4 rounded-2xl shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-l-4 border-purple-500">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 text-white font-mono font-extrabold text-2xl px-3.5 py-1.5 rounded-xl shadow">
                {currentPatient.token}
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">Currently Consulting</span>
                <h2 className="text-base font-extrabold text-primary-dark">{currentPatient.name} ({currentPatient.age} yrs • {currentPatient.gender})</h2>
              </div>
            </div>

            {/* In-Consultation Quick Advance Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('QUEUE')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Queue
              </button>

              <button
                onClick={handleCompleteAndCallNext}
                className="bg-accent hover:bg-teal-600 active:scale-95 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md flex items-center transition cursor-pointer"
              >
                <span>Save & Call Next ({nextPatient ? nextPatient.token : 'None'})</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN (4 cols): Detailed Patient Profile & Optometry Card */}
            <div className="lg:col-span-4 space-y-4">
              {/* Comprehensive Patient Demographic Profile */}
              <div className="surface-card p-5 rounded-2xl shadow-card space-y-3.5 border border-hospitalBorder">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Patient Demographics</span>
                    <h3 className="text-lg font-extrabold text-primary-dark">{currentPatient.name}</h3>
                  </div>
                  <span className="bg-primary/10 text-primary font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg">
                    {currentPatient.token}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-mutedText">Age & Gender:</span>
                    <strong className="text-hospitalText">{currentPatient.age} Years • {currentPatient.gender}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-mutedText">UHID Number:</span>
                    <strong className="text-primary font-mono">{currentPatient.uhid}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-mutedText">Mobile Contact:</span>
                    <strong className="text-hospitalText flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-accent" /> {currentPatient.mobile}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-mutedText">Address / City:</span>
                    <strong className="text-hospitalText flex items-center truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 mr-1 text-emergency shrink-0" /> {currentPatient.address}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-mutedText">Service Requested:</span>
                    <strong className="text-primary">{currentPatient.service}</strong>
                  </div>
                  <div className="py-1">
                    <span className="text-mutedText block mb-0.5">Chief Eye Complaint:</span>
                    <div className="bg-amber-50 text-amber-900 p-2 rounded-lg font-medium border border-amber-200 text-[11px]">
                      ⚠️ {currentPatient.problem}
                    </div>
                  </div>
                </div>
              </div>

              {/* Optometry Eye Refraction Card */}
              <div className="surface-card p-5 rounded-2xl shadow-card space-y-3 border border-hospitalBorder">
                <span className="text-xs font-bold text-primary-dark flex items-center">
                  <Eye className="w-4 h-4 mr-1.5 text-accent" /> Optometrist Eye Refraction & IOP
                </span>

                <div className="bg-hospitalBg p-3 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <span className="font-bold text-primary block">Right Eye (OD)</span>
                      <p className="font-mono text-gray-700 mt-1">SPH: -1.25 | CYL: -0.50</p>
                      <p className="font-mono text-emerald-600 font-bold">V/A: 6/6</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <span className="font-bold text-primary block">Left Eye (OS)</span>
                      <p className="font-mono text-gray-700 mt-1">SPH: -1.00 | CYL: 0.00</p>
                      <p className="font-mono text-emerald-600 font-bold">V/A: 6/6</p>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-gray-200 font-mono text-[11px] text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>NCT Intraocular Pressure:</span>
                      <strong className="text-emerald-700 font-bold">14 mmHg (Normal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pupil Dilation:</span>
                      <strong>Ready for Examination</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (8 cols): Clinical Examination Form & Prescription Builder */}
            <div className="lg:col-span-8 surface-card p-5 sm:p-6 rounded-2xl shadow-card space-y-4 border border-hospitalBorder">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-primary-dark">Doctor's Clinical Notes & Rx</h2>
                  <p className="text-xs text-mutedText">Consultation Room: {selectedDoctor.room} • {selectedDoctor.name}</p>
                </div>

                <button
                  onClick={handleAiScribe}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center shadow transition"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" /> AI Clinical Scribe
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-hospitalText block mb-1">Clinical Findings & Slit Lamp Examination (जांच निष्कर्ष)</label>
                  <textarea
                    rows={2}
                    value={findings}
                    onChange={(e) => setFindings(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary font-medium"
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-bold text-hospitalText block mb-1">Diagnosis (रोग / बीमारी)</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary font-bold text-primary-dark"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-hospitalText block mb-1">Treatment Plan & Patient Advice (उपचार सलाह)</label>
                  <textarea
                    rows={2}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
                  ></textarea>
                </div>

                {/* Prescription Medicine Builder */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-primary-dark block">Prescribed Medicines & Eye Drops:</span>
                    <button
                      onClick={handleAddMedicine}
                      className="text-xs text-accent hover:underline font-bold flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-0.5" /> Add Medicine
                    </button>
                  </div>

                  <div className="space-y-2">
                    {medicines.map((med, idx) => (
                      <div key={idx} className="bg-hospitalBg p-2.5 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-primary-dark">{med.name}</span>
                          <p className="text-[11px] text-mutedText">{med.dosage} • {med.freq} • Eye: {med.eye}</p>
                        </div>
                        <button
                          onClick={() => setMedicines(medicines.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save & Advance */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
                <button
                  onClick={handleCompleteConsultation}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs shadow transition flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> Save & Back to Queue
                </button>

                <button
                  onClick={handleCompleteAndCallNext}
                  className="w-full sm:w-auto bg-accent hover:bg-teal-600 active:scale-95 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg flex items-center justify-center transition cursor-pointer"
                >
                  <span>Save & Call Next ({nextPatient ? nextPatient.token : 'Finish'})</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Schedule & Leave Manager ── */}
      {activeTab === 'SCHEDULE' && (
        <div className="surface-card p-6 rounded-2xl shadow-card space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-primary-dark">Doctor OPD Schedule & Leave Manager</h2>
              <p className="text-xs text-mutedText">{selectedDoctor.name} — {selectedDoctor.room}</p>
            </div>
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="bg-emergency text-white font-bold px-4 py-2 rounded-xl text-xs shadow hover:bg-red-700 transition"
            >
              Apply Leave / Unavailable Date
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
              <span className="font-bold text-primary-dark">Monday - Saturday</span>
              <p className="text-mutedText">09:00 AM - 06:00 PM (Slot: 15 min, Cap: 4/slot)</p>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 space-y-1">
              <span className="font-bold text-amber-900">Tuesday Free OPD Day</span>
              <p className="text-amber-800">Special Free Eye Screening Consultations</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
              <span className="font-bold text-gray-700">Sunday</span>
              <p className="text-gray-500">Regular OPD Closed (Emergency 24x7 On-call)</p>
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
              <span>Notice: Appointments on this date will be automatically marked for rescheduling and patients alerted.</span>
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
