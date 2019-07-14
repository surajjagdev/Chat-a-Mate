const uuidv4 = require('uuid/v4');
//export
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    //id using a uuid instead
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        notNull: true
      },
      defaultValue: () => uuidv4()
    },
    //first name
    first_name: {
      //String limit of 255 default, making it 50 length
      type: DataTypes.STRING({ length: 50 }),
      //not allowing empty
      allowNull: false,
      //validation
      validate: {
        is: { args: ['^[a-z]+$', 'i'], msg: 'First name must be letters only' },
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
        is: { args: ['^[a-z]+$', 'i'], msg: 'Last name must be letters only' },
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
        //is email
        isEmail: {
          args: true,
          msg: 'Email Formatted Incorrectly'
        }
      }
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    //password field is virtual. Grab password from user input then will hash and set the password_hash field.
    password: {
      type: DataTypes.VIRTUAL,
      set: function(val) {
        this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
        this.setDataValue('password_hash', val);
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
  /*User.associate = models => {
    //has many posts
    User.hasMany(models.Post, {
      foreignKey: 'added_by',
      constraints: false
    });
  };*/
  return User;
};
