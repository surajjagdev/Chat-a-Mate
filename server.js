if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./models');
const routes = require('./routes/routes');
//Authethication packages
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
//static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
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
const sessionOptions = {
  key: 'user_sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
    secure: process.env.NODE_ENV === 'production' ? true : false
  }
};
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cookieparse
app.use(cookieParser(process.env.SECRET));
//express session
app.use(session(sessionOptions));
//passport
app.use(passport.initialize());
app.use(passport.session());
//use routes
app.use(routes);
//use routes when made and connect to mysql
db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
