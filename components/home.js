const object = require('../src/models/object');

exports.view = function (req, res, next){
 if(req.session.loggedin) {

  object.count()
      .then((count)=>{
       const skip = Math.floor(Math.random() * (count-4));
       object.find().limit(4).skip(skip<0?0:skip)
           .then((doc)=>{
            console.log(doc);
            res.render('index', {user: req.session.username, active: 'home', name:req.session.name, books: doc})
           })
  })
 }else{
  res.redirect('/login')
 }
}