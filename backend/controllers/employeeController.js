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

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Employee.find(JSON.parse(queryStr)).populate('user', 'name email').populate('department', 'name');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
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
        const employees = await populateEmployee(Employee.find({
            'profile.contact.address.location.state': new RegExp(state, 'i')
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

// @desc    Get employees by country
// @route   GET /api/v1/employees/country/:country
// @access  Private
exports.getEmployeesByCountry = async (req, res, next) => {
    try {
        const country = req.params.country;
        const employees = await populateEmployee(Employee.find({
            'profile.contact.address.location.country': new RegExp(country, 'i')
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
