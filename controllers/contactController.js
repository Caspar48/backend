/**
 * controllers/contactController.js
 * 
 * 處理「聯繫我們」表單提交，並通過 nodemailer 發送郵件通知
 */
const nodemailer = require('nodemailer');

exports.submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ msg: '請填寫所有必填字段' });
  }
  
  try {
    // 配置 nodemailer 傳輸器，這裡以 Gmail 為例（根據實際需求調整）
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // 設定郵件選項
    let mailOptions = {
      from: email, // 用戶郵箱
      to: process.env.EMAIL_USER, // 接收留言的郵箱（例如客服郵箱）
      subject: `聯繫我們 - ${name}`,
      text: message,
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ msg: '提交成功' });
  } catch (error) {
    console.error('提交聯繫我們信息時出錯:', error.message);
    res.status(500).json({ msg: '服務器錯誤' });
  }
};
