const Employee = require('../models/Employee');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Count total employees
// @route   GET /api/v1/stats/employees/count
exports.getTotalEmployees = async (req, res, next) => {
    try {
        const count = await Employee.countDocuments();
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Calculate average employee experience
// @route   GET /api/v1/stats/employees/experience-average
exports.getAverageExperience = async (req, res, next) => {
    try {
        const avg = await Employee.aggregate([
            { $group: { _id: null, averageExperience: { $avg: '$profile.skills.experience.years' } } }
        ]);
        res.status(200).json({ success: true, data: avg.length ? avg[0].averageExperience : 0 });
    } catch (err) { next(err); }
};

// @desc    Fetch highest experienced employee
// @route   GET /api/v1/stats/employees/top-experience
exports.getTopExperienceEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findOne().sort('-profile.skills.experience.years').populate('user', 'name email').populate('department', 'name');
        res.status(200).json({ success: true, data: employee });
    } catch (err) { next(err); }
};

// @desc    Count total projects
// @route   GET /api/v1/stats/employees/project-count
exports.getTotalProjects = async (req, res, next) => {
    try {
        const count = await Project.countDocuments();
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count total tasks
// @route   GET /api/v1/stats/employees/task-count
exports.getTotalTasks = async (req, res, next) => {
    try {
        const count = await Task.countDocuments();
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count employees by country
// @route   GET /api/v1/stats/employees/country-count
exports.getCountryCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $group: { _id: '$profile.contact.address.location.country', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count employees by state
// @route   GET /api/v1/stats/employees/state-count
exports.getStateCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $group: { _id: '$profile.contact.address.location.state', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count employees by domain
// @route   GET /api/v1/stats/employees/domain-count
exports.getDomainCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $unwind: '$profile.skills.experience.domains' },
            { $group: { _id: '$profile.skills.experience.domains', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count employees by skills
// @route   GET /api/v1/stats/employees/skill-count
exports.getSkillCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $group: { _id: '$profile.skills.primary', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count certification records
// @route   GET /api/v1/stats/employees/certification-count
exports.getCertificationCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $unwind: '$profile.skills.experience.certifications.current' },
            { $group: { _id: null, totalCertifications: { $sum: 1 } } }
        ]);
        res.status(200).json({ success: true, data: count.length ? count[0].totalCertifications : 0 });
    } catch (err) { next(err); }
};

// @desc    Count timezone distribution
// @route   GET /api/v1/stats/employees/timezone-count
exports.getTimezoneCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $group: { _id: '$profile.contact.address.location.geo.timezone.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Count verified employees
// @route   GET /api/v1/stats/employees/verified-count
exports.getVerifiedCount = async (req, res, next) => {
    try {
        const count = await Employee.countDocuments({ 'profile.skills.experience.certifications.meta.verified': true });
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};

// @desc    Analyze project distribution
// @route   GET /api/v1/stats/employees/project-distribution
exports.getProjectDistribution = async (req, res, next) => {
    try {
        const distribution = await Employee.aggregate([
            { $project: { projectCount: { $size: { $ifNull: ['$profile.projects', []] } } } },
            { $group: { _id: '$projectCount', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ success: true, data: distribution });
    } catch (err) { next(err); }
};

// @desc    Analyze task distribution
// @route   GET /api/v1/stats/employees/task-distribution
exports.getTaskDistribution = async (req, res, next) => {
    try {
        const distribution = await Task.aggregate([
            { $group: { _id: '$assignedTo', taskCount: { $sum: 1 } } },
            { $group: { _id: '$taskCount', employeeCount: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ success: true, data: distribution });
    } catch (err) { next(err); }
};

// @desc    Count technology usage
// @route   GET /api/v1/stats/employees/technology-count
exports.getTechnologyCount = async (req, res, next) => {
    try {
        const count = await Employee.aggregate([
            { $project: { allSkills: { $concatArrays: [ ["$profile.skills.primary"], { $ifNull: ["$profile.skills.secondary", []] } ] } } },
            { $unwind: '$allSkills' },
            { $group: { _id: '$allSkills', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: count });
    } catch (err) { next(err); }
};
