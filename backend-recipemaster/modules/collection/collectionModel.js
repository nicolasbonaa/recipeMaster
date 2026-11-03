const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Collection = sequelize.define('Collection', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: true },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    recipesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
}, {
    tableName: 'collections',
    timestamps: true,
    indexes: [{ fields: ['user_id'], name: 'idx_collections_user_id' }]
});

module.exports = Collection;
