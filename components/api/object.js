const objects = require("../../src/db/models/object")
const user = require('../../src/db/models/user')
const object = require("../../src/db/models/object")
const returner = require("../../src/db/models/returns")
const gfs = require("../../src/db/buckets/gfs")

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
    const d = new Date().toISOString()
    await user.updateOne({_id: req.session.userid}, {$push: {history: {book: req.params.id, start: d, end: null}}})
        .catch(err=>{
            console.error(err)
            res.sendStatus(500).redirect('/liste')
        })
    await object.updateOne({_id: req.params.id}, {$push: {history: {user: req.session.userid, start: d, end: null}}})
        .catch(err=>{
            console.error(err)
            res.sendStatus(500).redirect('/liste')
        })
    res.redirect("/liste")
}

exports.return = function (req, res) {
    if(req.session.loggedin) {
        console.log('return')
        const book_id = parseInt(req.body.id)
        const user_id = parseInt(req.session.userid)
        object.findOne({_id: book_id })
            .then( (doc) => {
                if (doc.typ.split('-')[0] !== 'E') {
                    console.log('book')
                    let _return = new returner({
                        user_id: user_id,
                        book_id: book_id,
                        returned: new Date().toISOString()
                    })
                    _return.save()
                        .then(() => {
                            user.updateOne({_id: user_id, history: {$elemMatch:{$and:[{book: book_id}, {end: null}]}}}, {$set: {"history.$.end": new Date().toISOString()}})
                                .then(doc=>console.log(doc))
                            res.send('return ticket submitted')
                        })
                        .catch(err => {
                            console.log(err)
                            res.sendStatus(500).send('return ticket submit did not go well')
                        })
                }
                else {
                    console.log("e-medium")
                    user.updateOne({_id: user_id, history: {$elemMatch:{$and:[{book: book_id}, {end: null}]}}}, {$set: {"history.$.end": new Date().toISOString()}})
                        .then(()=>{
                            object.updateOne({_id:book_id, history:{$elemMatch:{$and:[{user: user_id},{end: null}]}}},{$set: {"history.$.end": new Date().toISOString()}})
                                .then((doc) => {
                                    console.log(doc)
                                    res.send('e-medium returned')
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.sendStatus(500).send('return did not go well')
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.sendStatus(500).send('return did not go well')
                        })
                }
            })
            .catch(err=>{
                console.log(err)
                res.sendStatus(500).send('return ticket submit did not go well')
            })
    }else{
        res.redirect('/')
    }
}

exports.add = function (req, res){
    if(req.session.loggedin && req.session.role==='admin'){
        const keywords = []
        for(let d of req.body.keywords.split(', ')){
            if(d && d !== ""){
                keywords.push(d)
            }
        }
        objects.findOne().sort({_id: -1})
            .then(async (count) => {
                if((req.body.img_base64).split(':')[0]==="data") {
                    req.body.img_base64 ='data:image/webp;base64,' + (await require('sharp')(Buffer.from(req.body.img_base64.split(';base64,')[1], 'base64')).resize(128, 195).webp().toBuffer().catch(err => console.log(err))).toString('base64')
                }
                console.log(count ? count._id : 0)
                let object = new objects({
                    _id: (parseInt(count ? count._id : 0) + 1),
                    title: req.body.title,
                    author: req.body.author,
                    publisher: req.body.publisher,
                    isbn: req.body.isbn,
                    keywords: keywords,
                    typ: req.body.type,
                    year: req.body.year,
                    blurb: req.body.blurb,
                    small_desc: req.body.small_desc,
                    img: req.body.img_base64,
                    img_desc: req.body.img_desc,
                    history: [],
                    read: !!req.body.read_base64,
                    position: req.body.position ? req.body.position : null,
                    file: req.file?req.file.originalname:null
                })
                object.save()
                    .then(doc => {
                        console.log(doc)
                        res.redirect('/admin')
                    })
                    .catch(err => {
                        console.error(err)
                        res.sendStatus(500).redirect('/admin')
                    })
            })
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }
}

exports.delete = function (req, res){
    if(req.session.loggedin && req.session.role==='admin') {
        object.findOne({_id: req.params.id}).then(doc => {
            objects.deleteOne({_id: req.params.id})
                .then(del=>{
                    console.log(del)
                    if(doc.file) gfs.delete(doc.file)
                    res.send(del)
                })
                .catch(err=>{console.log(err);res.sendStatus(500).send({error: "Internal Server Error", deletedCount: 0})})
        })
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

exports.read = function (req, res){
    if(req.session.loggedin) {
        console.log(req.session.userid)
        const book = req.params.id
        user.findOne({_id: req.session.userid})
            .then((doc) => {
                for (let d of doc.history) {
                    console.log(d)
                    if (!d.end && d.book == book) {
                        object.findOne({_id:book})
                            .then((obj)=> {
                                if(obj.file) {
                                    gfs.search({filename: obj.file}).then(doc => {
                                        console.log(doc)
                                        if(doc || doc.length !== 0){
                                            gfs.get(obj.file).then(file=>{
                                                //console.log(file)
                                                res.send({book: doc, file: file})
                                            })
                                        }
                                    })
                                }else{
                                    res.send({file:null, error:"object has no file"})
                                }
                            })
                            .catch((err)=>{console.log(err);res.send({file:null, error: "Internal Server Error"})})
                        break;
                    }
                }
            })
    } else {
        res.sendStatus(401)
    }
}

exports.stream = function (req, res){ //more or less same as read except with other return value
    if(req.session.loggedin) {
        console.log(req.session.userid)
        const book = req.params.id
        user.findOne({_id: req.session.userid})
            .then((doc) => {
                for (let d of doc.history) {
                    console.log(d)
                    if (!d.end && d.book == book) {
                        object.findOne({_id:book})
                            .then((obj)=> {
                                if(obj.file) {
                                    gfs.search({filename: obj.file}).then(doc => {
                                        console.log(doc)
                                        if(doc || doc.length !== 0){
                                            gfs.stream(obj.file).pipe(res)
                                        }
                                    })
                                }else{
                                    res.send({file:null, error:"object has no file"})
                                }
                            })
                            .catch((err)=>{console.log(err);res.send({file:null, error: "Internal Server Error"})})
                        break;
                    }
                }
            })
    } else {
        res.sendStatus(401)
    }
}

exports.return_confirmation = function (req, res){
    if(req.session.loggedin && (req.session.role==='admin' || req.session.role==='worker')) {
        const book = req.params.id
        returner.deleteOne({book_id: book}).then(doc => console.log(doc))
        object.updateOne({_id: book, history: {$elemMatch: {end: null}}}, {$set: {"history.$.end": new Date().toISOString(), position: req.body.place}}).then(doc => console.log(doc))
        res.redirect("/ich/returns")
    }else{
        res.sendStatus(401).send('Sie sind kein Mitarbeiter/Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }
}
