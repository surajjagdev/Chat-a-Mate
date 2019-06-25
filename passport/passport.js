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
        usernameField: 'userName',
        passwordField: 'userPassword',
        passReqToCallback: true //pass in request from route to c if user is logged in or not
      },
      (req, email, password, done) => {
        if (email) {
          email = email.toLowerCase(); //lower case all email input
        }
        process.nextTick(() => {
          db.User.findOne({
            where: {
              email: email
            }
          }).then((user, err) => {
            //if err
            if (err) {
              console.log('err, passportjs line 43');
              return done(err);
            }
            //if no user found
            if (!user || user.length === 0 || user == null) {
              return done(null, false);
            }
            const hash = user.password_hash.toString();
            console.log(user.id);
            bycrpt.compare(password, hash, function(err, response) {
              if (err) {
                return done(null, false);
              }
              if (response === true && typeof user.id !== 'undefined') {
                const userIdentifaction = user.id;
                return done(null, userIdentifaction);
              } else {
                return done(null, false);
              }
            });
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
};

module.exports = myLocalConfiguration;
