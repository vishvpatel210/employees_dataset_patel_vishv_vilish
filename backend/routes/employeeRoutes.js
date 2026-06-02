const express = require('express');
const {
    getEmployees,
    getEmployee,
    createEmployee,
    replaceEmployee,
    updateEmployee,
    deleteEmployee,
    employeeExists,
    bulkCreateEmployees,
    bulkUpdateEmployees,
    bulkDeleteEmployees,
    getEmployeesByState,
    getEmployeesByCountry,
    getEmployeesByCity,
    getEmployeesByTimezone
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
    .route('/exists/:id')
    .get(employeeExists);

router
    .route('/bulk-create')
    .post(authorize('Admin', 'HR'), bulkCreateEmployees);

router
    .route('/bulk-update')
    .patch(authorize('Admin', 'HR'), bulkUpdateEmployees);

router
    .route('/bulk-delete')
    .delete(authorize('Admin', 'HR'), bulkDeleteEmployees);

router
    .route('/state/:state')
    .get(getEmployeesByState);

router
    .route('/country/:country')
    .get(getEmployeesByCountry);

router
    .route('/city/:city')
    .get(getEmployeesByCity);

router
    .route('/timezone/:timezone')
    .get(getEmployeesByTimezone);

router
    .route('/:id')
    .get(getEmployee)
    .put(authorize('Admin', 'HR'), replaceEmployee)
    .patch(authorize('Admin', 'HR'), updateEmployee)
    .delete(authorize('Admin', 'HR'), deleteEmployee);

module.exports = router;
