const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',  // Replace with your MySQL password
    database: 'your_database_name'  // Replace with your database name
});

// Test DB connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Admin Registration Route
app.post('/register/admin', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the admin already exists
        db.query('SELECT * FROM admins WHERE email = ?', [email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            if (result.length > 0) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            // Hash the password
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    if (err) throw err;

                    // Create a new admin
                    const query = 'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)';
                    db.query(query, [username, email, hashedPassword], (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: 'Server error' });
                        }

                        res.status(201).json({ message: 'Admin registered successfully' });
                    });
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
