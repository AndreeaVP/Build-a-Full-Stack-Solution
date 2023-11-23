const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.getAllUsers = (req, res) => {
  db.query(
    `SELECT user_id, firstname, lastname, email, image_url, created_at FROM users WHERE active = 'true'`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(result);
    }
  );
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = results[0];
      res.status(200).json({ user: { ...user, image_url: user.image_url } });
    });
  };
  
exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, password } = req.body;
    const image_url = req.file;

    const updateFields = {};

    if (firstName) {
        updateFields.firstName = firstName;
    }
    if (lastName) {
        updateFields.lastName = lastName;
    }
    if (email) {
        updateFields.email = email;
    }
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 8);
      updateFields.password = hashedPassword;
    }
    
    if (image_url) {
      updateFields.image_url = `${req.protocol}://${req.get('host')}/images/${image_url.filename}`;
    }


    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const query = 'UPDATE users SET ? WHERE user_id = ?';

    db.query(query, [updateFields, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User profile updated successfully', image_url: updateFields.image_url });
      });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query('DELETE FROM comments WHERE user_id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.query('DELETE FROM likes WHERE user_id = ?', [userId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.query('DELETE FROM posts WHERE user_id = ?', [userId], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.status(200).json({ message: 'User account deleted successfully' });
        });
      });
    });
  });
};
  
