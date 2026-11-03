const Report = require('./reportModel');
const Recipe = require('../recipe/recipeModel');

function httpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Uma escrita só: não precisa de transação. E o dono NÃO é notificado.
async function createReport(userId, recipeId, reason) {
    const recipe = await Recipe.findByPk(recipeId, { attributes: ['id', 'userId'] });
    if (!recipe) throw httpError('Receita não encontrada.', 404);
    if (Number(recipe.userId) === Number(userId)) throw httpError('Você não pode denunciar a sua própria receita.', 400);

    const [report, created] = await Report.findOrCreate({
        where: { userId, recipeId },
        defaults: { userId, recipeId, reason }
    });
    if (!created) throw httpError('Você já denunciou esta receita.', 409);
    return report;
}

module.exports = { createReport };
