#!/usr/bin/env ts-node
/**
 * Test Resend Email Service
 * 
 * This script tests the Resend email service configuration
 * Run: npm run test:resend
 */

require('dotenv').config();
import { Resend } from 'resend';

async function testResend() {
  console.log('\n🔬 Testing Resend Email Service\n');
  console.log('='.repeat(60));

  // Check if API key is set
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not set in .env file');
    console.log('\n📝 To set up Resend:');
    console.log('   1. Sign up at https://resend.com');
    console.log('   2. Get your API key from the dashboard');
    console.log('   3. Add RESEND_API_KEY=re_... to your .env file\n');
    process.exit(1);
  }

  if (!apiKey.startsWith('re_')) {
    console.error('❌ Invalid API key format. Resend API keys start with "re_"');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
  console.log('');

  // Initialize Resend
  const resend = new Resend(apiKey);

  // Test 1: Verify API key by listing domains
  console.log('🧪 Test 1: Verifying API key...');
  try {
    const domains = await resend.domains.list();
    console.log('✅ API key is valid');
    console.log(`   Found ${domains.data?.length || 0} verified domain(s)`);
    if (domains.data && domains.data.length > 0) {
      domains.data.forEach((domain: any) => {
        console.log(`   - ${domain.name} (${domain.status})`);
      });
    }
  } catch (error: any) {
    console.error('❌ API key verification failed:', error.message);
    process.exit(1);
  }
  console.log('');

  // Test 2: Send test email
  console.log('🧪 Test 2: Sending test email...');
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const fromEmail = process.env.RESEND_FROM || process.env.SMTP_FROM || 'onboarding@resend.dev';
  
  console.log(`   From: ${fromEmail}`);
  console.log(`   To: ${testEmail}`);
  console.log('');

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: 'Test Email from Spana Email Service',
      html: `
        <h1>✅ Resend is Working!</h1>
        <p>This is a test email from the Spana email service.</p>
        <p>If you received this, Resend is configured correctly!</p>
        <hr>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `,
      text: 'Resend is working! This is a test email from the Spana email service.',
    });

    if (result.data?.id) {
      console.log('✅ Test email sent successfully!');
      console.log(`   Email ID: ${result.data.id}`);
      console.log(`   Check ${testEmail} for the test email`);
    } else {
      console.error('❌ Email sent but no ID returned');
      console.log('   Response:', result);
    }
  } catch (error: any) {
    console.error('❌ Failed to send test email:', error.message);
    if (error.message.includes('domain')) {
      console.log('\n💡 Tip: If using a custom domain, make sure it\'s verified in Resend');
      console.log('   Or use "onboarding@resend.dev" for testing');
    }
    process.exit(1);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ All tests passed! Resend is configured correctly.\n');
}

// Run tests
testResend().catch((error) => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
