const bcrypt = require('bcryptjs');

const plainPassword = '123456'; // 你的密碼
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(plainPassword, salt);

console.log('加密後的密碼:', hashedPassword);