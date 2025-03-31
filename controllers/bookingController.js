/**
 * bookingController.js
 * 主要用於處理預訂創建、查詢等業務邏輯
 */

const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const booking = new Booking({
            ...req.body,
            userId: req.user.id
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
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
