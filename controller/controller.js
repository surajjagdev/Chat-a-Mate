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
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    const stripTagsFunction = myString => {
      return myString.replace(/(<([^>]+)>)/gi, '');
    };
    //strip html tags and remove uneccessary white spaces
    db.User.create({
      first_name: stripTagsFunction(first_name.split(' ').join('')),
      last_name: stripTagsFunction(last_name.split(' ').join('')),
      email: stripTagsFunction(email.split(' ').join('')),
      password: stripTagsFunction(password)
    })
      .then(created => {
        if (!created) {
          return res.json('An error has occured. User has not been saved');
        }
        return res.json(created);
      })
      .catch(error => {
        if (error) {
          return res.json(error);
        }
      });
  }
};
