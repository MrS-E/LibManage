var express = require('express');
var router = express.Router();
const admin = require('../../components/view/admin')

router.get('/', admin.view);
router.get('/?search', admin.search);
router.get('/new', admin.new)
router.get('/edit/:id', admin.edit)
router.get('/user') //todo user manage page for admin

module.exports = router;
