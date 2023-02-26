exports.view = function (req, res, next){
    if(req.session.loggedin) {
        res.render('sites/ich', {user: req.session.username, role: req.session.role})
    }else{
        res.redirect('/login')
    }
}

exports.settings = function (req, res, next){
    if(req.session.loggedin) {
        res.render('sites/ich', {user: req.session.username, role: req.session.role})
    }else{
        res.redirect('/login')
    }
}

exports.history = function (req, res, next){
    if(req.session.loggedin) {
        res.render('sites/ich', {user: req.session.username, role: req.session.role})
    }else{
        res.redirect('/login')
    }
}