const authService = require('./authService');
const { success } = require('../../middlewares/apiResponse');

exports.authenticateUser = async (req, res, next) => {
    const token = await authService.authenticate(req.body.email, req.body.password);
    return success(res, { token }, 'Login realizado com sucesso.', 200);
}