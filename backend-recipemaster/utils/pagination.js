const { PAGINATION } = require('../config/constants');

function parsePagination(query = {}) {
    const parsedPage = Number.parseInt(query.page, 10);
    const parsedLimit = Number.parseInt(query.limit, 10);

    return {
        page: Number.isInteger(parsedPage) && parsedPage >= 1
            ? parsedPage
            : PAGINATION.DEFAULT_PAGE,
        limit: Number.isInteger(parsedLimit) && parsedLimit >= 1
            ? Math.min(parsedLimit, PAGINATION.MAX_LIMIT)
            : PAGINATION.DEFAULT_LIMIT
    };
}

module.exports = { parsePagination };
