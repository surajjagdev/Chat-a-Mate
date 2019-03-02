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
  }
};
