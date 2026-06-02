const Employee = require('../models/Employee');
const Task = require('../models/Task');

// @desc    Analyze most popular employee skills
// @route   GET /api/v1/analytics/employees/top-skills
exports.getTopSkills = async (req, res, next) => {
    try {
        const skills = await Employee.aggregate([
            { $group: { _id: '$profile.skills.primary', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ success: true, data: skills });
    } catch (err) { next(err); }
};

// @desc    Analyze most active domains
// @route   GET /api/v1/analytics/employees/top-domains
exports.getTopDomains = async (req, res, next) => {
    try {
        const domains = await Employee.aggregate([
            { $unwind: '$profile.skills.experience.domains' },
            { $group: { _id: '$profile.skills.experience.domains', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ success: true, data: domains });
    } catch (err) { next(err); }
};

// @desc    Analyze most popular certifications
// @route   GET /api/v1/analytics/employees/top-certifications
exports.getTopCertifications = async (req, res, next) => {
    try {
        const certs = await Employee.aggregate([
            { $unwind: '$profile.skills.experience.certifications.current' },
            { $group: { _id: '$profile.skills.experience.certifications.current', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ success: true, data: certs });
    } catch (err) { next(err); }
};

// @desc    Analyze project distribution
// @route   GET /api/v1/analytics/employees/top-projects
exports.getTopProjects = async (req, res, next) => {
    try {
        const projects = await Employee.aggregate([
            { $unwind: '$profile.projects' },
            { $group: { _id: '$profile.projects', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ success: true, data: projects });
    } catch (err) { next(err); }
};

// @desc    Analyze technology usage
// @route   GET /api/v1/analytics/employees/top-technologies
exports.getTopTechnologies = async (req, res, next) => {
    try {
        const tech = await Employee.aggregate([
            { $project: { allSkills: { $concatArrays: [ ["$profile.skills.primary"], { $ifNull: ["$profile.skills.secondary", []] } ] } } },
            { $unwind: '$allSkills' },
            { $group: { _id: '$allSkills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ success: true, data: tech });
    } catch (err) { next(err); }
};

// @desc    Analyze employee timezone distribution
// @route   GET /api/v1/analytics/employees/timezone-analysis
exports.getTimezoneAnalysis = async (req, res, next) => {
    try {
        const timezones = await Employee.aggregate([
            { $group: { _id: '$profile.contact.address.location.geo.timezone.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: timezones });
    } catch (err) { next(err); }
};

// @desc    Analyze employee location distribution
// @route   GET /api/v1/analytics/employees/location-analysis
exports.getLocationAnalysis = async (req, res, next) => {
    try {
        const locations = await Employee.aggregate([
            { $group: { _id: { country: '$profile.contact.address.location.country', state: '$profile.contact.address.location.state' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: locations });
    } catch (err) { next(err); }
};

// @desc    Analyze employee experience distribution
// @route   GET /api/v1/analytics/employees/experience-analysis
exports.getExperienceAnalysis = async (req, res, next) => {
    try {
        const experience = await Employee.aggregate([
            { $group: { _id: '$profile.skills.experience.years', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ success: true, data: experience });
    } catch (err) { next(err); }
};

// @desc    Analyze certification verification status
// @route   GET /api/v1/analytics/employees/verification-analysis
exports.getVerificationAnalysis = async (req, res, next) => {
    try {
        const verification = await Employee.aggregate([
            { $group: { _id: '$profile.skills.experience.certifications.meta.verified', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);
        res.status(200).json({ success: true, data: verification });
    } catch (err) { next(err); }
};

// @desc    Analyze employee project activity
// @route   GET /api/v1/analytics/employees/project-analysis
exports.getProjectAnalysis = async (req, res, next) => {
    try {
        const projects = await Employee.aggregate([
            { $project: { projectCount: { $size: { $ifNull: ['$profile.projects', []] } } } },
            { $group: { _id: '$projectCount', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ success: true, data: projects });
    } catch (err) { next(err); }
};

// @desc    Analyze employee task activity
// @route   GET /api/v1/analytics/employees/task-analysis
exports.getTaskAnalysis = async (req, res, next) => {
    try {
        const tasks = await Task.aggregate([
            { $group: { _id: '$assignedTo', taskCount: { $sum: 1 } } },
            { $group: { _id: '$taskCount', employeeCount: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ success: true, data: tasks });
    } catch (err) { next(err); }
};

// @desc    Analyze skill distribution
// @route   GET /api/v1/analytics/employees/skill-distribution
exports.getSkillDistribution = async (req, res, next) => {
    try {
        const skills = await Employee.aggregate([
            { $group: { _id: '$profile.skills.primary', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: skills });
    } catch (err) { next(err); }
};

// @desc    Analyze domain distribution
// @route   GET /api/v1/analytics/employees/domain-distribution
exports.getDomainDistribution = async (req, res, next) => {
    try {
        const domains = await Employee.aggregate([
            { $unwind: '$profile.skills.experience.domains' },
            { $group: { _id: '$profile.skills.experience.domains', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: domains });
    } catch (err) { next(err); }
};

// @desc    Analyze country wise employee records
// @route   GET /api/v1/analytics/employees/country-analysis
exports.getCountryAnalysis = async (req, res, next) => {
    try {
        const countries = await Employee.aggregate([
            { $group: { _id: '$profile.contact.address.location.country', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: countries });
    } catch (err) { next(err); }
};

// @desc    Analyze state wise employee records
// @route   GET /api/v1/analytics/employees/state-analysis
exports.getStateAnalysis = async (req, res, next) => {
    try {
        const states = await Employee.aggregate([
            { $group: { _id: '$profile.contact.address.location.state', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: states });
    } catch (err) { next(err); }
};
