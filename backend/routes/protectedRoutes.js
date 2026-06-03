const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createEmployee, replaceEmployee, deleteEmployee } = require('../controllers/employeeController');
const { createProject, updateProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Employee Protected Routes
router.post('/employees', createEmployee);
router.patch('/employees/:id', replaceEmployee);
router.delete('/employees/:id', deleteEmployee);

// Project Protected Routes
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

module.exports = router;
