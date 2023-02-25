var express = require('express');
var router = express.Router();
const lend = require('../components/lend');

/* GET users listing. */
router.get('/:id', lend.view);
router.post('/:id', lend.lend);
router.put('/:id', lend.return);

module.exports = router;
