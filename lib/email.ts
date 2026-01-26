// Load environment variables
require('dotenv').config();

import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Initialize nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS');
  }

  // Enhanced configuration for KonsoleH/cPanel webmail
  // Try different authentication methods based on environment
  const authMethod = process.env.SMTP_AUTH_METHOD || 'PLAIN'; // PLAIN, LOGIN, or AUTO
  
  // Try username without domain if SMTP_USER_NO_DOMAIN is set
  const authUser = process.env.SMTP_USER_NO_DOMAIN === 'true' 
    ? user.split('@')[0] 
    : user;

  const transporterConfig: any = {
    host,
    port,
    secure, // true for 465, false for other ports
    auth: {
      user: authUser,
      pass,
      // Some servers need explicit method
      method: authMethod === 'LOGIN' ? 'LOGIN' : undefined,
    },
    requireTLS: !secure, // Use STARTTLS for non-SSL ports
    connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 5000,
    // TLS options for better compatibility with custom domains
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false', // Allow self-signed certs if needed
      // Note: Removed ciphers restriction - let Node.js negotiate best cipher
    },
    // Debug mode (set SMTP_DEBUG=true in .env to enable)
    debug: process.env.SMTP_DEBUG === 'true',
    logger: process.env.SMTP_DEBUG === 'true',
  };

  return nodemailer.createTransport(transporterConfig);
}

// Initialize Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(apiKey);
}

// Check if Resend is configured
export function isResendEnabled(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Verify SMTP connection
export async function verifySMTPConnection(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('[Email Service] ✅ SMTP connection verified successfully');
    return true;
  } catch (error: any) {
    // Only log SMTP errors if Resend is not enabled (SMTP is primary)
    if (!isResendEnabled()) {
      console.error('[Email Service] ❌ SMTP connection failed:', error.message);
    }
    // Otherwise, silently fail (SMTP is just a fallback)
    return false;
  }
}

// Cache Resend verification result to avoid excessive API calls
let resendVerificationCache: { verified: boolean; timestamp: number } | null = null;
const RESEND_VERIFICATION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Verify Resend connection (cached to avoid excessive API calls)
export async function verifyResendConnection(): Promise<boolean> {
  try {
    if (!isResendEnabled()) {
      return false;
    }

    // Check cache first
    const now = Date.now();
    if (resendVerificationCache && (now - resendVerificationCache.timestamp) < RESEND_VERIFICATION_CACHE_TTL) {
      return resendVerificationCache.verified;
    }

    const resend = getResendClient();
    // Resend doesn't have a verify method, but we can check if API key is valid
    // by attempting to list domains (lightweight check)
    // If this fails, the API key might still be valid but without domain permissions
    let verified = true;
    try {
      await resend.domains.list();
      // Only log on first verification or cache refresh
      if (!resendVerificationCache) {
        console.log('[Email Service] ✅ Resend API key verified successfully');
      }
    } catch (domainError: any) {
      // API key might be valid but without domain list permissions
      // This is okay - we'll know for sure when we try to send an email
      verified = true; // Assume valid, will fail on actual email send if not
      if (!resendVerificationCache) {
        console.log('[Email Service] ⚠️ Resend API key found (domain check skipped)');
      }
    }

    // Cache the result
    resendVerificationCache = {
      verified,
      timestamp: now
    };

    return verified;
  } catch (error: any) {
    console.error('[Email Service] ❌ Resend verification failed:', error.message);
    // Cache failure for shorter time (1 minute)
    const now = Date.now();
    resendVerificationCache = {
      verified: false,
      timestamp: now
    };
    return false;
  }
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

  // Prioritize SMTP (Gmail) - try SMTP first
  const hasSMTPConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  
  if (hasSMTPConfig) {
    try {
      // For SMTP, use SMTP_FROM
      const defaultFrom = process.env.SMTP_FROM || from || process.env.SMTP_USER || 'noreply@spana.co.za';
      const senderEmail = from || defaultFrom;
      
      console.log(`[Email Service] Sending via SMTP (Gmail): ${type} to ${to}`);
      const transporter = getTransporter();
      
      const mailOptions = {
        from: senderEmail,
        to,
        subject,
        text,
        html,
      };

      const result = await transporter.sendMail(mailOptions);

      console.log(`[Email Service] ✅ Email sent successfully via SMTP: ${type} to ${to}`);
      console.log(`[Email Service] 📧 Message ID: ${result.messageId}`);
      console.log(`[Email Service] 📬 From: ${senderEmail}`);

      return {
        success: true,
        messageId: result.messageId,
        type,
        to,
        subject,
        timestamp: new Date().toISOString(),
        provider: 'smtp'
      };
    } catch (error: any) {
      console.error(`[Email Service] ❌ SMTP failed: ${error.message}`);
      // Fall back to Resend if SMTP fails
      if (isResendEnabled()) {
        console.log(`[Email Service] Falling back to Resend...`);
      } else {
        throw new Error(`Failed to send email: ${error.message}`);
      }
    }
  }

  // Fall back to Resend if SMTP is not configured or failed
  if (isResendEnabled()) {
    // For Resend, prioritize RESEND_FROM over SMTP_FROM
    const defaultFrom = process.env.RESEND_FROM || process.env.SMTP_FROM || from || 'onboarding@resend.dev';
    const senderEmail = from || defaultFrom;
    try {
      console.log(`[Email Service] Sending via Resend: ${type} to ${to}`);
      const resend = getResendClient();
      
      const result = await resend.emails.send({
        from: senderEmail,
        to,
        subject,
        text: text || undefined,
        html: html || undefined,
      });

      const emailId = result.data?.id || result.id || 'unknown';
      console.log(`[Email Service] ✅ Email sent successfully via Resend: ${type} to ${to}`);
      console.log(`[Email Service] 📧 Resend Email ID: ${emailId}`);
      console.log(`[Email Service] 📬 From: ${senderEmail}`);
      if (emailId !== 'unknown') {
        console.log(`[Email Service] 🔗 Check delivery: https://resend.com/emails/${emailId}`);
      }

      return {
        success: true,
        messageId: result.data?.id || 'unknown',
        type,
        to,
        subject,
        timestamp: new Date().toISOString(),
        provider: 'resend'
      };
    } catch (error: any) {
      console.error(`[Email Service] ❌ Resend failed: ${error.message}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // If neither SMTP nor Resend is configured
  throw new Error('No email provider configured. Please set SMTP credentials or RESEND_API_KEY');
}
