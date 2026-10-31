const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Tabela que liga usuário a usuário: "followerId segue followingId".
const Follow = sequelize.define('Follow', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'follows',
    timestamps: true,
    indexes: [
        // follower_id primeiro: atende "quem EU sigo" (where follower_id = ?) e impede duplicatas.
        { unique: true, fields: ['follower_id', 'following_id'], name: 'idx_unique_follower_following' },
        // following_id sozinho: atende "quem ME segue" (where following_id = ?), que o índice acima não cobre.
        { fields: ['following_id'], name: 'idx_follows_following_id' }
    ]
});

module.exports = Follow;
