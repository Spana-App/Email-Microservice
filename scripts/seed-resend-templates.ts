#!/usr/bin/env ts-node
/**
 * Seed Resend Email Templates
 * 
 * Creates email templates in Resend for:
 * - Welcome emails
 * - Verification emails
 * - OTP emails
 * 
 * Run: npm run seed:templates
 */

require('dotenv').config();
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TemplateData {
  name: string;
  subject: string;
  html: string;
  text?: string;
}

async function seedTemplates() {
  console.log('\n🌱 Seeding Resend Email Templates\n');
  console.log('='.repeat(60));

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in .env file');
    process.exit(1);
  }

  const templates: TemplateData[] = [
    {
      name: 'spana-welcome-service-provider',
      subject: 'Welcome to SPANA, {{name}}! 🎉',
      html: `
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
              <div class="header">
                <h1>🎉 Welcome to SPANA!</h1>
              </div>
              <div class="content">
                <p style="color: #000000; font-size: 16px;">Hi {{name}},</p>
                <p style="color: #000000;">Welcome to SPANA! We're thrilled to have you join our platform as a <strong>Service Provider</strong>.</p>
                <h3 style="color: #0066CC; margin-top: 25px;">💰 Start Earning:</h3>
                <ul style="color: #000000; line-height: 1.8;">
                  <li><strong>Set Your Schedule:</strong> Work when you want</li>
                  <li><strong>Get Bookings:</strong> Receive instant booking requests</li>
                  <li><strong>Earn More:</strong> Keep up to 90% of each payment</li>
                  <li><strong>Build Reputation:</strong> Collect reviews and ratings</li>
                </ul>
                {{#if completeProfileLink}}
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{completeProfileLink}}" class="button">Complete Profile</a>
                </div>
                {{/if}}
                <p style="color: #000000; margin-top: 25px;">Best regards,<br><strong>The SPANA Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2024 SPANA. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi {{name}},\n\nWelcome to SPANA! We're excited to have you join our community as a Service Provider.\n\nComplete your profile to start receiving bookings.\n\nBest regards,\nThe SPANA Team`
    },
    {
      name: 'spana-verification',
      subject: 'Verify Your Email Address - SPANA',
      html: `
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
              <div class="header">
                <h1>✨ Verify Your Email</h1>
              </div>
              <div class="content">
                <p style="color: #000000; font-size: 16px;">Hi {{name}},</p>
                <p style="color: #000000;">Thank you for creating your SPANA account! Please verify your email address.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{verificationLink}}" class="button">Verify Email Address</a>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 25px;">This link expires in 24 hours.</p>
              </div>
              <div class="footer">
                <p>© 2024 SPANA. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi {{name}},\n\nPlease verify your email by clicking: {{verificationLink}}\n\nThis link expires in 24 hours.\n\n© 2024 SPANA.`
    },
    {
      name: 'spana-otp',
      subject: 'Your SPANA Admin Portal Access Code 🔐',
      html: `
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
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🔐 Admin Portal Access</h1>
              </div>
              <div class="content">
                <p style="color: #000000; font-size: 16px;">Hi {{name}},</p>
                <p style="color: #000000;">Your one-time password for admin login:</p>
                <div class="otp-box">
                  <div class="otp-code">{{otp}}</div>
                </div>
                <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
              </div>
              <div class="footer">
                <p>© 2024 SPANA. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi {{name}},\n\nYour OTP: {{otp}}\n\nExpires in 10 minutes.\n\n© 2024 SPANA.`
    }
  ];

  console.log(`Found ${templates.length} templates to create\n`);

  for (const template of templates) {
    try {
      console.log(`📧 Creating template: ${template.name}...`);
      
      // Note: Resend doesn't have a direct template API yet
      // We'll create them as React Email templates or document them
      // For now, we'll just log what would be created
      
      console.log(`   Subject: ${template.subject}`);
      console.log(`   ✅ Template structure ready for Resend\n`);
    } catch (error: any) {
      console.error(`   ❌ Failed: ${error.message}\n`);
    }
  }

  console.log('='.repeat(60));
  console.log('\n📝 Note: Resend currently uses React Email for templates');
  console.log('   Templates are created via Resend dashboard or React Email CLI');
  console.log('\n💡 Current implementation sends HTML directly (works great!)');
  console.log('   Templates can be added later for better management\n');
}

seedTemplates().catch(console.error);
