const user = require('../../src/db/models/user');
const request = require('../../src/db/models/password_request')
const sha512 = require('crypto-js/sha512');
const mail = require('../../src/mail/nodemailer/mail')

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

exports.request_password = function (req, res){
    const email = req.body.email
    user.findOne({email: email})
        .then((us)=>{
            const token = us.password + new Date().toString()
            let reset = new request({
                user_id: us._id,
                token: token
            })
            reset.save()
                .then((doc)=>{
                    mail({
                        from: "noreply@bibliothek.ch",
                        to: email,
                        subject: "Passwort Wiederherstellung",
                        text: "" +
                            "<div>" +
                            "<h1>Passwort Wiederherstellung</h1>" +
                            "<p>Wenn Sie nicht beantragt haben ihr Passwort zurückzusetzen, können Sie diese Mail ignorieren. " +
                            "Sollten Sie jedoch diesen Antrag gestellt haben, können Sie Ihr Passwort hier ändern, indem Sie diesen Link folgen.</p>" +
                            "<h3>Passwort ändern</h3>" +
                            "<form action='http://localhost:3000/api/user/request/"+token+"' method='post'>" +
                            "<label for='passwd1'>Neues Passwort</label>" +
                            "<input id='passwd1' type='passwort' name='passwd1'>" +
                            "<label for='passwd2'>Passwort wiederholen</label>" +
                            "<input id='passwd2' type='passwort' name='passwd2'>" +
                            "<button type='submit'>Ändern</button>" +
                            "</form>" +
                            "</div>"
                    })
                    res.redirect('/')
                })
                .catch((err)=>{
                    console.log(err)
                    res.redirect('/')
                })
        })
}

exports.reset_password = function (req, res){
    const token = res.params.token
    request.findOne({token: token})
        .then((doc)=>{
            if(req.body.passwd1 === req.body.passwd2) {
                user.updateOne({_id: doc.passwd1}, {$set: {password: sha512(req.body.passwd1).toString()}})
                    .then(()=>{
                        mail({
                            from: "noreply@bibliothek.ch",
                            to: doc.email,
                            subject: "Passwort wurde zurückgesetzt",
                            text: "" +
                                "<div>" +
                                "<h1>Passwort wurde geändert</h1>" +
                                "<p>Ihr Passwort wurde geändert, wenn Sie dies nicht veranlasst haben kontaktieren Sie uns.</p>" +
                                "</div>"
                        })
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
}