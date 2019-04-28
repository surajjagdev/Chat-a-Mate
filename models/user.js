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
      validate: {
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
      validate: {
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
      unique: true,
      //validation
      validate: {
        //is letters only
        isEmail: {
          args: true,
          msg: 'Email Formatted Incorrectly'
        }
      }
    },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    //password field is virtual. Grab password from user input then will hash and set the password_hash field.
    password: {
      type: DataTypes.VIRTUAL,
      set: function(val) {
        this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
        this.setDataValue('password_hash', 8 + val);
      },
      validate: {
        isLongEnough: function(val) {
          if (val.length < 7) {
            throw new Error('Please choose a longer password');
          }
        }
      }
    },
    //number of posts user has
    number_posts: {
      type: DataTypes.INTEGER,
      allowNull: true
    }, //number of posts user has
    number_likes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    //friends array. Can't use array dataType in mysql2 through sequelize, so will save as text.
    friendsArray: {
      type: DataTypes.TEXT,
      allowNull: true
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
