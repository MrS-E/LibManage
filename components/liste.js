exports.view = function (req, res, next) {
    if (req.session.loggedin) {
        res.render('liste')
    }else{
        res.redirect('/login')
    }
}