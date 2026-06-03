const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getEmployees } = require('../controllers/employeeController');
const { getProjects } = require('../controllers/projectController');
const { getTasks } = require('../controllers/taskController');
const { getTopCertifications } = require('../controllers/analyticsController');

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('Admin'));

router.get('/employees', getEmployees);
router.get('/projects', getProjects);
router.get('/tasks', getTasks);
router.get('/certifications', getTopCertifications);

module.exports = router;
