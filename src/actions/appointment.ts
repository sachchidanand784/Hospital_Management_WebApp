'use server';

import { prisma } from '@/lib/prisma';
import { allocateToken } from '@backend/engines/token-engine';
import { calculateETAWindow } from '@backend/engines/eta-engine';

import nodemailer from 'nodemailer';

export async function sendEmailOtp(email: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || 'Prayag Eye Care <noreply@prayageyecare.com>',
      to: email,
      subject: 'Your Appointment OTP - Prayag Eye Care',
      text: `Hello,\n\nYour OTP for booking an appointment is: 123456\n\nThank you,\nPrayag Eye Care`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0d9488;">Prayag Eye Care</h2>
          <p>Hello,</p>
          <p>Your OTP for booking an appointment is:</p>
          <h1 style="letter-spacing: 5px; color: #0f766e;">123456</h1>
          <p>Please use this OTP to confirm your booking.</p>
          <p>Thank you,<br/>Prayag Eye Care</p>
        </div>
      `,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log(`[Email OTP] Sent real email to ${email}`);
    } else {
      console.log(`[Email OTP] Mock sending OTP 123456 to ${email} (SMTP credentials not set)`);
    }

    return { success: true };
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
