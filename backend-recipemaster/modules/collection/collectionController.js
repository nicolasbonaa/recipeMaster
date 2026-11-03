const collectionService = require('./collectionService');
const { success } = require('../../middlewares/apiResponse');
const { parseId } = require('../../utils/parseId');

exports.list = async (req, res) => success(res, await collectionService.listMyCollections(req.user.id));
exports.create = async (req, res) => success(res, await collectionService.createCollection(req.user.id, req.body), 'Coleção criada com sucesso.', 201);
exports.get = async (req, res) => {
    const { collection, recipes, isOwner } = await collectionService.getCollectionById(parseId(req.params.id, 'coleção'), req.user?.id ?? null);
    return success(res, { ...collection.toJSON(), recipes, isOwner });
};
exports.remove = async (req, res) => {
    await collectionService.deleteCollection(parseId(req.params.id, 'coleção'), req.user.id);
    return success(res, null, 'Coleção excluída com sucesso.');
};
exports.status = async (req, res) => success(res, await collectionService.getCollectionStatus(parseId(req.params.id, 'receita'), req.user.id));
exports.add = async (req, res) => {
    const result = await collectionService.addRecipe(
        parseId(req.params.id, 'coleção'),
        parseId(req.body.recipeId, 'receita'),
        req.user.id
    );
    return success(res, result, result.added ? 'Receita adicionada à coleção.' : 'Receita já estava na coleção.', result.added ? 201 : 200);
};
exports.removeRecipe = async (req, res) => {
    const result = await collectionService.removeRecipe(
        parseId(req.params.id, 'coleção'),
        parseId(req.params.recipeId, 'receita'),
        req.user.id
    );
    return success(res, result, 'Receita removida da coleção.');
};
