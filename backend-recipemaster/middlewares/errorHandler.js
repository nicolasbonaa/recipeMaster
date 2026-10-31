const { error } = require('./apiResponse')
const fs = require('fs/promises');
const path = require('path');

module.exports = (err, req, res, next) => {
    console.log(err);

    if (req.file?.path) {
        fs.unlink(path.resolve(req.file.path)).catch(() => undefined);
    }

    const statusCode = err.statusCode || 500;
    return error(res, err.message || 'Ocorreu um erro interno no servidor.', statusCode, err.errors || []);
}