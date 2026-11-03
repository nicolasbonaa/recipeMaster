const reportService = require('./reportService');
const { success } = require('../../middlewares/apiResponse');
const { parseId } = require('../../utils/parseId');

exports.create = async (req, res) => {
    const recipeId = parseId(req.params.recipeId, 'receita');
    const report = await reportService.createReport(req.user.id, recipeId, req.body.reason);
    return success(res, { id: report.id, recipeId: report.recipeId, reason: report.reason }, 'Denúncia enviada. Obrigado por avisar.', 201);
};
