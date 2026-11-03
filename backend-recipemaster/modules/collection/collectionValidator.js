const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

function validate(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) return next();
    const firstError = result.array()[0].msg;
    const error = new Error(firstError);
    error.statusCode = 400;
    error.errors = result.array();
    throw error;
}

const createValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('O título da coleção é obrigatório.')
        .isLength({ min: VALIDATION.COLLECTION_TITLE_MIN, max: VALIDATION.COLLECTION_TITLE_MAX })
        .withMessage(`O título deve ter entre ${VALIDATION.COLLECTION_TITLE_MIN} e ${VALIDATION.COLLECTION_TITLE_MAX} caracteres.`),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: VALIDATION.COLLECTION_DESCRIPTION_MAX })
        .withMessage(`A descrição deve ter no máximo ${VALIDATION.COLLECTION_DESCRIPTION_MAX} caracteres.`),
    body('isPublic')
        .optional()
        .isBoolean({ strict: true }).withMessage('O campo isPublic deve ser booleano.'),
    validate
];

module.exports = { createValidator };
