if (process.env.NODE_ENV !== 'production') require('dotenv').config();
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
const sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
//serve up static assets production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  /*app.get('*', (req, res) => {
    res.sendFile(path.join((__dirname = './client/build/index.html')));*/
  /*const index = path.join(__dirname, 'build', 'index.html');
    res.sendFile(index);*/
  //});
}
//build mode local
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});*/
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
  key: 'userId',
  secret: /*process.env.SECRET*/ 'foo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: cookieExpirationDate, //1 month
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
//cookieparse
const secret = 'foo';
app.use(cookieParser(secret));
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

app.use(passport.session(sessionOptions));
app.use(routes);
//use routes when made and connect to mysql
db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
