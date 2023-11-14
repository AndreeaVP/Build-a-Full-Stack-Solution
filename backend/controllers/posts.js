const db = require('../config/database');
const fs = require('fs');

exports.createPost = (req, res) => {
  const body = req.file
    ? {
        ...req.body,
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body, image_url: null };

  const { user_id, textual_post, image_url } = body;

  db.query(
    'INSERT INTO posts (user_id, textual_post, image_url) VALUES (?, ?, ?)',
    [user_id, textual_post, image_url],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Post created successfully' });
    }
  );
};

exports.getAllPosts = (req, res) => {
  const query = `
    SELECT p.*, u.firstname, u.lastname
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ posts: results });
  });
};

exports.getPostsByUserId = (req, res) => {
  const userId = req.params.userId;
    
  db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json({ posts: results });
    });
  };
    

exports.updatePost = (req, res) => {
    const postId = req.params.postId;
    const { textual_post } = req.body;
  
    const updateFields = {};
  
    if (textual_post) {
      updateFields.textual_post = textual_post;
    }
  
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
  
    const query = 'UPDATE posts SET ? WHERE post_id = ?';
  
    db.query(query, [updateFields, postId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json({ message: 'Post updated successfully' });
    });
};  

exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  db.query('DELETE FROM posts WHERE post_id = ?', [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  });
};
