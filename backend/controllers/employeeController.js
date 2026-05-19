const Employee = require('../models/Employee');

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
        const employee = await Employee.findById(req.params.id).populate('user', 'name email').populate('department', 'name');

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

// @desc    Update employee
// @route   PATCH /api/v1/employees/:id
// @access  Private/Admin/HR
exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private/Admin/HR
exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

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
