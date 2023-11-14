const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likes');

router.post('/', auth, likeCtrl.createLike);
router.get('/:postId', auth, likeCtrl.getLikesByPostId);

module.exports = router;