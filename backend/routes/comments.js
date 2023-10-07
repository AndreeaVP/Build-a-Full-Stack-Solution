const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comments');

router.post('/:postId', auth, commentCtrl.createComment);
router.put('/:commentId', auth, commentCtrl.updateComment);
router.delete('/:commentId', auth, commentCtrl.deleteComment);
router.get('/:postId', auth, commentCtrl.getCommentsByPostId);

module.exports = router;