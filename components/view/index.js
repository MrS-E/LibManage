const object = require('../../src/db/models/object');

exports.register = function(req, res){
    if(req.query.error){
        res.render('auth/register', {error: req.query.error});
    }
    res.render('auth/register');
}

exports.login = function (req, res) {
    if(req.query.error){
        res.render('auth/login', {error: req.query.error});
    }
    res.render('auth/login');
}

exports.home = function (req, res){
    if(req.session.loggedin) {

        object.count() //TODO select books with keywords that the user read in the history and don't show the user books he already knows
            .then((count)=>{
                const skip = Math.floor(Math.random() * (count-4));
                object.find().limit(4).skip(skip<0?0:skip)
                    .then((doc)=>{
                        console.log(doc);
                        res.render('sites/index', {user: req.session.username, name:req.session.name, books: doc})
                    })
            })
    }else{
        res.redirect('/login')
    }
}