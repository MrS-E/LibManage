exports.login = function (req, res, next) {
    res.render('auth/login');
}

exports.verify = function (req, res, next){
    console.log("here");
    let email = req.body.email;
    let password = req.body.password;
    //todo check if user is in db
    if(email && password){
        req.session.loggedin = true;
        req.session.username = email;
        res.redirect('/home');
    }else{
        res.send({error:'Please enter Username and Password!'});
        res.end();
    }
}

exports.end = function (req, res, next){
    if (req.session) {
        req.session.destroy();
        res.redirect('/');
    }
}