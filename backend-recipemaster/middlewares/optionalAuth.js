const { verifyToken } = require('../config/jwt');

function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next();

    try {
        req.user = verifyToken(token);
    } catch {
        req.user = undefined;
    }

    next();
}

module.exports = { optionalAuth };