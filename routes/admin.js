var express = require('express');
var router = express.Router();
const admin = require('../components/admin')

router.get('/', admin.view);
router.get('/?search', admin.search);
router.get('/new', admin.new)
router.delete('/:id', admin.delete)
router.get("/edit/:id", admin.view_edit)
router.put('/:id', admin.edit)
router.post('/', admin.add)

module.exports = router;
