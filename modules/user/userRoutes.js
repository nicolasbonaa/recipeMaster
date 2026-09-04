const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { registerValidator } = require('./userValidator');
const { authenticate } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');

router.post('/register', registerValidator, asyncHandler(userController.register));
router.get('/profile/me', authenticate, asyncHandler(userController.getUserProfile));
router.get('/profile/:username', asyncHandler(userController.getPublicProfile));

module.exports = router;