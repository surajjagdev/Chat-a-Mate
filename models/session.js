const sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
  var Session = sequelize.define('Session', {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    userId: Sequelize.STRING,
    expires: Sequelize.DATE,
    data: Sequelize.TEXT
  });

  return Session;
};
