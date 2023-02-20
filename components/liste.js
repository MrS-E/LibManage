const objects = require('../src/models/object')

exports.view = function (req, res, next) {
    if (req.session.loggedin) {
        objects.find()
            .then((doc)=>{
                doc = doc.reduce((r, e, i) => (i % 4 ? r[r.length - 1].push(e) : r.push([e])) && r, []); // from https://stackoverflow.com/questions/38048497/group-array-values-in-group-of-3-objects-in-each-array-using-underscore-js
                console.log(doc)
                res.render('liste', {book_list: doc})
            })
    }else{
        res.redirect('/login')
    }
}