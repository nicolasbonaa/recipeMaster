const sequelize = require('../../config/database');
const Like = require('./likeModel');
const Recipe = require('../recipe/recipeModel');
const User = require('../user/userModel');
const { createNotification, removeNotification } = require('../notification/notificationService');
const { NOTIFICATION } = require('../../config/constants');

const authorAttributes = ['id', 'username', 'fullName', 'bio', 'profilePicture', 'recipesCount'];

function notFound() {
    const error = new Error('Receita não encontrada.');
    error.statusCode = 404;
    return error;
}

async function ensureRecipe(recipeId, transaction) {
    const recipe = await Recipe.findByPk(recipeId, { transaction });
    if (!recipe) throw notFound();
    return recipe;
}

// Três escritas na mesma transação: a curtida, o contador da receita e o aviso para o dono.
async function toggleLike(userId, recipeId) {
    return sequelize.transaction(async (transaction) => {
        const recipe = await ensureRecipe(recipeId, transaction);
        const existingLike = await Like.findOne({ where: { userId, recipeId }, transaction });
        const notification = { userId: recipe.userId, actorId: userId, type: NOTIFICATION.TYPES.LIKE, recipeId: recipe.id };

        if (existingLike) {
            await existingLike.destroy({ transaction });
            await recipe.decrement('likesCount', { by: 1, transaction });
            await removeNotification(notification, transaction); // descurtir apaga o aviso
            return { liked: false, likesCount: Math.max(recipe.likesCount - 1, 0), created: false };
        }

        await Like.create({ userId, recipeId }, { transaction });
        await recipe.increment('likesCount', { by: 1, transaction });
        await createNotification(notification, transaction);
        return { liked: true, likesCount: recipe.likesCount + 1, created: true };
    });
}

async function getLikeStatus(userId, recipeId) {
    await ensureRecipe(recipeId);
    if (!userId) return { liked: false };
    const like = await Like.findOne({ where: { userId, recipeId } });
    return { liked: Boolean(like) };
}

async function getLikedRecipes(userId) {
    const likes = await Like.findAll({
        where: { userId },
        attributes: ['recipeId'],
        include: [{
            model: Recipe,
            as: 'recipe',
            include: [{ model: User, as: 'author', attributes: authorAttributes }]
        }],
        order: [['createdAt', 'DESC']]
    });

    return likes.filter((like) => like.recipe).map((like) => ({
        ...like.recipe.toJSON(),
        isLiked: true
    }));
}

module.exports = { toggleLike, getLikeStatus, getLikedRecipes };
