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

// Custom error handler
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/analytics/employees', analyticsRoutes);

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
