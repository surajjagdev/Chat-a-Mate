const uuidv4 = require('uuid/v4');
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    //id using a uuid instead
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        notNull: true
      },
      defaultValue: () => uuidv4()
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    //userId
    added_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_to: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_closed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    likes: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
  return Post;
};
