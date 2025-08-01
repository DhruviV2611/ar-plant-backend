const express = require('express');
const router = express.Router();
const { register, login ,updateUserProfile,getUserDetails} = require('../controllers/authController');
const {protect ,verifyToken}= require('../middleWare/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.put('/profile', verifyToken, updateUserProfile);
router.get('/getUserDetails', protect, getUserDetails);

module.exports = router;