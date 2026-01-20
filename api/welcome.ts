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
    const { to, name, role, apiSecret } = (req as any).body;

    if (!to || !name) {
      return (res as any).status(400).json({ message: 'Missing required fields: to, name' });
    }

    // Verify API secret (optional for development if not set)
    const envSecret = process.env.API_SECRET;
    if (envSecret && envSecret.trim() !== '' && apiSecret !== envSecret) {
      return (res as any).status(401).json({ message: 'Unauthorized - Invalid API secret' });
    }

    const roleText = role === 'service_provider' ? 'Service Provider' : role === 'admin' ? 'Admin' : 'Customer';

    // Use Render backend URL for now so links are correctly tied to the live backend.
    // IMPORTANT: Do NOT use CLIENT_URL here yet, as the frontend domain (app.spana.co.za)
    // is not live. We want all CTAs to hit the Render API directly.
    const rawBaseUrl =
      process.env.EXTERNAL_API_URL ||
      'https://spana-server-5bhu.onrender.com';
    const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');
    const subject = `Welcome to SPANA, ${name}! 🎉`;
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
            .button { display: inline-block; background: #0066CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${getSpanaLogoHTML()}
            <div class="header">
              <h1>🎉 Welcome to SPANA!</h1>
            </div>
            <div class="content">
              <p style="color: #000000; font-size: 16px;">Hi ${name},</p>
              <p style="color: #000000;">Welcome to SPANA! We're thrilled to have you join our platform as a <strong>${roleText}</strong>. You're now part of South Africa's premier on-demand service marketplace.</p>
              
              ${role === 'customer' ? `
              <h3 style="color: #0066CC; margin-top: 25px;">🚀 Get Started as a Customer:</h3>
              <ul style="color: #000000; line-height: 1.8;">
                <li><strong>Browse Services:</strong> Explore thousands of verified service providers</li>
                <li><strong>Instant Bookings:</strong> Book same-day services with just a few taps</li>
                <li><strong>Real-time Tracking:</strong> Track your provider's location in real-time</li>
                <li><strong>Secure Payments:</strong> All payments are protected with escrow until service completion</li>
                <li><strong>24/7 Support:</strong> Our team is always here to help</li>
              </ul>
              <p style="color: #000000; margin-top: 20px;">You can now start booking services in the SPANA app!</p>
              ` : role === 'service_provider' ? `
              <h3 style="color: #0066CC; margin-top: 25px;">💰 Start Earning as a Service Provider:</h3>
              <ul style="color: #000000; line-height: 1.8;">
                <li><strong>Set Your Schedule:</strong> Work when you want, where you want</li>
                <li><strong>Get Bookings:</strong> Receive instant booking requests from customers nearby</li>
                <li><strong>Earn More:</strong> Keep up to 90% of each service payment</li>
                <li><strong>Build Your Reputation:</strong> Collect reviews and ratings to get more bookings</li>
                <li><strong>Guaranteed Payments:</strong> All payments are secured in escrow and released after completion</li>
              </ul>
              <p style="color: #000000; margin-top: 20px;">Complete your profile to start receiving booking requests!</p>
              ` : `
              <h3 style="color: #0066CC; margin-top: 25px;">🎯 Admin Portal Access:</h3>
              <ul style="color: #000000; line-height: 1.8;">
                <li><strong>Manage Platform:</strong> Oversee all bookings, users, and services</li>
                <li><strong>Monitor Performance:</strong> Track key metrics and analytics</li>
                <li><strong>Support Users:</strong> Assist customers and service providers</li>
                <li><strong>Approve Services:</strong> Review and approve new service listings</li>
                <li><strong>View Reports:</strong> Access comprehensive platform reports</li>
              </ul>
              `}
              
              ${role !== 'customer' ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${cleanBaseUrl}" style="background: #0066CC; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">${role === 'service_provider' ? 'Complete Profile' : 'Access Admin Portal'}</a>
              </div>
              ` : ''}
              
              <p style="color: #000000; margin-top: 25px;">If you have any questions or need assistance, our support team is available 24/7.</p>
              <p style="color: #000000; margin-top: 20px;">Best regards,<br><strong>The SPANA Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} SPANA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Hi ${name},\n\nWelcome to SPANA! We're excited to have you join our community as a ${roleText}.\n\nYou can now start using our platform. If you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe SPANA Team\n\n© ${new Date().getFullYear()} SPANA. All rights reserved.`;

    const result = await sendEmail({ to, subject, text, html, type: 'welcome', apiSecret });

    return (res as any).status(200).json(result);
  } catch (error: any) {
    console.error('[Email Service] Welcome email error:', error);
    return (res as any).status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
}
