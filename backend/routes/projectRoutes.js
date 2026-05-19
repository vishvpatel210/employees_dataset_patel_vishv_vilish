const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getProjects)
    .post(authorize('Admin', 'HR'), createProject);

router
    .route('/:id')
    .get(getProject)
    .patch(authorize('Admin', 'HR'), updateProject)
    .delete(authorize('Admin'), deleteProject);

module.exports = router;
