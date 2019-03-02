const express = require('express');
const router = express.Router();
const Users = require('../controller/controller');
//routes
router.get('/api/users', Users.findEverything);
router.post('/api/newuser', Users.newUser);
//export router
module.exports = router;
