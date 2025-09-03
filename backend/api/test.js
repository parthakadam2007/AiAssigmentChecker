require('dotenv').config();
const nodemailer = require('nodemailer');

// Email configuration - CORRECTED: use createTransport (not createTransporter)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const testStudents = [
  {
    student_id: 1,
    first_name: 'Test',
    last_name: 'Student',
    email: process.env.TEST_EMAIL || 'test@example.com' // Replace with your email for testing
  }
];

const testMessage = 'TEST: This is a test of the emergency notification system. Please acknowledge receipt.';

const sendTestEmail = async (student) => {
  try {
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: '🚨 TEST EMERGENCY NOTIFICATION',
      text: testMessage,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #ff0000; border-radius: 10px; padding: 20px;">
          <h2 style="color: #ff0000; text-align: center; background-color: #fff0f0; padding: 15px; border-radius: 5px;">
            🚨 TEST EMERGENCY ALERT
          </h2>
          <p style="font-size: 16px; line-height: 1.5; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${testMessage}
          </p>
          <hr style="border: 1px solid #ddd;">
          <p style="font-size: 14px; color: #666;">
            This is a test email from the emergency notification system.<br>
            If this were a real emergency, please follow your teacher's instructions.
          </p>
          <div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
            <small>Sent via Classroom Emergency System</small>
          </div>
        </div>
      `
    });
    
    console.log(`✅ Email sent successfully to: ${student.email}`);
    console.log(`   Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${student.email}:`, error.message);
    return false;
  }
};

const testEmailSystem = async () => {
  console.log('📧 Testing email notification system...\n');
  console.log('From:', process.env.EMAIL_USER);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const student of testStudents) {
    console.log(`\nAttempting to send to: ${student.email}`);
    const success = await sendTestEmail(student);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    // Add a small delay between emails
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Test completed: ${successCount} successful, ${failureCount} failed`);
  
  if (failureCount > 0) {
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your EMAIL_USER and EMAIL_PASSWORD in .env file');
    console.log('2. Make sure you\'re using an App Password, not your regular Gmail password');
    console.log('3. Ensure 2-factor authentication is enabled on your Gmail account');
    console.log('4. Check if "Less secure app access" is enabled (though App Passwords are better)');
  }
};

// Check if environment variables are loaded
console.log('🔍 Checking environment variables...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Loaded' : '❌ Not found');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Loaded' : '❌ Not found');
console.log('TEST_EMAIL:', process.env.TEST_EMAIL || 'Using default test@example.com');

testEmailSystem().catch(console.error);