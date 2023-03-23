const objects = require('../../src/db/models/object')

exports.view = function (req, res) {
    if (req.session.loggedin) {
        objects.find()
            .then((doc)=>{
                doc = doc.reduce((r, e, i) => (i % 4 ? r[r.length - 1].push(e) : r.push([e])) && r, []); // from https://stackoverflow.com/questions/38048497/group-array-values-in-group-of-3-objects-in-each-array-using-underscore-js
                console.log(doc)
                res.render('sites/liste', {user: req.session.username, book_list: doc})
            })
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
    if(req.session.loggedin) { //TODO check is already rented by you
        objects.findOne({_id: req.params.id})
            .then((doc)=>{
                if(doc.typ.split('-')[0] === 'E'){
                    res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: true})
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