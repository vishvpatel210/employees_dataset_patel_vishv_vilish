const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
    logger, 
    requestTime, 
    rateLimitMock, 
    roleCheck, 
    validation, 
    auditLog 
} = require('../middlewares/practiceMiddlewares');

const router = express.Router();

router.get('/logger', logger, (req, res) => {
    res.status(200).json({ success: true, message: 'Logger middleware executed. Check server console.' });
});

router.get('/auth', protect, (req, res) => {
    res.status(200).json({ success: true, message: 'Auth middleware passed. You are authenticated.' });
});

router.get('/rate-limit', rateLimitMock, (req, res) => {
    res.status(200).json({ success: true, message: 'Rate limit middleware applied. Headers set.' });
});

router.get('/error-handler', (req, res, next) => {
    const error = new Error('This is a practice error triggered intentionally');
    error.statusCode = 500;
    next(error);
});

router.get('/request-time', requestTime, (req, res) => {
    res.status(200).json({ success: true, requestTime: req.requestTime });
});

router.get('/role-check', roleCheck('Admin'), (req, res) => {
    res.status(200).json({ success: true, message: 'Role check middleware passed.' });
});

router.get('/validation', validation, (req, res) => {
    res.status(200).json({ success: true, message: 'Validation middleware passed.' });
});

router.get('/audit-log', auditLog, (req, res) => {
    res.status(200).json({ success: true, message: 'Audit log created. Check server console.' });
});

module.exports = router;
