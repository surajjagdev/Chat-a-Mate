const db = require('../models');
const bycrpt = require('bcrypt');
const app = require('express')();
const session = require('express-session');
const saltRounds = 10;
module.exports = {
  findEverything: (req, res) => {
    db.User.findAll({})
      .then(dbFindAll => {
        return res.json(dbFindAll);
      })
      .catch(error => {
        if (error) {
          res.json(error);
        }
      });
  },
  newUser: (req, res, next) => {
    //strip tags afterwards.
    const { first_name, last_name, email, password } = req.body;
    //strip html tags and remove uneccessary white spaces
    const stripTagsFunction = myString => {
      return myString.replace(/(<([^>]+)>)/gi, '');
    };
    if (first_name && last_name && email && password) {
      bycrpt.hash(password, saltRounds, function(err, hash) {
        if (!err) {
          db.User.create({
            first_name: stripTagsFunction(first_name.split(' ').join('')),
            last_name: stripTagsFunction(last_name.split(' ').join('')),
            email: stripTagsFunction(email.split(' ').join('')),
            password: hash
          })
            .then(created => {
              if (!created) {
                return res.status(400).json({
                  success: false,
                  message: 'An error has occured. User has not been saved'
                });
              }
              app.use(
                session({
                  secret: 'cat',
                  resave: false,
                  saveUninitialized: true
                  /*,
                  cookie: { secure: true }*/
                })
              );
              return res.json({
                success: true,
                data: created,
                message: 'User successfully created'
              });
            })
            .catch(error => {
              if (error) {
                return res.json({ success: false, errors: error });
              }
            });
        } else {
          res.json({ success: false, errors: err, message: 'Hash Failed' });
        }
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Error Missing Parameters' });
    }
  }
};
