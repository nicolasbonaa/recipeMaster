const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { optionalAuth } = require('../../middlewares/optionalAuth');
const asyncHandler = require('../../middlewares/asyncHandler');
const uploadRecipe = require('../../middlewares/recipeMulter');
const { createValidator, updateValidator } = require('./recipeValidator');
const recipeController = require('./recipeController');

router.post('/recipes', authenticate, uploadRecipe.single('image'), createValidator, asyncHandler(recipeController.create));
router.get('/feed', authenticate, asyncHandler(recipeController.getFeed));
router.get('/my-recipes', authenticate, asyncHandler(recipeController.getMyRecipes));
router.get('/recipes/:id/edit', authenticate, asyncHandler(recipeController.getForEdit));
router.put('/recipes/:id', authenticate, uploadRecipe.single('image'), updateValidator, asyncHandler(recipeController.update));
router.delete('/recipes/:id', authenticate, asyncHandler(recipeController.remove));
router.get('/recipes/:id', optionalAuth, asyncHandler(recipeController.getDetails));

module.exports = router;
