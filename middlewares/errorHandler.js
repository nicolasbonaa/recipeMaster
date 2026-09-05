const { error } = require('./apiResponse')

module.exports = (err, req, res, next) => {
    console.log(err);

    const statusCode = err.statusCode || 500;
    return error(res, err.message || 'Ocorreu um erro interno no servidor.', statusCode, err.errors || []);
}