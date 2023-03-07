const objects = require("../src/models/object");

exports.view = function(req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        objects.find()
            .then((doc)=> {
                res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'object', books:doc})
            })
    }else if(req.session.loggedin){
        res.send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
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
        res.send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.new = function (req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        res.render('sites/ich', {user: req.session.username, role: req.session.role, render: 'new'})
    }else if(req.session.loggedin){
        res.send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.add = function (req, res, next){
    if(req.session.loggedin && req.session.role==='admin'){
        console.log(req.body)
    }else if(req.session.loggedin){
        res.send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}