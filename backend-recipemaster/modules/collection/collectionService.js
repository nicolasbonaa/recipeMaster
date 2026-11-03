const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const Collection = require('./collectionModel');
const CollectionRecipe = require('./collectionRecipeModel');
const Recipe = require('../recipe/recipeModel');
const User = require('../user/userModel');

const userAttributes = ['id', 'username', 'fullName', 'profilePicture'];
const recipeAttributes = ['id', 'title', 'description', 'image', 'views', 'likesCount', 'commentsCount', 'userId', 'createdAt'];

function httpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function getOwnedCollection(id, userId) {
    const collection = await Collection.findByPk(id);
    if (!collection) throw httpError('Coleção não encontrada.', 404);
    if (Number(collection.userId) !== Number(userId)) throw httpError('Você não tem permissão para esta coleção.', 403);
    return collection;
}

async function listMyCollections(userId) {
    return Collection.findAll({
        where: { userId },
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
    });
}

async function createCollection(userId, data) {
    return Collection.create({
        userId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        isPublic: data.isPublic === true
    });
}

async function getCollectionById(id, currentUserId = null) {
    const collection = await Collection.findByPk(id, {
        include: [
            { model: User, as: 'owner', attributes: userAttributes },
            {
                model: Recipe,
                as: 'recipes',
                attributes: recipeAttributes,
                through: { attributes: [] },
                include: [{ model: User, as: 'author', attributes: userAttributes }]
            }
        ],
        order: [[{ model: Recipe, as: 'recipes' }, 'createdAt', 'DESC']]
    });
    if (!collection) throw httpError('Coleção não encontrada.', 404);
    // currentUserId !== null primeiro: um visitante nunca pode "casar" undefined/null com o dono.
    const isOwner = currentUserId !== null && Number(collection.userId) === Number(currentUserId);
    if (!collection.isPublic && !isOwner) throw httpError('Esta coleção é privada.', 403);
    const recipes = collection.recipes || [];
    return { collection, recipes, isOwner };
}

async function deleteCollection(id, userId) {
    const collection = await getOwnedCollection(id, userId);
    await sequelize.transaction(async (transaction) => {
        await CollectionRecipe.destroy({ where: { collectionId: id }, transaction });
        await collection.destroy({ transaction });
    });
}

async function getCollectionStatus(recipeId, userId) {
    const recipe = await Recipe.findByPk(recipeId, { attributes: ['id'] });
    if (!recipe) throw httpError('Receita não encontrada.', 404);
    const collections = await listMyCollections(userId);
    const links = await CollectionRecipe.findAll({
        where: { recipeId, collectionId: { [Op.in]: collections.map((item) => item.id) } },
        attributes: ['collectionId']
    });
    const linkedIds = new Set(links.map((link) => Number(link.collectionId)));
    return collections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        isPublic: collection.isPublic,
        recipesCount: collection.recipesCount,
        hasRecipe: linkedIds.has(Number(collection.id))
    }));
}

async function addRecipe(collectionId, recipeId, userId) {
    const collection = await getOwnedCollection(collectionId, userId);
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) throw httpError('Receita não encontrada.', 404);
    const created = await sequelize.transaction(async (transaction) => {
        const [, wasCreated] = await CollectionRecipe.findOrCreate({
            where: { collectionId, recipeId },
            defaults: { collectionId, recipeId },
            transaction
        });
        // Só conta quando a linha foi criada: repetir o clique não pode inflar o contador.
        if (wasCreated) await collection.increment('recipesCount', { by: 1, transaction });
        return wasCreated;
    });
    await collection.reload();
    return { added: created, recipesCount: collection.recipesCount };
}

async function removeRecipe(collectionId, recipeId, userId) {
    const collection = await getOwnedCollection(collectionId, userId);
    await sequelize.transaction(async (transaction) => {
        const deleted = await CollectionRecipe.destroy({ where: { collectionId, recipeId }, transaction });
        if (!deleted) throw httpError('Este item não está na coleção.', 404);
        await collection.decrement('recipesCount', { by: 1, transaction });
    });
    await collection.reload();
    return { removed: true, recipesCount: collection.recipesCount };
}

async function removeRecipeFromCollections(recipeId, transaction) {
    const links = await CollectionRecipe.findAll({ where: { recipeId }, transaction });
    if (links.length) {
        const collectionIds = links.map((link) => link.collectionId);
        await Collection.increment('recipesCount', {
            by: -1,
            where: { id: { [Op.in]: collectionIds }, recipesCount: { [Op.gt]: 0 } },
            transaction
        });
        await CollectionRecipe.destroy({ where: { recipeId }, transaction });
    }
}

module.exports = {
    listMyCollections,
    createCollection,
    getCollectionById,
    deleteCollection,
    getCollectionStatus,
    addRecipe,
    removeRecipe,
    removeRecipeFromCollections
};
