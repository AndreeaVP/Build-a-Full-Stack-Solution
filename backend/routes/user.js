const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');

router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, multer.single('image_url'), userController.updateUser);
router.delete('/:id', auth,  userController.deleteUser);

module.exports = router;