import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email using the configured SMTP server.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not set. Email not sent:", subject);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Prayag Eye Care" <noreply@prayageyecare.com>',
      to,
      subject,
      html,
    });
    console.log('✅ Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

// ==========================================
// PRE-DEFINED EMAIL TEMPLATES
// ==========================================

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #0b5cff;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password for Prayag Eye Hospital. Click the button below to set a new password:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0b5cff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Reset Your Password - Prayag Eye Care', html });
}

export async function sendDoctorVerificationEmail(email: string, doctorName: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2E9E6B;">Account Verified!</h2>
      <p>Dear Dr. ${doctorName},</p>
      <p>Your account at Prayag Eye Hospital has been successfully verified by the administrator.</p>
      <p>You can now log in to the dashboard to manage your appointments and schedule.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Account Verified - Prayag Eye Care', html });
}

export async function sendAppointmentConfirmationEmail(email: string, patientName: string, date: string, time: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #0b5cff;">Appointment Confirmed</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment at Prayag Eye Hospital is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.</p>
      <p>Please arrive 10 minutes before your scheduled time.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Appointment Confirmed - Prayag Eye Care', html });
}
