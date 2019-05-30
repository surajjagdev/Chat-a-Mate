const db = require('../models');
const bycrpt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const saltRounds = 10;
router.get('/test', authenticationMiddleware(), (req, res) => {
  return res.json({ message: 'hello' });
});
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
            const userId = created.id;
            if (!created) {
              return res.status(400).json({
                success: false,
                message: 'An error has occured. User has not been saved'
              });
            } else if (created && typeof userId !== 'undefined') {
              req.login(userId, error => {
                console.log('req.user: ', req.user);
                console.log('is authenticated: ', req.isAuthenticated());
                if (!error) {
                  return res.json({
                    success: true,
                    data: created,
                    message: 'User successfully created'
                  });
                } else {
                  return res.json({
                    success: false,
                    data: 'corrupted seralization',
                    message: 'User created Successfully, but not seralized'
                  });
                }
              });
            }
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
passport.serializeUser((userId, done) => {
  console.log('from seralized userId: ', userId);
  done(null, userId);
});
passport.deserializeUser((userId, done) => {
  db.User.findById(userId, (err, user) => {
    console.log('from deseralize: ', user);
    done(null, user);
  });
});
//authentication middleware
function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
    );
    console.log(req.session);
    console.log('is authenticated middleware: ', req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res
        .json({
          success: false,
          data: 'unable to login',
          message: 'unsuccessfull login process'
        })
        .status(404);
    }
  };
}
//passport
module.exports = router;
