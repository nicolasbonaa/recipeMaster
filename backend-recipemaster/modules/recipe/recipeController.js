const recipeService = require('./recipeService');
const { success } = require('../../middlewares/apiResponse');

exports.create = async (req, res) => {
    const recipe = await recipeService.createRecipe({
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
        userId: req.user.id
    });

    return success(res, recipe, 'Receita publicada com sucesso.', 201);
};

exports.getDetails = async (req, res) => {
    const recipe = await recipeService.getRecipeDetails(req.params.id, req.user?.id);
    return success(res, recipe);
};

exports.getFeed = async (req, res) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 6, 1), 50);
    const recipes = await recipeService.getFeed(page, limit);
    return success(res, recipes);
};

exports.getMyRecipes = async (req, res) => {
    const recipes = await recipeService.getMyRecipes(req.user.id);
    return success(res, recipes);
};

exports.getForEdit = async (req, res) => {
    const recipe = await recipeService.getRecipeForEdit(req.params.id, req.user.id);
    return success(res, recipe);
};

exports.update = async (req, res) => {
    const recipe = await recipeService.updateRecipe(req.params.id, req.user.id, {
        title: req.body.title,
        description: req.body.description,
        image: req.file?.filename
    });
    return success(res, recipe, 'Receita atualizada com sucesso.');
};

exports.remove = async (req, res) => {
    await recipeService.deleteRecipe(req.params.id, req.user.id);
    return success(res, null, 'Receita excluída com sucesso.');
};
