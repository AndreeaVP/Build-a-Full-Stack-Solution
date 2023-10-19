const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

exports.signup = (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (emailQueryError, emailResults) => {
        if (emailQueryError) {
            console.error('Database Error:', emailQueryError);
            return res.status(500).json({ error: 'Server error: Unable to check email availability.' });
        }

        if (emailResults.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        bcrypt.hash(password, 8, (hashError, hash) => {
            if (hashError) {
                console.error('Bcrypt Error:', hashError);
                return res.status(500).json({ error: 'Server error: Unable to hash the password.' });
            }

            db.query(
                'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
                [firstName, lastName, email, hash],
                (dbError, result) => {
                    if (dbError) {
                        console.error('Database Error:', dbError);
                        return res.status(500).json({ error: 'Server error: Unable to complete the registration process.' });
                    }

                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    });
};


  

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password)
            .then(match => {
                if (!match) {
                    return res.status(401).json({ error: 'Authentication failed' });
                }

                const token = jwt.sign({ userId: user.id }, process.env.USER_TOKEN, {
                    expiresIn: '24h',
                });

                delete user.password;

                res.status(200).json({ user, token, message: 'Login successful!' });
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
};
