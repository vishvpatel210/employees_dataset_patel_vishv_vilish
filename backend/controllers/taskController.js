const Task = require('../models/Task');
const Project = require('../models/Project');
const Employee = require('../models/Employee');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        let filter = {};
        const isAdminOrHr = ['Admin', 'HR'].includes(req.user.role);

        if (!isAdminOrHr) {
            const employee = await Employee.findOne({ user: req.user._id }).select('_id');
            if (employee) {
                filter.assignedTo = employee._id;
            } else {
                return res.status(200).json({ success: true, count: 0, data: [] });
            }
        }

        const tasks = await Task.find(filter).populate('project', 'name').populate('assignedTo', 'name id user');
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'name').populate('assignedTo', 'name id user');
        if (!task) {
            return res.status(404).json({ success: false, message: `Task not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: task });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private/Admin/HR
exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        
        // Link task to project automatically
        if(req.body.project) {
            await Project.findByIdAndUpdate(req.body.project, { $push: { tasks: task._id } });
        }
        
        res.status(201).json({ success: true, data: task });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Update task
// @route   PATCH /api/v1/tasks/:id
// @access  Private/Admin/HR
exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!task) {
            return res.status(404).json({ success: false, message: `Task not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: task });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Update task status only (for assigned employee)
// @route   PATCH /api/v1/tasks/:id/status
// @access  Private (assigned employee or Admin/HR)
exports.updateTaskStatus = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: `Task not found with id of ${req.params.id}` });
        }

        const isAdminOrHr = ['Admin', 'HR'].includes(req.user.role);
        const assignedId = task.assignedTo ? task.assignedTo.toString() : null;
        const employee = await Employee.findOne({ user: req.user._id }).select('_id');
        const employeeId = employee ? employee._id.toString() : null;

        if (!isAdminOrHr && assignedId !== employeeId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this task'
            });
        }

        const allowedFields = ['status'];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: updatedTask });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private/Admin/HR
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: `Task not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) { 
        next(err); 
    }
};
