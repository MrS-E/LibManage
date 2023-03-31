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
                                    res.redirect('/register?error=Etwas hat nicht funktioniert, versuchen Sie es später noch einmal.')
                                })
                        } else {
                            res.redirect('/register?error=Nutzer existiert bereits')
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        res.redirect('/register?error=Etwas hat nicht funktioniert, versuchen Sie es später noch einmal.')
                    })
            })
    }else{
        res.redirect('/register?error=Bitte geben Sie zweimal das selbe Passwort an.')
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
                res.redirect('/login?error=Anmeldedaten waren inkorrekt. Bitte versuchen Sie es noch einmal.')
            }
        })
        .catch(err => {
            console.error(err)
            res.redirect('/login?error=Etwas ist schiefgelaufen');
        })
}

exports.unverify = function (req, res){
    if (req.session) {
        req.session.destroy();
        res.redirect('/');
        res.end();
    }
}

exports.delete = function (req,res){}

exports.update = function(req, res){
    if(req.session.loggedin){
        user.updateOne({_id: req.session.userid}, {$set:{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: sha512(req.body.passwd).toString()
            }})
            .then((doc)=>{
            res.redirect('/api/user/logout')
            })
    }else{
        res.redirect('/')
    }
}