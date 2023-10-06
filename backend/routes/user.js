const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');

router.get('/', auth, userCtrl.getAllUsers);
router.get('/:id', auth, userCtrl.getUserById);
router.put('/:id', auth, multer.single('image_url'), userCtrl.updateUser);
router.delete('/:id', auth,  userCtrl.deleteUser);

module.exports = router;