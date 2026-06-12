const express = require('express');
const { 
    register, login, getProfile, logout, updateProfile, deleteProfile,
    forgotPassword, resetPassword, changePassword, verifyEmail, sendOtp, verifyOtp, resendVerification
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);
router.post('/verify-email', verifyEmail);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-verification', resendVerification);

module.exports = router;
