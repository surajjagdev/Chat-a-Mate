//export

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    //column name
    burgerName: {
      //String limit of 255
      type: DataTypes.STRING,
      //not allowing empty
      allowNull: false,
      //validation
      validation: {
        //is letters only
        is: ['^[a-z]+$', 'i']
      }
    },
    //column name
    devoured: {
      //boolean type 0 or 1 only
      type: DataTypes.BOOLEAN,
      //not allowing empty
      allowNull: false,
      //default is false
      defaultValue: false,
      //validation
      validation: {
        //not allowing letters
        not: ['[a-z]', 'i']
      }
    }
  });
  return User;
};
