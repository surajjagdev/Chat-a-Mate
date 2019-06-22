//========================if production=====================================//
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
//===========================require in modules============================================//
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./models');
const routes = require('./controller/controller');
//Authethication packages
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
//==============Production======================================///
//serve up static assets production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
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
const sessionOptions = {
  name: 'backend',
  secret: /*process.env.SECRET*/ 'foo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: cookieExpirationDate, //1 month,
    secureProxy: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: process.env.NODE_ENV === 'production' ? true : false
  },
  store: new SequelizeStore({
    db: db,
    table: 'Session',
    checkExpirationInterval: 20 * 23 * 60 * 1000,
    expiration: 30 * 24 * 60 * 60 * 1000, //1 month
    extendedDefaultFields: extendedDefaultFields
  })
};
//configuration==============================================//
//cookieparse
app.use(cookieParser('foo'));
//static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
//middleware to extract requests and exposing to req, without manually searching for them.
//extented keyword allow you to have nested objects sent
//dont need bodyparser package. Express has it included now after version 4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//express session. Options in object defined from line 29.
app.use(session(sessionOptions));
//passport
app.use(passport.initialize());
app.use(passport.session());
//==========local passport login===========================//
//=========================routes===========================//
require('./passport/passport')(passport);
app.use(routes);
//================port server=============================///
//use routes when made and connect to mysql
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
