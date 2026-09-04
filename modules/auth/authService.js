const bcrypt = require('bcrypt');
const { generateToken } = require('../../config/jwt');
const User = require('../user/userModel');

async function createLogin(email, password) {

    const usuario = await User.findOne({
        where: { email }
    });

    if (!usuario) {
        const error = new Error('E-mail ou senha inválidos.');
        error.statusCode = 401;
        throw error;
    }

    const senhaValida = await bcrypt.compare(
        password,
        usuario.password
    );

    if (!senhaValida) {
        const error = new Error('E-mail ou senha inválidos.');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken({
        id: usuario.id
    });

    return token;
}

module.exports = { createLogin };