var express = require('express');
var router = express.Router();
const index = require('../../components/view/index');

/* GET home page. */
router.get('/', function(req, res){
    if(!req.session.loggedin) {
        res.redirect('/login');
    }else{
        res.redirect('/home');
    }
});
router.get('/home', index.home);
router.get('/login', index.login);
router.get('/register', index.register);
router.get('/forgotten', index.forgotten)

module.exports = router;
