'use server';

import { prisma } from '../lib/prisma';
import nodemailer from 'nodemailer';
import { revalidatePath } from 'next/cache';

// Reusable nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function submitEmergencyRequest(data: {
  name: string;
  mobile: string;
  email?: string;
  problem: string;
  description?: string;
}) {
  try {
    // 1. Save to database
    const request = await prisma.emergencyRequest.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email || null,
        problem: data.problem,
        description: data.description || null,
        status: 'NEW',
      },
    });

    // 2. Send Email if email is provided
    if (data.email) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'Prayag Eye Care <noreply@prayageyecare.com>',
          to: data.email,
          subject: 'Emergency Alert Received - Prayag Eye Care',
          html: `
            <h2>Emergency Alert Received</h2>
            <p>Dear ${data.name},</p>
            <p>We have successfully received your emergency alert regarding <strong>${data.problem}</strong>.</p>
            <p>Our medical team has been notified and will contact you immediately at your mobile number: <strong>${data.mobile}</strong>.</p>
            <p>If the situation is critical, please proceed to the nearest hospital immediately.</p>
            <br/>
            <p>Prayag Eye Care Team</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email. (Ensure SMTP variables are correct):', emailError);
        // We don't throw the error, we still want the request to be successful
      }
    }

    revalidatePath('/dashboard/owner');
    return { success: true, request };
  } catch (error) {
    console.error('Failed to submit emergency request:', error);
    return { success: false, error: 'Failed to submit request' };
  }
}

export async function getEmergencyRequests() {
  try {
    const requests = await prisma.emergencyRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, requests };
  } catch (error) {
    console.error('Failed to fetch emergency requests:', error);
    return { success: false, requests: [] };
  }
}

export async function updateEmergencyStatus(id: string, status: string) {
  try {
    await prisma.emergencyRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/dashboard/owner');
    return { success: true };
  } catch (error) {
    console.error('Failed to update emergency status:', error);
    return { success: false };
  }
}
