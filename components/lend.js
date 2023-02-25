exports.view = function(req, res, next){
    if(req.session.loggedin) {
        res.render('sites/lend', {user: req.session.username, active: 'liste'})
    }
    else{
        res.redirect('/login')
    }
}