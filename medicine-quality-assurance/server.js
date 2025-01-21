require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // To generate the JWT token

// Import User and Admin models
const User = require('./models/user');
const Admin = require('./models/admin');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

// Basic route to check server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body; // Include role in request body

  try {
    // Check if the user/admin already exists based on the role
    if (role === 'admin') {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return res.status(400).json({ message: 'Admin email is already registered' });
      
      // Hash the password and create a new Admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, email, password: hashedPassword });
      await newAdmin.save();
      return res.status(201).json({ message: 'Admin registered successfully' });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email is already registered' });
      
      // Hash the password and create a new User
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Create and send JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'User logged in successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login Route
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Create and send JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Admin logged in successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
