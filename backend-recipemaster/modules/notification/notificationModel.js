const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { NOTIFICATION } = require('../../config/constants');

// Um aviso para o DONO de algo (userId), gerado quando outra pessoa (actorId) curte, comenta ou segue.
const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    actorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    type: { type: DataTypes.ENUM(...Object.values(NOTIFICATION.TYPES)), allowNull: false },
    // Opcional: "seguir" não tem receita.
    recipeId: { type: DataTypes.INTEGER, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
    tableName: 'notifications',
    timestamps: true,
    indexes: [
        // Atende "minhas não lidas" (unread-count) e a lista do destinatário.
        { fields: ['user_id', 'is_read'], name: 'idx_notifications_user_read' },
        // Atende a limpeza dos avisos de uma receita excluída.
        { fields: ['recipe_id'], name: 'idx_notifications_recipe_id' }
    ]
});

module.exports = Notification;
