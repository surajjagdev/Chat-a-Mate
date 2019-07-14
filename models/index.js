'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
//models/tables
db.User = require('./user.js')(sequelize, Sequelize);
db.Post = require('./posts.js')(sequelize, Sequelize);
db.PostComment = require('./posts_comments.js')(sequelize, Sequelize);
db.Like = require('./likes.js')(sequelize, Sequelize);
//=================relations========================//
//Users have many posts
db.User.hasMany(db.Post);
//each post belongs to one User
db.Post.belongsTo(db.User);
//comments belong to post
db.PostComment.belongsTo(db.Post);
//Posts can have many comments
db.Post.hasMany(db.PostComment);
//Post can have many likes
db.Post.hasMany(db.Like);
//like can belong to a single post
db.Like.belongsTo(db.Post);

module.exports = db;
