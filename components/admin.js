const objects = require("../src/models/object");

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
                    author: req.body.author,
                    publisher: req.body.publisher,
                    isbn: req.body.isbn,
                    keywords: req.body.keywords.split(', '),
                    typ: req.body.type,
                    year: req.body.year,
                    blurb: req.body.blurb,
                    small_desc: req.body.small_desc,
                    img: req.body.img_base64,
                    img_desc: req.body.img_desc,
                    history: [],
                    //read: req.body.read, //todo safe to storage
                    position: req.body.position?req.body.position:null
                })
                object.save()
                    .then(doc => {
                        console.log(doc)
                        res.redirect('/admin');
                    })
                    .catch(err => {
                        console.error(err)
                        res.redirect('/admin');
                    })
            })
    }else if(req.session.loggedin){
        res.sendStatus(401).send('Sie sind kein Administrator und so nicht genehmigt diesen Bereich der Webseite aufzusuchen.')
    }else{
        res.redirect('/login')
    }
}

exports.delete =async function (req,res,next){
    if(req.session.loggedin && req.session.role==='admin') {
        res.send(await objects.deleteOne({_id: req.params.id}))
    }
    else{
        res.sendStatus(401).send({error: "You are not an admin", deletedCount: 0})
    }
}