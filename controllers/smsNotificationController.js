/**
 * controllers/smsNotificationController.js
 * 
 * 實現短信通知功能，通過 Twilio 發送短信
 */
/**const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * 發送短信通知
 /** @param {string} toPhone - 接收短信的電話號碼（國際格式，如 +852xxxxxxxx）
 /** @param {string} message - 短信內容
 /** @returns {Promise<object>} 發送結果
 */
/** exports.sendSMSNotification = async (toPhone, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone,
    });
    return result;
  } catch (err) {
    console.error("發送短信通知失敗:", err.message);
    throw err;
  }
};*/
