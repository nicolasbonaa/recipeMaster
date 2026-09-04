const bcrypt = require('bcrypt');
const { generateToken } = require('../../config/jwt');
const User = require('../user/userModel');

async function authenticate(email, password) {
    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
        throw new Error('E-mail incorreto.');
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);

    if (!senhaValida) {
        throw new Error('Senha incorreta.');
    }

    const token = generateToken({ email, password });

    return token;
}

module.exports = { authenticate };