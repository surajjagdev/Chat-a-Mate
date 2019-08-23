const db = require('../models');
const bycrpt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const moment = require('moment');
const saltRounds = 10;
const io = require('../server.js');
const {
  INITIAL_POSTS,
  GLOBAL_POSTS,
  ERROR,
  USER_POST,
  USER_CONNECTED,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
  USER_DICONNECTED,
  TYPING,
  VERIFY_USER,
  LOGOUT
} = require('../client/src/events.js');
let connectedUsers = {};
//io function//
function ioScoped(event, data) {
  return io.emit(event, data);
}
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
              password: hash,
              friendsArray: ','
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
  req.session.destroy(error => {
    if (!error) {
      return res
        .status(200)
        .clearCookie('backend', {
          path: '/'
        })
        .json({ success: true });
    }
  });
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
  '/api/user/posts/allfriends',
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
        if (found.email === email && userId === req.session.passport.user) {
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
//================================Intial Posts=================================================================//
router.get('/api/user/allposts', authenticationMiddleware(), (req, res) => {
  let offSetQueryString = req.query.offset;
  let offset = parseInt(offSetQueryString, 10);
  db.Post.findAndCountAll({
    include: [{ model: db.PostComment }],
    where: {
      user_closed: false,
      deleted: false
    },
    limit: 10,
    offset: offset,
    order: [['createdAt', 'DESC']]
  })
    .then(found => {
      db.User.findOne({ where: { id: req.session.passport.user } })
        .then(friends => {
          let friendArrayCount = friends.friendsArray.length - 1;
          let friendArraySpliced = friends.friendsArray;
          let friendArray = friendArraySpliced
            .slice(1, friendArrayCount)
            .split(',');
          console.log('friendArray: ', friendArray);
          let friendNotPublicPostsArray = [];
          let countToAddFriend = 0;
          let ommited = 0;
          const postsObject = found.rows.map(posts => {
            let friendNotPublicPosts;
            if (posts.public === false) {
              if (
                friendArray.includes(
                  posts.added_by
                ) &&
                post.added_by === req.passport.user
              ) {
                countToAddFriend += 1;
                friendNotPublicPosts = Object.assign(
                  {},
                  {
                    postId: posts.id,
                    body: posts.body,
                    added_by: posts.added_by,
                    user_to: posts.user_to,
                    user_closed: posts.user_closed,
                    deleted: posts.deleted,
                    public: posts.public,
                    likes: posts.likes,
                    createdAt: posts.createdAt,
                    comments: posts.PostComments.map(comment => {
                      //tidy up the comment data
                      return Object.assign(
                        {},
                        {
                          comment_id: comment.id,
                          postBody: comment.post_body,
                          commenter: comment.post_by,
                          postId: comment.post_id
                        }
                      );
                    })
                  }
                );
                friendNotPublicPostsArray.push(friendNotPublicPosts);
                console.log(friendNotPublicPostsArray);
              } else {
                ommited += 1;
              }
            }
            if (posts.public === true) {
              return Object.assign(
                {},
                {
                  postId: posts.id,
                  body: posts.body,
                  added_by: posts.added_by,
                  user_to: posts.user_to,
                  user_closed: posts.user_closed,
                  deleted: posts.deleted,
                  public: posts.public,
                  likes: posts.likes,
                  createdAt: posts.createdAt,
                  comments: posts.PostComments.map(comment => {
                    //tidy up the comment data
                    return Object.assign(
                      {},
                      {
                        comment_id: comment.id,
                        postBody: comment.post_body,
                        commenter: comment.post_by,
                        postId: comment.post_id
                      }
                    );
                  })
                }
              );
            }
          });
          let filteredArray = postsObject.filter(function(el) {
            return el != null;
          });
          //

          return res.json({
            success: true,
            count: found.count,
            ommited: ommited,
            postsByFriendsIncluded: countToAddFriend,
            friendArray: friendArray,
            posts: filteredArray,
            friendNotPublicPosts: friendNotPublicPostsArray
          });
        })
        .catch(error => {
          return res.json({ success: false, error: true, errors: error });
        });
    })
    .catch(error => {
      return res.json({ success: false, error: true, errors: error });
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
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList['id'] = user;
  console.log(newList);
  return newList;
}

const newsocketmanager = function(socket) {
  socket.request.user.logged_in = true;
  sendStatus = function(s) {
    socket.emit(ERROR, s);
  };
  socket.on(USER_CONNECTED, user => {
    if (socket.request.user) {
      connectedUsers = addUser(connectedUsers, user);
      console.log('connected users:', connectedUsers);
      socket.emit('connectedusers', { connectedUsers, socketId: socket.id });
      return (socket.request.username = user);
    }
  });
  router.post(
    '/api/auth/user/newpost',
    authenticationMiddleware(),
    (req, res) => {
      const { body, added_by, user_to, user } = req.body;
      if (
        socket.request.user.logged_in === true &&
        user === req.session.passport.user &&
        body.length > 0 &&
        added_by.length > 0 &&
        user_to.length > 0
      ) {
        db.Post.create({
          body: body,
          added_by: added_by,
          user_to: user_to,
          UserId: user
        })
          .then(created => {
            if (created) {
              db.User.update(
                {
                  number_posts: sequelize.literal('number_posts + 1')
                },
                {
                  returning: true,
                  where: { id: user }
                }
              )
                .then(found => {
                  if (found) {
                    db.User.findOne({ where: { id: user } })
                      .then(foundUpdated => {
                        return (
                          socket.broadcast.emit(MESSAGE_SENT, {
                            success: true,
                            errors: null,
                            global: false,
                            posts: {
                              postId: created.id,
                              body: created.body,
                              added_by: created.added_by,
                              deleted: created.deleted,
                              public: created.public,
                              user_closed: created.user_closed,
                              user_to: created.user_to,
                              likes: created.likes,
                              createdAt: created.createdAt
                            }
                          }),
                          res.json({
                            success: true,
                            errors: null,
                            global: false,
                            posts: {
                              postId: created.id,
                              body: created.body,
                              added_by: created.added_by,
                              deleted: created.deleted,
                              public: created.public,
                              user_closed: created.user_closed,
                              user_to: created.user_to,
                              likes: created.likes,
                              createdAt: created.createdAt
                            },
                            number_posts_total: foundUpdated.number_posts,
                            number_likes_total: foundUpdated.number_likes
                          })
                        );
                      })
                      .catch(error3 => {
                        return res.json({
                          success: false,
                          error: true,
                          errors: {
                            errors: [
                              {
                                message:
                                  'post created and user updated, but not returned.'
                              }
                            ]
                          },
                          message: error3
                        });
                      });
                  }
                })
                .catch(error2 => {
                  return res.json({
                    success: false,
                    error: true,
                    errors: {
                      errors: [
                        {
                          message: 'post created, but user not updated.'
                        }
                      ]
                    },
                    message: error2
                  });
                });
            }
          })
          .catch(error1 => {
            return res.json({
              success: false,
              error: true,
              errors: {
                errors: [
                  {
                    message: 'Post not created'
                  }
                ]
              },
              message: error1
            });
          });
      }
    }
  );
};

module.exports = {
  router: router,
  newsocketmanager: newsocketmanager
};
