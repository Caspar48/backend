const express = require('express')
const router = express.Router()

router.get('/health-check', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  })
})

module.exports = router