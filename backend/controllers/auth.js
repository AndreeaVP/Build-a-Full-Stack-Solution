const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

exports.signup = (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    bcrypt.hash(password, 8)
        .then(hash => {
            db.query(
                'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
                [firstName, lastName, email, hash],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
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

                res.status(200).json({ user, token });
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
};