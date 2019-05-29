module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define('Session', {
    //session id
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    //expires
    expires: DataTypes.DATE,
    //data from passport session cookie
    data: DataTypes.STRING(5000)
  });
  return Session;
};
