const db = require('../models');
const bycrpt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const saltRounds = 10;
router.get('/api/users', (req, res, next) => {
  db.User.findAll({})
    .then(dbFindAll => {
      return res.json(dbFindAll);
    })
    .catch(error => {
      if (error) {
        res.json(error);
      }
    });
});
router.post('/api/newuser', (req, res, next) => {
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
            const userId = created.id;
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
});
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db.User.findById(id, (err, user) => {
    done(err, user);
  });
});
//passport
module.exports = router;
