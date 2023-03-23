var express = require('express');
var router = express.Router();
const ich = require("../../components/view/ich");

/*GET ich page*/
router.get('/', ich.view);
router.get('/settings', ich.settings);
router.get('/history', ich.history);
router.get('/returns') //todo

module.exports = router;