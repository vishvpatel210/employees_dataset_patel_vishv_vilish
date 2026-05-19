const express = require('express');
const {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Require authentication for all employee routes
router.use(protect);

router
    .route('/')
    .get(getEmployees)
    .post(authorize('Admin', 'HR'), createEmployee);

router
    .route('/:id')
    .get(getEmployee)
    .patch(authorize('Admin', 'HR'), updateEmployee)
    .delete(authorize('Admin', 'HR'), deleteEmployee);

module.exports = router;
