const Booking = require('../models/Booking');
const Company = require('../models/Company');

// 獲取公司的訂單列表
exports.getCompanyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ company: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('獲取訂單列表時出錯:', err.message);
    res.status(500).send('服務器錯誤');
  }
};

// 更新公司的可用狀態
exports.updateCompanyAvailability = async (req, res) => {
  const { isAvailable } = req.body;

  try {
    const company = await Company.findById(req.user.id);
    if (!company) {
      return res.status(404).json({ msg: '公司未找到' });
    }

    company.isAvailable = isAvailable;
    await company.save();

    res.json(company);
  } catch (err) {
    console.error('更新可用狀態時出錯:', err.message);
    res.status(500).send('服務器錯誤');
  }
};