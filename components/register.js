const user = require('../src/models/user');
const sha512 = require('crypto-js/sha512');


exports.view = function(req, res, next){
    res.render('auth/register');
}
exports.add = function (req, res, next){
    if(req.body.password === req.body.password2) {
        let nutzer = new user({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            password: sha512(req.body.password).toString()
        })

        nutzer.save()
            .then(doc => {
                console.log(doc)
                res.redirect('/login');
            })
            .catch(err => {
                console.error(err)
                res.render('auth/register', {error: 'Etwas hat nicht funktioniert, versuchen Sie es später noch einmal.'})
            })
    }else{
        res.render('auth/register', {error: 'Bitte geben Sie zweimal das selbe Passwort an.'})
    }
}