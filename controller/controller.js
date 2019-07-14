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
              image: 'https://www.gstatic.com/webp/gallery/4.sm.jpg',
              number_posts: 0,
              number_likes: 0,
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
              email: found.email,
              image: found.image,
              likes: found.number_likes,
              posts: found.number_posts
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
//=================update user====================================================================//
router.put('/api/user/update', authenticationMiddleware(), (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const image = req.body.image;
  db.User.findOne({
    where: {
      id: req.session.passport.user
    }
  }).then(found => {
    if (
      found &&
      found.firstName === firstName &&
      found.lastName === lastName &&
      found.email === email
    ) {
      db.User.update(
        {
          image
        },
        {
          where: {
            id: req.session.passport.user
          }
        }
      )
        .then(rowsupdated => {
          return res.json({ success: true, errors: null, rowsupdated });
        })
        .catch(error => {
          if (err) {
            return res.json({
              success: false,
              error: true,
              errors: err,
              message: 'An error has occured updating image'
            });
          }
        });
    } else {
      return res.json({
        success: false,
        error: true,
        errors: {
          errors: [
            {
              message:
                'Incorrect credientials to update image. Please try again.'
            }
          ]
        },
        message: 'Incorrect credientials'
      });
    }
  });
});
//====================posts============================================================================//

//get all posts from user
router.get(
  '/api/auth/user/allposts',
  authenticationMiddleware(),
  (req, res) => {
    const email = req.body.email;
    const userId = req.body.userId;
    db.User.findOne({
      where: {
        id: userId
      }
    })
      .then(found => {
        if (found.email === email) {
          return res.json({
            success: true,
            error: null,
            number_posts: found.number_posts
          });
        } else {
          return res.json({
            success: false,
            error: true,
            errors: {
              errors: [{ message: 'Server Error getting user  Posts.' }]
            }
          });
        }
      })
      .catch(error => {
        res.json({ success: false, error: true, errors: error });
      });
  }
);
//new post update post table, then user number of posts table
router.post('/api/auth/user/post', authenticationMiddleware(), (req, res) => {
  const body = req.body.body;
  //added_by and user_to will be same if posting status on own profile.
  const added_by = req.body.added_by;
  const user = req.session.passport.user;
  const user_to = req.body.user_to;
  db.Post.create({
    body: body,
    added_by: added_by,
    user_to: user_to
  })
    .then(created => {
      if (!created) {
        return res.json({
          success: false,
          error: true,
          errors: {
            errors: [
              {
                message:
                  'Posts created, but failed to update user number of posts category.'
              }
            ]
          }
        });
      } else {
        db.User.update(
          {
            number_posts: 3
          },
          {
            returning: true,
            where: {
              id: user
            }
          }
        )
          .then(found => {
            if (found) {
              return res.json({
                success: true,
                errors: null,
                details: created,
                number_posts: found.number_posts,
                number_likes: found.number_likes
              });
            }
          })
          .catch(error => {
            return res.json({
              success: false,
              error: true,
              errors: error,
              message:
                'Posts created, but failed to update user number of posts category.'
            });
          });
      }
    })
    .catch(error => {
      return res.json({
        success: false,
        error: true,
        errors: error,
        message: 'post error fail'
      });
    });
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
