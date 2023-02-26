var express = require('express');
var router = express.Router();
const liste = require("../components/liste");

router.get('/', liste.view);
router.get('/:id', liste.object);

module.exports = router;
