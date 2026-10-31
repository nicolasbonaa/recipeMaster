const sequelize = require('../../config/database');
const Recipe = require('./recipeModel');
const User = require('../user/userModel');
const Like = require('../like/likeModel');
const Comment = require('../comment/commentModel');
const Follow = require('../follow/followModel');
const { Op } = require('sequelize');
const fs = require('fs/promises');
const path = require('path');

const RECIPE_UPLOADS_DIR = path.join(__dirname, '../../public/uploads/recipes');

const authorAttributes = ['id', 'username', 'fullName', 'bio', 'profilePicture', 'recipesCount'];

async function createRecipe({ title, description, image, userId }) {
    return sequelize.transaction(async (transaction) => {
        const recipe = await Recipe.create({ title, description, image, userId }, { transaction });
        await User.increment('recipesCount', { by: 1, where: { id: userId }, transaction });
        return recipe;
    });
}

async function getRecipeDetails(id, viewerId) {
    const recipe = await Recipe.findByPk(id, {
        include: [{ model: User, as: 'author', attributes: authorAttributes }]
    });

    if (!recipe) {
        const error = new Error('Receita não encontrada.');
        error.statusCode = 404;
        throw error;
    }

    await recipe.increment('views');
    await recipe.reload({
        include: [{ model: User, as: 'author', attributes: authorAttributes }]
    });

    const isLiked = viewerId
        ? Boolean(await Like.findOne({ where: { userId: viewerId, recipeId: id } }))
        : false;

    return {
        ...recipe.toJSON(),
        isOwner: Number(viewerId) === Number(recipe.userId),
        isLiked
    };
}

async function getFeed(page = 1, limit = 6) {
    const offset = (page - 1) * limit;
    return Recipe.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        include: [{ model: User, as: 'author', attributes: authorAttributes }]
    });
}

// Feed só com receitas de quem userId segue.
async function getFollowingRecipes(userId, page = 1, limit = 12) {
    const follows = await Follow.findAll({ where: { followerId: userId }, attributes: ['followingId'] });
    const followedIds = follows.map((follow) => Number(follow.followingId));

    // Não segue ninguém: nada a buscar (e `IN ()` vazio não faz sentido em SQL).
    if (followedIds.length === 0) return [];

    const offset = (page - 1) * limit;
    return Recipe.findAll({
        where: { userId: { [Op.in]: followedIds } },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        include: [{ model: User, as: 'author', attributes: authorAttributes }]
    });
}

async function getMyRecipes(userId) {
    return Recipe.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'author', attributes: authorAttributes }]
    });
}

async function getRecipeForEdit(id, userId) {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
        const error = new Error('Receita não encontrada.');
        error.statusCode = 404;
        throw error;
    }
    if (Number(recipe.userId) !== Number(userId)) {
        const error = new Error('Você não tem permissão para editar esta receita.');
        error.statusCode = 403;
        throw error;
    }
    return recipe;
}

async function updateRecipe(id, userId, { title, description, image }) {
    const recipe = await getRecipeForEdit(id, userId);
    const previousImage = recipe.image;
    const updateData = { title, description };
    if (image) updateData.image = image;

    await recipe.update(updateData);

    if (image && previousImage && previousImage !== image) {
        await fs.unlink(path.join(RECIPE_UPLOADS_DIR, path.basename(previousImage))).catch(() => undefined);
    }
    return recipe;
}

async function deleteRecipe(id, userId) {
    const recipe = await getRecipeForEdit(id, userId);
    await sequelize.transaction(async (transaction) => {
        await Like.destroy({ where: { recipeId: id }, transaction });
        await Comment.destroy({ where: { recipeId: id }, transaction });
        await recipe.destroy({ transaction });
        await User.decrement('recipesCount', { by: 1, where: { id: userId }, transaction });
    });
    await fs.unlink(path.join(RECIPE_UPLOADS_DIR, path.basename(recipe.image))).catch(() => undefined);
}

module.exports = { createRecipe, getRecipeDetails, getFeed, getFollowingRecipes, getMyRecipes, getRecipeForEdit, updateRecipe, deleteRecipe };
