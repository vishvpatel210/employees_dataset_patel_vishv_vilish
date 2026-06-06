import api from './api';

/* ────────── Core CRUD ────────── */
export const getEmployees = (params) => api.get('/employees', { params });

export const getEmployeeById = (id) => api.get(`/employees/${id}`);

export const createEmployee = (data) => api.post('/employees', data);

export const replaceEmployee = (id, data) => api.put(`/employees/${id}`, data);

export const updateEmployee = (id, data) => api.patch(`/employees/${id}`, data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

/* ────────── Existence ────────── */
export const employeeExists = (id) => api.get(`/employees/exists/${id}`);

/* ────────── Bulk Operations ────────── */
export const bulkCreateEmployees = (data) => api.post('/employees/bulk-create', data);

export const importEmployeesJson = (data) => api.post('/employees/import-json', data);

export const bulkUpdateEmployees = (data) => api.patch('/employees/bulk-update', data);

export const bulkDeleteEmployees = (ids) => api.delete('/employees/bulk-delete', { data: { ids } });

/* ────────── Search by Name ────────── */
export const getEmployeesByName = (name, params) => api.get(`/employees/name/${name}`, { params });

/* ────────── Geo ────────── */
export const getEmployeesByState = (state, params) => api.get(`/employees/state/${state}`, { params });

export const getEmployeesByCountry = (country, params) => api.get(`/employees/country/${country}`, { params });

export const getEmployeesByCity = (city, params) => api.get(`/employees/city/${city}`, { params });

export const getEmployeesByTimezone = (timezone, params) => api.get(`/employees/timezone/${timezone}`, { params });

/* ────────── Skills & Domains ────────── */
export const getEmployeesByPrimarySkill = (skill, params) => api.get(`/employees/primary-skill/${skill}`, { params });

export const getEmployeesBySecondarySkill = (skill, params) =>
  api.get(`/employees/secondary-skill/${skill}`, { params });

export const getEmployeesByDomain = (domain, params) => api.get(`/employees/domain/${domain}`, { params });

export const getCloudEngineers = (params) => api.get('/employees/cloud-engineers', { params });

export const getDevOpsEngineers = (params) => api.get('/employees/devops-engineers', { params });

export const getAIEngineers = (params) => api.get('/employees/ai-engineers', { params });

export const getFullstackDevelopers = (params) => api.get('/employees/fullstack', { params });

export const getTopSkills = () => api.get('/employees/top-skills');

/* ────────── Experience & Certifications ────────── */
export const getEmployeesByExperience = (years, params) => api.get(`/employees/experience/${years}`, { params });

export const getTopExperience = () => api.get('/employees/top-experience');

export const getEmployeesByCertification = (certification, params) =>
  api.get(`/employees/certification/${certification}`, { params });

export const getRecentCertifications = () => api.get('/employees/recent-certifications');

export const getVerifiedEmployees = (params) => api.get('/employees/verified', { params });

/* ────────── Projects & Tasks Lookup ────────── */
export const getEmployeeProjects = () => api.get('/employees/projects');

export const getEmployeeTasks = () => api.get('/employees/tasks');

export const getEmployeesByProject = (projectId, params) => api.get(`/employees/project/${projectId}`, { params });

export const getEmployeeByTask = (taskId, params) => api.get(`/employees/task/${taskId}`, { params });

/* ────────── Search ────────── */
export const searchEmployees = (q, params) => api.get('/search/employees', { params: { q, ...params } });

/* ────────── Sort / Filter / Performance ────────── */
export const getSortedEmployees = (sortType, params) => api.get(`/employees/sort/${sortType}`, { params });

export const getFilteredEmployees = (filterType, params) => api.get(`/employees/filter/${filterType}`, { params });

export const getEmployeePerformance = (id) => api.get(`/employees/performance/${id}`);

export const getEmployeeStatsById = (id) => api.get(`/employees/stats/${id}`);

/* ────────── Validation ────────── */
export const validateCertifications = (data) => api.post('/employees/certifications', data);

export const validateGeo = (data) => api.post('/employees/geo', data);

/* ────────── Discovery / Insights / Alerts ────────── */
export const getRandomEmployee = () => api.get('/employees/random');

export const getEmployeeHeatmap = () => api.get('/employees/heatmap');

export const getEmployeeDashboard = () => api.get('/employees/dashboard');

export const getLiveSearch = () => api.get('/employees/live-search');

export const getTrendingSkills = () => api.get('/employees/trending-skills');

export const getRecentEmployees = () => api.get('/employees/recent');

export const getEmployeeRecommendations = () => api.get('/employees/recommendations');

export const getPerformancePredictions = () => api.get('/employees/predictions/performance');

export const getProjectFitPredictions = () => api.get('/employees/predictions/project-fit');

export const getTopPerformersSegment = () => api.get('/employees/segments/top-performers');

export const getCloudEngineersSegment = () => api.get('/employees/segments/cloud-engineers');

export const getDevOpsSegment = () => api.get('/employees/segments/devops');

export const getAIEngineersSegment = () => api.get('/employees/segments/ai-engineers');

export const getFullstackSegment = () => api.get('/employees/segments/fullstack');

export const getCountryHeatmap = () => api.get('/employees/heatmap/countries');

export const getStateHeatmap = () => api.get('/employees/heatmap/states');

export const getSkillHeatmap = () => api.get('/employees/heatmap/skills');

export const getProjectInsights = () => api.get('/employees/insights/projects');

export const getTaskInsights = () => api.get('/employees/insights/tasks');

export const getCertificationInsights = () => api.get('/employees/insights/certifications');

export const getExpiredCertificationAlerts = () => api.get('/employees/alerts/expired-certifications');

export const getHighWorkloadAlerts = () => api.get('/employees/alerts/high-workload');

export const getProjectDelayAlerts = () => api.get('/employees/alerts/project-delays');

export const submitEmployeeReport = (data) => api.post('/employees/report', data);

export const clearEmployeeCache = () => api.post('/employees/cache/clear');

export const getSystemHealth = () => api.get('/employees/system/health');

export const getSystemVersion = () => api.get('/employees/system/version');

export const getSystemConfig = () => api.get('/employees/system/config');

export const getSystemLogs = () => api.get('/employees/system/logs');

export const getApiLogs = () => api.get('/employees/logs');
