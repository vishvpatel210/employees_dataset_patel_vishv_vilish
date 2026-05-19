const express = require('express');
const {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Require authentication for all department routes
router.use(protect);

router
    .route('/')
    .get(getDepartments)
    .post(authorize('Admin', 'HR'), createDepartment);

router
    .route('/:id')
    .get(getDepartment)
    .patch(authorize('Admin', 'HR'), updateDepartment)
    .delete(authorize('Admin'), deleteDepartment);

module.exports = router;
