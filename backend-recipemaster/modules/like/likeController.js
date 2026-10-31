const likeService = require('./likeService');
const { success } = require('../../middlewares/apiResponse');

exports.toggle = async (req, res) => {
    const result = await likeService.toggleLike(req.user.id, req.params.recipeId);
    return success(res, {
        liked: result.liked,
        likesCount: result.likesCount
    }, result.liked ? 'Receita curtida.' : 'Curtida removida.', result.created ? 201 : 200);
};

exports.status = async (req, res) => {
    const result = await likeService.getLikeStatus(req.user?.id, req.params.recipeId);
    return success(res, result);
};

exports.list = async (req, res) => {
    const recipes = await likeService.getLikedRecipes(req.user.id);
    return success(res, recipes);
};
