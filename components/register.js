const user = require('../src/models/user');
const sha512 = require('crypto-js/sha512');


exports.view = function(req, res, next){
    res.render('auth/register');
}
exports.add = function (req, res, next){
    if(req.body.password === req.body.password2) {
       user.count()
            .then((count)=> {
            user.count({email: req.body.email})
                .then(doc => {
                    if (doc === 0) {
                        let nutzer = new user({
                            _id: (count + 1).toString(), //fixme it's a problem if user is deleted
                            salutation: req.body.anrede,
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
                    } else {
                        res.render('auth/register', {error: 'Nutzer existiert bereits'})
                    }
                })
                .catch(err => {
                    console.error(err)
                    res.render('auth/register', {error: 'Etwas hat nicht funktioniert, versuchen Sie es später noch einmal.'})
                })
        })
    }else{
        res.render('auth/register', {error: 'Bitte geben Sie zweimal das selbe Passwort an.'})
    }
}