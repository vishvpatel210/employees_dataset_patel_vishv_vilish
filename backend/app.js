const express = require('express');
const cors = require('cors');

// Route files
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const searchRoutes = require('./routes/searchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');
const jwtRoutes = require('./routes/jwtRoutes');

// Middlewares
const errorHandler = require('./middlewares/errorMiddleware');
const { standardLimiter, heavyApiLimiter } = require('./middlewares/rateLimitMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers with appropriate rate limiters
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/analytics/employees', analyticsRoutes);
app.use('/api/v1/stats/employees', statsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1/middleware', middlewareRoutes);
app.use('/api/v1/jwt', jwtRoutes);

// Basic route for testing
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to EmployeeSphere API'
    });
});

// Error handling middleware (must be after routes)
app.use(errorHandler);

module.exports = app;
