const io = require('../server.js').io;
const db = require('../models');
const {
  INITIAL_POSTS,
  GLOBAL_POSTS,
  ERROR,
  USER_CONNECTED,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
  USER_DICONNECTED,
  TYPING,
  VERIFY_USER,
  LOGOUT
} = require('../client/src/events.js');
module.exports = function(socket) {
  //on intial sign in find 10 posts that are public user
  if (socket.request.user) {
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
              postId: posts.id,
              body: posts.body,
              added_by: posts.added_by,
              user_to: posts.user_to,
              user_closed: posts.user_closed,
              deleted: posts.deleted,
              public: posts.public,
              likes: posts.likes,
              createdAt: posts.createdAt
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

  socket.on(USER_CONNECTED, user => {
    if (socket.request.user) {
      console.log('user socket: ', user);
    }
  });
  socket.on('greet', greeting => {
    if (socket.request.user) {
      console.log(greeting);
    }
  });
};
