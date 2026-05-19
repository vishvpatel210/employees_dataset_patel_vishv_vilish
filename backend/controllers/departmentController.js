const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/v1/departments
// @access  Private
exports.getDepartments = async (req, res, next) => {
    try {
        const departments = await Department.find();

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single department
// @route   GET /api/v1/departments/:id
// @access  Private
exports.getDepartment = async (req, res, next) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({ success: false, message: `Department not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new department
// @route   POST /api/v1/departments
// @access  Private/Admin/HR
exports.createDepartment = async (req, res, next) => {
    try {
        const department = await Department.create(req.body);

        res.status(201).json({
            success: true,
            data: department
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update department
// @route   PATCH /api/v1/departments/:id
// @access  Private/Admin/HR
exports.updateDepartment = async (req, res, next) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!department) {
            return res.status(404).json({ success: false, message: `Department not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete department
// @route   DELETE /api/v1/departments/:id
// @access  Private/Admin
exports.deleteDepartment = async (req, res, next) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ success: false, message: `Department not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
