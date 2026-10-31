const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const firstError = errors.array()[0].msg;
    const error = new Error(firstError);
    error.statusCode = 400;
    error.errors = errors.array();
    throw error;
};

const fields = [
    body('title')
        .trim()
        .notEmpty().withMessage('O título da receita é obrigatório.')
        .isLength({ max: VALIDATION.TITLE_MAX })
        .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),
    body('description')
        .trim()
        .notEmpty().withMessage('A descrição da receita é obrigatória.')
        .isLength({ max: VALIDATION.DESCRIPTION_MAX })
        .withMessage(`A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`),
    (req, res, next) => {
        if (!req.file) {
            const error = new Error('A imagem da receita é obrigatória.');
            error.statusCode = 400;
            throw error;
        }
        next();
    },
    validate
];

const updateFields = [
    body('title')
        .trim()
        .notEmpty().withMessage('O título da receita é obrigatório.')
        .isLength({ max: VALIDATION.TITLE_MAX })
        .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),
    body('description')
        .trim()
        .notEmpty().withMessage('A descrição da receita é obrigatória.')
        .isLength({ max: VALIDATION.DESCRIPTION_MAX })
        .withMessage(`A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`),
    validate
];

module.exports = { createValidator: fields, updateValidator: updateFields };
