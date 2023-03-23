var express = require('express');
var router = express.Router();
const user = require('../../components/api/user');

/* GET users listing. */
router.post('/add', user.add);
router.post('/verify', user.verify)
router.post('/logout', user.end_session);



module.exports = router;
