const object = require('../../src/db/models/object')
const user = require('../../src/db/models/user')

exports.view = function (req, res){
    if(req.session.loggedin) {
        user.findOne({_id: req.session.userid})
            .then(async (doc) => {
                const books = []
                for (let d of doc.history) {
                    if(!d.end) books.push(await object.findOne({_id: d.book}))
                }
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'lend', books: books
                })
            })
    }else{
        res.redirect('/login')
    }
}

exports.settings = function (req, res){
    if(req.session.loggedin) {
        res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'settings'})
    }else{
        res.redirect('/login')
    }
}

exports.history = function (req, res){
    if(req.session.loggedin) {
        user.findOne({_id: req.session.userid})
            .then(async (doc) => {
                const books = []
                for (let d of doc.history) {
                    const obj = await object.findOne({_id: d.book})
                    if(obj) books.push(obj)
                }
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'history', books: books})
            })
    }else{
        res.redirect('/login')
    }
}