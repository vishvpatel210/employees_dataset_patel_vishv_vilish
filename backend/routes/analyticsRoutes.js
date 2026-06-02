const express = require('express');
const {
    getTopSkills,
    getTopDomains,
    getTopCertifications,
    getTopProjects,
    getTopTechnologies,
    getTimezoneAnalysis,
    getLocationAnalysis,
    getExperienceAnalysis,
    getVerificationAnalysis,
    getProjectAnalysis,
    getTaskAnalysis,
    getSkillDistribution,
    getDomainDistribution,
    getCountryAnalysis,
    getStateAnalysis
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/top-skills', getTopSkills);
router.get('/top-domains', getTopDomains);
router.get('/top-certifications', getTopCertifications);
router.get('/top-projects', getTopProjects);
router.get('/top-technologies', getTopTechnologies);
router.get('/timezone-analysis', getTimezoneAnalysis);
router.get('/location-analysis', getLocationAnalysis);
router.get('/experience-analysis', getExperienceAnalysis);
router.get('/verification-analysis', getVerificationAnalysis);
router.get('/project-analysis', getProjectAnalysis);
router.get('/task-analysis', getTaskAnalysis);
router.get('/skill-distribution', getSkillDistribution);
router.get('/domain-distribution', getDomainDistribution);
router.get('/country-analysis', getCountryAnalysis);
router.get('/state-analysis', getStateAnalysis);

module.exports = router;
