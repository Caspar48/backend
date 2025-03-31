const dotenv = require('dotenv');
dotenv.config();

let alipaySdk = null;

try {
  const AlipaySdk = require('alipay-sdk').default;
  alipaySdk = new AlipaySdk({
    appId: process.env.ALIPAY_APP_ID,
    privateKey: process.env.ALIPAY_PRIVATE_KEY,
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
    gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  });
} catch (error) {
  console.warn('Alipay SDK 未加載，支付功能暫不可用');
}

module.exports = alipaySdk;
