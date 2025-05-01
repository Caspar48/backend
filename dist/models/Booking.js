"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startLocation: {
        type: String,
        required: true
    },
    endLocation: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    passengers: {
        type: Number,
        required: true
    },
    luggage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    driverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Booking', bookingSchema);
