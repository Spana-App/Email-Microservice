// Load environment variables
require('dotenv').config();

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

// Initialize nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is missing');
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
function verifyApiSecret(req: VercelRequest | Request): boolean {
  const apiSecret = process.env.API_SECRET;
  if (!apiSecret || apiSecret.trim() === '') {
    console.warn('[Email Service] API_SECRET not set - allowing all requests (development mode)');
    return true; // Allow if not set (for development)
  }

  const providedSecret = (req as any).headers?.['x-api-secret'] || (req as any).body?.apiSecret;
  return providedSecret === apiSecret;
}

export default async function handler(
  req: VercelRequest | Request,
  res: VercelResponse | Response,
) {
  if (req.method !== 'POST') {
    return (res as any).status(405).json({ message: 'Method not allowed' });
  }

  // Verify API secret (optional for development if not set)
  const envSecret = process.env.API_SECRET;
  if (envSecret && envSecret.trim() !== '') {
    if (!verifyApiSecret(req)) {
      return (res as any).status(401).json({ message: 'Unauthorized - Invalid API secret' });
    }
  }

  try {
    const { to, subject, text, html, from, type } = (req as any).body;

    if (!to || !subject) {
      return (res as any).status(400).json({ 
        message: 'Missing required fields: to, subject',
        required: ['to', 'subject']
      });
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

    console.log(`[Email Service] Email sent successfully: ${type || 'generic'} to ${to}`);

    return (res as any).status(200).json({
      success: true,
      messageId: result.messageId,
      type: type || 'generic',
      to,
      subject,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Email Service] Error sending email:', error);
    return (res as any).status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
      code: error.code
    });
  }
}
