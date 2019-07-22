const io = require('../server.js').io;
const db = require('../models');
const sequelize = require('sequelize');
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
module.exports = function(socket) {
  socket.request.user.logged_in = true;
  sendStatus = function(s) {
    socket.emit(ERROR, s);
  };
  //on intial sign in find 10 posts that are public user
  if (socket.request.user && socket.request.user.logged_in === true) {
    db.Post.findAll({
      include: [{ model: db.PostComment }],
      where: {
        public: true,
        user_closed: false,
        deleted: false
      },
      limit: 10
    })
      .then(found => {
        //
        const postsObject = found.map(posts => {
          return Object.assign(
            {},
            {
              success: true,
              errors: null,
              posts: {
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
            }
          );
        });
        //
        socket.emit(INITIAL_POSTS, postsObject);
      })
      .catch(error => {
        //
        socket.emit(ERROR, error);
      });
  }
  //user connected to socket
  socket.on(USER_CONNECTED, user => {
    if (socket.request.user) {
      return (socket.request.username = user);
    }
  });
  socket.on(USER_POST, data => {
    let body = data.body;
    let added_by = data.added_by;
    let user_to = data.user_to;
    const user = data.user;
    if (
      socket.request.user.logged_in === true &&
      user === socket.request.username
    ) {
      console.log('hello: ', body, added_by, user_to, user);
      if (body !== '' && added_by !== '' && user_to !== '' && user !== '') {
        //
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
                  where: {
                    id: user
                  }
                }
              )
                .then(found => {
                  if (found) {
                    db.User.findOne({
                      where: {
                        id: user
                      }
                    })
                      .then(foundUpdated => {
                        if (foundUpdated) {
                          //change to socket emit
                          return socket.emit(GLOBAL_POSTS, {
                            success: true,
                            errors: null,
                            post: {
                              postId: created.id,
                              body: created.body,
                              added_by: created.added_by,
                              deleted: created.deleted,
                              public: created.public,
                              user_closed: created.user_closed,
                              user_to: created.user_to,
                              likes: created.likes
                            },
                            number_posts_total: foundUpdated.number_posts,
                            number_likes_total: foundUpdated.number_likes
                          });
                        }
                      })
                      .catch(error => {
                        return socket.emit(ERROR, {
                          success: false,
                          error: true,
                          errors: error,
                          message: 'Posts created, user update failed however.'
                        });
                      });
                  }
                })
                .catch(error => {
                  return socket.emit(ERROR, {
                    success: false,
                    error: true,
                    errors: error,
                    message: 'Posts created, user update failed however.'
                  });
                });
            }
          })
          .catch(error => {
            socket.emit(ERROR, {
              success: false,
              error: true,
              errors: error,
              message: 'post error fail'
            });
          });
      }
    } else {
      sendStatus('Please Enter valid Post Message');
    }
  });

  //test
  socket.on('greet', greeting => {
    if (socket.request.user) {
      console.log(greeting);
    }
  });
};
