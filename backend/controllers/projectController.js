const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().populate('tasks');
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('tasks');
        if (!project) {
            return res.status(404).json({ success: false, message: `Project not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private/Admin/HR
exports.createProject = async (req, res, next) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Update project
// @route   PATCH /api/v1/projects/:id
// @access  Private/Admin/HR
exports.updateProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!project) {
            return res.status(404).json({ success: false, message: `Project not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) { 
        next(err); 
    }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: `Project not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) { 
        next(err); 
    }
};
