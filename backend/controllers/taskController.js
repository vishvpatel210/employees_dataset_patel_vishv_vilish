const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find().populate('project', 'name').populate('assignedTo', 'name id');
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
        const task = await Task.findById(req.params.id).populate('project', 'name').populate('assignedTo', 'name id');
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
