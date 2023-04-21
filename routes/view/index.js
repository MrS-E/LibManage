var express = require('express');
var router = express.Router();
const index = require('../../components/view/index');

/* GET home page. */
router.get('/', function(req, res){
    if(!req.session.loggedin) {
        index.login(req, res)
        //res.redirect('/login');
    }else{
        index.home(req, res)
        //res.redirect('/home');
    }
});
router.get('/register', index.register);
router.get('/forgotten', index.forgotten)

module.exports = router;
