import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Request, Response } from 'express';
import { isResendEnabled, verifyResendConnection, verifySMTPConnection } from '../lib/email';

// Handler for both Vercel and Express
export default async function handler(
  req: VercelRequest | Request,
  res: VercelResponse | Response,
) {
  if (req.method !== 'GET') {
    return (res as any).status(405).json({ message: 'Method not allowed' });
  }

  const health: any = {
    status: 'healthy',
    service: 'spana-email-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    providers: {}
  };

  // Check SMTP first (primary provider - Gmail)
  const hasSMTPConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (hasSMTPConfig) {
    try {
      const smtpHealthy = await verifySMTPConnection();
      health.providers.smtp = {
        enabled: true,
        status: smtpHealthy ? 'connected' : 'error',
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || '587',
        from: process.env.SMTP_FROM || process.env.SMTP_USER
      };
    } catch (error: any) {
      health.providers.smtp = {
        enabled: true,
        status: 'error',
        error: error.message
      };
    }
  } else {
    health.providers.smtp = { enabled: false };
  }

  // Resend is disabled - using SMTP only
  health.providers.resend = { enabled: false, note: 'Using SMTP only' };

  return (res as any).status(200).json(health);
}
