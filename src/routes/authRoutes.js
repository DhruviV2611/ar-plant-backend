const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updateUserProfile,
  getUserDetails,
} = require('../controllers/authController');
const { protect } = require('../middleWare/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateUserProfile);
router.get('/getUserDetails', protect, getUserDetails);

module.exports = router;
