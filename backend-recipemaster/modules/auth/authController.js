const authService = require('./authService');
const { success } = require('../../middlewares/apiResponse');

exports.createLogin = async (req, res, next) => {
    const token = await authService.createLogin(req.body.email, req.body.password);
    return success(res, { token }, 'Login realizado com sucesso.', 200);
}

// JWT sem estado: não há sessão para encerrar no servidor; o front descarta o token.
exports.logout = async (req, res) => success(res, null, 'Logout realizado com sucesso.');
