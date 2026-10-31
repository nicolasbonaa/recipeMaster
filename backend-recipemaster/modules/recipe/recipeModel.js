const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    commentsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    userId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'recipes',
    timestamps: true
});

module.exports = Recipe;
