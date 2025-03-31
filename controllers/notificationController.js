const transporter = require('../config/email');

// 發送郵件通知
exports.sendEmailNotification = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('郵件通知已發送');
  } catch (err) {
    console.error('郵件通知發送失敗', err);
  }
};