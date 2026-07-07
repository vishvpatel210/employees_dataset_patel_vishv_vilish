const mongoose = require('mongoose');
const User = require('./models/userModel');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Check if admin exists
    const admin = await User.findOne({ email: 'admin@company.com' });
    if (!admin) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@company.com',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'Admin'
      });
      console.log('Successfully created default admin: admin@company.com / password123');
    } else {
      console.log('Admin already exists.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
