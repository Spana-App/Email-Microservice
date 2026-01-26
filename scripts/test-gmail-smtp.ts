/**
 * Test Gmail SMTP Connection
 * 
 * This script tests Gmail SMTP configuration and sends a test email.
 * 
 * Usage:
 *   npm run test:smtp
 *   or
 *   npx ts-node --transpile-only scripts/test-gmail-smtp.ts
 */

require('dotenv').config();
import nodemailer from 'nodemailer';

async function testGmailSMTP() {
  console.log('\n🔍 Testing Gmail SMTP Configuration...\n');

  // Check environment variables
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.SMTP_FROM || user;

  console.log('📋 Configuration:');
  console.log('   Host:', host || '❌ NOT SET');
  console.log('   Port:', port || '❌ NOT SET');
  console.log('   Secure:', secure);
  console.log('   User:', user || '❌ NOT SET');
  console.log('   Password:', pass ? '✅ SET (' + pass.length + ' chars)' : '❌ NOT SET');
  console.log('   From:', from || '❌ NOT SET');
  console.log('');

  if (!host || !user || !pass) {
    console.error('❌ Missing required SMTP configuration!');
    console.log('\n💡 Please set in .env:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your-email@gmail.com');
    console.log('   SMTP_PASS=your-app-password');
    console.log('   SMTP_FROM=your-email@gmail.com\n');
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    requireTLS: !secure, // Use STARTTLS for non-SSL ports
    connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 5000,
    tls: {
      rejectUnauthorized: true,
    },
    debug: true,
    logger: true,
  });

  // Test connection
  console.log('🔌 Testing SMTP connection...\n');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');
  } catch (error: any) {
    console.error('❌ SMTP connection failed!\n');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Common causes:');
      console.log('   1. 2FA not enabled on Gmail account');
      console.log('   2. Using regular password instead of app-specific password');
      console.log('   3. App-specific password not generated');
      console.log('\n📖 See GMAIL_SMTP_SETUP.md for instructions\n');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection failed. Common causes:');
      console.log('   1. Firewall blocking port', port);
      console.log('   2. Wrong SMTP host');
      console.log('   3. Network restrictions');
      console.log('\n💡 Try:');
      console.log('   - Port 465 (SSL) instead of 587');
      console.log('   - Check firewall settings');
      console.log('   - Verify SMTP_HOST=smtp.gmail.com\n');
    }
    
    process.exit(1);
  }

  // Send test email
  const testEmail = process.env.TEST_EMAIL || user;
  console.log(`📧 Sending test email to: ${testEmail}\n`);

  try {
    const info = await transporter.sendMail({
      from: `"Spana Email Service" <${from}>`,
      to: testEmail,
      subject: '✅ Gmail SMTP Test - Spana Email Service',
      text: `This is a test email from the Spana email service.

If you received this, Gmail SMTP is configured correctly!

Configuration:
- Host: ${host}
- Port: ${port}
- Secure: ${secure}
- From: ${from}

Sent at: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">✅ Gmail SMTP Test</h2>
          <p>This is a test email from the <strong>Spana email service</strong>.</p>
          <p>If you received this, Gmail SMTP is configured correctly! 🎉</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration:</h3>
            <ul>
              <li><strong>Host:</strong> ${host}</li>
              <li><strong>Port:</strong> ${port}</li>
              <li><strong>Secure:</strong> ${secure}</li>
              <li><strong>From:</strong> ${from}</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!\n');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 From:', from);
    console.log('📮 To:', testEmail);
    console.log('\n💡 Check your inbox (and spam folder) for the test email.\n');
  } catch (error: any) {
    console.error('❌ Failed to send test email!\n');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testGmailSMTP().catch(console.error);
