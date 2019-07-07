module.exports = function(sequelize, DataTypes) {
  var PostComment = sequelize.define('PostComment', {
    //id using a uuid instead
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      validate: {
        notNull: true
      }
    },
    post_body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    posted_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_to: {
      allowNull: false,
      type: DataTypes.STRING
    },
    date_added: {
      allowNull: false,
      type: DataTypes.DATE,
      default: DataTypes.NOW
    },
    removed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      default: false
    },
    post_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  return PostComment;
};
