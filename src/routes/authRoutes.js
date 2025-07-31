const express = require('express');
const router = express.Router();
const { register, login ,updateUserProfile} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
