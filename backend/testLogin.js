const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

const run = async () => {
    try {
        await mongoose.connect('mongodb://vishv_vp:Vishv0210@ac-5boqmub-shard-00-00.ikmsfsj.mongodb.net:27017,ac-5boqmub-shard-00-01.ikmsfsj.mongodb.net:27017,ac-5boqmub-shard-00-02.ikmsfsj.mongodb.net:27017/EmployeeSphere?ssl=true&replicaSet=atlas-dnjyig-shard-0&authSource=admin&retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');

        const email = 'kamlesh@example.com';
        const password = 'Kamlesh123';

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found!');
            process.exit(0);
        }
        
        console.log('User found:', user.email);
        console.log('Stored Hashed Password:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        
        // Also let's test if we hash it manually
        const salt = await bcrypt.genSalt(10);
        const manualHash = await bcrypt.hash(password, salt);
        console.log('If we hash it now:', manualHash);
        
        const isDoubleMatch = await bcrypt.compare(user.password, manualHash); // wait, this isn't how you check double hash
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
