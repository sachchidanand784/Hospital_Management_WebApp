'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { SEED_DATA } from '@backend/db/seed';
import {
  ShieldCheck, UserCheck, UserX, UserPlus, FileSpreadsheet, Users, Calendar,
  AlertTriangle, Settings, CheckCircle, XCircle, Eye, Clock, Activity,
  Building, Phone, Mail, Stethoscope, Trash2, Edit, PlusCircle,
  BarChart3, Megaphone, FileText, Lock, LogOut, Search, Filter, Bell,
} from 'lucide-react';
import { getEmergencyRequests, updateEmergencyStatus } from '@/actions/emergency';
import { getHospitalSettings, updateHospitalSettings } from '@/actions/hospital';
import { getOwnerDashboardData } from '@/actions/dashboard';

type TabType = 'OVERVIEW' | 'DOCTORS' | 'STAFF' | 'SERVICES' | 'APPOINTMENTS' | 'EMERGENCY' | 'HOSPITAL' | 'REPORTS';

export default function OwnerDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');

  // Doctor Management State
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [verifiedDoctors, setVerifiedDoctors] = useState<any[]>([]);
  const [declineModalDoc, setDeclineModalDoc] = useState<any>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  // Staff Management State
  const [staffList, setStaffList] = useState<any[]>([]);
  
  const [services, setServices] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [addStaffModal, setAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', mobile: '', role: 'RECEPTION' });

  // Add Doctor Modal
  const [addDoctorModal, setAddDoctorModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    fullName: '', email: '', mobile: '', qualification: '', specialization: '',
    experienceYears: '', consultationFee: '', bio: '',
  });

  // Hospital Settings State
  const [hospitalSettings, setHospitalSettings] = useState({
    name_en: '',
    name_hi: '',
    address_en: '',
    email: '',
    phone1: '',
    phone2: '',
    emergencyPhone: '',
    emergency24x7: true,
  });

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  React.useEffect(() => {
    async function loadSettings() {
      const res = await getHospitalSettings();
      if (res.success && res.hospital) {
        setHospitalSettings(res.hospital);
      }
      setIsLoadingSettings(false);

      const dashRes = await getOwnerDashboardData();
      if (dashRes.success) {
        setPendingDoctors(dashRes.doctors.filter((d: any) => d.verificationStatus === 'PENDING'));
        setVerifiedDoctors(dashRes.doctors.filter((d: any) => d.verificationStatus === 'VERIFIED'));
        setStaffList(dashRes.staff);
        setServices(dashRes.services);
        setSpecializations(dashRes.specializations);
      }
    }
    loadSettings();
  }, []);

  const handleSaveHospitalSettings = async () => {
    const res = await updateHospitalSettings(hospitalSettings);
    if (res.success) {
      alert(locale === 'hi' ? 'अस्पताल की सेटिंग्स सफलतापूर्वक सहेजी गईं!' : 'Hospital settings saved successfully!');
    } else {
      alert(locale === 'hi' ? 'सेटिंग्स सहेजने में विफल!' : 'Failed to save settings!');
    }
  };

  // Demo Appointments Data
  const [appointments] = useState([
    { id: 'APT-1001', token: 'A-012', patient: 'Ramesh Gupta', doctor: 'Dr. Suresh Kumar Sharma', service: 'General Eye Checkup', status: 'COMPLETED', date: '2026-09-25', time: '09:30 AM' },
    { id: 'APT-1002', token: 'A-014', patient: 'Sunita Devi', doctor: 'Dr. Suresh Kumar Sharma', service: 'Cataract Evaluation', status: 'IN_CONSULTATION', date: '2026-09-25', time: '10:00 AM' },
    { id: 'APT-1003', token: 'A-015', patient: 'Mohan Lal', doctor: 'Dr. Suresh Kumar Sharma', service: 'General Eye Checkup', status: 'WAITING', date: '2026-09-25', time: '10:30 AM' },
    { id: 'APT-1004', token: 'B-003', patient: 'Priya Singh', doctor: 'Dr. Ananya Srivastava', service: 'Retinal Screening', status: 'CHECKED_IN', date: '2026-09-25', time: '09:45 AM' },
    { id: 'APT-1005', token: 'A-016', patient: 'Vikram Yadav', doctor: 'Dr. Suresh Kumar Sharma', service: 'Cataract Evaluation', status: 'BOOKED', date: '2026-09-25', time: '11:00 AM' },
    { id: 'APT-1006', token: 'C-001', patient: 'Anita Pandey', doctor: 'Dr. Rajeshwar Patel', service: 'Glaucoma Screening', status: 'NO_SHOW', date: '2026-09-25', time: '09:00 AM' },
  ]);

  // Emergency Alerts Data
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchAlerts() {
      const res = await getEmergencyRequests();
      if (res.success) {
        setEmergencyAlerts(res.requests);
      }
    }
    fetchAlerts();
    
    // Poll every 30 seconds for new alerts
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateEmergencyStatus = async (id: string, status: string) => {
    const res = await updateEmergencyStatus(id, status);
    if (res.success) {
      setEmergencyAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, status } : alert));
      alert('Status updated successfully!');
    } else {
      alert('Failed to update status.');
    }
  };

  const handleConfirmDoctor = (docId: string) => {
    const doc = pendingDoctors.find((d) => d.id === docId);
    if (doc) {
      setPendingDoctors(pendingDoctors.filter((d) => d.id !== docId));
      setVerifiedDoctors([...verifiedDoctors, { ...doc, verificationStatus: 'VERIFIED' as const }]);
      alert(locale === 'hi' ? 'डॉक्टर सफलतापूर्वक सत्यापित और सक्रिय हो गया।' : 'Doctor successfully verified and activated.');
    }
  };

  const handleDeclineDoctor = () => {
    if (declineModalDoc) {
      setPendingDoctors(pendingDoctors.filter((d: any) => d.id !== declineModalDoc.id));
      setDeclineModalDoc(null);
      setDeclineReason('');
      alert(locale === 'hi' ? 'डॉक्टर पंजीकरण आवेदन अस्वीकार कर दिया गया।' : 'Doctor registration request declined.');
    }
  };

  const handleDeleteDoctor = (docId: string) => {
    if (confirm(locale === 'hi' ? 'क्या आप वाकई इस डॉक्टर को हटाना चाहते हैं?' : 'Are you sure you want to remove this doctor?')) {
      setVerifiedDoctors(verifiedDoctors.filter((d) => d.id !== docId));
      alert(locale === 'hi' ? 'डॉक्टर सस्पेंड / हटा दिया गया।' : 'Doctor suspended / removed.');
    }
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-new-${Date.now()}`,
      fullName: newDoctor.fullName,
      email: newDoctor.email,
      mobile: newDoctor.mobile,
      qualification: newDoctor.qualification,
      specialization_en: newDoctor.specialization,
      specialization_hi: newDoctor.specialization,
      experienceYears: parseInt(newDoctor.experienceYears) || 0,
      consultationFee: parseInt(newDoctor.consultationFee) || 300,
      bio_en: newDoctor.bio,
      bio_hi: newDoctor.bio,
      verificationStatus: 'VERIFIED' as const,
      photoUrl: null,
    };
    setVerifiedDoctors([...verifiedDoctors, newDoc]);
    setAddDoctorModal(false);
    setNewDoctor({ fullName: '', email: '', mobile: '', qualification: '', specialization: '', experienceYears: '', consultationFee: '', bio: '' });
    alert(locale === 'hi' ? 'नया डॉक्टर जोड़ा गया!' : 'New doctor added successfully!');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffList([...staffList, { role: newStaff.role, email: newStaff.email, mobile: newStaff.mobile, name: newStaff.name }]);
    setAddStaffModal(false);
    setNewStaff({ name: '', email: '', mobile: '', role: 'RECEPTION' });
    alert(locale === 'hi' ? 'नया स्टाफ सदस्य जोड़ा गया!' : 'New staff member added!');
  };

  const handleDeleteStaff = (email: string) => {
    if (confirm(locale === 'hi' ? 'स्टाफ सदस्य हटाएं?' : 'Remove staff member?')) {
      setStaffList(staffList.filter((s) => s.email !== email));
    }
  };

  const filteredDoctors = verifiedDoctors.filter((d) =>
    d.fullName.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.specialization_en.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'OVERVIEW', label: locale === 'hi' ? 'अवलोकन' : 'Overview', icon: Activity },
    { id: 'DOCTORS', label: locale === 'hi' ? 'डॉक्टर प्रबंधन' : 'Doctor Mgmt', icon: Users },
    { id: 'STAFF', label: locale === 'hi' ? 'स्टाफ प्रबंधन' : 'Staff Mgmt', icon: UserCheck },
    { id: 'SERVICES', label: locale === 'hi' ? 'सेवाएं' : 'Services', icon: Stethoscope },
    { id: 'APPOINTMENTS', label: locale === 'hi' ? 'अपॉइंटमेंट' : 'Appointments', icon: Calendar },
    { id: 'EMERGENCY', label: locale === 'hi' ? 'आपातकालीन' : 'Emergency', icon: AlertTriangle },
    { id: 'HOSPITAL', label: locale === 'hi' ? 'अस्पताल सेटिंग्स' : 'Hospital Settings', icon: Building },
    { id: 'REPORTS', label: locale === 'hi' ? 'रिपोर्ट' : 'Reports', icon: BarChart3 },
  ];

  const statusColor: Record<string, string> = {
    BOOKED: 'bg-blue-100 text-blue-800',
    CHECKED_IN: 'bg-cyan-100 text-cyan-800',
    WAITING: 'bg-amber-100 text-amber-800',
    IN_CONSULTATION: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    NO_SHOW: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="bg-primary-dark text-white p-5 rounded-2xl shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-l-8 border-accent">
        <div>
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">{locale === 'hi' ? 'अस्पताल प्रशासन कंसोल' : 'Hospital Administration Console'}</span>
          <h1 className="text-xl font-extrabold">{locale === 'hi' ? 'ओनर / एडमिन डैशबोर्ड' : 'Owner / Admin Dashboard'}</h1>
          <p className="text-[11px] text-gray-300 mt-0.5">Prayag Eye Care & Laser Centre</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => alert('Exporting CSV...')} className="bg-accent hover:bg-teal-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center shadow transition">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Export CSV
          </button>
          <Link href={`/${locale}/auth/login`} className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center transition">
            <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
          </Link>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
              activeTab === id
                ? 'bg-primary text-white border-primary shadow'
                : 'bg-white text-hospitalText border-gray-200 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════ OVERVIEW TAB ══════════ */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="surface-card p-4 rounded-xl shadow border-l-4 border-amber-500"><span className="text-[11px] text-mutedText font-semibold block">{locale === 'hi' ? 'लंबित डॉक्टर आवेदन' : 'Pending Doctor Requests'}</span><div className="text-2xl font-extrabold text-amber-600">{pendingDoctors.length}</div></div>
            <div className="surface-card p-4 rounded-xl shadow border-l-4 border-emerald-500"><span className="text-[11px] text-mutedText font-semibold block">{locale === 'hi' ? 'सक्रिय डॉक्टर' : 'Active Doctors'}</span><div className="text-2xl font-extrabold text-emerald-600">{verifiedDoctors.length}</div></div>
            <div className="surface-card p-4 rounded-xl shadow border-l-4 border-primary"><span className="text-[11px] text-mutedText font-semibold block">{locale === 'hi' ? 'आज के अपॉइंटमेंट' : "Today's Appointments"}</span><div className="text-2xl font-extrabold text-primary">{appointments.length}</div></div>
            <div className="surface-card p-4 rounded-xl shadow border-l-4 border-emergency"><span className="text-[11px] text-mutedText font-semibold block">{locale === 'hi' ? 'आपातकालीन अलर्ट' : 'Emergency Alerts'}</span><div className="text-2xl font-extrabold text-emergency">{emergencyAlerts.filter(e => e.status === 'NEW').length}</div></div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onClick={() => setActiveTab('DOCTORS')} className="surface-card p-4 rounded-xl shadow hover:shadow-lg transition text-center space-y-2 border border-hospitalBorder">
              <Users className="w-6 h-6 text-primary mx-auto" />
              <span className="text-xs font-bold text-primary-dark block">{locale === 'hi' ? 'डॉक्टर प्रबंधन' : 'Manage Doctors'}</span>
            </button>
            <button onClick={() => setActiveTab('STAFF')} className="surface-card p-4 rounded-xl shadow hover:shadow-lg transition text-center space-y-2 border border-hospitalBorder">
              <UserCheck className="w-6 h-6 text-accent mx-auto" />
              <span className="text-xs font-bold text-primary-dark block">{locale === 'hi' ? 'स्टाफ प्रबंधन' : 'Manage Staff'}</span>
            </button>
            <button onClick={() => setActiveTab('APPOINTMENTS')} className="surface-card p-4 rounded-xl shadow hover:shadow-lg transition text-center space-y-2 border border-hospitalBorder">
              <Calendar className="w-6 h-6 text-amber-600 mx-auto" />
              <span className="text-xs font-bold text-primary-dark block">{locale === 'hi' ? 'अपॉइंटमेंट देखें' : 'View Appointments'}</span>
            </button>
            <button onClick={() => setActiveTab('EMERGENCY')} className="surface-card p-4 rounded-xl shadow hover:shadow-lg transition text-center space-y-2 border border-hospitalBorder">
              <AlertTriangle className="w-6 h-6 text-emergency mx-auto" />
              <span className="text-xs font-bold text-primary-dark block">{locale === 'hi' ? 'आपातकालीन' : 'Emergency Center'}</span>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder">
            <h3 className="font-bold text-sm text-primary-dark mb-3 flex items-center"><Clock className="w-4 h-4 mr-2 text-accent" />{locale === 'hi' ? 'हाल की गतिविधियां' : 'Recent Activity'}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 py-2 border-b border-gray-100"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Dr. Suresh completed consultation for Token A-012 (Ramesh Gupta)</span><span className="ml-auto text-mutedText shrink-0">10 min ago</span></div>
              <div className="flex items-center gap-2 py-2 border-b border-gray-100"><AlertTriangle className="w-3.5 h-3.5 text-emergency shrink-0" /><span className="text-emergency font-bold">Emergency Request: Chemical Splash — Anil Kumar</span><span className="ml-auto text-mutedText shrink-0">5 min ago</span></div>
              <div className="flex items-center gap-2 py-2 border-b border-gray-100"><UserPlus className="w-3.5 h-3.5 text-primary shrink-0" /><span>New doctor registration: Dr. Amit Vikram Roy (Cornea Specialist)</span><span className="ml-auto text-mutedText shrink-0">1 hr ago</span></div>
              <div className="flex items-center gap-2 py-2"><Bell className="w-3.5 h-3.5 text-amber-500 shrink-0" /><span>Walk-in patient Mohan Lal checked in via Reception</span><span className="ml-auto text-mutedText shrink-0">25 min ago</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DOCTORS TAB ══════════ */}
      {activeTab === 'DOCTORS' && (
        <div className="space-y-6">
          {/* Pending Requests */}
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-primary-dark flex items-center"><UserCheck className="w-5 h-5 mr-2 text-accent" />{locale === 'hi' ? `लंबित डॉक्टर आवेदन (${pendingDoctors.length})` : `Pending Doctor Requests (${pendingDoctors.length})`}</h2>
              <button onClick={() => setAddDoctorModal(true)} className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow transition">
                <PlusCircle className="w-3.5 h-3.5 mr-1" />{locale === 'hi' ? 'नया डॉक्टर जोड़ें' : 'Add Doctor'}
              </button>
            </div>
            {pendingDoctors.length === 0 ? (
              <div className="p-5 text-center text-xs text-mutedText bg-hospitalBg rounded-xl">{locale === 'hi' ? 'कोई लंबित आवेदन नहीं।' : 'No pending requests.'}</div>
            ) : (
              <div className="space-y-3">
                {pendingDoctors.map((doc) => (
                  <div key={doc.id} className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2"><span className="font-bold text-sm text-primary-dark">{doc.fullName}</span><span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">PENDING</span></div>
                      <p className="text-xs text-mutedText mt-0.5">{doc.qualification} • {locale === 'hi' ? doc.specialization_hi : doc.specialization_en} • {doc.experienceYears} yrs</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{doc.email} | {doc.mobile}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleConfirmDoctor(doc.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center shadow"><CheckCircle className="w-3.5 h-3.5 mr-1" />{locale === 'hi' ? 'स्वीकार' : 'Approve'}</button>
                      <button onClick={() => setDeclineModalDoc(doc)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center shadow"><XCircle className="w-3.5 h-3.5 mr-1" />{locale === 'hi' ? 'अस्वीकार' : 'Decline'}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Doctors List */}
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-primary-dark flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" />{locale === 'hi' ? `सक्रिय डॉक्टर (${verifiedDoctors.length})` : `Active Doctors (${verifiedDoctors.length})`}</h2>
              <div className="relative w-full sm:w-64">
                <input type="text" value={doctorSearch} onChange={(e) => setDoctorSearch(e.target.value)} placeholder={locale === 'hi' ? 'डॉक्टर खोजें...' : 'Search doctors...'} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-primary" />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-primary-dark">{doc.fullName}</h3>
                      <span className="text-[11px] text-accent font-semibold">{locale === 'hi' ? doc.specialization_hi : doc.specialization_en}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-mutedText">{doc.qualification} • {doc.experienceYears} yrs • Fee: ₹{doc.consultationFee}</p>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => alert('Edit doctor profile')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-hospitalText font-bold py-1.5 rounded-lg text-[11px] flex justify-center items-center transition"><Edit className="w-3 h-3 mr-1" />{locale === 'hi' ? 'संपादित' : 'Edit'}</button>
                    <button onClick={() => handleDeleteDoctor(doc.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-1.5 rounded-lg text-[11px] flex justify-center items-center transition"><Trash2 className="w-3 h-3 mr-1" />{locale === 'hi' ? 'सस्पेंड' : 'Suspend'}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ══════════ STAFF TAB ══════════ */}
      {activeTab === 'STAFF' && (
        <div className="space-y-6">
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-primary-dark flex items-center"><Users className="w-5 h-5 mr-2 text-primary" />{locale === 'hi' ? 'स्टाफ सदस्य प्रबंधन' : 'Staff Members Management'}</h2>
              <button onClick={() => setAddStaffModal(true)} className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow"><PlusCircle className="w-3.5 h-3.5 mr-1" />{locale === 'hi' ? 'स्टाफ जोड़ें' : 'Add Staff'}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-hospitalBg text-mutedText font-bold"><th className="text-left p-3 rounded-l-lg">{locale === 'hi' ? 'नाम' : 'Name'}</th><th className="text-left p-3">{locale === 'hi' ? 'रोल' : 'Role'}</th><th className="text-left p-3">Email</th><th className="text-left p-3">Mobile</th><th className="text-center p-3 rounded-r-lg">{locale === 'hi' ? 'कार्रवाई' : 'Actions'}</th></tr></thead>
                <tbody>
                  {staffList.map((staff, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-primary-dark">{staff.name}</td>
                      <td className="p-3"><span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full text-[11px]">{staff.role}</span></td>
                      <td className="p-3 text-mutedText">{staff.email}</td>
                      <td className="p-3 text-mutedText">{staff.mobile}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => alert('Reset password')} className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition" title="Reset Password"><Lock className="w-3.5 h-3.5 text-gray-600" /></button>
                          <button onClick={() => handleDeleteStaff(staff.email)} className="bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition" title="Remove"><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ══════════ SERVICES TAB ══════════ */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-6">
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-primary-dark flex items-center"><Stethoscope className="w-5 h-5 mr-2 text-primary" />{locale === 'hi' ? 'सेवाएं एवं शुल्क प्रबंधन' : 'Services & Fee Management'}</h2>
              <button onClick={() => alert('Add new service form')} className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow"><PlusCircle className="w-3.5 h-3.5 mr-1" />{locale === 'hi' ? 'सेवा जोड़ें' : 'Add Service'}</button>
            </div>
            <div className="space-y-3">
              {services.map((srv) => (
                <div key={srv.id} className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-primary-dark">{locale === 'hi' ? srv.name_hi : srv.name_en}</h3>
                    <p className="text-[11px] text-mutedText mt-0.5">{locale === 'hi' ? srv.desc_hi : srv.desc_en}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {srv.problems?.map((p: any) => (<span key={p.id} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.redFlag ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{locale === 'hi' ? p.name_hi : p.name_en}</span>))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-extrabold text-primary-dark text-sm">{srv.defaultFee > 0 ? `₹${srv.defaultFee}` : 'FREE'}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => alert('Edit service')} className="bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center"><Edit className="w-3 h-3 mr-1" />Edit</button>
                      <button onClick={() => alert('Delete service')} className="bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-red-700 flex items-center"><Trash2 className="w-3 h-3 mr-1" />Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ══════════ APPOINTMENTS TAB ══════════ */}
      {activeTab === 'APPOINTMENTS' && (
        <div className="space-y-6">
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-primary-dark flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary" />{locale === 'hi' ? 'आज के अपॉइंटमेंट' : "Today's Appointments"}</h2>
              <span className="text-xs text-mutedText font-semibold">{locale === 'hi' ? '25 सितम्बर 2026' : 'September 25, 2026'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-hospitalBg text-mutedText font-bold"><th className="text-left p-2.5 rounded-l-lg">ID</th><th className="text-left p-2.5">Token</th><th className="text-left p-2.5">{locale === 'hi' ? 'मरीज' : 'Patient'}</th><th className="text-left p-2.5">{locale === 'hi' ? 'डॉक्टर' : 'Doctor'}</th><th className="text-left p-2.5">{locale === 'hi' ? 'सेवा' : 'Service'}</th><th className="text-left p-2.5">{locale === 'hi' ? 'समय' : 'Time'}</th><th className="text-center p-2.5 rounded-r-lg">{locale === 'hi' ? 'स्थिति' : 'Status'}</th></tr></thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2.5 font-mono text-mutedText">{apt.id}</td>
                      <td className="p-2.5 font-extrabold text-primary">{apt.token}</td>
                      <td className="p-2.5 font-semibold text-primary-dark">{apt.patient}</td>
                      <td className="p-2.5 text-mutedText">{apt.doctor}</td>
                      <td className="p-2.5 text-mutedText">{apt.service}</td>
                      <td className="p-2.5 text-mutedText">{apt.time}</td>
                      <td className="p-2.5 text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[apt.status] || 'bg-gray-100 text-gray-700'}`}>{apt.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ══════════ EMERGENCY TAB ══════════ */}
      {activeTab === 'EMERGENCY' && (
        <div className="space-y-6">
          <section className="surface-card p-5 rounded-2xl shadow-card border-2 border-red-200 space-y-4">
            <h2 className="text-base font-bold text-emergency flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />{locale === 'hi' ? 'आपातकालीन अलर्ट सेंटर' : 'Emergency Alert Center'}</h2>
            <div className="space-y-3">
              {emergencyAlerts.map((emr) => (
                <div key={emr.id} className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row justify-between gap-3 ${emr.status === 'NEW' ? 'border-red-400 bg-red-50 animate-pulse' : emr.status === 'ACKNOWLEDGED' ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-primary-dark">{emr.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emr.aiSeverity === 'HIGH' ? 'bg-red-600 text-white' : emr.aiSeverity === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-yellow-200 text-yellow-800'}`}>{emr.aiSeverity || 'UNRATED'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emr.status === 'NEW' ? 'bg-red-100 text-red-800' : emr.status === 'ACKNOWLEDGED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{emr.status}</span>
                    </div>
                    <p className="text-xs text-hospitalText font-semibold mt-1">{emr.problem}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-mutedText">
                      <a href={`tel:${emr.mobile.replace(/\s/g, '')}`} className="text-primary font-bold hover:underline flex items-center"><Phone className="w-3 h-3 mr-0.5" />{emr.mobile}</a>
                      <span><Clock className="w-3 h-3 inline mr-0.5" />{new Date(emr.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {emr.status === 'NEW' && <button onClick={() => handleUpdateEmergencyStatus(emr.id, 'ACKNOWLEDGED')} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow">Acknowledge</button>}
                    {(emr.status === 'NEW' || emr.status === 'ACKNOWLEDGED') && <button onClick={() => handleUpdateEmergencyStatus(emr.id, 'CONTACTED')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow">Mark Contacted</button>}
                    <button onClick={() => alert(JSON.stringify(emr, null, 2))} className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-xs font-bold">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ══════════ HOSPITAL SETTINGS TAB ══════════ */}
      {activeTab === 'HOSPITAL' && (
        <div className="space-y-6">
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <h2 className="text-base font-bold text-primary-dark flex items-center"><Building className="w-5 h-5 mr-2 text-primary" />{locale === 'hi' ? 'अस्पताल सूचना एवं सेटिंग्स' : 'Hospital Information & Settings'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Hospital Name (EN)</label><input type="text" value={hospitalSettings.name_en} onChange={(e) => setHospitalSettings({ ...hospitalSettings, name_en: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Hospital Name (HI)</label><input type="text" value={hospitalSettings.name_hi} onChange={(e) => setHospitalSettings({ ...hospitalSettings, name_hi: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Address</label><input type="text" value={hospitalSettings.address_en} onChange={(e) => setHospitalSettings({ ...hospitalSettings, address_en: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Email</label><input type="email" value={hospitalSettings.email} onChange={(e) => setHospitalSettings({ ...hospitalSettings, email: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Phone 1</label><input type="tel" value={hospitalSettings.phone1} onChange={(e) => setHospitalSettings({ ...hospitalSettings, phone1: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Phone 2</label><input type="tel" value={hospitalSettings.phone2} onChange={(e) => setHospitalSettings({ ...hospitalSettings, phone2: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div><label className="text-[11px] font-bold text-mutedText block mb-1">Emergency Phone</label><input type="tel" value={hospitalSettings.emergencyPhone} onChange={(e) => setHospitalSettings({ ...hospitalSettings, emergencyPhone: e.target.value })} disabled={isLoadingSettings} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div className="flex items-center gap-2 pt-3">
                  <input type="checkbox" checked={hospitalSettings.emergency24x7} onChange={(e) => setHospitalSettings({ ...hospitalSettings, emergency24x7: e.target.checked })} disabled={isLoadingSettings} className="w-4 h-4 accent-primary" />
                  <label className="text-xs font-bold text-primary-dark">{locale === 'hi' ? '24x7 आपातकालीन सेवा सक्रिय' : '24x7 Emergency Service Active'}</label>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button onClick={handleSaveHospitalSettings} className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow transition">{locale === 'hi' ? 'सेटिंग्स सहेजें' : 'Save Settings'}</button>
            </div>
          </section>
        </div>
      )}

      {/* ══════════ REPORTS TAB ══════════ */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          <section className="surface-card p-5 rounded-2xl shadow-card border border-hospitalBorder space-y-4">
            <h2 className="text-base font-bold text-primary-dark flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-primary" />{locale === 'hi' ? 'परिचालन रिपोर्ट (Non-Revenue)' : 'Operational Reports (Non-Revenue)'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: locale === 'hi' ? 'मरीज रिपोर्ट (दैनिक/साप्ताहिक)' : 'Patient Report (Daily/Weekly)', desc: 'Total patients by date, service, doctor' },
                { title: locale === 'hi' ? 'डॉक्टर उपयोग रिपोर्ट' : 'Doctor Utilization Report', desc: 'Patients per doctor, avg consultation time' },
                { title: locale === 'hi' ? 'प्रतीक्षा समय रिपोर्ट' : 'Wait Time Analysis', desc: 'Avg wait time, peak hours heatmap' },
                { title: locale === 'hi' ? 'नो-शो / रद्द रिपोर्ट' : 'No-Show & Cancellation Report', desc: 'No-show rate, cancellation patterns' },
                { title: locale === 'hi' ? 'आपातकालीन प्रतिक्रिया रिपोर्ट' : 'Emergency Response Time', desc: 'SLA compliance, response duration' },
                { title: locale === 'hi' ? 'ऑप्टिकल / फार्मेसी रिपोर्ट' : 'Optical & Pharmacy Report', desc: 'Requests by status, turnaround time' },
              ].map((report, i) => (
                <button key={i} onClick={() => alert(`Generating: ${report.title}`)} className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition space-y-1.5">
                  <h3 className="font-bold text-xs text-primary-dark">{report.title}</h3>
                  <p className="text-[11px] text-mutedText">{report.desc}</p>
                  <span className="text-[10px] font-bold text-primary flex items-center mt-1"><FileSpreadsheet className="w-3 h-3 mr-1" />Generate CSV / PDF</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ══════════ ADD DOCTOR MODAL ══════════ */}
      {addDoctorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-primary-dark">{locale === 'hi' ? 'नया डॉक्टर जोड़ें' : 'Add New Doctor'}</h3>
            <form onSubmit={handleAddDoctor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'पूरा नाम *' : 'Full Name *'}</label><input required value={newDoctor.fullName} onChange={(e) => setNewDoctor({...newDoctor, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
                <div><label className="text-[11px] font-bold block mb-1">Mobile *</label><input required value={newDoctor.mobile} onChange={(e) => setNewDoctor({...newDoctor, mobile: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              </div>
              <div><label className="text-[11px] font-bold block mb-1">Email *</label><input required type="email" value={newDoctor.email} onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'योग्यता *' : 'Qualification *'}</label><input required value={newDoctor.qualification} onChange={(e) => setNewDoctor({...newDoctor, qualification: e.target.value})} placeholder="MBBS, MS (Ophthalmology)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'विशेषज्ञता *' : 'Specialization *'}</label><select required value={newDoctor.specialization} onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none">
                  <option value="">Select...</option>
                  {specializations.map((s) => <option key={s.id} value={s.name_en}>{locale === 'hi' ? s.name_hi : s.name_en}</option>)}
                </select></div>
                <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (yrs)'}</label><input type="number" value={newDoctor.experienceYears} onChange={(e) => setNewDoctor({...newDoctor, experienceYears: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              </div>
              <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'परामर्श शुल्क ₹' : 'Consultation Fee ₹'}</label><input type="number" value={newDoctor.consultationFee} onChange={(e) => setNewDoctor({...newDoctor, consultationFee: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold block mb-1">Bio</label><textarea rows={2} value={newDoctor.bio} onChange={(e) => setNewDoctor({...newDoctor, bio: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none resize-none" /></div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-xl text-xs font-bold shadow">{locale === 'hi' ? 'डॉक्टर जोड़ें' : 'Add Doctor'}</button>
                <button type="button" onClick={() => setAddDoctorModal(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-xs font-bold">{locale === 'hi' ? 'रद्द करें' : 'Cancel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ ADD STAFF MODAL ══════════ */}
      {addStaffModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-primary-dark">{locale === 'hi' ? 'नया स्टाफ सदस्य जोड़ें' : 'Add New Staff Member'}</h3>
            <form onSubmit={handleAddStaff} className="space-y-3">
              <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'नाम *' : 'Name *'}</label><input required value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold block mb-1">{locale === 'hi' ? 'रोल *' : 'Role *'}</label>
                <select required value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none">
                  <option value="RECEPTION">Reception & Front Desk</option>
                  <option value="OPTOMETRIST">Optometrist / Eye Technician</option>
                  <option value="PHARMACY">Pharmacy Staff</option>
                  <option value="OPTICAL">Optical (Chashma Ghar) Staff</option>
                  <option value="OT">Surgery & OT Staff</option>
                </select>
              </div>
              <div><label className="text-[11px] font-bold block mb-1">Email *</label><input required type="email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold block mb-1">Mobile *</label><input required value={newStaff.mobile} onChange={(e) => setNewStaff({...newStaff, mobile: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-primary focus:outline-none" /></div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-xl text-xs font-bold shadow">{locale === 'hi' ? 'स्टाफ जोड़ें' : 'Add Staff'}</button>
                <button type="button" onClick={() => setAddStaffModal(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-xs font-bold">{locale === 'hi' ? 'रद्द करें' : 'Cancel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ DECLINE DOCTOR MODAL ══════════ */}
      {declineModalDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-primary-dark">{locale === 'hi' ? 'डॉक्टर आवेदन अस्वीकार करें' : 'Decline Doctor Request'}: {declineModalDoc.fullName}</h3>
            <div><label className="text-xs font-bold block mb-1">{locale === 'hi' ? 'अस्वीकार का कारण (वैकल्पिक)' : 'Reason for Decline (Optional)'}</label>
              <textarea rows={3} value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} placeholder={locale === 'hi' ? 'कारण लिखें...' : 'Enter reason...'} className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleDeclineDoctor} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold shadow">{locale === 'hi' ? 'अस्वीकार करें' : 'Confirm Decline'}</button>
              <button onClick={() => setDeclineModalDoc(null)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-xs font-bold">{locale === 'hi' ? 'रद्द करें' : 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
