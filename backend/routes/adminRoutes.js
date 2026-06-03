const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getEmployees } = require('../controllers/employeeController');
const { getProjects } = require('../controllers/projectController');
const { getTasks } = require('../controllers/taskController');
const { getTopCertifications } = require('../controllers/analyticsController');
const { strictLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('Admin'));
router.use(strictLimiter); // Protect admin routes with strict limits

router.get('/dashboard', (req, res) => res.status(200).json({ success: true, message: 'Admin dashboard' }));
router.get('/employees', getEmployees);
router.get('/projects', getProjects);
router.get('/tasks', getTasks);
router.get('/certifications', getTopCertifications);

module.exports = router;
