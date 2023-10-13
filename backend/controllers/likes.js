const db = require('../config/database');


exports.createUpdateDeleteLike = (req, res) => {
  const { like, dislike, post_id, user_id } = req.body;

  if (like === 1) {
    // Check if the user has already liked the post
    db.query(
      'SELECT likes FROM likes WHERE post_id = ? AND user_id_liked = ?',
      [post_id, user_id],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (result.length > 0) {
          // Update the likes column for the existing record
          db.query(
            'UPDATE likes SET likes = ? WHERE post_id = ? AND user_id_liked = ?',
            [like, post_id, user_id],
            (err, updateResult) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.status(200).json({ message: "Like updated!" });
            }
          );
        } else {
          // Insert a new like record
          db.query(
            'INSERT INTO likes (likes, post_id, user_id_liked) VALUES (?, ?, ?)',
            [like, post_id, user_id],
            (err, insertResult) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.status(201).json({ message: "Like added!" });
            }
          );
        }
      }
    );
  } else if (like === 0) {
    // Remove the like
    db.query(
      'UPDATE likes SET likes = ? WHERE post_id = ? AND user_id_liked = ?',
      [like, null, post_id, user_id],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).json({ message: "Like removed!" });
      }
    );
  }

  if (dislike === 1) {
    // Check if the user has already disliked the post
    db.query(
      'SELECT dislikes FROM likes WHERE post_id = ? AND user_id_disliked = ?',
      [post_id, user_id],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (result.length > 0) {
          // Update the dislikes column for the existing record
          db.query(
            'UPDATE likes SET dislikes = ? WHERE post_id = ? AND user_id_disliked = ?',
            [dislike, post_id, user_id],
            (err, updateResult) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.status(200).json({ message: "Dislike updated!" });
            }
          );
        } else {
          // Insert a new dislike record
          db.query(
            'INSERT INTO likes (dislikes, post_id, user_id_disliked) VALUES (?, ?, ?)',
            [dislike, post_id, user_id],
            (err, insertResult) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.status(201).json({ message: "Dislike added!" });
            }
          );
        }
      }
    );
  } else if (dislike === 0) {
    // Remove the dislike
    db.query(
      'UPDATE likes SET dislikes = ? WHERE post_id = ? AND user_id_disliked = ?',
      [dislike, null, post_id, user_id],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).json({ message: "Dislike removed!" });
      }
    );
  }
};

exports.getLikesByPostId = (req, res) => {
  const postId = req.params.postId;

  db.query(
    'SELECT * FROM likes WHERE post_id = ?',
    [postId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ likes: results });
    }
  );
};

exports.getLikesAndDislikes = (req, res) => {
  db.query(`SELECT post_id, likes, dislikes, user_id_liked, user_id_disliked FROM likes`,
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send(result);
    }
  );
};
