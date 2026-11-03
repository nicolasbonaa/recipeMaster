const { Op } = require('sequelize');
const Recipe = require('../recipe/recipeModel');
const User = require('../user/userModel');
const { SEARCH } = require('../../config/constants');

function escapeLike(value) {
    return value.replace(/[\\%_]/g, '\\$&');
}

function searchRecipes(query) {
    return Recipe.findAll({
        where: { title: { [Op.like]: `%${escapeLike(query)}%` } },
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'fullName', 'profilePicture'] }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit: SEARCH.LIMIT
    });
}

function searchUsers(query) {
    const pattern = `%${escapeLike(query)}%`;
    return User.findAll({
        where: { [Op.or]: [{ username: { [Op.like]: pattern } }, { fullName: { [Op.like]: pattern } }] },
        attributes: ['id', 'username', 'fullName', 'profilePicture'],
        order: [['username', 'ASC']],
        limit: SEARCH.LIMIT
    });
}

function globalSearch(query) {
    return Promise.all([searchRecipes(query), searchUsers(query)])
        .then(([receitas, users]) => ({ receitas, users }));
}

module.exports = { globalSearch, escapeLike };
