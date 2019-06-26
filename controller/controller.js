const db = require('../models');
const bycrpt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const saltRounds = 10;
//=========================Get all users===========================================//
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
//======================New User Login============================================//
router.post(
  '/api/newuser',
  checkAuthenticationMiddleware(),
  (req, res, next) => {
    //strip tags afterwards.
    const { first_name, last_name, email, password } = req.body;
    //strip html tags and remove uneccessary white spaces
    const stripTagsFunction = myString => {
      return myString.replace(/(<([^>]+)>)/gi, '');
    };
    db.User.findOne({
      where: {
        email: email
      }
    }).then(user => {
      if (user === null) {
        continueRegister();
      } else {
        return res.json({
          success: false,
          user: { firstName: user.first_name, lastName: user.last_name },
          errors: {
            errors: [
              {
                message: 'Email already exists in database. Please login in.'
              }
            ]
          },
          message: 'Email already in use.'
        });
      }
    });
    //register the user. hash password and log them in.
    function continueRegister() {
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
                          message:
                            'An error has occured. User has not been saved'
                        }
                      ]
                    },
                    message: 'An error has occured. User has not been saved'
                  });
                } else if (created && typeof userId !== 'undefined') {
                  req.login(userId, {}, error => {
                    // console.log('req.user: ', req);
                    if (!error) {
                      console.log('req.session.id :', req.session.id);
                      const sessionId = req.session.id;
                      req.session.id = sessionId;
                      return res.json({
                        success: true,
                        data: created,
                        user: created.id,
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
  }
);
//===================Login in User========================================//
router.post(
  '/api/user/login',
  checkAuthenticationLogin(),
  passport.authenticate('local-login', {
    successRedirect: '/api/auth/user/success',
    failureRedirect: '/api/auth/user/failure'
  })
);
router.get(
  '/api/auth/user/authcheck',
  authenticationMiddleware(),
  (req, res) => {
    db.User.findOne({
      where: {
        id: req.session.passport.user
      }
    })
      .then(found => {
        if (found) {
          return res.json({
            success: true,
            errors: null,
            details: {
              firstName: found.first_name,
              lastName: found.last_name,
              email: found.email
            },
            user: req.session.passport.user
          });
        } else {
          return res.json({
            success: false,
            errors: { errors: [{ message: 'Please Try again later' }] }
          });
        }
      })
      .catch(error => {
        if (error) {
          console.log('error: ', error);
        }
      });
  }
);
router.get('/api/auth/user/failure', authenticationMiddleware());
router.get('/api/auth/user/success', (req, res) => {
  return res.json({
    success: true,
    errors: null,
    user: req.session.passport.user
  });
});
router.get('/api/user/logout', authenticationMiddleware(), (req, res) => {
  //logout
  req.logOut();
  req.session.destroy();
});
//====================Check if user is logged in. If not make them login==============================//
function authenticationMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.json({
        success: false,
        error: true,
        errors: {
          errors: [
            {
              message: 'Incorrect username and/ or password. Please try again'
            }
          ]
        },
        message: 'unsuccessfull login process. You are not logged in.'
      });
    }
  };
}
function checkAuthenticationLogin() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.json({
        success: false,
        error: true,
        errors: {
          errors: [
            {
              message: 'User is Already Logged in'
            }
          ]
        }
      });
    } else {
      return next();
    }
  };
}
function ensureUserMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.json({
        success: false,
        errors: {
          errors: [{ message: 'Time Out' }]
        }
      });
    }
  };
}
//=======================Register Middleware========================================//
//Check if user exists in database. If Not register them. If so deny registeration.
function checkAuthenticationMiddleware() {
  return (req, res, next) => {
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
      console.log('Returning next. User does not exist in database.');
      return next();
    }
  };
}
module.exports = router;
