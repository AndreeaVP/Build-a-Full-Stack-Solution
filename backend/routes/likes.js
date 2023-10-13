const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likes');

router.post('/:postId', auth, likeCtrl.createUpdateDeleteLike);
router.get('/:postId', auth, likeCtrl.getLikesByPostId);

module.exports = router;