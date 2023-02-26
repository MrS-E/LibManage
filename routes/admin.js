var express = require('express');
var router = express.Router();
const admin = require('../components/admin')

/* GET users listing. */
router.get('/', admin.view);
router.get('/?search', admin.search);
router.get('/new')
router.delete('/:id')
router.put('/:id')
router.post('/')

module.exports = router;
