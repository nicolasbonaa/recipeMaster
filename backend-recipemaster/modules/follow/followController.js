const followService = require('./followService');
const recipeService = require('../recipe/recipeService');
const { success, error } = require('../../middlewares/apiResponse');

/**
 * req.params.userId chega SEMPRE como string ("5"). Sem converter, req.user.id (5) === "5" é false
 * e a regra "não seguir a si mesmo" nunca dispara. Convertemos aqui, na borda da API.
 * Devolve o número, ou null depois de já ter respondido 400.
 */
function parseUserId(req, res) {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
        error(res, 'Id de usuário inválido.', 400);
        return null;
    }
    return userId;
}

exports.toggle = async (req, res) => {
    const userId = parseUserId(req, res);
    if (userId === null) return;

    const result = await followService.toggleFollow(Number(req.user.id), userId);
    return success(res, {
        isFollowing: result.isFollowing,
        followersCount: result.followersCount
    }, result.isFollowing ? 'Agora você segue este usuário.' : 'Você deixou de seguir este usuário.', result.created ? 201 : 200);
};

exports.status = async (req, res) => {
    const userId = parseUserId(req, res);
    if (userId === null) return;

    const isFollowing = await followService.getFollowStatus(Number(req.user.id), userId);
    return success(res, { isFollowing });
};

exports.followers = async (req, res) => {
    const userId = parseUserId(req, res);
    if (userId === null) return;

    const users = await followService.getFollowers(userId);
    return success(res, users);
};

exports.following = async (req, res) => {
    const userId = parseUserId(req, res);
    if (userId === null) return;

    const users = await followService.getFollowing(userId);
    return success(res, users);
};

exports.followingRecipes = async (req, res) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
    const recipes = await recipeService.getFollowingRecipes(Number(req.user.id), page, limit);
    return success(res, recipes);
};
