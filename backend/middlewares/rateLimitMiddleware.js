const rateLimitMap = new Map();

exports.createRateLimiter = ({ windowMs, max, message }) => {
    return (req, res, next) => {
        // Use IP address as the key
        const key = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        
        if (!rateLimitMap.has(key)) {
            rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        const requestData = rateLimitMap.get(key);
        
        // If window has passed, reset counter
        if (now > requestData.resetTime) {
            requestData.count = 1;
            requestData.resetTime = now + windowMs;
            return next();
        }
        
        requestData.count++;
        
        // If limit exceeded, block
        if (requestData.count > max) {
            return res.status(429).json({
                success: false,
                message: message || 'Too many requests from this IP, please try again later.'
            });
        }
        
        next();
    };
};

// Preset limiters for different practice scenarios
exports.standardLimiter = exports.createRateLimiter({ 
    windowMs: 60 * 1000, 
    max: 60, 
    message: 'Standard rate limit exceeded. Max 60 requests per minute.' 
});

exports.strictLimiter = exports.createRateLimiter({ 
    windowMs: 60 * 1000, 
    max: 10, 
    message: 'Strict rate limit exceeded. Max 10 requests per minute.' 
});

exports.authLimiter = exports.createRateLimiter({ 
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 5, 
    message: 'Too many authentication attempts. Please try again after 15 minutes.' 
});

exports.heavyApiLimiter = exports.createRateLimiter({ 
    windowMs: 60 * 1000, 
    max: 20, 
    message: 'Heavy API rate limit exceeded. Max 20 analytics/search requests per minute.' 
});
