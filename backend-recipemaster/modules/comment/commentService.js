const sequelize = require('../../config/database');
const Comment = require('./commentModel');
const Recipe = require('../recipe/recipeModel');
const User = require('../user/userModel');

const authorAttributes = ['id', 'username', 'fullName', 'profilePicture'];

function recipeNotFound() {
    const error = new Error('Receita não encontrada.');
    error.statusCode = 404;
    return error;
}

async function ensureRecipe(recipeId, transaction) {
    const recipe = await Recipe.findByPk(recipeId, { transaction });
    if (!recipe) throw recipeNotFound();
    return recipe;
}

async function createComment(userId, recipeId, content) {
    return sequelize.transaction(async (transaction) => {
        const recipe = await ensureRecipe(recipeId, transaction);
        const comment = await Comment.create({ userId, recipeId, content }, { transaction });
        await recipe.increment('commentsCount', { by: 1, transaction });
        return Comment.findByPk(comment.id, {
            transaction,
            include: [{ model: User, as: 'author', attributes: authorAttributes }]
        });
    });
}

async function getComments(recipeId) {
    await ensureRecipe(recipeId);
    return Comment.findAll({
        where: { recipeId },
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'author', attributes: authorAttributes }]
    });
}

module.exports = { createComment, getComments };
