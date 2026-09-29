const UserService = require('./userService');
const { success } = require('../../middlewares/apiResponse');
const { authenticate } = require('../../middlewares/auth');

exports.register = async(req, res, next) => {
    const { username, email, password, fullName } = req.body;

    const newUser = await UserService.registerUser(username, email, password, fullName);

    return success(res, newUser, 'Usuário registrado com sucesso. Faça Login para continuar', 201);
}

exports.getPublicProfile = async(req, res, next) => {
    const user = await UserService.getPublicProfile(req.params.username);

    return success(res, user);
}

exports.getUserProfile = async(req, res, next) => {
    const user = await UserService.getUserProfile(req.user.id);

    return success(res, user);
}

exports.updateProfile = async(req, res, next) => {
    const profilePicture = req.file?.filename;
    const user = await UserService.updateUserProfile(req.user.id, {
        fullName: req.body.fullName,
        bio: req.body.bio,
        profilePicture
    });

    return success(res, user, 'Perfil atualizado com sucesso.');
}
