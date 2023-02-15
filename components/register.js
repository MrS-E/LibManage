const user = require('../src/models/user');

exports.register = function(req, res, next){
    res.render('auth/register');
}
exports.registering = async function (req, res, next){
    if(req.body.password === req.body.password) {
        let nutzer = new user({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        })

        nutzer.save()
            .then(doc => {
                console.log(doc)
            })
            .catch(err => {
                console.error(err)
            })

        res.redirect('auth/login');
    }else{
        res.render('auth/register', {error: 'Bitte geben Sie zweimal das selbe Passwort an.'})
    }
}