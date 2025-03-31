/**
 * controllers/driverController.js
 * 
 * 包含兩個功能：
 * 1. 獲取司機的訂單列表：從 Booking 模型中查詢當前司機的所有預訂記錄。
 * 2. 更新司機的可用狀態：更新 Driver 模型中對應司機的 isAvailable 屬性。
 */

const Booking = require('../models/Booking');
const Driver = require('../models/Driver');

/**
 * 獲取司機的訂單列表
 * @param {object} req - Express 請求對象，包含已驗證的 req.user.id
 * @param {object} res - Express 響應對象
 */
exports.getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('獲取訂單列表時出錯:', err.message);
    res.status(500).send('服務器錯誤');
  }
};

/**
 * 更新司機的可用狀態
 * @param {object} req - Express 請求對象，包含 req.user.id 與 req.body.isAvailable
 * @param {object} res - Express 響應對象
 */
exports.updateDriverAvailability = async (req, res) => {
  const { isAvailable } = req.body;

  // 檢查 isAvailable 是否存在且為布林值
  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ msg: '請提供正確的 isAvailable 布林值' });
  }

  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) {
      return res.status(404).json({ msg: '司機未找到' });
    }

    driver.isAvailable = isAvailable;
    await driver.save();

    res.json(driver);
  } catch (err) {
    console.error('更新可用狀態時出錯:', err.message);
    res.status(500).send('服務器錯誤');
  }
};
