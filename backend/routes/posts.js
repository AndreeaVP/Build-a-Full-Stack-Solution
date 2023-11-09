const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/posts');
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');

router.post('/', auth, multer.single('image_url'), postCtrl.createPost);
router.get('/:userId', auth, postCtrl.getPostsByUserId);
router.get('/', auth, postCtrl.getAllPosts);
router.put('/:postId', auth, postCtrl.updatePost);
router.delete('/:postId', auth, postCtrl.deletePost);

module.exports = router;