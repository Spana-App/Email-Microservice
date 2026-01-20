import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail } from '../lib/email';
import { getSpanaLogoHTML } from '../lib/logo';

// Send OTP email

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, name, otp, apiSecret } = req.body;

    if (!to || !otp) {
      return (res as any).status(400).json({ message: 'Missing required fields: to, otp' });
    }

    // Verify API secret (optional for development if not set)
    const envSecret = process.env.API_SECRET;
    if (envSecret && envSecret.trim() !== '' && apiSecret !== envSecret) {
      return (res as any).status(401).json({ message: 'Unauthorized - Invalid API secret' });
    }

    const subject = 'Your SPANA Admin Portal Access Code 🔐';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #000000; background-color: #F5F5F5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066CC; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #FFFFFF; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #0066CC; }
            .otp-box { background: #F5F5F5; border: 2px dashed #0066CC; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; }
            .otp-code { font-size: 36px; font-weight: bold; color: #0066CC; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .security-note { background: #FFF3CD; border-left: 4px solid #FFA500; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${getSpanaLogoHTML()}
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔐 Admin Portal Access</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">One-Time Password Required</p>
            </div>
            <div class="content">
              <p style="color: #000000; font-size: 16px;">Hi ${name || 'Admin'},</p>
              <p style="color: #000000;">You've requested to access the SPANA Admin Portal. For your security, please use the one-time password below to complete your login:</p>
              <div class="otp-box">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Your Admin Access Code:</div>
                <div class="otp-code">${otp}</div>
              </div>
              <div class="security-note">
                <strong>⚠️ Security Notice:</strong><br>
                • This code expires in <strong>10 minutes</strong><br>
                • Never share this code with anyone<br>
                • SPANA staff will never ask for your OTP<br>
                • If you didn't request this code, please secure your account immediately
              </div>
              <p style="color: #000000; margin-top: 25px;">Enter this code on the admin login page to complete your authentication.</p>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">If you have any concerns about your account security, please contact our security team immediately.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} SPANA. All rights reserved.</p>
              <p>This is an automated security email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Hi ${name || 'there'},\n\nYour one-time password (OTP) for admin login is: ${otp}\n\nThis OTP will expire in 10 minutes. Please do not share this code with anyone.\n\nIf you didn't request this OTP, please ignore this email.\n\n© ${new Date().getFullYear()} SPANA. All rights reserved.`;

    const result = await sendEmail({ to, subject, text, html, type: 'otp', apiSecret });

    return (res as any).status(200).json(result);
  } catch (error: any) {
    console.error('[Email Service] OTP email error:', error);
    return (res as any).status(500).json({
      success: false,
      message: 'Failed to send OTP email',
      error: error.message
    });
  }
}
