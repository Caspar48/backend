"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 數據庫連接配置
 */
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI, {
        // Mongoose 6+ 不再需要這些選項
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true
        });
        logger_1.default.info(`MongoDB 已連接: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(`連接數據庫錯誤: ${error.message}`);
        }
        else {
            logger_1.default.error('連接數據庫時發生未知錯誤');
        }
        process.exit(1);
    }
};
exports.default = connectDB;
