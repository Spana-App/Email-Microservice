// Test SMTP with different authentication variations
require('dotenv').config();

import nodemailer from 'nodemailer';

async function testVariation(name: string, config: any) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   User: ${config.auth.user}`);
  console.log(`   Secure: ${config.secure}`);
  console.log(`   Auth Method: ${config.auth.method || 'AUTO'}\n`);

  try {
    const transporter = nodemailer.createTransport(config);
    await transporter.verify();
    console.log(`✅ ${name}: SUCCESS!\n`);
    return true;
  } catch (error: any) {
    console.log(`❌ ${name}: FAILED`);
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

async function testAllVariations() {
  console.log('\n🔬 Testing SMTP Authentication Variations\n');
  console.log('=' .repeat(60));

  const host = process.env.SMTP_HOST || 'mail.spana.co.za';
  const pass = process.env.SMTP_PASS || '';
  const fullEmail = process.env.SMTP_USER || 'no-reply@spana.co.za';
  const usernameOnly = fullEmail.split('@')[0];

  if (!pass) {
    console.error('❌ SMTP_PASS not set in .env\n');
    process.exit(1);
  }

  const variations = [
    {
      name: 'Port 587 + Full Email + PLAIN',
      config: {
        host,
        port: 587,
        secure: false,
        auth: { user: fullEmail, pass },
        requireTLS: true,
      },
    },
    {
      name: 'Port 587 + Username Only + PLAIN',
      config: {
        host,
        port: 587,
        secure: false,
        auth: { user: usernameOnly, pass },
        requireTLS: true,
      },
    },
    {
      name: 'Port 587 + Full Email + LOGIN',
      config: {
        host,
        port: 587,
        secure: false,
        auth: { user: fullEmail, pass, method: 'LOGIN' },
        requireTLS: true,
      },
    },
    {
      name: 'Port 587 + Username Only + LOGIN',
      config: {
        host,
        port: 587,
        secure: false,
        auth: { user: usernameOnly, pass, method: 'LOGIN' },
        requireTLS: true,
      },
    },
    {
      name: 'Port 465 + Full Email + SSL',
      config: {
        host,
        port: 465,
        secure: true,
        auth: { user: fullEmail, pass },
        requireTLS: false,
      },
    },
    {
      name: 'Port 465 + Username Only + SSL',
      config: {
        host,
        port: 465,
        secure: true,
        auth: { user: usernameOnly, pass },
        requireTLS: false,
      },
    },
  ];

  const results: { name: string; success: boolean }[] = [];

  for (const variation of variations) {
    const success = await testVariation(variation.name, variation.config);
    results.push({ name: variation.name, success });
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Results Summary:\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  if (successful.length > 0) {
    console.log('✅ Successful Configurations:');
    successful.forEach(r => {
      console.log(`   ✓ ${r.name}`);
    });
    console.log('\n💡 Use the first successful configuration in your .env file!\n');
  } else {
    console.log('❌ All configurations failed.\n');
    console.log('This indicates a KonsoleH-side issue:\n');
    console.log('   1. Account may be locked');
    console.log('   2. SMTP access may be disabled');
    console.log('   3. Password may be incorrect');
    console.log('   4. Need to contact KonsoleH support\n');
  }

  if (failed.length > 0) {
    console.log('❌ Failed Configurations:');
    failed.forEach(r => {
      console.log(`   ✗ ${r.name}`);
    });
    console.log('');
  }

  process.exit(successful.length > 0 ? 0 : 1);
}

testAllVariations();
