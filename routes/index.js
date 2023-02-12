var express = require('express');
var router = express.Router();
const login = require('../components/login');
const home = require('../components/home');
const register = require('../components/register');

/* GET home page. */
router.get('/', function(req, res, next){
    if(!req.session.loggedin) {
        res.redirect('/login');
    }else{
        res.redirect('/home');

    }
});
router.get('/home', home.index)
router.get('/login', login.login)
router.post('/login', login.login_verify)
router.get('/register', register.register)
router.post('/register', register.registering)
module.exports = router;
