module.exports = {
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 12,
        MAX_LIMIT: 50
    },
    VALIDATION: {
        USERNAME_MIN: 3,
        USERNAME_MAX: 20,
        PASSWORD_MIN: 6,
        TITLE_MAX: 120,
        BIO_MAX: 255,
        DESCRIPTION_MAX: 500,
        COMMENT_MAX: 500,
        COLLECTION_TITLE_MIN: 3,
        COLLECTION_TITLE_MAX: 100,
        COLLECTION_DESCRIPTION_MAX: 500,
    },
    SEARCH: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        LIMIT: 10,
    },
    NOTIFICATION: {
        TYPES: {
            LIKE: 'like',
            COMMENT: 'comment',
            FOLLOW: 'follow',
        },
    },
    REPORT: {
        // Lista fixa para todos os projetos (a Aula 15 lê as denúncias com estas chaves).
        REASONS: ['inappropriate_content', 'harassment', 'spam', 'copyright', 'other'],
    },
}