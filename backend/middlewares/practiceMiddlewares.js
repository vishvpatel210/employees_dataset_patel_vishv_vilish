// @desc Practice request logging middleware
exports.logger = (req, res, next) => {
    console.log(`[LOGGER] ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

// @desc Practice request timing middleware
exports.requestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

// @desc Practice API rate limiting middleware
exports.rateLimitMock = (req, res, next) => {
    res.setHeader('X-RateLimit-Limit', 100);
    res.setHeader('X-RateLimit-Remaining', 99);
    next();
};

// @desc Practice role based authorization middleware
exports.roleCheck = (role) => (req, res, next) => {
    // Basic mock check without full auth pipeline requirement for practice
    const userRole = req.headers['x-role'] || (req.user && req.user.role) || 'Guest';
    if (userRole !== role && userRole !== 'Admin') {
        return res.status(403).json({ success: false, message: `Role ${userRole} not authorized. Requires ${role}` });
    }
    next();
};

// @desc Practice request validation middleware
exports.validation = (req, res, next) => {
    if (req.query.failValidation === 'true') {
        return res.status(400).json({ success: false, message: 'Validation failed on purpose (practice validation)' });
    }
    next();
};

// @desc Practice audit logging middleware
exports.auditLog = (req, res, next) => {
    console.log(`[AUDIT LOG] Action: ${req.method} on ${req.originalUrl} by IP ${req.ip} at ${new Date().toISOString()}`);
    next();
};
