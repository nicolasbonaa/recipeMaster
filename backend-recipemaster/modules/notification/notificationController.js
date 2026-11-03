const notificationService = require('./notificationService');
const { success } = require('../../middlewares/apiResponse');
const { parsePagination } = require('../../utils/pagination');
const { parseId } = require('../../utils/parseId');

exports.list = async (req, res) => {
    const { page, limit } = parsePagination(req.query);
    return success(res, await notificationService.getUserNotifications(req.user.id, page, limit));
};

exports.unreadCount = async (req, res) => {
    const unreadCount = await notificationService.getUnreadCount(req.user.id);
    return success(res, { unreadCount });
};

exports.markAsRead = async (req, res) => {
    const id = parseId(req.params.id, 'notificação');
    const result = await notificationService.markAsRead(id, req.user.id);
    return success(res, result, 'Notificação marcada como lida.');
};
