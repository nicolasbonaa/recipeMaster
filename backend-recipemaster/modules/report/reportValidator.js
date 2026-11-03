const { body, validationResult } = require('express-validator');
const { REPORT } = require('../../config/constants');

function validate(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) return next();
    const error = new Error(result.array()[0].msg);
    error.statusCode = 400;
    error.errors = result.array();
    throw error;
}

const reportValidator = [
    body('reason').isIn(REPORT.REASONS).withMessage('Escolha um motivo válido para a denúncia.'),
    validate
];

module.exports = { reportValidator };
