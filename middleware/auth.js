/**
 * auth.js
 * JWT 驗證中間件，保護需要授權的API路由
 */

const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: '未提供認證令牌' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: '認證失敗' });
    }
};

module.exports = auth;
