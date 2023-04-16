const objects = require("../../src/db/models/object")
const returns = require("../../src/db/models/returns")
const users = require("../../src/db/models/user")

exports.object = function(req, res){
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

exports.search = function (req, res){
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

exports.new = function (req, res){
    if(req.session.loggedin && req.session.role==='admin'){
        res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'new'})
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.edit = function(req, res){
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
                file.year = doc.year?doc.year.toString().split(' ')[3]:""
                console.log(file)
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'edit', book:file})
            })
    } else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    } else{
        res.redirect('/login')
    }
}

exports.returns = function (req, res){
    if(req.session.loggedin && (req.session.role==='admin' || req.session.role==='worker')){
        returns.find()
            .then(async (doc)=> {
                const books_to_return = [];
                for(let d of doc){
                    const obj = await objects.findOne({_id: d.book_id})
                    const user = await users.findOne({_id:d.user_id})
                    console.log(d)
                    if(obj && user) books_to_return.push({book: obj, user:user, returned_date: new Date(d.returned).toISOString().split('T')[0].split('-'),returned_time:new Date(d.returned).toISOString().split('T')[1].split('.')[0]})
                }
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'return', returns:books_to_return})
            })
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Mitarbeiter/Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.duplicate = function (req, res){
    if(req.session.loggedin && req.session.role==='admin'){
        res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'duplicate'})
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.user = function(req, res){
    if(req.session.loggedin && req.session.role==='admin'){
        users.find()
            .then(doc=>{
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'user', data: doc})
            })
            .catch(err=>console.log(err))

    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}