const nodemailer = require('nodemailer');

const config = {
  host: 'mail.spana.co.za',
  port: 465,
  user: 'no-reply@spana.co.za',
  pass: 'ProjectSpana@2028',  // Correct mixed case password
  secure: true,
  from: 'no-reply@spana.co.za'
};

console.log('🧪 Testing SMTP with correct password (ProjectSpana@2028)...\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  User: ${config.user}`);
console.log(`  Pass: ${config.pass.substring(0, 3)}*** (hidden)`);
console.log(`  Secure: ${config.secure}\n`);

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: { user: config.user, pass: config.pass },
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
      subject: 'Test Email from SPANA - Password Fixed!',
      text: 'This is a test email to verify SMTP credentials are working.',
      html: '<p>This is a test email to verify SMTP credentials are working.</p>'
    });
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);
    console.log('🎉 SMTP credentials are correct!\n');
    console.log('📬 Check your inbox at eksnxiweni@gmail.com!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ SMTP Test Failed:\n');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Response: ${error.response}`);
    console.error(`   Message: ${error.message}\n`);
    if (error.code === 'EAUTH') {
      console.error('🔴 Authentication Failed!');
      console.error('   Password might still be incorrect or SMTP requires different settings.\n');
    }
    process.exit(1);
  } finally {
    transporter.close();
  }
}

test();
