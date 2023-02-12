exports.register = function(req, res, next){
    res.render('auth/register');
}
exports.registering = function (req, res, next){
    if(req.body.password !== req.body.password2){
        res.render('auth/register', {error:'Bitte geben sie zweimal das selbe Passwort ein.'})
    }
    //TODO add to mongoose -> mongodb
}