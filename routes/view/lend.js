var express = require('express');
var router = express.Router();
const lend = require('../../components/view/liste');

/* GET users listing. */
router.get('/:id', lend.lend);

module.exports = router;
