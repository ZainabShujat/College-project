const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the admin schema
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash the password before saving the admin
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (error) {
        next(error); // Pass errors to the next middleware
    }
});

// Method to compare entered password with the hashed one
adminSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the Admin model
module.exports = mongoose.model('Admin', adminSchema);
