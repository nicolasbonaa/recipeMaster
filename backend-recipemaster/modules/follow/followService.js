const sequelize = require('../../config/database');
const Follow = require('./followModel');
const User = require('../user/userModel');

// Dados públicos de uma pessoa (nunca password/email).
const publicUserAttributes = ['id', 'username', 'fullName', 'bio', 'profilePicture', 'followersCount', 'followingCount', 'recipesCount'];

function httpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function ensureUser(userId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) throw httpError('Usuário não encontrado.', 404);
    return user;
}

/**
 * followerId (quem está logado) passa a seguir / deixa de seguir followingId (o alvo).
 * Os ids já chegam como número (convertidos no controller).
 */
async function toggleFollow(followerId, followingId) {
    if (followerId === followingId) {
        throw httpError('Você não pode seguir a si mesmo.', 400);
    }

    const target = await ensureUser(followingId);

    let isFollowing;
    let created;

    await sequelize.transaction(async (t) => {
        // Escrita 1: a linha em follows (cria ou remove).
        const [follow, wasCreated] = await Follow.findOrCreate({
            where: { followerId, followingId },
            defaults: { followerId, followingId },
            transaction: t
        });

        if (wasCreated) {
            // Escritas 2 e 3: followersCount sobe NO SEGUIDO; followingCount sobe EM QUEM SEGUE.
            await User.increment('followersCount', { by: 1, where: { id: followingId }, transaction: t });
            await User.increment('followingCount', { by: 1, where: { id: followerId }, transaction: t });
        } else {
            await follow.destroy({ transaction: t });
            await User.decrement('followersCount', { by: 1, where: { id: followingId }, transaction: t });
            await User.decrement('followingCount', { by: 1, where: { id: followerId }, transaction: t });
        }

        isFollowing = wasCreated;
        created = wasCreated;
    });

    // increment/decrement não atualizam a instância em memória: reload() lê o valor real do banco.
    await target.reload();

    return { isFollowing, followersCount: target.followersCount, created };
}

async function getFollowStatus(followerId, followingId) {
    await ensureUser(followingId);
    if (!followerId || followerId === followingId) return false;
    const follow = await Follow.findOne({ where: { followerId, followingId } });
    return Boolean(follow);
}

// "Seguidores de X": linhas em que X é o SEGUIDO (followingId = X); entrego o Follower de cada linha.
async function getFollowers(userId) {
    await ensureUser(userId);
    const rows = await Follow.findAll({
        where: { followingId: userId },
        include: [{ model: User, as: 'Follower', attributes: publicUserAttributes }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
    });
    return rows.map((row) => row.Follower).filter(Boolean);
}

// "Quem X segue": linhas em que X é o SEGUIDOR (followerId = X); entrego o Following de cada linha.
async function getFollowing(userId) {
    await ensureUser(userId);
    const rows = await Follow.findAll({
        where: { followerId: userId },
        include: [{ model: User, as: 'Following', attributes: publicUserAttributes }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
    });
    return rows.map((row) => row.Following).filter(Boolean);
}

module.exports = { toggleFollow, getFollowStatus, getFollowers, getFollowing };
