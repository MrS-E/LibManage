var express = require('express');
var router = express.Router();
const object = require('../../components/api/object')
const storage = require('../../src/db/gridfs')
const upload = require('multer')({storage})

/* GET users listing. */
//router.get('/detail/:id', object.detail);
router.post('/lend/:id', object.lend)
router.put('/return', object.return)
router.get('/read/:id', object.read)
router.get('/stream/:id', object.stream)
router.post('/return/:id', object.return_confirmation)

router.get('/', object.all);
router.get('/:id', object.get)
router.delete('/:id', object.delete)
router.put('/:id', object.edit)
router.post('/', upload.single('read'), object.add);

module.exports = router;
