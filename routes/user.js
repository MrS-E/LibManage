var express = require('express');
var router = express.Router();
const register = require('../components/register');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/add', register.add)

module.exports = router;
