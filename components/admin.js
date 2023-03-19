const objects = require("../src/db/models/object");
const files = require("../src/db/models/files")

exports.view = function(req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        objects.find()
            .then((doc)=> {
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'object', books:doc})
            })
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.search = function (req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        const term = req.query.search;
        objects.find({$or: [{title: term}, {author: term}, {publisher: term}, {isbn: term}, {keywords: term}, {blurb: term}]})
            .then((doc)=> {
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'object', books:doc})
            })
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.new = function (req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'new'})
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.add = function (req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        //objects.count()
        objects.findOne().sort({_id: -1})
            .then((count)=> {
                console.log(count?count._id:0)
                let object = new objects({
                    _id: (parseInt(count?count._id:0)+1),
                    title: req.body.title,
                    author: req.body.author,
                    publisher: req.body.publisher,
                    isbn: req.body.isbn,
                    keywords: req.body.keywords.split(', '),
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

exports.delete = async function (req, res, next){
    if(req.session.loggedin && req.session.role==='admin') {
        res.send(await objects.deleteOne({_id: req.params.id}))
    }
    else{
        res.sendStatus(401).send({error: "You are not an admin", deletedCount: 0})
    }
}

exports.view_edit = function(req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        objects.findOne({_id: req.params.id})
            .then((doc)=>{
                let file = {
                    _id:doc._id,
                    title:doc.title,
                    author:doc.author,
                    publisher:doc.publisher,
                    keywords:"",
                    year:"",
                    typ: doc.typ,
                    blurb:doc.blurb,
                    page:doc.page,
                    position:doc.position
                }
                for(let d=0; d < doc.keywords.length; d++){
                    file.keywords += doc.keywords[d]
                    if(d+1 !== doc.keywords.length){
                        file.keywords += ", "
                    }
                }
                file.year = doc.year.toString().split(' ')[3]
                console.log(file)
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'edit', book:file})
            })
    } else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    } else{
        res.redirect('/login')
    }
}

exports.edit = function (req, res,next) {
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