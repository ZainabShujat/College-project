const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise'); // Using mysql2's promise-based API
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// MySQL Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Engineer@826',  // Replace with your MySQL password
    database: 'medical_assurance'  // Replace with your database name
});

// Test DB connection
db.getConnection()
    .then(() => {
        console.log('Connected to the MySQL database');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// Admin Registration Route
app.post('/register/admin', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the admin already exists
        const [existingAdmin] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new admin
        const query = 'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)';
        await db.query(query, [username, email, hashedPassword]);

        res.status(201).json({ message: 'Admin registered successfully' });

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Start server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
