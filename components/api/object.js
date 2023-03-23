const objects = require("../../src/db/models/object");
const user = require('../../src/db/models/user')
const object = require("../../src/db/models/object");
const returner = require("../../src/db/models/returns");

exports.all = function (req, res){
    objects.find()
        .then((doc)=>{
            res.send(doc)
        })
}

exports.find = function (req, res){
    const term = {$regex: req.query.find, $options: "i"}
    objects.find({$or: [{title: term}, {author: term}, {publisher: term}, {isbn: term}, {keywords: term}, {blurb: term}]})
        .then((doc)=>{
            res.send(doc)
        })
}

exports.detail = function (req, res){
    const term = req.params.id;
    objects.find({_id: term})
        .then((doc)=>{
            res.send(doc)
        })
}

exports.lend = async function (req, res){
    console.log(req.session.userid, ' ', req.params.id)
    const d = new Date().toISOString().split('T')[0]
    await user.updateOne({_id: req.session.userid}, {$push: {history: {book: req.params.id, start: d, end: null}}})
        .catch(err=>{
            console.error(err)
            res.redirect('/liste')
        })
    await object.updateOne({_id: req.params.id}, {$push: {history: {user: req.session.userid, start: d, end: null}}})
        .catch(err=>{
            console.error(err)
            res.redirect('/liste')
        })
    res.redirect("/home")
}

exports.return = function (req, res){
    if(req.session.userid) {
        console.log('return')
        object.findOne({_id: req.body.id })
            .then( (doc) => {
                if (doc.typ.split('-')[0] !== 'E') {
                    console.log('book')
                    let _return = new returner({
                        user_id: req.session.userid,
                        book_id: req.body.id
                    })
                    _return.save()
                        .then(() => {
                            user.updateOne({_id: req.session.userid, "history.book": req.body.id, "history.end": null}, {$set: {"history.$.end": new Date().toISOString()}})
                                .then(doc=>console.log(doc))
                            res.send('return ticket submitted')
                        })
                        .catch(err => {
                            console.log(err)
                            res.send('return ticket submit did not go well')
                        })
                } else {
                    console.log("e-medium")
                    user.updateOne({_id: req.session.userid, "history.book": req.body.id, "history.end": null}, {$set: {"history.$.end": new Date().toISOString()}})
                        .then(()=>{
                            object.updateOne({_id: req.body.id, "history.user": req.session.userid, "history.end": null}, {$set: {"history.$.end": new Date().toISOString()}}) //fixme Why doesn't this work when the same command works fine on the user?
                                .then((doc) => {
                                    console.log(doc)
                                    res.send('e-medium returned')
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.send('return did not go well')
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.send('return did not go well')
                        })
                }
            })
    }
}