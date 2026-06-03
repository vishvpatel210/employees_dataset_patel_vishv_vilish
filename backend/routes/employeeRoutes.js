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
    getTopSkills,
    getEmployeesByExperience,
    getEmployeesByCertification,
    getVerifiedEmployees,
    getRecentCertifications,
    getTopExperience,
    getEmployeeProjects,
    getEmployeeTasks,
    getEmployeesByName,
    getEmployeesByProject,
    getEmployeeByTask,
    getEmployeePerformance,
    getEmployeeStats,
    getSortedEmployees,
    getFilteredEmployees,
    validateCertifications,
    validateGeo
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
    .route('/import-json')
    .post(authorize('Admin', 'HR'), bulkCreateEmployees);

router
    .route('/certifications')
    .post(authorize('Admin', 'HR'), validateCertifications);

router
    .route('/geo')
    .post(authorize('Admin', 'HR'), validateGeo);

// Mock visualization/analytics routes for rate limit practice
router.get('/random', (req, res) => res.status(200).json({ success: true, message: 'Random API hit' }));
router.get('/heatmap', (req, res) => res.status(200).json({ success: true, message: 'Heatmap API hit' }));
router.get('/dashboard', (req, res) => res.status(200).json({ success: true, message: 'Dashboard API hit' }));
router.get('/live-search', (req, res) => res.status(200).json({ success: true, message: 'Live search API hit' }));

// Advanced Practice Routes
router.get('/trending-skills', (req, res) => res.status(200).json({ success: true, message: 'Trending skills data' }));
router.get('/recent', (req, res) => res.status(200).json({ success: true, message: 'Recently added employees' }));
router.get('/recommendations', (req, res) => res.status(200).json({ success: true, message: 'Employee recommendations' }));

router.get('/predictions/performance', (req, res) => res.status(200).json({ success: true, message: 'Performance predictions' }));
router.get('/predictions/project-fit', (req, res) => res.status(200).json({ success: true, message: 'Project fit predictions' }));

router.get('/segments/top-performers', (req, res) => res.status(200).json({ success: true, message: 'Top performers segment' }));
router.get('/segments/cloud-engineers', (req, res) => res.status(200).json({ success: true, message: 'Cloud engineers segment' }));
router.get('/segments/devops', (req, res) => res.status(200).json({ success: true, message: 'DevOps engineers segment' }));
router.get('/segments/ai-engineers', (req, res) => res.status(200).json({ success: true, message: 'AI engineers segment' }));
router.get('/segments/fullstack', (req, res) => res.status(200).json({ success: true, message: 'Fullstack segment' }));

router.get('/heatmap/countries', (req, res) => res.status(200).json({ success: true, message: 'Country heatmap data' }));
router.get('/heatmap/states', (req, res) => res.status(200).json({ success: true, message: 'State heatmap data' }));
router.get('/heatmap/skills', (req, res) => res.status(200).json({ success: true, message: 'Skill heatmap data' }));

router.get('/insights/projects', (req, res) => res.status(200).json({ success: true, message: 'Project insights' }));
router.get('/insights/tasks', (req, res) => res.status(200).json({ success: true, message: 'Task insights' }));
router.get('/insights/certifications', (req, res) => res.status(200).json({ success: true, message: 'Certification insights' }));

router.get('/alerts/expired-certifications', (req, res) => res.status(200).json({ success: true, message: 'Expired certification alerts' }));
router.get('/alerts/high-workload', (req, res) => res.status(200).json({ success: true, message: 'High workload alerts' }));
router.get('/alerts/project-delays', (req, res) => res.status(200).json({ success: true, message: 'Project delay alerts' }));

router.post('/report', (req, res) => res.status(200).json({ success: true, message: 'Issue report submitted successfully' }));
router.post('/cache/clear', (req, res) => res.status(200).json({ success: true, message: 'Employee cache cleared' }));

router.get('/system/health', (req, res) => res.status(200).json({ success: true, status: 'Healthy', version: '1.0.0' }));
router.get('/system/version', (req, res) => res.status(200).json({ success: true, version: '1.0.0' }));
router.get('/system/config', (req, res) => res.status(200).json({ success: true, config: { features: ['search', 'analytics'] } }));
router.get('/system/logs', (req, res) => res.status(200).json({ success: true, message: 'System logs fetched' }));
router.get('/logs', (req, res) => res.status(200).json({ success: true, message: 'API System logs' }));

// Good to Have explicit HEAD/OPTIONS wrappers for documentation practice
router.head('/', (req, res) => res.status(200).end());
router.head('/:id', (req, res) => res.status(200).end());
router.head('/projects', (req, res) => res.status(200).end());
router.options('/', (req, res) => {
    res.set('Allow', 'GET, POST, HEAD, OPTIONS');
    res.status(204).end();
});
router.options('/:id', (req, res) => {
    res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.status(204).end();
});

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
    .route('/verified')
    .get(getVerifiedEmployees);

router
    .route('/recent-certifications')
    .get(getRecentCertifications);

router
    .route('/top-experience')
    .get(getTopExperience);

router
    .route('/experience/:years')
    .get(getEmployeesByExperience);

router
    .route('/certification/:certification')
    .get(getEmployeesByCertification);

router
    .route('/projects')
    .get(getEmployeeProjects);

router
    .route('/tasks')
    .get(getEmployeeTasks);

router
    .route('/name/:name')
    .get(getEmployeesByName);

router
    .route('/project/:projectId')
    .get(getEmployeesByProject);

router
    .route('/task/:taskId')
    .get(getEmployeeByTask);

router
    .route('/performance/:id')
    .get(getEmployeePerformance);

router
    .route('/stats/:id')
    .get(getEmployeeStats);

router
    .route('/sort/:sortType')
    .get(getSortedEmployees);

router
    .route('/filter/:filterType')
    .get(getFilteredEmployees);

router
    .route('/:id')
    .get(getEmployee)
    .put(authorize('Admin', 'HR'), replaceEmployee)
    .patch(authorize('Admin', 'HR'), updateEmployee)
    .delete(authorize('Admin', 'HR'), deleteEmployee);

module.exports = router;
