/**
 * Test Email Service
 * Tests all email endpoints
 */

// Load environment variables
require('dotenv').config();

import axios from 'axios';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const API_SECRET = process.env.API_SECRET || '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

function log(icon: string, message: string, color: string = colors.reset) {
  console.log(`${color}${icon}${colors.reset} ${message}`);
}

async function testEmailService() {
  console.log(`\n${colors.cyan}🧪 TESTING EMAIL SERVICE${colors.reset}\n`);
  console.log(`${colors.gray}URL: ${BASE_URL}${colors.reset}\n`);

  // Test 1: Health Check
  log('📋', '1. Testing Health Check...', colors.yellow);
  try {
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    log('  ✅', `Health check passed: ${JSON.stringify(healthResponse.data)}`, colors.green);
  } catch (error: any) {
    log('  ❌', `Health check failed: ${error.message}`, colors.red);
    return;
  }
  console.log('');

  // Test 2: Send OTP Email
  log('📋', '2. Testing OTP Email...', colors.yellow);
  try {
    const otpResponse = await axios.post(`${BASE_URL}/api/otp`, {
      to: 'xoli@spana.co.za',
      name: 'Xoli',
      otp: '123456',
      apiSecret: API_SECRET || undefined
    });
    log('  ✅', `OTP email sent: ${JSON.stringify(otpResponse.data)}`, colors.green);
  } catch (error: any) {
    log('  ❌', `OTP email failed: ${error.response?.data?.message || error.message}`, colors.red);
    if (error.response?.data) {
      log('  ℹ️', `Details: ${JSON.stringify(error.response.data)}`, colors.gray);
    }
  }
  console.log('');

  // Test 3: Send Verification Email
  log('📋', '3. Testing Verification Email...', colors.yellow);
  try {
    const verificationResponse = await axios.post(`${BASE_URL}/api/verification`, {
      to: 'xoli@spana.co.za',
      name: 'Xoli',
      verificationLink: 'https://spana.co.za/verify?token=abc123',
      apiSecret: API_SECRET || undefined
    });
    log('  ✅', `Verification email sent: ${JSON.stringify(verificationResponse.data)}`, colors.green);
  } catch (error: any) {
    log('  ❌', `Verification email failed: ${error.response?.data?.message || error.message}`, colors.red);
    if (error.response?.data) {
      log('  ℹ️', `Details: ${JSON.stringify(error.response.data)}`, colors.gray);
    }
  }
  console.log('');

  // Test 4: Send Welcome Email
  log('📋', '4. Testing Welcome Email...', colors.yellow);
  try {
    const welcomeResponse = await axios.post(`${BASE_URL}/api/welcome`, {
      to: 'xoli@spana.co.za',
      name: 'Xoli',
      role: 'admin',
      apiSecret: API_SECRET || undefined
    });
    log('  ✅', `Welcome email sent: ${JSON.stringify(welcomeResponse.data)}`, colors.green);
  } catch (error: any) {
    log('  ❌', `Welcome email failed: ${error.response?.data?.message || error.message}`, colors.red);
    if (error.response?.data) {
      log('  ℹ️', `Details: ${JSON.stringify(error.response.data)}`, colors.gray);
    }
  }
  console.log('');

  // Test 5: Send Generic Email
  log('📋', '5. Testing Generic Email...', colors.yellow);
  try {
    const genericResponse = await axios.post(`${BASE_URL}/api/send`, {
      to: 'xoli@spana.co.za',
      subject: 'Test Email from SPANA',
      text: 'This is a test email from SPANA email service.',
      html: '<h1>Test Email</h1><p>This is a test email from SPANA email service.</p>',
      type: 'test',
      apiSecret: API_SECRET || undefined
    });
    log('  ✅', `Generic email sent: ${JSON.stringify(genericResponse.data)}`, colors.green);
  } catch (error: any) {
    log('  ❌', `Generic email failed: ${error.response?.data?.message || error.message}`, colors.red);
    if (error.response?.data) {
      log('  ℹ️', `Details: ${JSON.stringify(error.response.data)}`, colors.gray);
    }
  }
  console.log('');

  log('✅', 'Email service tests completed!', colors.green);
  console.log('');
  log('💡', 'Check your email inbox at xoli@spana.co.za', colors.cyan);
  console.log('');
}

// Run tests
testEmailService().catch(console.error);
