const commentService = require('./commentService');
const { success } = require('../../middlewares/apiResponse');

exports.create = async (req, res) => {
    const comment = await commentService.createComment(req.user.id, req.params.recipeId, req.body.content);
    return success(res, comment, 'Comentário publicado com sucesso.', 201);
};

exports.list = async (req, res) => {
    const comments = await commentService.getComments(req.params.recipeId);
    return success(res, comments);
};
