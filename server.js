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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
app.use(cookieParser());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    /*,
    cookie: { secure: true }*/
  })
);
app.use(routes);

//use routes when made and connect to mysql
db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
