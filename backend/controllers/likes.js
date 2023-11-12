const db = require('../config/database');

exports.createUpdateDeleteLike = (req, res) => {
  const { like, dislike, post_id, user_id } = req.body;

  db.query('SELECT * FROM likes WHERE post_id = ? AND (user_id_liked = ? OR user_id_disliked = ?)', [post_id, user_id, user_id], (err, existingLike) => {
    if (err) {
      console.error('Error querying existing like:', err);
      return res.status(500).json({ message: 'Internal Server Error.' });
    }

    try {
      if (existingLike.length > 0) {
        if (like === 1) {
          db.query('DELETE FROM likes WHERE post_id = ? AND user_id_liked = ? AND user_id_disliked IS NULL AND likes = 1', [post_id, user_id], (err) => {
            if (err) {
              console.error('Error canceling like:', err);
              return res.status(500).json({ message: 'Internal Server Error.' });
            }
            res.status(200).json({ message: 'Like removed successfully.' });
          });
        } else if (dislike === 1) {
          db.query('DELETE FROM likes WHERE post_id = ? AND user_id_liked IS NULL AND user_id_disliked = ? AND dislikes = 1', [post_id, user_id], (err) => {
            if (err) {
              console.error('Error canceling dislike:', err);
              return res.status(500).json({ message: 'Internal Server Error.' });
            }
            res.status(200).json({ message: 'Dislike removed successfully.' });
          });
        } 
      } else {
        if ((like === 1 && dislike === 0) || (like === 0 && dislike === 1)) {
          db.query('INSERT INTO likes (likes, dislikes, post_id, user_id_liked, user_id_disliked) VALUES (?, ?, ?, ?, ?)', [like, dislike, post_id, like === 1 ? user_id : null, dislike === 1 ? user_id : null], (err) => {
            if (err) {
              console.error('Error creating like or dislike:', err);
              return res.status(500).json({ message: 'Internal Server Error.' });
            }
            res.status(200).json({ message: like === 1 ? 'Like added successfully.' : 'Dislike added successfully.' });
          });
        } else {
          res.status(400).json({ message: 'Invalid request.' });
        }
      }
    } catch (error) {
      console.error('Error processing like or dislike:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  });
};

exports.getLikesAndDislikes = (req, res) => {
  db.query(`SELECT post_id, likes, dislikes, user_id_liked, user_id_disliked FROM likes`, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
};
