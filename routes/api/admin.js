var express = require('express');
var router = express.Router();
const admin = require('../../components/api/admin')

router.delete('/:id', admin.delete)
router.put('/:id', admin.edit)
router.post('/', admin.add)

module.exports = router;