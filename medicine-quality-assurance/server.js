const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require('jsonwebtoken'); // Added for JWT generation
const app = express();

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'Engineer@826',  // Your MySQL password
    database: 'medical_assurance' // Your MySQL database
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.use(bodyParser.json());

// Secret key for JWT token (Keep this secret)
const secretKey = 'yourSecretKey';  // Use a more secure key in production

// Route for user/admin registration
app.post('/register/:role', async (req, res) => {
    const { username, email, password } = req.body;
    const { role } = req.params; // Get role from the URL parameter

    // Check if the role is valid
    if (role !== 'user' && role !== 'admin') {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const tableName = role === 'admin' ? 'admins' : 'users';
        
        // Check if the email already exists
        db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], async (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.length > 0) return res.status(400).json({ message: `${role} email is already registered` });

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert the user/admin into the corresponding table
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

// Route for user/admin login
app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    // Check if role is provided
    if (!role || (role !== 'user' && role !== 'admin')) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const tableName = role === 'admin' ? 'admins' : 'users';
    
    db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], async (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result[0];

        // Compare password with the hashed one in the database
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token after successful login
        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
