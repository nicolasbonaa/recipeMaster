const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const { reportValidator } = require('./reportValidator');
const controller = require('./reportController');

// Ordem: autenticação -> validação do motivo -> controller.
router.post('/recipes/:recipeId/report', authenticate, reportValidator, asyncHandler(controller.create));

module.exports = router;
