const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const controller = require('./notificationController');

router.get('/notifications', authenticate, asyncHandler(controller.list));
router.get('/notifications/unread-count', authenticate, asyncHandler(controller.unreadCount));
router.patch('/notifications/:id/read', authenticate, asyncHandler(controller.markAsRead));

module.exports = router;
