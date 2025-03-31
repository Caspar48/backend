/**
 * routes/contactRoutes.js
 * 
 * 定義聯繫我們接口：POST /api/contact
 */
const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

router.post('/', submitContact);

module.exports = router;
