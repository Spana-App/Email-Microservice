const nodemailer = require('nodemailer');

// Test with port 587 and STARTTLS
const config = {
  host: 'mail.spana.co.za',
  port: 587,
  user: 'no-reply@spana.co.za',
  pass: 'ProjectSpana@2028',
  secure: false,  // STARTTLS instead of SSL
  from: 'no-reply@spana.co.za'
};

console.log('🧪 Testing SMTP with port 587 (STARTTLS)...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  User: ${config.user}`);
console.log(`  Pass: ${config.pass.substring(0, 3)}*** (hidden)`);
console.log(`  Secure: ${config.secure} (STARTTLS)\n`);

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
      subject: 'Test Email from SPANA - Port 587',
      text: 'This is a test email using port 587 with STARTTLS.',
      html: '<p>This is a test email using port 587 with STARTTLS.</p>'
    });
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);
    console.log('🎉 SMTP credentials work with port 587!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ SMTP Test Failed:\n');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Response: ${error.response}`);
    console.error(`   Message: ${error.message}\n`);
    process.exit(1);
  } finally {
    transporter.close();
  }
}

test();
