var express = require('express');
var router = express.Router();
const { success } = require('../middlewares/apiResponse')

router.get('/', (req, res) => {
    return success(res, {
        name: 'Recipe Master API',
        version: '2.0.0',
        status: 'online'
    }, 'Bem vindo à API do Recipe Master')
})

module.exports = router;