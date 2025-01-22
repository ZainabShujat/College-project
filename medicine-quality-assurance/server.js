require('dotenv').config(); // Load environment variables from .env file
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.JWT_SECRET) {
    console.error('Missing required environment variables');
    process.exit(1);
}

console.log('DB Host:', process.env.DB_HOST);
console.log('DB User:', process.env.DB_USER);
console.log('DB Password:', process.env.DB_PASSWORD);
console.log('DB Name:', process.env.DB_NAME);

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // To handle cross-origin requests

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    console.log('Request body:', req.body);

    if (typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const tableName = role === 'admin' ? 'admins' : 'users';
        db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], async (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.length > 0) return res.status(400).json({ message: `${role} email is already registered` });

            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                `INSERT INTO ${tableName} (username, email, password) VALUES (?, ?, ?)`,
                [username, email, hashedPassword],
                (err) => {
                    if (err) return res.status(500).json({ message: 'Server error' });
                    res.status(201).json({ message: `${role} registered successfully` });
                }
            );
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.length === 0) return res.status(400).json({ message: 'User not found' });

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'User logged in successfully', token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Login Route
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.length === 0) return res.status(400).json({ message: 'Admin not found' });

            const admin = result[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Admin logged in successfully', token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
