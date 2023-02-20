var express = require('express');
var router = express.Router();
const register = require('../components/register');
const login = require('../components/login');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with data about the user');
});
router.post('/add', register.add);
router.post('/verify', login.verify)


module.exports = router;
