const objects = require("../../src/db/models/object");
const user = require('../../src/db/models/user')
const object = require("../../src/db/models/object");
const returner = require("../../src/db/models/returns");
const files = require("../../src/db/models/files")

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

exports.return = function (req, res) {
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

exports.add = function (req, res){
    if(req.session.loggedin && req.session.role==='admin'){
        //objects.count()
        const keywords = []
        for(let d of req.body.keywords.split(', ')){
            if(d && d !== ""){
                keywords.push(d)
            }
        }

        objects.findOne().sort({_id: -1})
            .then((count)=> {
                console.log(count?count._id:0)
                let object = new objects({
                    _id: (parseInt(count?count._id:0)+1),
                    title: req.body.title,
                    author: req.body.author,
                    publisher: req.body.publisher,
                    isbn: req.body.isbn,
                    keywords: keywords,
                    typ: req.body.type,
                    year: req.body.year,
                    blurb: req.body.blurb,
                    small_desc: req.body.small_desc,
                    img: req.body.img_base64, //todo convert to webp for better storage usage
                    img_desc: req.body.img_desc,
                    history: [],
                    read: !!req.body.read_base64,
                    position: req.body.position?req.body.position:null
                })
                if(req.body.read_base64){
                    console.log(object._id)
                    let file = new files({
                        book_id: object._id,
                        file: req.body.read_base64
                    })
                    file.save()
                        .then(doc => {
                            console.log(doc)
                        })
                        .catch(err => {
                            console.error(err)
                        })
                }
                object.save()
                    .then(doc => {
                        console.log(doc)
                        res.redirect('/admin')
                    })
                    .catch(err => {
                        console.error(err)
                        res.redirect('/admin')
                    })
            })
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }
}

exports.delete = async function (req, res){
    if(req.session.loggedin && req.session.role==='admin') {
        res.send(await objects.deleteOne({_id: req.params.id}))
    }
    else{
        res.sendStatus(401).send({error: "You are not an admin", deletedCount: 0})
    }
}

exports.edit = function (req, res) {
    if (req.session.loggedin && req.session.role === 'admin') {
        console.log(req.params.id)
        console.log(req.body)
        objects.updateOne({_id:req.params.id}, {$set: req.body})
            .then((doc)=>{
                res.send(doc)
            })
    } else if (req.session.loggedin) {
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }
}
