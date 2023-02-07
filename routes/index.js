var express = require('express');
var router = express.Router();
let login = require('../components/login');

/* GET home page. */
router.get('/', login.login);

module.exports = router;
