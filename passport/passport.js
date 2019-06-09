const LocalStrategy = require('passport-local').Strategy;
const bycrpt = require('bcrypt');
const db = require('../models');
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
        done(null, userId);
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
        const { first_name, last_name } = req.body;
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
            db.User.findOne({
              where: { email: email }
            }).then((user, err) => {
              if (err) {
                return done(err);
              } else {
                if (
                  first_name &&
                  last_name &&
                  email &&
                  password &&
                  !user &&
                  !err
                ) {
                  bycrpt.hash(password, saltRounds, function(error, hash) {
                    if (!error) {
                      db.User.create({
                        first_name: stripTagsFunction(
                          first_name.split(' ').join('')
                        ),
                        last_name: stripTagsFunction(
                          last_name.split(' ').join('')
                        ),
                        email: stripTagsFunction(email.split(' ').join('')),
                        password: hash
                      }).then(created => {
                        if (created) {
                          let userId = created.id;
                          return done(null, userId);
                        }
                      });
                    }
                  });
                }
              }
            });
          } else if (!req.user.email) {
            //if user logged in but no local account
            db.User.findOne({
              where: {
                email: email
              }
            }).then((user, err) => {
              if (err) {
                return done(err);
              }
              if (user) {
                return done(null, false);
              } else {
                let user = req.user;
                user.local.email = email;
                bycrpt.hash(password, saltRounds, function(errors, hash) {
                  if (!errors) {
                    db.User.create({
                      first_name: 'Change Name',
                      last_name: 'Change Name',
                      email: email,
                      password: hash
                    }).then(created => {
                      if (created) {
                        let userId = created.id;
                        return done(null, userId);
                      }
                    });
                  }
                });
              }
            });
          } else {
            //user logged in

            return done(null, req.userId);
          }
        });
      }
    )
  );
  function authenticationMiddleware() {
    return (req, res, next) => {
      console.log(req.session);
      console.log(req.cookies);
      console.log('is authenticated middleware: ', req.isAuthenticated());
      if (req.isAuthenticated()) {
        return next();
      } else {
        return res.json({
          success: false,
          error: true,
          errors: {
            errors: [
              {
                message: 'Unsuccessfull login authorized. Please Log back in.'
              }
            ]
          },
          message: 'unsuccessfull login process'
        });
      }
    };
  }
  function checkAuthenticationMiddleware() {
    return (req, res, next) => {
      console.log(req.session);
      console.log(req.cookies);
      console.log(
        'is authenticated via req.isAuthenticated: ',
        req.isAuthenticated()
      );
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
        console.log('returning next. User DNE');
        return next();
      }
    };
  }
};
module.exports = myLocalConfiguration;
