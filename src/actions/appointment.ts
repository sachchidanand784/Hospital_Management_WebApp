'use server';

import { prisma } from '@/lib/prisma';
import { allocateToken } from '@backend/engines/token-engine';
import { calculateETAWindow } from '@backend/engines/eta-engine';

export async function sendEmailOtp(email: string) {
  // Mock sending OTP via email
  console.log(`[Email OTP] Sending OTP 123456 to ${email}`);
  // In a real app, use Nodemailer, Resend, SendGrid, etc.
  return { success: true };
}

export async function bookAppointment(data: {
  serviceId: string;
  problemId: string;
  doctorId: string;
  doctorPreference: string;
  date: string;
  slotStart: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientMobile: string;
  patientEmail: string;
}) {
  try {
    // 1. Find or create patient
    let patient = await prisma.patient.findFirst({
      where: { mobile: data.patientMobile }
    });

    if (!patient) {
      const count = await prisma.patient.count();
      const uhid = `PRY-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
      patient = await prisma.patient.create({
        data: {
          uhid,
          name: data.patientName,
          age: parseInt(data.patientAge) || 0,
          gender: data.patientGender,
          mobile: data.patientMobile,
          email: data.patientEmail,
        }
      });
    }

    // 2. Generate Appointment Code
    const appointmentCode = `PRY-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Allocate token (Using a mock allocation logic via token-engine for demo)
    const tokenRes = allocateToken({
      prefix: 'A',
      lastSeq: Math.floor(Math.random() * 20),
      slotIndex: 2,
      capacityPerSlot: 3,
    });

    // 4. Calculate ETA
    const eta = calculateETAWindow({
      patientsAhead: 3,
      avgConsultMin: 15,
      currentTime: new Date(),
    });

    // 5. Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        appointmentCode,
        patientId: patient.id,
        serviceId: data.serviceId,
        problemId: data.problemId || null,
        doctorId: data.doctorPreference === 'SPECIFIC' ? data.doctorId : null,
        type: data.doctorPreference,
        date: new Date(data.date),
        slotStart: data.slotStart,
        slotEnd: '17:00', // Mock end
        tokenSeq: parseInt(tokenRes.tokenLabel.split('-')[1]) || 1,
        tokenLabel: tokenRes.tokenLabel,
        status: 'BOOKED'
      }
    });

    return { 
      success: true, 
      appointmentCode, 
      allocatedToken: tokenRes.tokenLabel,
      etaResult: eta 
    };
  } catch (error) {
    console.error('Failed to book appointment:', error);
    return { success: false, error: 'Failed to book appointment' };
  }
}
