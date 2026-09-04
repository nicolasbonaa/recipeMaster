const express = require('express');
const router = express.Router();
const authController = require('./authController');
const asyncHandler = require('../../middlewares/asyncHandler');

router.post('/login', asyncHandler(authController.authenticateUser));

module.exports = router;