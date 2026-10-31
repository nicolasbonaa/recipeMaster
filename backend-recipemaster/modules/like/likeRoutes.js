const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');
const asyncHandler = require('../../middlewares/asyncHandler');
const likeController = require('./likeController');

router.get('/liked-recipes', authenticate, asyncHandler(likeController.list));
router.post('/recipes/:recipeId/toggle-like', authenticate, asyncHandler(likeController.toggle));
router.get('/recipes/:recipeId/like-status', optionalAuth, asyncHandler(likeController.status));

module.exports = router;
