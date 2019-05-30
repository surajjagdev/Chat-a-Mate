const sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
  var Session = sequelize.define('Session', {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    expires: Sequelize.DATE,
    data: Sequelize.TEXT
  });

  return Session;
};
