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

const createCommentValidator = [
    body('content')
        .trim()
        .notEmpty().withMessage('O comentário não pode ficar vazio.')
        .isLength({ max: VALIDATION.COMMENT_MAX })
        .withMessage(`O comentário deve ter no máximo ${VALIDATION.COMMENT_MAX} caracteres.`),
    validate
];

module.exports = { createCommentValidator };
