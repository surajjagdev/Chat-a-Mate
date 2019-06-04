const LocalStrategy = require('passport-local').Strategy;
const bycrpt = require('bcrypt');
const db = require('./models');
const myLocalConfiguration = passport => {
  //=================================================//
  //passport setup/////////////////////====================//
  //persistence
  //==========seralize user for session=================//
  passport.serializeUser(function(userId, done) {
    console.log('from seralized userId: ', userId);
    done(null, userId);
  });
  //============deseralize user if exists=======//
  passport.deserializeUser(function(userId, done) {
    db.User.findOne({ where: { id: userId } }).then(user => {
      if (user) {
        console.log('\n\n\n\nFound User\n\n\n\n');
        done(null, user);
      } else {
        console.log('Unable to deseralize');
      }
    });
  });
  ///==========Local login ====================//
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        //passport uses user and pass by default. set to email and pass====//
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true //pass in request from route to c if user is logged in or not
      },
      (req, email, password, done) => {
        if (email) {
          email = email.toLowerCase(); //lower case all email input
        }
        process.nextTick(() => {
          db.User.findOne({
            where: {
              'local.email': email
            }
          }).then((user, err) => {
            //if err
            if (err) {
              console.log('err, passportjs line 43');
              return done(err);
            }
            //if no user found
            if (!user) {
              return done(null, false);
            }
            if (!user.validPassword(password)) {
              return done(null, false);
            } else {
              return done(null, user);
            }
          });
        });
      }
    )
  );
  //===================local signup=======================//
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        //default passport has user and pass, overirde with email.
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req, email, password, done) => {
        //strip tags afterwards.
        const saltRounds = 10;
        const { first_name, last_name, email, password } = req.body;
        //strip html tags and remove uneccessary white spaces
        const stripTagsFunction = myString => {
          return myString.replace(/(<([^>]+)>)/gi, '');
        };
        if (email) {
          email = email.toLowerCase();
        }
        process.nextTick(() => {
          //if user not logged in
          if (!req.user) {
            db.User.findOne({ 'local.email': email }).then((user, err) => {
              if (err) {
                return done(err);
              }
              //check if user is in db
              if (user) {
                return done(null, false);
              } else {
                if (first_name && last_name && email && password) {
                }
              }
            });
          }
        });
      }
    )
  );
};
