//export
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    //first name
    first_name: {
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
    },
    //last name
    last_name: {
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
    },
    //email
    email: {
      //String limit of 255 default, making it 100 max length
      type: DataTypes.STRING({ length: 100 }),
      //not allowing empty
      allowNull: false,
      //validation
      validation: {
        //is letters only
        isEmail: {
          args: true,
          msg: 'Email Formatted Incorrectly'
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validation: {
        lengthOf: function(val) {
          if (val.length < 5 || val.length < 15) {
            throw new Error(
              'please choose a password between 5 and 15 characters'
            );
          }
        }
      }
    }
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
