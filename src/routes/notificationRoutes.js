// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { sendTestNotification,saveFcmToken,getNotificationHistory } = require('../controllers/notificationController');
const { protect } = require('../middleWare/authMiddleware');

router.post('/save-token', protect, saveFcmToken);
router.post('/send-test', protect, sendTestNotification);
router.get('/notificationHistory', protect, getNotificationHistory);


module.exports = router;
