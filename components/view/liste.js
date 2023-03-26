const objects = require('../../src/db/models/object')

exports.view = function (req, res) {
    if (req.session.loggedin) {
            res.render('sites/liste', {user: req.session.username, book_list: {}})
    }else{
        res.redirect('/login')
    }
}

exports.object = function (req, res){
    if (req.session.loggedin) {
        objects.findOne({_id: req.params.id})
            .then((doc)=>{
                res.render('sites/object', {user: req.session.username, book: doc})
            })
    }else{
        res.redirect('/login')
    }
}

exports.lend = function(req, res){
    if(req.session.loggedin) {
        objects.findOne({_id: req.params.id})
            .then((doc)=>{
                if(doc.typ.split('-')[0] === 'E'){
                    let rentable = true
                    for(let d of doc.history) {
                        console.log(d)
                        console.log(req.session.userid)
                        if(d.user == req.session.userid && d.end===null){
                            rentable = false
                            break
                        }
                    }
                    res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: rentable})
                }else{
                    if(doc.history.length === 0 || doc.history[doc.history.length-1].end){
                        res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: true})
                    }else{
                        res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: false})
                    }
                }
            })
            .catch((err)=>{
                console.log(err)
                res.sendStatus(500).redirect('/liste/'+req.params.id)
            })
    }
    else{
        res.redirect('/login')
    }
}