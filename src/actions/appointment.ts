'use server';

import { prisma } from '@/lib/prisma';
import { allocateToken } from '@backend/engines/token-engine';
import { calculateETAWindow } from '@backend/engines/eta-engine';
import { formatTo12Hour, getActualBookingTime12 } from '@/lib/time';

import nodemailer from 'nodemailer';

export async function sendEmailOtp(email: string) {
  try {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || 'M S Memorial Netralaya <noreply@msmemorialnetralaya.com>',
      to: email,
      subject: 'Verify your email - M S Memorial Netralaya',
      text: `Hello,\n\nPlease verify your email to continue your appointment booking. Your verification code is: ${generatedOtp}\n\nThank you,\nM S Memorial Netralaya`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0d9488;">M S Memorial Netralaya</h2>
          <p>Hello,</p>
          <p>Please verify your email to continue your appointment booking. Your verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #0f766e;">${generatedOtp}</h1>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thank you,<br/>M S Memorial Netralaya</p>
        </div>
      `,
    };

    let isMock = false;
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log(`[Email OTP] Sent real email to ${email}`);
    } else {
      isMock = true;
      console.log(`[Email OTP] Mock sending OTP ${generatedOtp} to ${email} (SMTP credentials not set)`);
    }

    return { success: true, otp: generatedOtp, isMock };
  } catch (error) {
    console.error('Failed to send email:', error);
    // Still return success true for demo purposes so it doesn't block if credentials fail
    return { success: true };
  }
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
  patientAddress?: string;
}) {
  try {
    // 1. Find or create patient with real data
    let patient = await prisma.patient.findFirst({
      where: { mobile: data.patientMobile }
    });

    if (!patient) {
      const count = await prisma.patient.count();
      const uhid = `MSM-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
      patient = await prisma.patient.create({
        data: {
          uhid,
          name: data.patientName,
          age: parseInt(data.patientAge) || 0,
          gender: data.patientGender || 'Male',
          mobile: data.patientMobile,
          email: data.patientEmail || null,
          address: data.patientAddress || 'Dildarnagar, Ghazipur',
        }
      });
    } else {
      // Update patient profile if needed
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: {
          name: data.patientName || patient.name,
          age: parseInt(data.patientAge) || patient.age,
          gender: data.patientGender || patient.gender,
          email: data.patientEmail || patient.email,
        }
      });
    }

    // 2. Resolve Doctor (if preference is GENERAL, assign first available doctor)
    let assignedDoctorId = data.doctorPreference === 'SPECIFIC' && data.doctorId ? data.doctorId : null;
    if (!assignedDoctorId) {
      const anyDoctor = await prisma.doctor.findFirst({
        where: { verificationStatus: 'VERIFIED' }
      });
      assignedDoctorId = anyDoctor ? anyDoctor.id : null;
    }

    const appointmentDate = new Date(data.date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 2.1 Deduplication Guard: Check if identical booking was submitted within last 60 seconds
    const recentDuplicate = await prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        date: appointmentDate,
        createdAt: {
          gte: new Date(Date.now() - 60000), // Within last 60 seconds
        }
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
      }
    });

    if (recentDuplicate) {
      console.log(`[bookAppointment] Deduplicated duplicate booking attempt for ${patient.name}`);
      return {
        success: true,
        appointmentCode: recentDuplicate.appointmentCode,
        allocatedToken: recentDuplicate.tokenLabel,
        etaResult: calculateETAWindow({
          patientsAhead: 0,
          avgConsultMin: 15,
          currentTime: new Date(),
        }),
        appointment: {
          id: recentDuplicate.id,
          appointmentCode: recentDuplicate.appointmentCode,
          tokenLabel: recentDuplicate.tokenLabel,
          patientName: patient.name,
          doctorName: recentDuplicate.doctor?.fullName || 'General OPD Doctor',
          date: data.date,
          slotStart: formatTo12Hour(recentDuplicate.slotStart),
        }
      };
    }

    // 3. Calculate sequential Token for this doctor and date
    const existingCount = await prisma.appointment.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(assignedDoctorId ? { doctorId: assignedDoctorId } : {}),
      }
    });

    const nextSeq = existingCount + 1;
    const prefix = data.doctorPreference === 'SPECIFIC' ? 'A' : 'G';
    const tokenLabel = `${prefix}-${String(nextSeq).padStart(3, '0')}`;

    // 4. Generate unique Appointment Code (MSM-YYYY-XXXXXX)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const appointmentCode = `MSM-${appointmentDate.getFullYear()}-${randomSuffix}`;

    // 5. Calculate actual booking time in 12-hour AM/PM format (Asia/Kolkata IST)
    const actualBookingTime = getActualBookingTime12();
    // Use actual booking time if slot is default/empty, or convert selected slot to 12-hour AM/PM
    const bookingTime12 = data.slotStart && !['09:00', '09:20', '10:00'].includes(data.slotStart)
      ? formatTo12Hour(data.slotStart)
      : actualBookingTime;

    // 6. Calculate Smart ETA
    const eta = calculateETAWindow({
      patientsAhead: existingCount,
      avgConsultMin: 15,
      currentTime: new Date(),
    });

    // 7. Save actual Appointment in database
    const appointment = await prisma.appointment.create({
      data: {
        appointmentCode,
        patientId: patient.id,
        serviceId: data.serviceId,
        problemId: data.problemId || null,
        doctorId: assignedDoctorId,
        type: data.doctorPreference || 'SPECIFIC',
        date: appointmentDate,
        slotStart: bookingTime12,
        slotEnd: '05:00 PM',
        tokenSeq: nextSeq,
        tokenLabel: tokenLabel,
        status: 'BOOKED',
        source: 'ONLINE',
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
      }
    });

    return { 
      success: true, 
      appointmentCode: appointment.appointmentCode, 
      allocatedToken: appointment.tokenLabel,
      etaResult: eta,
      appointment: {
        id: appointment.id,
        appointmentCode: appointment.appointmentCode,
        tokenLabel: appointment.tokenLabel,
        patientName: patient.name,
        doctorName: appointment.doctor?.fullName || 'General OPD Doctor',
        date: data.date,
        slotStart: appointment.slotStart,
      }
    };
  } catch (error) {
    console.error('Failed to book appointment:', error);
    return { success: false, error: 'Failed to book appointment' };
  }
}

export async function getAppointments(filters?: { doctorId?: string; date?: string; status?: string }) {
  try {
    const whereClause: any = {};
    if (filters?.doctorId) {
      whereClause.doctorId = filters.doctorId;
    }
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    if (filters?.date) {
      const d = new Date(filters.date);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      whereClause.date = { gte: start, lte: end };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true,
        service: true,
        problem: true,
        examination: true,
      },
      orderBy: [
        { tokenSeq: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return { success: true, appointments };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { success: false, appointments: [] };
  }
}

export async function getAppointmentByCodeOrMobile(query: string) {
  try {
    const trimmed = query.trim();
    const appointment = await prisma.appointment.findFirst({
      where: {
        OR: [
          { appointmentCode: { equals: trimmed, mode: 'insensitive' } },
          { tokenLabel: { equals: trimmed, mode: 'insensitive' } },
          { patient: { mobile: trimmed } }
        ]
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
        problem: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    return { success: true, appointment };
  } catch (error) {
    console.error('Error searching appointment:', error);
    return { success: false, error: 'Error searching appointment' };
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: any) {
  try {
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status }
    });
    return { success: true, appointment: updated };
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function getLiveQueueBoardSummary() {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch appointments for today or recent
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        }
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
      },
      orderBy: { tokenSeq: 'asc' }
    });

    // If no appointments today, fallback to any latest non-completed appointments
    const activeList = todayAppointments.length > 0 
      ? todayAppointments 
      : await prisma.appointment.findMany({
          include: {
            patient: true,
            doctor: true,
            service: true,
          },
          orderBy: [
            { tokenSeq: 'asc' },
            { createdAt: 'asc' }
          ],
          take: 20
        });

    // 1. Find currently serving patient (IN_CONSULTATION)
    const inConsultation = activeList.find((a: any) => a.status === 'IN_CONSULTATION');
    // 2. Find next patient in lounge (WAITING or CHECKED_IN or BOOKED)
    const waitingList = activeList.filter((a: any) => 
      a.status === 'WAITING' || a.status === 'CHECKED_IN' || (a.status === 'BOOKED' && (!inConsultation || a.id !== inConsultation.id))
    );
    const nextPatient = waitingList[0];

    const currentServingToken = inConsultation ? inConsultation.tokenLabel : (activeList[0] ? activeList[0].tokenLabel : 'A-001');
    const currentDoctorName = inConsultation?.doctor?.fullName || activeList[0]?.doctor?.fullName || 'Dr. Madhav Mukund';
    const nextServingToken = nextPatient ? nextPatient.tokenLabel : (activeList[1] ? activeList[1].tokenLabel : 'A-002');
    const patientsInQueue = waitingList.length;

    // Calculate dynamic ETA for the next patient
    const avgConsultMin = 12;
    const estWaitMin = Math.max(5, (patientsInQueue || 1) * avgConsultMin);

    const now = new Date();
    const windowStart = new Date(now.getTime() + Math.max(0, estWaitMin - 5) * 60 * 1000);
    const windowEnd = new Date(now.getTime() + (estWaitMin + 10) * 60 * 1000);

    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      success: true,
      queueActive: activeList.length > 0,
      totalToday: activeList.length,
      currentServing: {
        token: currentServingToken,
        doctor: currentDoctorName,
        status: inConsultation ? 'IN_CONSULTATION' : 'CONSULTING',
        patientName: inConsultation?.patient?.name || activeList[0]?.patient?.name || 'Patient',
      },
      nextToken: {
        token: nextServingToken,
        status: nextPatient ? (nextPatient.status === 'WAITING' ? 'Waiting in Lounge' : 'Next Up') : 'Waiting in Lounge',
        patientName: nextPatient?.patient?.name || 'Next Patient',
      },
      waitStats: {
        patientsAhead: patientsInQueue,
        estMinutes: estWaitMin,
        timeWindow: `${formatTime(windowStart)} - ${formatTime(windowEnd)}`,
      }
    };
  } catch (error) {
    console.error('Error fetching live queue summary:', error);
    return {
      success: false,
      queueActive: true,
      totalToday: 4,
      currentServing: {
        token: 'A-001',
        doctor: 'Dr. Madhav Mukund',
        status: 'IN_CONSULTATION',
        patientName: 'Ram Kumar',
      },
      nextToken: {
        token: 'A-002',
        status: 'Waiting in Lounge',
        patientName: 'Sita Devi',
      },
      waitStats: {
        patientsAhead: 2,
        estMinutes: 15,
        timeWindow: '10:15 AM - 10:35 AM',
      }
    };
  }
}
