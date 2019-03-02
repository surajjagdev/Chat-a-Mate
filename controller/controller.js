const db = require('../models');
module.exports = {
  findEverything: (req, res) => {
    db.User.findAll({})
      .then(dbFindAll => {
        if (!dbFindAll) {
          return res.json('Nothing Found');
        }
        return res.json(dbFindAll);
      })
      .catch(error => {
        if (error) {
          res.json(error);
        }
      });
  },
  newUser: (req, res) => {
    let [{ firstName, lastName, email, password }] = req.body;
    db.create({
      first_Name: firstName,
      last_Name: lastName,
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
