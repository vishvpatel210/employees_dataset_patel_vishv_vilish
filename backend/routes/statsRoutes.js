const express = require('express');
const {
    getTotalEmployees,
    getAverageExperience,
    getTopExperienceEmployee,
    getTotalProjects,
    getTotalTasks,
    getCountryCount,
    getStateCount,
    getDomainCount,
    getSkillCount,
    getCertificationCount,
    getTimezoneCount,
    getVerifiedCount,
    getProjectDistribution,
    getTaskDistribution,
    getTechnologyCount
} = require('../controllers/statsController');

const router = express.Router();

router.get('/count', getTotalEmployees);
router.get('/experience-average', getAverageExperience);
router.get('/top-experience', getTopExperienceEmployee);
router.get('/project-count', getTotalProjects);
router.get('/task-count', getTotalTasks);
router.get('/country-count', getCountryCount);
router.get('/state-count', getStateCount);
router.get('/domain-count', getDomainCount);
router.get('/skill-count', getSkillCount);
router.get('/certification-count', getCertificationCount);
router.get('/timezone-count', getTimezoneCount);
router.get('/verified-count', getVerifiedCount);
router.get('/project-distribution', getProjectDistribution);
router.get('/task-distribution', getTaskDistribution);
router.get('/technology-count', getTechnologyCount);

module.exports = router;
