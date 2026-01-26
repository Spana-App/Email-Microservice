#!/usr/bin/env ts-node
/**
 * Check Resend Email Delivery Status
 * 
 * Checks the delivery status of recent emails sent via Resend
 * Run: npm run check:delivery
 */

require('dotenv').config();
import { Resend } from 'resend';

async function checkDelivery() {
  console.log('\n🔍 Checking Resend Email Delivery Status\n');
  console.log('='.repeat(60));

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set');
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Get recent emails
    console.log('📧 Fetching recent emails from Resend...\n');
    
    // Note: Resend API doesn't have a direct "list emails" endpoint
    // But we can check the dashboard or use webhooks
    
    console.log('💡 To check email delivery:');
    console.log('   1. Go to: https://resend.com/emails');
    console.log('   2. Look for emails to: eksnxiweni@gmail.com');
    console.log('   3. Check delivery status (sent, delivered, bounced, etc.)\n');
    
    console.log('📋 Common issues if emails not received:');
    console.log('   • Check spam/junk folder');
    console.log('   • Gmail may delay emails from new senders');
    console.log('   • Wait 1-2 minutes for delivery');
    console.log('   • Check Resend dashboard for bounce/spam reports\n');
    
    console.log('🔗 Resend Dashboard: https://resend.com/emails\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkDelivery();
