const express = require('express');
const {
    getTasks,
    
    getTask,
    createTask,
    updateTask,
    deleteTask
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

module.exports = router;
