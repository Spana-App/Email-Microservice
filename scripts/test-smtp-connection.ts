// Test SMTP connection with detailed debugging
require('dotenv').config();

import nodemailer from 'nodemailer';

async function testSMTPConnection() {
  console.log('\n🧪 Testing SMTP Connection...\n');

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.SMTP_FROM || user;

  console.log('📋 Configuration:');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   User: ${user}`);
  console.log(`   Secure: ${secure} (${secure ? 'SSL' : 'STARTTLS'})`);
  console.log(`   From: ${from}\n`);

  if (!host || !user || !pass) {
    console.error('❌ Missing SMTP configuration!');
    console.error('   Please set SMTP_HOST, SMTP_USER, SMTP_PASS in .env\n');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure,
    connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 5000,
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
    },
    debug: true, // Enable detailed debug output
    logger: true, // Log to console
  });

  try {
    console.log('📡 Verifying SMTP connection...\n');
    
    // Verify connection
    await transporter.verify();
    
    console.log('✅ SMTP connection verified successfully!\n');
    console.log('📧 Sending test email...\n');
    
    // Send test email
    const testEmail = process.env.TEST_EMAIL || 'eksnxiweni@gmail.com';
    const info = await transporter.sendMail({
      from: from,
      to: testEmail,
      subject: '✅ SPANA Email Service Test',
      text: 'This is a test email from the SPANA email service. If you receive this, SMTP is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0066CC;">✅ SPANA Email Service Test</h2>
          <p>This is a test email from the SPANA email service.</p>
          <p>If you receive this, your SMTP configuration is working correctly! 🎉</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Sent from: ${from}<br>
            SMTP Host: ${host}:${port}<br>
            Time: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${testEmail}\n`);
    console.log('🎉 SMTP is working correctly!\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ SMTP Test Failed:\n');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    console.error(`   Response: ${error.response || 'N/A'}\n`);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication Error (535):');
      console.error('   This means the SMTP server rejected your username/password.\n');
      console.error('   Troubleshooting steps:');
      console.error('   1. Verify SMTP_USER is correct (try full email: no-reply@spana.co.za)');
      console.error('   2. Verify SMTP_PASS is correct (check for typos, case sensitivity)');
      console.error('   3. Check if 2FA is enabled (may need app password)');
      console.error('   4. Try port 465 with SMTP_SECURE=true');
      console.error('   5. Contact KonsoleH support if account is locked\n');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('🌐 Connection Error:');
      console.error('   Cannot connect to SMTP server.\n');
      console.error('   Troubleshooting steps:');
      console.error('   1. Verify SMTP_HOST is correct');
      console.error('   2. Check if port is correct (587 or 465)');
      console.error('   3. Check firewall/network restrictions');
      console.error('   4. Try alternative SMTP_HOST (smtp.spana.co.za, webmail.spana.co.za)\n');
    } else if (error.code === 'ESOCKET') {
      console.error('🔒 TLS/SSL Error:');
      console.error('   Issue with encryption handshake.\n');
      console.error('   Troubleshooting steps:');
      console.error('   1. Try SMTP_SECURE=false with port 587');
      console.error('   2. Try SMTP_SECURE=true with port 465');
      console.error('   3. Set SMTP_REJECT_UNAUTHORIZED=false if using self-signed cert\n');
    }
    
    console.error('💡 For more help, see:');
    console.error('   - SMTP_TROUBLESHOOTING.md');
    console.error('   - SMTP_FIX_GUIDE.md\n');
    
    process.exit(1);
  }
}

testSMTPConnection();
