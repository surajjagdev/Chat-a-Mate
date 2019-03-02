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
  newUser: (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    db.User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
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
