const followService = require('./followService');
const recipeService = require('../recipe/recipeService');
const { success } = require('../../middlewares/apiResponse');
const { parsePagination } = require('../../utils/pagination');
const { parseId } = require('../../utils/parseId');

exports.toggle = async (req, res) => {
    const userId = parseId(req.params.userId, 'usuário');

    const result = await followService.toggleFollow(Number(req.user.id), userId);
    return success(res, {
        isFollowing: result.isFollowing,
        followersCount: result.followersCount
    }, result.isFollowing ? 'Agora você segue este usuário.' : 'Você deixou de seguir este usuário.', result.created ? 201 : 200);
};

exports.status = async (req, res) => {
    const userId = parseId(req.params.userId, 'usuário');

    const isFollowing = await followService.getFollowStatus(Number(req.user.id), userId);
    return success(res, { isFollowing });
};

exports.followers = async (req, res) => {
    const userId = parseId(req.params.userId, 'usuário');

    const users = await followService.getFollowers(userId);
    return success(res, users);
};

exports.following = async (req, res) => {
    const userId = parseId(req.params.userId, 'usuário');

    const users = await followService.getFollowing(userId);
    return success(res, users);
};

exports.followingRecipes = async (req, res) => {
    const { page, limit } = parsePagination(req.query);
    const recipes = await recipeService.getFollowingRecipes(Number(req.user.id), page, limit);
    return success(res, recipes);
};
