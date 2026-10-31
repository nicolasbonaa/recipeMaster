const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const followController = require('./followController');

// Ações do usuário logado
router.post('/users/:userId/toggle-follow', authenticate, asyncHandler(followController.toggle));
router.get('/users/:userId/follow-status', authenticate, asyncHandler(followController.status));

// Listas públicas
router.get('/users/:userId/followers', asyncHandler(followController.followers));
router.get('/users/:userId/following', asyncHandler(followController.following));

// Feed filtrado por quem eu sigo
router.get('/following-recipes', authenticate, asyncHandler(followController.followingRecipes));

module.exports = router;
