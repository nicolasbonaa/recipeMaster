var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');
require('dotenv').config();

var indexRouter = require('./routes/index');
var searchRoutes = require('./modules/search/searchRoutes');
var userRoutes = require('./modules/user/userRoutes');
var authRoutes = require('./modules/auth/authRoutes');
var recipeRoutes = require('./modules/recipe/recipeRoutes');
var likeRoutes = require('./modules/like/likeRoutes');
var commentRoutes = require('./modules/comment/commentRoutes');
var followRoutes = require('./modules/follow/followRoutes');
var collectionRoutes = require('./modules/collection/collectionRoutes');
var notificationRoutes = require('./modules/notification/notificationRoutes');
var reportRoutes = require('./modules/report/reportRoutes');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

app.use(logger('dev'));
// CORS antes dos parsers: se o express.json() recusar o corpo (400), a resposta de erro
// já sai com Access-Control-Allow-Origin e o navegador mostra o 400 em vez de "erro de CORS".
app.use(cors({
    origin: [process.env.CORS_ORIGIN || 'http://localhost:5174', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api', indexRouter);
app.use('/api', searchRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', recipeRoutes);
app.use('/api', likeRoutes);
app.use('/api', commentRoutes);
app.use('/api', followRoutes);
app.use('/api', collectionRoutes);
app.use('/api', notificationRoutes);
app.use('/api', reportRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        errors: []
    })
})

app.use(errorHandler);

module.exports = app;
