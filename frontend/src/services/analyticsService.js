import api from './api';

/* ────────── Analytics ────────── */
export const getTopSkills = () => api.get('/analytics/employees/top-skills');

export const getTopDomains = () => api.get('/analytics/employees/top-domains');

export const getTopCertifications = () => api.get('/analytics/employees/top-certifications');

export const getTopProjects = () => api.get('/analytics/employees/top-projects');

export const getTopTechnologies = () => api.get('/analytics/employees/top-technologies');

export const getTimezoneAnalysis = () => api.get('/analytics/employees/timezone-analysis');

export const getLocationAnalysis = () => api.get('/analytics/employees/location-analysis');

export const getExperienceAnalysis = () => api.get('/analytics/employees/experience-analysis');

export const getVerificationAnalysis = () => api.get('/analytics/employees/verification-analysis');

export const getProjectAnalysis = () => api.get('/analytics/employees/project-analysis');

export const getTaskAnalysis = () => api.get('/analytics/employees/task-analysis');

export const getSkillDistribution = () => api.get('/analytics/employees/skill-distribution');

export const getDomainDistribution = () => api.get('/analytics/employees/domain-distribution');

export const getCountryAnalysis = () => api.get('/analytics/employees/country-analysis');

export const getStateAnalysis = () => api.get('/analytics/employees/state-analysis');

/* ────────── Stats ────────── */
export const getEmployeeCount = () => api.get('/stats/employees/count');

export const getAverageExperience = () => api.get('/stats/employees/experience-average');

export const getTopExperienceStats = () => api.get('/stats/employees/top-experience');

export const getProjectCount = () => api.get('/stats/employees/project-count');

export const getTaskCount = () => api.get('/stats/employees/task-count');

export const getCountryCount = () => api.get('/stats/employees/country-count');

export const getStateCount = () => api.get('/stats/employees/state-count');

export const getDomainCount = () => api.get('/stats/employees/domain-count');

export const getSkillCount = () => api.get('/stats/employees/skill-count');

export const getCertificationCount = () => api.get('/stats/employees/certification-count');

export const getTimezoneCount = () => api.get('/stats/employees/timezone-count');

export const getVerifiedCount = () => api.get('/stats/employees/verified-count');

export const getProjectDistribution = () => api.get('/stats/employees/project-distribution');

export const getTaskDistribution = () => api.get('/stats/employees/task-distribution');

export const getTechnologyCount = () => api.get('/stats/employees/technology-count');
