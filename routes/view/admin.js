var express = require('express');
var router = express.Router();
const admin = require('../../components/view/admin')

router.get('/', admin.object);
router.get('/?search', admin.search);
router.get('/new', admin.new)
router.get('/edit/:id', admin.edit)
router.get('/user', admin.user)
router.get('/duplicate', admin.duplicate)

module.exports = router;
