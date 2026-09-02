const { error } = require('./apiResponse')

module.exports = (err, req, res, next) => {
    console.log(err);

    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || [];

    return error(res, err.massage || 'Ocorreu um erro interno no servidor.', statusCode, err.errors);
}