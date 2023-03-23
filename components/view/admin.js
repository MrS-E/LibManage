const objects = require("../../src/db/models/object");

exports.view = function(req, res){
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
