const mongoose = require('mongoose');
const User = require('./models/userModel');

mongoose.connect('mongodb://localhost:27017/EmployeeSphere')
  .then(async () => {
    const admins = await User.find({ role: 'Admin' });
    console.log('Admins in DB:', admins);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
