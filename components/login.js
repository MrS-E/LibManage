const user = require('../src/models/user');
const sha512 = require('crypto-js/sha512');

exports.view = function (req, res, next) {
    res.render('auth/login');
}

exports.verify = function (req, res, next){
    let email = req.body.email;
    let password = sha512(req.body.password).toString();

    user
        .findOne({
            email: email   // search query
        })
        .then(doc => {
            console.log(doc)
            if(doc.password===password){
                req.session.loggedin = true;
                req.session.username = email;
                req.session.userid = doc._id;
                req.session.name = doc.salutation?doc.salutation:"" +" "+doc.firstName?doc.firstName:"" + " " + doc.lastName?doc.lastName:"";
                res.redirect('/home');
            }else{
                res.render('auth/login', {error: "Anmeldedaten waren inkorrekt. Bitte versuchen Sie es noch einmal."})
            }
        })
        .catch(err => {
            console.error(err)
            res.render('auth/login', {error: "Etwas ist schiefgelaufen"})
        })
}

exports.end = function (req, res, next){
    if (req.session) {
        req.session.destroy();
        res.redirect('/');
        res.end();
    }
}