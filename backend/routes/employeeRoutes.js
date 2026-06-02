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
    getEmployeesByTimezone,
    getEmployeesByPrimarySkill,
    getEmployeesBySecondarySkill,
    getEmployeesByDomain,
    getCloudEngineers,
    getDevOpsEngineers,
    getAIEngineers,
    getFullstackDevelopers,
    getTopSkills
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
    .route('/cloud-engineers')
    .get(getCloudEngineers);

router
    .route('/devops-engineers')
    .get(getDevOpsEngineers);

router
    .route('/ai-engineers')
    .get(getAIEngineers);

router
    .route('/fullstack')
    .get(getFullstackDevelopers);

router
    .route('/top-skills')
    .get(getTopSkills);

router
    .route('/primary-skill/:skill')
    .get(getEmployeesByPrimarySkill);

router
    .route('/secondary-skill/:skill')
    .get(getEmployeesBySecondarySkill);

router
    .route('/domain/:domain')
    .get(getEmployeesByDomain);

router
    .route('/:id')
    .get(getEmployee)
    .put(authorize('Admin', 'HR'), replaceEmployee)
    .patch(authorize('Admin', 'HR'), updateEmployee)
    .delete(authorize('Admin', 'HR'), deleteEmployee);

module.exports = router;
