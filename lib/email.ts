// Load environment variables
require('dotenv').config();

import nodemailer from 'nodemailer';

// Initialize nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure,
    connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 5000,
  });
}

// Verify API secret
export function verifyApiSecret(apiSecret?: string): boolean {
  const envSecret = process.env.API_SECRET;
  if (!envSecret || envSecret.trim() === '') {
    console.warn('[Email Service] API_SECRET not set - allowing all requests (development mode)');
    return true; // Allow if not set (for development)
  }

  return apiSecret === envSecret;
}

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  type?: string;
  apiSecret?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from,
  type = 'generic',
  apiSecret
}: SendEmailParams) {
  // Verify API secret if provided and API_SECRET is set
  const envSecret = process.env.API_SECRET;
  if (envSecret && envSecret.trim() !== '' && apiSecret && !verifyApiSecret(apiSecret)) {
    throw new Error('Unauthorized - Invalid API secret');
  }

  const transporter = getTransporter();
  const defaultFrom = process.env.SMTP_FROM || from || 'noreply@spana.co.za';

  const mailOptions = {
    from: from || defaultFrom,
    to,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);

  console.log(`[Email Service] Email sent successfully: ${type} to ${to}`);

  return {
    success: true,
    messageId: result.messageId,
    type,
    to,
    subject,
    timestamp: new Date().toISOString()
  };
}
