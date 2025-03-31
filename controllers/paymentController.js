/**
 * paymentController.js
 * 主要用于处理支付订单的创建
 */

const alipaySdk = require('../config/alipay');
const Booking = require('../models/Booking');

/**
 * 創建支付訂單
 * 接收前端传来的 bookingId，并利用 Booking 信息创建支付订单
 * @param {Object} req - 请求对象，包含 bookingId 参数
 * @param {Object} res - 响应对象，返回支付链接或错误信息
 */
exports.createPayment = async (req, res) => {
  const { bookingId } = req.body;

  try {
    // 检查 Alipay SDK 是否加载成功
    if (!alipaySdk) {
      console.warn('Alipay 未啟用，支付功能暫不可用');
      return res.status(503).json({ msg: '支付功能暫不可用' });
    }

    // 根据 bookingId 查询预订记录
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: '預約未找到' });
    }

    // 若 Booking 已包含实际金额，则使用 booking.totalAmount，否则使用默认值
    const totalAmount = booking.totalAmount ? booking.totalAmount.toFixed(2) : '100.00';

    // 此处可以扩展：若 booking.paymentStatus 已为 '已支付' 则不允许重复支付

    const paymentData = {
      subject: '車輛預約服務',
      out_trade_no: bookingId, // 使用預約ID作為訂單號
      total_amount: totalAmount,
      product_code: 'FAST_INSTANT_TRADE_PAY',
    };

    // 调用支付宝 SDK 创建支付订单，获得支付页面链接
    const result = await alipaySdk.pageExec('alipay.trade.page.pay', {
      method: 'POST',
      bizContent: paymentData,
      returnUrl: 'http://localhost:3000/payment/success', // 支付成功后跳转页面
    });

    // 返回支付链接给前端
    res.json({ paymentUrl: result });
  } catch (err) {
    console.error('創建支付訂單時出錯:', err.message);
    res.status(500).send('服務器錯誤');
  }
};
