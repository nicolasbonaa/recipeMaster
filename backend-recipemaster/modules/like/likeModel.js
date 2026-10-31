const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Like = sequelize.define('Like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    recipeId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'likes',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['user_id', 'recipe_id'], name: 'idx_unique_user_recipe_like' }
    ]
});

module.exports = Like;
