function parseId(rawValue, label) {
    const id = Number(rawValue);
    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error(`Identificador de ${label} inválido.`);
        error.statusCode = 400;
        throw error;
    }
    return id;
}

module.exports = { parseId };
