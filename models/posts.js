module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    //id using a uuid instead
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
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
