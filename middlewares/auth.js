const { verifyToken } = require('../config/jwt');

function authenticate(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({ message: 'Usuário não autenticado.' });

    try {
        const data = verifyToken(token);
        req.user = data;
        next();
    }catch (err){
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
}

module.exports = { authenticate };