const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const getEmployeeLookupConditions = employeeId => {
    const id = String(employeeId);
    const conditions = [{ id }];

    if (mongoose.Types.ObjectId.isValid(id)) {
        conditions.unshift({ _id: id });
    }

    return conditions;
};

const getEmployeeLookup = employeeId => ({
    $or: getEmployeeLookupConditions(employeeId)
});

const populateEmployee = query => query.populate('user', 'name email').populate('department', 'name');

const getBulkItems = (body, key) => Array.isArray(body) ? body : body && body[key];

const getPaginationData = (page, limit, total) => {
    const pagination = {};
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }
    return pagination;
};

const getUpdatePayload = updateItem => {
    if (!updateItem || typeof updateItem !== 'object' || Array.isArray(updateItem)) {
        return null;
    }

    if (updateItem.data) {
        return updateItem.data;
    }

    if (updateItem.fields) {
        return updateItem.fields;
    }

    if (updateItem.update) {
        return updateItem.update;
    }

    const { id, _id, employeeId, data, fields, update, ...payload } = updateItem;
    return payload;
};

// @desc    Get all employees
// @route   GET /api/v1/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
    try {
        let query;

        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Handle custom query parameters for nested fields
        let customQuery = {};
        
        if (reqQuery.country) customQuery['profile.contact.address.location.country'] = new RegExp(reqQuery.country, 'i');
        if (reqQuery.state) customQuery['profile.contact.address.location.state'] = new RegExp(reqQuery.state, 'i');
        if (reqQuery.city) customQuery['profile.contact.address.city'] = new RegExp(reqQuery.city, 'i');
        if (reqQuery.primarySkill) customQuery['profile.skills.primary'] = new RegExp(reqQuery.primarySkill, 'i');
        if (reqQuery.secondarySkill) customQuery['profile.skills.secondary'] = new RegExp(reqQuery.secondarySkill, 'i');
        if (reqQuery.domain) customQuery['profile.skills.experience.domains'] = new RegExp(reqQuery.domain, 'i');
        if (reqQuery.experience) customQuery['profile.skills.experience.years'] = reqQuery.experience;
        if (reqQuery.verified !== undefined) customQuery['profile.skills.experience.certifications.meta.verified'] = reqQuery.verified === 'true';
        if (reqQuery.certification) customQuery['profile.skills.experience.certifications.current'] = new RegExp(reqQuery.certification, 'i');
        
        if (reqQuery.timezone) {
            customQuery['$or'] = customQuery['$or'] || [];
            customQuery['$or'].push(
                { 'profile.contact.address.location.geo.timezone.name': new RegExp(reqQuery.timezone, 'i') },
                { 'profile.contact.address.location.geo.timezone.utc_offset': new RegExp(reqQuery.timezone, 'i') }
            );
        }
        
        if (reqQuery.project) {
            customQuery['profile.projects'] = reqQuery.project;
        }
        
        if (reqQuery.technology || reqQuery.skill) {
            const tech = reqQuery.technology || reqQuery.skill;
            customQuery['$or'] = customQuery['$or'] || [];
            customQuery['$or'].push(
                { 'profile.skills.primary': new RegExp(tech, 'i') },
                { 'profile.skills.secondary': new RegExp(tech, 'i') }
            );
        }
        
        if (reqQuery.emailVerified !== undefined) {
             customQuery['profile.contact.emailVerified'] = reqQuery.emailVerified === 'true';
        }

        if (reqQuery.task) {
            const Task = require('../models/Task');
            const tasks = await Task.find({ taskId: reqQuery.task });
            const assignedEmployeeIds = tasks.map(t => t.assignedTo);
            customQuery['_id'] = { $in: assignedEmployeeIds };
        }

        // Remove mapped fields from reqQuery to avoid conflicts with stringified query
        const mappedFields = ['country', 'state', 'city', 'primarySkill', 'secondarySkill', 'domain', 'experience', 'verified', 'certification', 'timezone', 'project', 'technology', 'skill', 'emailVerified', 'task'];
        mappedFields.forEach(param => delete reqQuery[param]);

        // Create query string for remaining operators
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Merge standard parsed query with customQuery
        const finalQuery = { ...JSON.parse(queryStr), ...customQuery };

        // Finding resource
        query = Employee.find(finalQuery).populate('user', 'name email').populate('department', 'name');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortMap = {
                'experience': 'profile.skills.experience.years',
                '-experience': '-profile.skills.experience.years',
                'country': 'profile.contact.address.location.country',
                '-country': '-profile.contact.address.location.country',
                'state': 'profile.contact.address.location.state',
                '-state': '-profile.contact.address.location.state',
                'city': 'profile.contact.address.city',
                '-city': '-profile.contact.address.city',
                'skill': 'profile.skills.primary',
                '-skill': '-profile.skills.primary',
                'timezone': 'profile.contact.address.location.geo.timezone.name',
                '-timezone': '-profile.contact.address.location.geo.timezone.name',
                'lastUpdated': 'profile.skills.experience.certifications.meta.lastUpdated',
                '-lastUpdated': '-profile.skills.experience.certifications.meta.lastUpdated',
                'project': 'profile.projects',
                '-project': '-profile.projects',
                'domain': 'profile.skills.experience.domains',
                '-domain': '-profile.skills.experience.domains',
                'certification': 'profile.skills.experience.certifications.current',
                '-certification': '-profile.skills.experience.certifications.current'
            };
            
            const sortBy = req.query.sort.split(',').map(s => sortMap[s.trim()] || s.trim()).join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Employee.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const employees = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination,
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single employee
// @route   GET /api/v1/employees/:id
// @access  Private
exports.getEmployee = async (req, res, next) => {
    try {
        const employee = await populateEmployee(Employee.findOne(getEmployeeLookup(req.params.id)));

        if (!employee) {
            return res.status(404).json({ success: false, message: `Employee not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Check whether employee exists
// @route   GET /api/v1/employees/exists/:id
// @access  Private
exports.employeeExists = async (req, res, next) => {
    try {
        const employee = await Employee.exists(getEmployeeLookup(req.params.id));

        res.status(200).json({
            success: true,
            exists: !!employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new employee
// @route   POST /api/v1/employees
// @access  Private/Admin/HR
exports.createEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);

        res.status(201).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create multiple employees
// @route   POST /api/v1/employees/bulk-create
// @access  Private/Admin/HR
exports.bulkCreateEmployees = async (req, res, next) => {
    try {
        const employeesToCreate = getBulkItems(req.body, 'employees');

        if (!Array.isArray(employeesToCreate) || employeesToCreate.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide a non-empty employees array' });
        }

        const employees = await Employee.insertMany(employeesToCreate, {
            ordered: true
        });

        res.status(201).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Replace employee
// @route   PUT /api/v1/employees/:id
// @access  Private/Admin/HR
exports.replaceEmployee = async (req, res, next) => {
    try {
        const replacement = { ...req.body };
        delete replacement._id;

        const employee = await populateEmployee(Employee.findOneAndReplace(getEmployeeLookup(req.params.id), replacement, {
            new: true,
            runValidators: true
        }));

        if (!employee) {
            return res.status(404).json({ success: false, message: `Employee not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update employee
// @route   PATCH /api/v1/employees/:id
// @access  Private/Admin/HR
exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await populateEmployee(Employee.findOneAndUpdate(getEmployeeLookup(req.params.id), req.body, {
            new: true,
            runValidators: true
        }));

        if (!employee) {
            return res.status(404).json({ success: false, message: `Employee not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update multiple employees
// @route   PATCH /api/v1/employees/bulk-update
// @access  Private/Admin/HR
exports.bulkUpdateEmployees = async (req, res, next) => {
    try {
        const updates = getBulkItems(req.body, 'updates');

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide a non-empty updates array' });
        }

        const results = [];

        for (const updateItem of updates) {
            if (!updateItem || typeof updateItem !== 'object' || Array.isArray(updateItem)) {
                return res.status(400).json({
                    success: false,
                    message: 'Each update must be an object'
                });
            }

            const employeeId = updateItem.id || updateItem._id || updateItem.employeeId;
            const updatePayload = getUpdatePayload(updateItem);

            if (
                !employeeId ||
                !updatePayload ||
                typeof updatePayload !== 'object' ||
                Array.isArray(updatePayload) ||
                Object.keys(updatePayload).length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Each update must include id, _id, or employeeId and at least one field to update'
                });
            }

            const employee = await populateEmployee(Employee.findOneAndUpdate(getEmployeeLookup(employeeId), updatePayload, {
                new: true,
                runValidators: true
            }));

            results.push({
                id: employeeId,
                success: !!employee,
                data: employee || null,
                message: employee ? undefined : `Employee not found with id of ${employeeId}`
            });
        }

        res.status(200).json({
            success: true,
            count: results.filter(result => result.success).length,
            data: results
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private/Admin/HR
exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findOneAndDelete(getEmployeeLookup(req.params.id));

        if (!employee) {
            return res.status(404).json({ success: false, message: `Employee not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete multiple employees
// @route   DELETE /api/v1/employees/bulk-delete
// @access  Private/Admin/HR
exports.bulkDeleteEmployees = async (req, res, next) => {
    try {
        const employeeIds = getBulkItems(req.body, 'ids');

        if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide a non-empty ids array' });
        }

        if (employeeIds.some(employeeId => employeeId === undefined || employeeId === null || String(employeeId).trim() === '')) {
            return res.status(400).json({ success: false, message: 'Each id must be a non-empty value' });
        }

        const deleteConditions = employeeIds.flatMap(getEmployeeLookupConditions);
        const result = await Employee.deleteMany({ $or: deleteConditions });

        res.status(200).json({
            success: true,
            count: result.deletedCount,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by state
// @route   GET /api/v1/employees/state/:state
// @access  Private
exports.getEmployeesByState = async (req, res, next) => {
    try {
        const state = req.params.state;
        const queryFilter = { 'profile.contact.address.location.state': new RegExp(state, 'i') };
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter);
        const employees = await populateEmployee(queryObj).skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by country
// @route   GET /api/v1/employees/country/:country
// @access  Private
exports.getEmployeesByCountry = async (req, res, next) => {
    try {
        const country = req.params.country;
        const queryFilter = { 'profile.contact.address.location.country': new RegExp(country, 'i') };
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter);
        const employees = await populateEmployee(queryObj).skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by city
// @route   GET /api/v1/employees/city/:city
// @access  Private
exports.getEmployeesByCity = async (req, res, next) => {
    try {
        const city = req.params.city;
        const employees = await populateEmployee(Employee.find({
            'profile.contact.address.city': new RegExp(city, 'i')
        }));

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by timezone
// @route   GET /api/v1/employees/timezone/:timezone
// @access  Private
exports.getEmployeesByTimezone = async (req, res, next) => {
    try {
        const timezone = req.params.timezone;
        const employees = await populateEmployee(Employee.find({
            $or: [
                { 'profile.contact.address.location.geo.timezone.name': new RegExp(timezone, 'i') },
                { 'profile.contact.address.location.geo.timezone.utc_offset': new RegExp(timezone, 'i') }
            ]
        }));

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by primary skill
// @route   GET /api/v1/employees/primary-skill/:skill
// @access  Private
exports.getEmployeesByPrimarySkill = async (req, res, next) => {
    try {
        const skill = req.params.skill;
        const queryFilter = { 'profile.skills.primary': new RegExp(skill, 'i') };
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter);
        const employees = await populateEmployee(queryObj).skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by secondary skill
// @route   GET /api/v1/employees/secondary-skill/:skill
// @access  Private
exports.getEmployeesBySecondarySkill = async (req, res, next) => {
    try {
        const skill = req.params.skill;
        const employees = await populateEmployee(Employee.find({
            'profile.skills.secondary': new RegExp(skill, 'i')
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by domain
// @route   GET /api/v1/employees/domain/:domain
// @access  Private
exports.getEmployeesByDomain = async (req, res, next) => {
    try {
        const domain = req.params.domain;
        const queryFilter = { 'profile.skills.experience.domains': new RegExp(domain, 'i') };
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter);
        const employees = await populateEmployee(queryObj).skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get cloud engineers
// @route   GET /api/v1/employees/cloud-engineers
// @access  Private
exports.getCloudEngineers = async (req, res, next) => {
    try {
        const regex = /(cloud|aws|azure|gcp|google cloud)/i;
        const employees = await populateEmployee(Employee.find({
            $or: [
                { 'profile.skills.primary': regex },
                { 'profile.skills.secondary': regex },
                { 'profile.skills.experience.domains': regex }
            ]
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get DevOps engineers
// @route   GET /api/v1/employees/devops-engineers
// @access  Private
exports.getDevOpsEngineers = async (req, res, next) => {
    try {
        const regex = /(devops|kubernetes|docker|jenkins|ci\/cd|terraform)/i;
        const employees = await populateEmployee(Employee.find({
            $or: [
                { 'profile.skills.primary': regex },
                { 'profile.skills.secondary': regex },
                { 'profile.skills.experience.domains': regex }
            ]
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get AI engineers
// @route   GET /api/v1/employees/ai-engineers
// @access  Private
exports.getAIEngineers = async (req, res, next) => {
    try {
        const regex = /(ai|artificial intelligence|machine learning|deep learning|nlp|data science|tensorflow|pytorch)/i;
        const employees = await populateEmployee(Employee.find({
            $or: [
                { 'profile.skills.primary': regex },
                { 'profile.skills.secondary': regex },
                { 'profile.skills.experience.domains': regex }
            ]
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Fullstack developers
// @route   GET /api/v1/employees/fullstack
// @access  Private
exports.getFullstackDevelopers = async (req, res, next) => {
    try {
        const regex = /(fullstack|full stack|mern|mean)/i;
        const employees = await populateEmployee(Employee.find({
            $or: [
                { 'profile.skills.primary': regex },
                { 'profile.skills.secondary': regex },
                { 'profile.skills.experience.domains': regex }
            ]
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Top Skills
// @route   GET /api/v1/employees/top-skills
// @access  Private
exports.getTopSkills = async (req, res, next) => {
    try {
        const topSkills = await Employee.aggregate([
            { $group: { _id: '$profile.skills.primary', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, skill: '$_id', count: 1 } }
        ]);
        res.status(200).json({ success: true, count: topSkills.length, data: topSkills });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by minimum experience years
// @route   GET /api/v1/employees/experience/:years
// @access  Private
exports.getEmployeesByExperience = async (req, res, next) => {
    try {
        const years = Number(req.params.years);
        const employees = await populateEmployee(Employee.find({
            'profile.skills.experience.years': { $gte: years }
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by certification
// @route   GET /api/v1/employees/certification/:certification
// @access  Private
exports.getEmployeesByCertification = async (req, res, next) => {
    try {
        const certification = req.params.certification;
        const employees = await populateEmployee(Employee.find({
            'profile.skills.experience.certifications.current': new RegExp(certification, 'i')
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get verified employees
// @route   GET /api/v1/employees/verified
// @access  Private
exports.getVerifiedEmployees = async (req, res, next) => {
    try {
        
        const queryFilter = { 'profile.skills.experience.certifications.meta.verified': true };
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter);
        const employees = await populateEmployee(queryObj).skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees with recent certifications
// @route   GET /api/v1/employees/recent-certifications
// @access  Private
exports.getRecentCertifications = async (req, res, next) => {
    try {
        
        const queryFilter = {};
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter).sort({ 'profile.skills.experience.certifications.meta.lastUpdated': -1 });
        const employees = await populateEmployee(queryObj).skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees with top experience
// @route   GET /api/v1/employees/top-experience
// @access  Private
exports.getTopExperience = async (req, res, next) => {
    try {
        const employees = await populateEmployee(
            Employee.find({})
            .sort({ 'profile.skills.experience.years': -1 })
            .limit(10)
        );
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees with projects
// @route   GET /api/v1/employees/projects
// @access  Private
exports.getEmployeeProjects = async (req, res, next) => {
    try {
        
        const queryFilter = { 'profile.projects': { $exists: true, $not: { $size: 0 } } };
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter);
        const employees = await populateEmployee(queryObj).populate('profile.projects').skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees with tasks
// @route   GET /api/v1/employees/tasks
// @access  Private
exports.getEmployeeTasks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        const pipeline = [
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'tasks'
                }
            },
            {
                $match: {
                    'tasks.0': { $exists: true }
                }
            }
        ];

        const countResult = await Employee.aggregate([...pipeline, { $count: 'total' }]);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        const employeesWithTasks = await Employee.aggregate([
            ...pipeline,
            { $skip: startIndex },
            { $limit: limit }
        ]);

        res.status(200).json({ 
            success: true, 
            count: employeesWithTasks.length, 
            pagination: getPaginationData(page, limit, total),
            data: employeesWithTasks 
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by name
// @route   GET /api/v1/employees/name/:name
// @access  Private
exports.getEmployeesByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        const employees = await populateEmployee(Employee.find({
            name: new RegExp(name, 'i')
        }));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees by project ID
// @route   GET /api/v1/employees/project/:projectId
// @access  Private
exports.getEmployeesByProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        
        // If projectId is not valid ObjectId, it won't match anyway but we prevent casting error
        let query = { 'profile.projects': projectId };
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            // Might be an issue with Mongoose throwing CastError if we pass invalid ID to ObjectId array
            return res.status(400).json({ success: false, message: 'Invalid project ID format' });
        }
        
        const employees = await populateEmployee(Employee.find(query));
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employee by task ID
// @route   GET /api/v1/employees/task/:taskId
// @access  Private
exports.getEmployeeByTask = async (req, res, next) => {
    try {
        const Task = require('../models/Task');
        
        // Look up by internal _id or custom taskId
        const taskQuery = [{ taskId: req.params.taskId }];
        if (mongoose.Types.ObjectId.isValid(req.params.taskId)) {
            taskQuery.push({ _id: req.params.taskId });
        }
        
        const task = await Task.findOne({ $or: taskQuery });

        if (!task) {
             return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const employee = await populateEmployee(Employee.findById(task.assignedTo));
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employee performance analytics
// @route   GET /api/v1/employees/performance/:id
// @access  Private
exports.getEmployeePerformance = async (req, res, next) => {
    try {
        const employee = await Employee.findOne(getEmployeeLookup(req.params.id));
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        const Task = require('../models/Task');
        const tasksCount = await Task.countDocuments({ assignedTo: employee._id });
        
        const baseScore = 60;
        const experienceBonus = employee.profile.skills.experience.years * 2;
        const projectBonus = employee.profile.projects.length * 3;
        const taskBonus = tasksCount * 1;
        
        let totalScore = baseScore + experienceBonus + projectBonus + taskBonus;
        totalScore = Math.min(100, totalScore);

        let rating = 'Needs Improvement';
        if (totalScore >= 90) rating = 'Outstanding';
        else if (totalScore >= 80) rating = 'Exceeds Expectations';
        else if (totalScore >= 70) rating = 'Meets Expectations';

        const analytics = {
            performanceScore: totalScore,
            rating: rating,
            metrics: {
                experienceContribution: experienceBonus,
                projectContribution: projectBonus,
                taskContribution: taskBonus
            }
        };

        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employee statistics
// @route   GET /api/v1/employees/stats/:id
// @access  Private
exports.getEmployeeStats = async (req, res, next) => {
    try {
        const employee = await Employee.findOne(getEmployeeLookup(req.params.id));
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        const Task = require('../models/Task');
        const tasksCount = await Task.countDocuments({ assignedTo: employee._id });

        const stats = {
            totalProjects: employee.profile.projects.length,
            totalTasks: tasksCount,
            yearsOfExperience: employee.profile.skills.experience.years,
            primarySkill: employee.profile.skills.primary,
            designation: employee.designation || 'N/A'
        };

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employees sorted by specific parameter
// @route   GET /api/v1/employees/sort/:sortType
// @access  Private
exports.getSortedEmployees = async (req, res, next) => {
    try {
        const sortType = req.params.sortType;
        const [field, order] = sortType.split('-');
        
        let sortStr = field;
        if (order === 'desc') {
            sortStr = '-' + field;
        } else if (order === 'asc') {
            sortStr = field;
        }

        req.query.sort = sortStr;
        return exports.getEmployees(req, res, next);
    } catch (err) {
        next(err);
    }
};
