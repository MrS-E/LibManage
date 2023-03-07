var express = require('express');
var router = express.Router();
const admin = require('../components/admin')

router.get('/', admin.view);
router.get('/?search', admin.search);
router.get('/new', admin.new)
router.delete('/:id')
router.put('/:id')
router.post('/', admin.add)

module.exports = router;
