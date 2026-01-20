// Load environment variables
require('dotenv').config();

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Request, Response } from 'express';
import { sendEmail } from '../lib/email';
import { getSpanaLogoHTML } from '../lib/logo';

export default async function handler(
  req: VercelRequest | Request,
  res: VercelResponse | Response,
) {
  if (req.method !== 'POST') {
    return (res as Response).status(405).json({ message: 'Method not allowed' });
  }

  // Verify API secret (optional for development if not set)
  const envSecret = process.env.API_SECRET;
  if (envSecret && envSecret.trim() !== '') {
    const providedSecret = (req as any).body?.apiSecret || (req as any).headers?.['x-api-secret'];
    if (providedSecret !== envSecret) {
      return (res as Response).status(401).json({ message: 'Unauthorized - Invalid API secret' });
    }
  }

  try {
    const { to, name, email, password, appDownloadLink } = (req as any).body;

    if (!to || !email || !password) {
      return (res as Response).status(400).json({ 
        message: 'Missing required fields: to, email, password',
        required: ['to', 'email', 'password']
      });
    }

    const downloadLink = appDownloadLink || 'https://spana.co.za/download';
    const loginUrl = 'https://app.spana.co.za/login';

    const subject = 'Welcome to SPANA - Your Service Provider Account & App Credentials 🎉';
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
            .credentials-box { background: white; border: 2px solid #0066CC; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .credential-row { margin: 15px 0; padding: 10px; background: #F9F9F9; border-radius: 4px; border-left: 3px solid #0066CC; }
            .credential-label { font-weight: bold; color: #0066CC; margin-bottom: 5px; }
            .credential-value { font-size: 16px; color: #000; font-family: 'Courier New', monospace; }
            .button { display: inline-block; background: #0066CC; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .warning { background: #FFF3CD; border-left: 4px solid #FFA500; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${getSpanaLogoHTML()}
            <div class="header">
              <h1>🎉 Welcome to SPANA!</h1>
              <p>Your Service Provider Account is Ready</p>
            </div>
            <div class="content">
              <p>Hi ${name || 'there'},</p>
              <p>Great news! Your service provider account has been created on the SPANA platform. You can now start offering your services to customers.</p>
              
              <h3>📱 Step 1: Download the SPANA App</h3>
              <p>To get started, download the SPANA mobile app using the link below:</p>
              <div style="text-align: center;">
                <a href="${downloadLink}" class="button">Download SPANA App</a>
              </div>

              <h3>🔐 Step 2: Your Login Credentials</h3>
              <p>Use these credentials to log into the SPANA app:</p>
              <div class="credentials-box">
                <div class="credential-row">
                  <div class="credential-label">Email Address:</div>
                  <div class="credential-value">${email}</div>
                </div>
                <div class="credential-row">
                  <div class="credential-label">Temporary Password:</div>
                  <div class="credential-value">${password}</div>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> Please change your password immediately after your first login. This temporary password is for initial access only.
              </div>

              <h3>🚀 Next Steps</h3>
              <ol>
                <li>Download and install the SPANA app</li>
                <li>Log in using the credentials above</li>
                <li>Complete your profile setup</li>
                <li>Start accepting bookings and earning!</li>
              </ol>

              <p style="margin-top: 30px;">
                <strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a>
              </p>

              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br>The SPANA Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} SPANA. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Hi ${name || 'there'},

Great news! Your service provider account has been created on the SPANA platform.

STEP 1: Download the SPANA App
Download link: ${downloadLink}

STEP 2: Your Login Credentials
Email: ${email}
Temporary Password: ${password}

⚠️ IMPORTANT: Please change your password immediately after your first login.

Next Steps:
1. Download and install the SPANA app
2. Log in using the credentials above
3. Complete your profile setup
4. Start accepting bookings and earning!

Login URL: ${loginUrl}

If you have any questions, please contact our support team.

Best regards,
The SPANA Team

© ${new Date().getFullYear()} SPANA. All rights reserved.`;

    try {
      const result = await sendEmail({ to, subject, text, html, type: 'provider_credentials', apiSecret: (req as any).body?.apiSecret });

      if (result.success) {
        console.log(`[Email Service] Provider credentials email sent to ${to}`);
        return (res as Response).status(200).json({ 
          success: true, 
          message: 'Provider credentials email sent', 
          messageId: result.messageId 
        });
      } else {
        throw new Error('Failed to send email - result.success is false');
      }
    } catch (emailError: any) {
      console.error('[Email Service] Failed to send provider credentials email:', emailError.message);
      return (res as Response).status(500).json({ 
        success: false, 
        message: 'Failed to send provider credentials email', 
        error: emailError.message 
      });
    }
  } catch (error: any) {
    console.error('[Email Service] Error sending provider credentials email:', error);
    return (res as Response).status(500).json({ 
      success: false, 
      message: 'Failed to send provider credentials email', 
      error: error.message 
    });
  }
}
