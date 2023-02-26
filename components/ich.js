const object = require('../src/models/object')
const returner = require('../src/models/returns')

exports.view = function (req, res, next){
    if(req.session.loggedin) {
        object.find()
            .then((doc) => {
            res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'lend', books: doc})
        })
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

exports.return = function (req, res, next){
    if(req.session.userid) {
        let _return = new returner({
            user_id: req.session.userid,
            book_id: req.body.id
        })
        _return.save()
            .then(doc => {
                res.redirect('/ich')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/ich')
            })
    }
}