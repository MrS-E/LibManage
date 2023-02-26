var express = require('express');
const ich = require("../components/ich");
var router = express.Router();

/*GET ich page*/
router.get('/', ich.view);
router.get('/settings', ich.settings);
router.get('/history', ich.history);

module.exports = router;
