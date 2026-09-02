const UserService = require('./userService');
const { success } = require('../../middlewares/apiResponse');

exports.register = async(req, res, next) => {
    const { username, email, password, fullName } = req.body;

    const newUser = await UserService.registerUser(username, email, password, fullName);

    return success(res, 'Usuário registrado com sucesso. Faça Login para continuar', 201, newUser);
}

exports.getPublicProfile = async(req, res, next) => {
    const user = await UserService.getPublicProfile(req.params.username);

    return success(res, user);
}