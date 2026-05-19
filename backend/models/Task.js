const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: [true, 'Please add a task ID'],
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please add a task description']
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
