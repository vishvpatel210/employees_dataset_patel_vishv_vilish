const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const jwtController = require('../controllers/jwtController');
const { getEmployees } = require('../controllers/employeeController');
const { getProjects } = require('../controllers/projectController');
const { getTasks } = require('../controllers/taskController');
const { getTopSkills } = require('../controllers/analyticsController'); 

const router = express.Router();

router.get('/profile', protect, jwtController.getProfile);
router.get('/dashboard', protect, jwtController.getDashboard);

router.post('/generate-token', jwtController.generateToken);
router.post('/verify-token', jwtController.verifyToken);
router.post('/refresh-token', jwtController.refreshToken);
router.delete('/revoke-token', protect, jwtController.revokeToken);

// Reusing existing controllers for private data access via JWT
router.get('/private-employees', protect, getEmployees);
router.get('/private-projects', protect, getProjects);
router.get('/private-tasks', protect, getTasks);
router.get('/private-analytics', protect, getTopSkills); 

module.exports = router;
