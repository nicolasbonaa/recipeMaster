const User = require('../modules/user/userModel');
const Recipe = require('../modules/recipe/recipeModel');
const Like = require('../modules/like/likeModel');
const Comment = require('../modules/comment/commentModel');
const Follow = require('../modules/follow/followModel');
const Collection = require('../modules/collection/collectionModel');
const CollectionRecipe = require('../modules/collection/collectionRecipeModel');
const Notification = require('../modules/notification/notificationModel');
const Report = require('../modules/report/reportModel');

User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(Like, { foreignKey: 'userId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Recipe.hasMany(Like, { foreignKey: 'recipeId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Recipe.hasMany(Comment, { foreignKey: 'recipeId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

// Follow liga User a User duas vezes: os apelidos dizem qual das duas pontas estamos incluindo.
Follow.belongsTo(User, { as: 'Follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'Following', foreignKey: 'followingId' });

User.hasMany(Collection, { foreignKey: 'userId', as: 'collections', onDelete: 'CASCADE' });
Collection.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Collection.belongsToMany(Recipe, { through: CollectionRecipe, foreignKey: 'collectionId', otherKey: 'recipeId', as: 'recipes', uniqueKey: 'idx_unique_collection_recipe' });
Recipe.belongsToMany(Collection, { through: CollectionRecipe, foreignKey: 'recipeId', otherKey: 'collectionId', as: 'collections', uniqueKey: 'idx_unique_collection_recipe' });
Collection.hasMany(CollectionRecipe, { foreignKey: 'collectionId', as: 'recipeLinks', onDelete: 'CASCADE' });
CollectionRecipe.belongsTo(Collection, { foreignKey: 'collectionId' });
Recipe.hasMany(CollectionRecipe, { foreignKey: 'recipeId', as: 'collectionLinks', onDelete: 'CASCADE' });
CollectionRecipe.belongsTo(Recipe, { foreignKey: 'recipeId' });

// Notificação: quem recebe, quem agiu e (opcional) a receita.
// Só o belongsTo define o ON DELETE: SET NULL na receita da notificação, NO ACTION na receita da denúncia.
Notification.belongsTo(User, { foreignKey: 'userId', as: 'Recipient' });
Notification.belongsTo(User, { foreignKey: 'actorId', as: 'Actor' });
Notification.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe', onDelete: 'SET NULL' });

// Denúncia: quem denunciou e a receita denunciada.
Report.belongsTo(User, { foreignKey: 'userId', as: 'Reporter' });
Report.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe', onDelete: 'NO ACTION' });

module.exports = { User, Recipe, Like, Comment, Follow, Collection, CollectionRecipe, Notification, Report };
