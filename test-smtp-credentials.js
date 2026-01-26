/**
 * Test SMTP Credentials Locally
 * 
 * This script helps verify if SMTP credentials are correct
 * Run: node test-smtp-credentials.js
 */

const nodemailer = require('nodemailer');

// Load environment variables from .env file if it exists
require('dotenv').config();

// Use credentials from environment or defaults (matching Vercel settings)
const config = {
  host: process.env.SMTP_HOST || 'mail.spana.co.za',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  user: process.env.SMTP_USER || 'no-reply@spana.co.za',
  pass: process.env.SMTP_PASS || 'ProjectSpana@2028',
  secure: process.env.SMTP_SECURE === 'true' || false,
  from: process.env.SMTP_FROM || 'no-reply@spana.co.za'
};

console.log('🧪 Testing SMTP Credentials...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  User: ${config.user}`);
console.log(`  Pass: ${config.pass.substring(0, 3)}*** (hidden)`);
console.log(`  Secure: ${config.secure}`);
console.log(`  From: ${config.from}\n`);

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: {
    user: config.user,
    pass: config.pass
  },
  requireTLS: !config.secure,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  debug: true, // Enable debug output
  logger: true // Log to console
});

async function testConnection() {
  try {
    console.log('📡 Verifying SMTP connection...\n');
    
    // Verify connection
    await transporter.verify();
    
    console.log('✅ SMTP connection successful!\n');
    console.log('📧 Sending test email...\n');
    
    // Send test email
    const info = await transporter.sendMail({
      from: config.from,
      to: 'eksnxiweni@gmail.com', // Change to your test email
      subject: 'Test Email from SPANA',
      text: 'This is a test email to verify SMTP credentials are working.',
      html: '<p>This is a test email to verify SMTP credentials are working.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);
    console.log('🎉 SMTP credentials are correct!\n');
    
  } catch (error) {
    console.error('\n❌ SMTP Test Failed:\n');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Response: ${error.response}`);
    console.error(`   Command: ${error.command}`);
    console.error(`   Message: ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.error('🔴 Authentication Failed!');
      console.error('   Possible issues:');
      console.error('   - Username is incorrect');
      console.error('   - Password is incorrect');
      console.error('   - Account might be locked');
      console.error('   - SMTP might require app-specific password\n');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('🔴 Connection Failed!');
      console.error('   Possible issues:');
      console.error('   - SMTP host is incorrect');
      console.error('   - Port is blocked by firewall');
      console.error('   - Server is unreachable\n');
    } else {
      console.error('🔴 Unknown Error!');
      console.error('   Check the error details above\n');
    }
    
    process.exit(1);
  } finally {
    transporter.close();
  }
}

testConnection();
