const jwt = require('jsonwebtoken');

// @desc    Access JWT protected employee profile
// @route   GET /api/v1/jwt/profile
// @access  Private
exports.getProfile = (req, res) => {
    res.status(200).json({ success: true, data: req.user });
};

// @desc    Access JWT protected dashboard
// @route   GET /api/v1/jwt/dashboard
// @access  Private
exports.getDashboard = (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome to the protected dashboard' });
};

// @desc    Generate JWT token
// @route   POST /api/v1/jwt/generate-token
// @access  Public
exports.generateToken = (req, res) => {
    // Generates a mock token for practice purposes
    const payload = req.body.payload || { id: 'practice-user-id', role: 'User' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.status(200).json({ success: true, token, message: 'Practice JWT token generated' });
};

// @desc    Verify JWT token
// @route   POST /api/v1/jwt/verify-token
// @access  Public
exports.verifyToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: 'Please provide a token in the request body' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        res.status(200).json({ success: true, message: 'Token is valid', decoded });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token', error: err.message });
    }
};

// @desc    Refresh JWT access token
// @route   POST /api/v1/jwt/refresh-token
// @access  Public
exports.refreshToken = (req, res) => {
    // In practice, this would check a refresh token from cookies/body
    const token = jwt.sign({ id: 'practice-user-id', role: 'User' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.status(200).json({ success: true, token, message: 'Token refreshed successfully' });
};

// @desc    Revoke JWT token
// @route   DELETE /api/v1/jwt/revoke-token
// @access  Private
exports.revokeToken = (req, res) => {
    // In stateless JWT, revoking usually means blacklisting the token in a DB or clearing it on the client
    res.status(200).json({ success: true, message: 'Token revoked successfully (please clear from client)' });
};
