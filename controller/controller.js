const db = require('../models');
module.exports = {
  findEverything: (req, res) => {
    db.User.findAll({})
      .then(dbFindAll => {
        return res.json(dbFindAll);
      })
      .catch(error => {
        if (error) {
          res.json(error);
        }
      });
  },
  newUser: (req, res, next) => {
    //strip tags afterwards.
    const { first_name, last_name, email, password } = req.body;
    //strip html tags and remove uneccessary white spaces
    const stripTagsFunction = myString => {
      return myString.replace(/(<([^>]+)>)/gi, '');
    };
    if (first_name && last_name && email && password) {
      db.User.create({
        first_name: stripTagsFunction(first_name.split(' ').join('')),
        last_name: stripTagsFunction(last_name.split(' ').join('')),
        email: stripTagsFunction(email.split(' ').join('')),
        password: stripTagsFunction(password)
      })
        .then(created => {
          if (!created) {
            return res.status(400).json({
              success: false,
              message: 'An error has occured. User has not been saved'
            });
          }
          return res.json({
            success: true,
            data: created,
            message: 'User successfully created'
          });
        })
        .catch(error => {
          if (error) {
            return res.json(error);
          }
        });
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Error Missing Parameters' });
    }
  }
};
