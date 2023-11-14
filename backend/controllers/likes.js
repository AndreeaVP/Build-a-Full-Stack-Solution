const db = require('../config/database');

exports.createLike = (req, res) => {
  const { post_id, user_id } = req.body;

  db.query('SELECT * FROM likes WHERE post_id = ? AND user_id = ?', [post_id, user_id], (err, existingLike) => {
    if (err) {
      console.error('Error querying existing like:', err);
      return res.status(500).json({ message: 'Internal Server Error.' });
    }

    try {
      if (existingLike.length > 0) {
        db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [post_id, user_id], (err) => {
          if (err) {
            console.error('Error canceling like:', err);
            return res.status(500).json({ message: 'Internal Server Error.' });
          }
          res.status(200).json({ message: 'Like removed successfully.', action: 'remove' });
        });
      } else {
        db.query('INSERT INTO likes (likes, post_id, user_id) VALUES (?, ?, ?)', [1, post_id, user_id], (err) => {
          if (err) {
            console.error('Error adding like:', err);
            return res.status(500).json({ message: 'Internal Server Error.' });
          }
          res.status(200).json({ message: 'Like added successfully.', action: 'add' });
        });
      }
    } catch (error) {
      console.error('Error processing like:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  });
};

exports.getLikesByPostId = (req, res) => {
  const postId = req.params.postId;

  db.query('SELECT * FROM likes WHERE post_id = ?', [postId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
};