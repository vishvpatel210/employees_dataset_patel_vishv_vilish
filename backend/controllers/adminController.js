const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/v1/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user role
// @route   PATCH /api/v1/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ success: false, message: 'Please provide a role' });
        }

        const validRoles = ['User', 'Employee', 'HR', 'Admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get admin dashboard overview stats
// @route   GET /api/v1/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                roleDistribution,
                recentUsers,
            },
        });
    } catch (err) {
        next(err);
    }
};
