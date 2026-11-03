const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Tabela de junção do muitos-para-muitos Coleção <-> Receita.
const CollectionRecipe = sequelize.define('CollectionRecipe', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    collectionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'collections', key: 'id' } },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'recipes', key: 'id' } }
}, {
    tableName: 'collection_recipes',
    timestamps: true,
    indexes: [
        // Composto e único: acelera "esta receita está nesta coleção?" e impede a linha repetida.
        { unique: true, fields: ['collection_id', 'recipe_id'], name: 'idx_unique_collection_recipe' },
        // Simples na receita: acelera "em quais coleções esta receita está?" (status e exclusão da receita).
        { fields: ['recipe_id'], name: 'idx_collection_recipes_recipe_id' }
    ]
});

module.exports = CollectionRecipe;
