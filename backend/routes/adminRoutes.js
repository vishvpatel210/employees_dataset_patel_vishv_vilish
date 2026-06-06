const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getDashboardStats,
    getUsers,
    getUser,
    updateUserRole,
    deleteUser,
} = require('../controllers/adminController');
const { strictLimiter } = require('../middlewares/rateLimitMiddleware');
const { getEmployees } = require('../controllers/employeeController');
const { getProjects } = require('../controllers/projectController');
const { getTasks } = require('../controllers/taskController');
const { getTopCertifications } = require('../controllers/analyticsController');

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('Admin'));
router.use(strictLimiter);

router.get('/dashboard', getDashboardStats);
router.get('/employees', getEmployees);
router.get('/projects', getProjects);
router.get('/tasks', getTasks);
router.get('/certifications', getTopCertifications);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
