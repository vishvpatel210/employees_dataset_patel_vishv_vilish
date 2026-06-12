const express = require('express');
const {
    getTasks,
    
    getTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getTasks) 
    .post(authorize('Admin', 'HR'), createTask);

router
    .route('/:id')
    .get(getTask)
    .patch(authorize('Admin', 'HR'), updateTask)
    .delete(authorize('Admin', 'HR'), deleteTask);

router
    .route('/:id/status')
    .patch(updateTaskStatus);

module.exports = router;
