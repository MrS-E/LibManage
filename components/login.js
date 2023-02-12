exports.login = function (req, res, next) {
    res.render('auth/login');
}

exports.login_verify = function (req, res, next){
    console.log("here");
    let email = req.body.email;
    let password = req.body.password;
    if(email && password){
        req.session.loggedin = true;
        req.session.username = email;
        res.redirect('/home');
    }else{
        res.send({error:'Please enter Username and Password!'});
        res.end();
    }
}