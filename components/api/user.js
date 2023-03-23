const user = require('../../src/db/models/user');
const sha512 = require('crypto-js/sha512');

exports.add = function (req, res){
    if(req.body.password === req.body.password2) {
        user.findOne().sort({_id: -1})
            .then((count)=> {
                user.count({email: req.body.email})
                    .then(doc => {
                        if (doc === 0) {
                            let nutzer = new user({
                                _id: ((count?count._id:0) + 1).toString(),
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
                                    res.sendStatus(500).redirect('/register?error="Etwas hat nicht funktioniert, versuchen Sie es später noch einmal."')
                                })
                        } else {
                            res.sendStatus(403).redirect('/register?error="Nutzer existiert bereits"')
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        res.sendStatus(500).redirect('/register?error="Etwas hat nicht funktioniert, versuchen Sie es später noch einmal."')
                    })
            })
    }else{
        res.sendStatus(400).redirect('/register?error="Bitte geben Sie zweimal das selbe Passwort an."')
    }
}

exports.verify = function (req, res){
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
                req.session.role = doc.role;
                res.redirect('/home');
            }else{
                res.sendStatus(401).redirect('/home?error="Anmeldedaten waren inkorrekt. Bitte versuchen Sie es noch einmal."')
            }
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500).redirect('/home?error="Etwas ist schiefgelaufen"');
        })
}

exports.end_session = function (req, res){
    if (req.session) {
        req.session.destroy();
        res.redirect('/');
        res.end();
    }
}