const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to EmployeeSphere API'
    });
});

module.exports = app;
