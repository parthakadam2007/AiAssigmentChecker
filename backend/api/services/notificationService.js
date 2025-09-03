const nodemailer = require('nodemailer');

// CORRECTED: use createTransport (not createTransporter)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmergencyNotification = async (students, message) => {
  const results = {
    sent: 0,
    failed: 0,
    details: []
  };
  
  for (const student of students) {
    try {
      let channels = [];
      
      // Send email only
      if (student.email) {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: '🚨 EMERGENCY NOTIFICATION',
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #ff0000; border-radius: 10px; padding: 20px;">
              <h2 style="color: #ff0000; text-align: center; background-color: #fff0f0; padding: 15px; border-radius: 5px;">
                🚨 EMERGENCY ALERT
              </h2>
              <p style="font-size: 16px; line-height: 1.5; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                ${message}
              </p>
              <hr style="border: 1px solid #ddd;">
              <p style="font-size: 14px; color: #666;">
                This is an automated emergency notification from your educational institution.<br>
                Please follow any instructions provided by your teacher immediately.
              </p>
              <div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
                <small>Sent via Classroom Emergency System</small>
              </div>
            </div>
          `
        });
        channels.push('email');
        results.sent++;
      } else {
        throw new Error('No email address available');
      }
      
      results.details.push({
        studentId: student.student_id,
        name: `${student.first_name} ${student.last_name}`,
        status: 'success',
        channels: channels
      });
    } catch (error) {
      console.error(`Failed to notify student ${student.student_id}:`, error);
      results.failed++;
      results.details.push({
        studentId: student.student_id,
        name: `${student.first_name} ${student.last_name}`,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  return results;
};

module.exports = {
  sendEmergencyNotification
};