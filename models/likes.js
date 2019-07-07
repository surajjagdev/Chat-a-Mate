module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    //id using a uuid instead
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    post_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  return Like;
};
