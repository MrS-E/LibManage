const objects = require("../../src/db/models/object");
const files = require("../../src/db/models/files")

exports.add = function (req, res){
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