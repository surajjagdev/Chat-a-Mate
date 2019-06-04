const db = require('../models');
const bycrpt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const saltRounds = 10;
router.get('/api/users', authenticationMiddleware(), (req, res, next) => {
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
router.post(
  '/api/newuser',
  checkAuthenticationMiddleware(),
  (req, res, next) => {
    //strip tags afterwards.
    setTimeout(() => {
      console.log(req.session);
    }, 5000);
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
                  errors: {
                    errors: [
                      {
                        message: 'An error has occured. User has not been saved'
                      }
                    ]
                  },
                  message: 'An error has occured. User has not been saved'
                });
              } else if (created && typeof userId !== 'undefined') {
                req.login(userId, {}, error => {
                  // console.log('req.user: ', req);
                  if (!error) {
                    console.log(req.session);
                    return res.json({
                      success: true,
                      data: created,
                      message: 'User successfully created'
                    });
                  } else {
                    return res.json({
                      success: false,
                      errors: {
                        errors: [{ message: 'corrupted seralization' }]
                      },
                      message: 'User created Successfully, but not seralized'
                    });
                  }
                });
              }
            })
            .catch(error => {
              if (error) {
                return res.json({
                  success: false,
                  errors: {
                    errors: [{ message: JSON.stringify(error) }]
                  },
                  message: 'Error Caught on Server. Please Try again.'
                });
              }
            });
        } else {
          res.json({
            success: false,
            errors: { errors: [{ error: err, message: 'Hash failed' }] },
            message: 'Hash Failed'
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        errors: { errors: [{ message: 'Error Missing Parameters' }] },
        message: 'Error Missing Parameters'
      });
    }
  }
);
router.get('/api/newuser/test', authenticationMiddleware(), (req, res) => {
  return res.send('hi');
});
passport.serializeUser(function(userId, done) {
  console.log('from seralized userId: ', userId);
  done(null, userId);
});
passport.deserializeUser(function(userId, done) {
  db.User.findOne({ where: { id: userId } }).then(user => {
    if (user) {
      console.log('\n\n\n\nFound User\n\n\n\n');
      done(null, user);
    } else {
      console.log('Unable to deseralize');
    }
  });
});
//authentication middleware
function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(req.session);
    console.log(req.cookies);
    console.log('is authenticated middleware: ', req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.json({
        success: false,
        error: true,
        errors: {
          errors: [
            {
              message: 'Unsuccessfull login authorized. Please Log back in.'
            }
          ]
        },
        message: 'unsuccessfull login process'
      });
    }
  };
}
function checkAuthenticationMiddleware() {
  return (req, res, next) => {
    console.log(req.session);
    console.log(req.cookies);
    console.log(
      'is authenticated via req.isAuthenticated: ',
      req.isAuthenticated()
    );
    if (req.isAuthenticated()) {
      return res.json({
        success: false,
        error: true,
        errors: {
          errors: [
            {
              message:
                'User Already exists in Database. Cannot Register. Try Logging in.'
            }
          ]
        },
        message: 'Already Logged in'
      });
    } else {
      console.log('returning next. User DNE');
      return next();
    }
  };
}

//passport
module.exports = router;
