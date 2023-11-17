const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

exports.signup = (req, res) => {
    console.log(req.file);
    const { firstName, lastName, email, password } = req.body;
    const image_url = req.file;

    try {
        bcrypt.hash(password, 8, (hashError, hash) => {
            if (hashError) {
                throw hashError;
            }

            const imageUrl = image_url
                ? `${req.protocol}://${req.get('host')}/images/${image_url.filename}`
                : null;
    
            db.query(
                'INSERT INTO users (firstName, lastName, email, password, image_url) VALUES (?, ?, ?, ?, ?)',
                [firstName, lastName, email, hash, imageUrl],
                (err, result) => {
                  if (err) {
                    throw err;
                  }
                  res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error: Unable to complete the registration process.' });
    }
};

exports.login = (req, res) => {
    try {
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
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error: Unable to complete the login process.' });
    }
};
