/**
 * bookingController.js
 * 主要用於處理預訂創建、查詢等業務邏輯
 */

const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        // 檢查是否有登入用戶，如果有則添加用戶 ID
        const bookingData = {
            ...req.body
        };
        
        // 如果用戶已登入，添加用戶 ID
        if (req.user) {
            bookingData.userId = req.user.id;
        }

        const booking = new Booking(bookingData);
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        // 只有登入用戶才能查看其預訂記錄
        if (!req.user) {
            return res.status(401).json({ message: '請先登入以查看預訂記錄' });
        }
        const bookings = await Booking.find({ userId: req.user.id });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings
};
