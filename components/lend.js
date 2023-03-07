const user = require('../src/models/user')
const object = require('../src/models/object')

exports.view = function(req, res, next){
    if(req.session.loggedin) { //TODO check is already rented by you
        object.findOne({_id: req.params.id})
            .then((doc)=>{
                if(doc.typ===('E-Book' || 'E-Audio' || 'E-Video' || 'E-Paper')){
                    res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: true})
                }else{
                    if(doc.history.length === 0 || typeof(doc.history[doc.history.length-1].end) === Date){
                        res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: true})
                    }else{
                        res.render('sites/lend', {user: req.session.username, name: req.session.name, book: doc, can_be_rented: false})
                    }
                }
            })
            .catch((err)=>{
                console.log(err)
                res.redirect('/liste/'+req.params.id)
            })
    }
    else{
        res.redirect('/login')
    }
}
exports.lend = async function (req, res, next){
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
exports.return = function (req, res, next){

}