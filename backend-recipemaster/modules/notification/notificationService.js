const Notification = require('./notificationModel');
const User = require('../user/userModel');
const Recipe = require('../recipe/recipeModel');

const actorAttributes = ['id', 'username', 'fullName', 'profilePicture'];
const recipeAttributes = ['id', 'title', 'image'];

function httpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Chamado DENTRO da transação de curtir/comentar/seguir: sempre receba e repasse a transação.
async function createNotification({ userId, actorId, type, recipeId = null }, transaction) {
    // Ninguém é avisado das próprias ações.
    if (Number(userId) === Number(actorId)) return null;
    return Notification.create({ userId, actorId, type, recipeId }, { transaction });
}

// Desfaz o aviso de uma ação desfeita (descurtir / deixar de seguir).
async function removeNotification({ userId, actorId, type, recipeId = null }, transaction) {
    return Notification.destroy({ where: { userId, actorId, type, recipeId }, transaction });
}

async function getUserNotifications(userId, page, limit) {
    return Notification.findAll({
        where: { userId },
        attributes: ['id', 'type', 'recipeId', 'isRead', 'createdAt'],
        include: [
            { model: User, as: 'Actor', attributes: actorAttributes },
            { model: Recipe, as: 'recipe', attributes: recipeAttributes }
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset: (page - 1) * limit
    });
}

async function getUnreadCount(userId) {
    return Notification.count({ where: { userId, isRead: false } });
}

async function markAsRead(id, userId) {
    const notification = await Notification.findByPk(id);
    if (!notification) throw httpError('Notificação não encontrada.', 404);
    if (Number(notification.userId) !== Number(userId)) throw httpError('Esta notificação não é sua.', 403);
    // Idempotente: só escreve se ainda não estava lida.
    if (!notification.isRead) await notification.update({ isRead: true });
    // Contado DEPOIS da escrita terminar.
    const unreadCount = await getUnreadCount(userId);
    return { id: notification.id, isRead: true, unreadCount };
}

module.exports = { createNotification, removeNotification, getUserNotifications, getUnreadCount, markAsRead };
