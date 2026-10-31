const User = require('../modules/user/userModel');
const Recipe = require('../modules/recipe/recipeModel');
const Like = require('../modules/like/likeModel');
const Comment = require('../modules/comment/commentModel');
const Follow = require('../modules/follow/followModel');

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

module.exports = { User, Recipe, Like, Comment, Follow };
