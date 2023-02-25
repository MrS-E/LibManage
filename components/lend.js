exports.view = function(req, res, next){
    if(req.session.loggedin) {
        res.render('sites/lend', {user: req.session.username, active: 'liste'})
    }
    else{
        res.redirect('/login')
    }
}
exports.lend = function (req, res, next){

}
exports.return = function (req, res, next){

}