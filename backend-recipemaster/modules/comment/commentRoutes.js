const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { createCommentValidator } = require('./commentValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const commentController = require('./commentController');

router.post('/recipes/:recipeId/comments', authenticate, createCommentValidator, asyncHandler(commentController.create));
router.get('/recipes/:recipeId/comments', asyncHandler(commentController.list));

module.exports = router;
