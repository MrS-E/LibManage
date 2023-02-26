exports.view = function (req, res, next){
    if(req.session.loggedin) {
        res.render('sites/ich', {user: req.session.username, active: 'lend'})
    }else{
        res.redirect('/login')
    }
}