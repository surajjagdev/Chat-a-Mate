//export
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    //user's name
    name: {
      //String limit of 255 default, making it 50 length
      type: DataTypes.STRING({ length: 50 }),
      //not allowing empty
      allowNull: false,
      //validation
      validation: {
        //is letters only
        is: { args: ['^[a-z]+$', 'i'], msg: 'Name must be letters only' },
        len: {
          args: [1, 50],
          msg: 'Name must be between 1 and 50 characters'
        }
      }
    }
    //column name
  });
  return User;
};
/*devoured: {
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
  }*/
