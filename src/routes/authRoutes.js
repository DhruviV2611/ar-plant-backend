const express = require('express');
const router = express.Router();
const { register, login ,updateUserProfile,getUserDetails} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/getUserDetails', authMiddleware, getUserDetails); 

module.exports = router;
