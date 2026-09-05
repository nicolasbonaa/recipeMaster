const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { registerValidator } = require('./userValidator');
const { profileUpdateValidator } = require('./userValidator');
const { authenticate } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const uploadProfile = require('../../middlewares/profileMulter');

router.post('/register', registerValidator, asyncHandler(userController.register));
router.get('/profile/me', authenticate, asyncHandler(userController.getUserProfile));
router.put('/profile/me', authenticate, uploadProfile.single('photo'), profileUpdateValidator, asyncHandler(userController.updateProfile));
router.get('/profile/:username', asyncHandler(userController.getPublicProfile));

module.exports = router;