var express = require('express');
var router = express.Router();
const object = require('../components/object')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with data about objects');
});
router.get('/all', object.all);
router.get('/search', object.find);

module.exports = router;
