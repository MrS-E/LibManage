const object = require('../src/db/models/object')
const returner = require('../src/db/models/returns')
const user = require('../src/db/models/user')

exports.view = function (req, res, next){
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

exports.settings = function (req, res, next){
    if(req.session.loggedin) {
        res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'settings'})
    }else{
        res.redirect('/login')
    }
}

exports.history = function (req, res, next){
    if(req.session.loggedin) {
        user.findOne({_id: req.session.userid})
            .then(async (doc) => {
                const books = []
                for (let d of doc.history) {
                    books.push(await object.findOne({_id: d.book}))
                }
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'history', books: books})
            })
    }else{
        res.redirect('/login')
    }
}

exports.return = function (req, res, next){
    if(req.session.userid) {
        //console.log('return')
        object.findOne({_id: req.body.id })
            .then((doc)=>{
                if(doc.typ !== ('E-Book' || 'E-Audio' || 'E-Video' || 'E-Paper')){
                    let _return = new returner({
                        user_id: req.session.userid,
                        book_id: req.body.id
                    })
                    _return.save()
                        .then(() => {
                            res.send('return ticket submitted')
                        })
                        .catch(err => {
                            console.log(err)
                            res.send('return ticket submit did not go well')
                        })
                }else{
                    //console.log("e-medium")
                    user.updateOne({_id: req.session.userid, "history.book": req.body.id}, {$set:{"history.$.end": new Date().toISOString().split('T')[0]}})
                        .then(()=>res.send('e-medium returned'))
                        .catch(err=> {
                            console.log(err)
                            res.send('return did not go well')
                        })
                    object.updateOne({_id: req.body.id, "history.user":req.session.userid}, {$set:{"history.$.end": new Date().toISOString().split('T')[0]}})
                }
            })
    }
}

exports.read = function (req, res, next){
    //todo read function (check if user has rented the book + read base64 from mongodb)
}