const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: [true, 'Please add a project ID'],
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Please add a project name']
    },
    tasks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
