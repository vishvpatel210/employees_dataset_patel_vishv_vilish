const User = require("../models/userModel");
const Employee = require("../models/Employee");
const jwt = require('jsonwebtoken');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d' // typical standard
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const existingEmployee = await Employee.findOne({ 'profile.contact.email': email });
        if (!existingEmployee) {
            await Employee.create({
                id: `EMP-${Date.now()}`,
                name,
                profile: {
                    contact: {
                        email,
                        phone: 'N/A'
                    }
                },
                user: user._id
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Logged out successfully', token: null });
};

// @desc    Update current logged in user profile
// @route   PATCH /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete current logged in user profile
// @route   DELETE /api/v1/auth/profile
// @access  Private
exports.deleteProfile = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ success: true, message: 'Profile deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Password reset link sent to email' });
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
};

// @desc    Change current password
// @route   POST /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Password changed successfully' });
};

// @desc    Verify email address
// @route   POST /api/v1/auth/verify-email
// @access  Public/Private
exports.verifyEmail = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Email verified successfully' });
};

// @desc    Send OTP code
// @route   POST /api/v1/auth/send-otp
// @access  Public/Private
exports.sendOtp = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'OTP sent to your registered email/phone' });
};

// @desc    Verify OTP code
// @route   POST /api/v1/auth/verify-otp
// @access  Public/Private
exports.verifyOtp = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
};

// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
// @access  Public/Private
exports.resendVerification = async (req, res, next) => {
    res.status(200).json({ success: true, message: 'Verification email resent' });
};
