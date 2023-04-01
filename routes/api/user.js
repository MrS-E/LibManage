var express = require('express');
var router = express.Router();
const user = require('../../components/api/user');

/* GET users listing. */
router.post('/add', user.add)
router.post('/verify', user.verify)
router.post('/logout', user.unverify)
router.post('/update', user.update)
router.post('/request', user.request_password)
router.post('/request/:token', user.reset_password)


module.exports = router;
