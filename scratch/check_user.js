const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/academic-curator';

const checkUser = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({ email: String, isVerified: Boolean }));
        
        const user = await User.findOne({ email: 'anya06791@gmail.com' });
        
        if (user) {
            console.log('User found:', user);
        } else {
            console.log('User not found');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUser();
