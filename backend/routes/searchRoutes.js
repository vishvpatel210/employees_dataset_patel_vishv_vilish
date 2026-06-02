const express = require('express');
const { searchEmployees } = require('../controllers/employeeController');

const router = express.Router();

router.route('/employees').get(searchEmployees);

module.exports = router;
