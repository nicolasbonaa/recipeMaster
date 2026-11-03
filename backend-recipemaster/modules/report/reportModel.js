const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { REPORT } = require('../../config/constants');

// Uma pessoa avisa a moderação de que uma receita merece revisão.
const Report = sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    recipeId: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.ENUM(...REPORT.REASONS), allowNull: false }
}, {
    tableName: 'reports',
    timestamps: true,
    indexes: [
        // Uma denúncia por pessoa e receita: é o que garante o 409 mesmo com dois cliques simultâneos.
        { unique: true, fields: ['user_id', 'recipe_id'], name: 'idx_unique_report_user_recipe' },
        { fields: ['recipe_id'], name: 'idx_reports_recipe_id' }
    ]
});

module.exports = Report;
