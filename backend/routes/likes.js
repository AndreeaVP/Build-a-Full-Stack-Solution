const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likes');

router.post('/', auth, likeCtrl.createUpdateDeleteLike);
router.get('/', auth, likeCtrl.getLikesAndDislikes);

module.exports = router;