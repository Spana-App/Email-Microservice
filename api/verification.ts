// Load environment variables
require('dotenv').config();

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Request, Response } from 'express';
import { sendEmail } from '../lib/email';
import { getSpanaLogoHTML } from '../lib/logo';

export default async function handler(
  req: VercelRequest | Request,
  res: VercelResponse | Response,
) {
  if (req.method !== 'POST') {
    return (res as any).status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, name, verificationLink, apiSecret } = (req as any).body;

    if (!to || !verificationLink) {
      return (res as any).status(400).json({ message: 'Missing required fields: to, verificationLink' });
    }

    // Verify API secret (optional for development if not set)
    const envSecret = process.env.API_SECRET;
    if (envSecret && envSecret.trim() !== '' && apiSecret !== envSecret) {
      return (res as any).status(401).json({ message: 'Unauthorized - Invalid API secret' });
    }

    const subject = 'Verify Your Email Address - SPANA';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066CC; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #F5F5F5; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0066CC; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${getSpanaLogoHTML()}
            <div class="header">
              <h1>✨ Verify Your Email</h1>
            </div>
            <div class="content">
              <p style="color: #000000; font-size: 16px;">Hi ${name || 'there'},</p>
              <p style="color: #000000;">Thank you for creating your SPANA account! To ensure the security of your account and enable all features, please verify your email address.</p>
              
              <div style="background: #F5F5F5; border-left: 4px solid #0066CC; padding: 15px; margin: 20px 0;">
                <p style="color: #000000; margin: 0;"><strong>Why verify your email?</strong></p>
                <ul style="color: #000000; margin: 10px 0 0 20px; line-height: 1.6;">
                  <li>Secure your account with email-based authentication</li>
                  <li>Receive important booking updates and notifications</li>
                  <li>Reset your password if needed</li>
                  <li>Get special offers and platform updates</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              
              <p style="color: #000000; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066CC; font-size: 12px; padding: 10px; background: #F5F5F5; border-radius: 4px;">${verificationLink}</p>
              
              <p style="color: #666; font-size: 14px; margin-top: 25px;"><strong>⏰ Important:</strong> This verification link will expire in <strong>24 hours</strong> for your security.</p>
              
              <div style="background: #FFF3CD; border-left: 4px solid #FFA500; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #856404; margin: 0; font-size: 14px;"><strong>⚠️ Security Notice:</strong> If you didn't create an account with SPANA, please ignore this email. Your email address will not be used.</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} SPANA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Hi ${name || 'there'},\n\nThank you for signing up with SPANA! Please verify your email address by clicking this link:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account with SPANA, please ignore this email.\n\n© ${new Date().getFullYear()} SPANA. All rights reserved.`;

    const result = await sendEmail({ to, subject, text, html, type: 'verification', apiSecret });

    return (res as any).status(200).json(result);
  } catch (error: any) {
    console.error('[Email Service] Verification email error:', error);
    return (res as any).status(500).json({
      success: false,
      message: 'Failed to send verification email',
      error: error.message
    });
  }
}
