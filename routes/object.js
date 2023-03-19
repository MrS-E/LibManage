var express = require('express');
var router = express.Router();
const object = require('../components/object')
const ich = require('../components/ich')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with data about objects');
});
//todo make routing better (remove all suburls use /, /?find,/:id instead)
router.get('/all', object.all);
router.get('/search', object.find);
router.get('/detail/:id', object.detail);
router.post('/return', ich.return);

module.exports = router;
