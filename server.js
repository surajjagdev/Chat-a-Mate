//========================if production=====================================//
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
//===========================require in modules============================================//
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./models');
const routes = require('./controller/controller.js').router;
const newSocketManager = require('./controller/controller.js').newsocketmanager;
//Authethication packages
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
//socket auth with passport
const passportSocketIo = require('passport.socketio');
//==============Production======================================///
//serve up static assets production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
  app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
  app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
  app.enable('trust-proxy', 1); //for securing cookies
}
//======================for passport and persistence=====================//
//session options
function extendedDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires
  };
}
//
const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(
  cookieExpirationDate.getDate() + cookieExpirationDays
);
const newSessionStoreObject = new SequelizeStore({
  db: db,
  table: 'Session',
  checkExpirationInterval: 20 * 23 * 60 * 1000,
  expiration: 30 * 24 * 60 * 60 * 1000, //1 month
  extendedDefaultFields: extendedDefaultFields
});
/*const sessionOptions = {
  name: 'backend',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: cookieExpirationDate //1 month,
  },
  store: newSessionStoreObject
};*/

//configuration==============================================//
//cookieparse
app.use(cookieParser(process.env.SECRET));
//static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
//middleware to extract requests and exposing to req, without manually searching for them.
//extented keyword allow you to have nested objects sent
//dont need bodyparser package. Express has it included now after version 4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//express session. Options in object defined from line 29.
app.use(
  session({
    store: newSessionStoreObject,
    secret: process.env.SECRET,
    cookie: {
      expires: cookieExpirationDate
    },
    resave: false,
    saveUninitialized: false
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());
//==========local passport login===========================//
//=========================routes===========================//
require('./passport/passport')(passport);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(routes);
//================port server=============================///
//use routes when made and connect to mysql
const server = app.listen(PORT, () => {
  db.sequelize.sync().then(() => {
    console.log(`Server listening on port ${PORT}`);
  });
});
//socket
const io = require('socket.io')(server);
io.use(
  passportSocketIo.authorize({
    key: 'backend',
    secret: process.env.SECRET,
    store: newSessionStoreObject,
    cookieParser: cookieParser,
    //success: live default behaviour
    fail: (data, message, error, accept) => accept(null, true)
  })
);
module.exports = io;

//const socketManager = require('./websocket/socketManager.js');
io.sockets.on('connection', newSocketManager);
