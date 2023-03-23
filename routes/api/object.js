var express = require('express');
var router = express.Router();
const object = require('../../components/api/object')
/* GET users listing. */
//todo make routing better (remove all suburls use /, /?find,/:id instead)
router.get('/all', object.all);
router.get('/search', object.find);
router.get('/detail/:id', object.detail);
router.post('/lend/:id', object.lend);
router.put('/return', object.return);

module.exports = router;
