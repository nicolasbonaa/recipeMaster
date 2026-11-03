const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');
const asyncHandler = require('../../middlewares/asyncHandler');
const controller = require('./collectionController');
const { createValidator } = require('./collectionValidator');

router.get('/my-collections', authenticate, asyncHandler(controller.list));
router.post('/collections', authenticate, createValidator, asyncHandler(controller.create));
router.get('/collections/:id', optionalAuth, asyncHandler(controller.get));
router.delete('/collections/:id', authenticate, asyncHandler(controller.remove));
router.post('/collections/:id/recipes', authenticate, asyncHandler(controller.add));
router.delete('/collections/:id/recipes/:recipeId', authenticate, asyncHandler(controller.removeRecipe));
router.get('/recipes/:id/collections-status', authenticate, asyncHandler(controller.status));

module.exports = router;
