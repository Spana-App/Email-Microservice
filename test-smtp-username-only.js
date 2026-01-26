const nodemailer = require('nodemailer');

// Test with username only (no domain)
const config = {
  host: 'mail.spana.co.za',
  port: 587,
  user: 'no-reply',  // Username only, no @domain
  pass: 'ProjectSpana@2028',
  secure: false,
  from: 'no-reply@spana.co.za'
};

console.log('🧪 Testing SMTP with username only (no-reply)...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  User: ${config.user} (username only)`);
console.log(`  Pass: ${config.pass.substring(0, 3)}*** (hidden)`);
console.log(`  Secure: ${config.secure}\n`);

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: { user: config.user, pass: config.pass },
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  debug: true,
  logger: true
});

async function test() {
  try {
    console.log('📡 Verifying SMTP connection...\n');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    console.log('📧 Sending test email...\n');
    const info = await transporter.sendMail({
      from: config.from,
      to: 'eksnxiweni@gmail.com',
      subject: 'Test Email - Username Only Format',
      text: 'Testing with username only format.',
      html: '<p>Testing with username only format.</p>'
    });
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);
    console.log('🎉 SMTP works with username-only format!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Still failing with username-only format\n');
    console.error(`   Error: ${error.code} - ${error.response}\n`);
    console.error('💡 This confirms it\'s a KonsoleH-side issue.\n');
    console.error('   Contact KonsoleH support - something changed on their end.\n');
    process.exit(1);
  } finally {
    transporter.close();
  }
}

test();
