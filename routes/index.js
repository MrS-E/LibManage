var express = require('express');
var router = express.Router();
const login = require('../components/login');
const home = require('../components/home');
const register = require('../components/register');
const liste = require('../components/liste');
const ich = require('../components/ich');
const admin = require('../components/admin')

/* GET home page. */
router.get('/', function(req, res, next){
    if(!req.session.loggedin) {
        res.redirect('/login');
    }else{
        res.redirect('/home');
    }
});
router.get('/home', home.view);
router.get('/login', login.view);
router.post('/logout', login.end);
router.get('/register', register.view);

/*GET liste page*/
router.get('/liste', liste.view);
router.get('/liste/:id', liste.object);

/*GET ich page*/
router.get('/ich', ich.view);
router.get('/ich/settings', ich.settings);
router.get('/ich/history', ich.history);

/*GET worker pages*/
router.get('/returns')

module.exports = router;
