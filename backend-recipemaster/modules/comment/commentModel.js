const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.STRING(500), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    recipeId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'comments',
    timestamps: true
});

module.exports = Comment;
