exports.view = function (req, res, next){
 if(req.session.loggedin) {
  const books = [{ //todo add db question
   title: "",
   author: "",
   small_desc: "",
   img: "",
   img_desc: ""
  }]
  res.render('index', {title: 'Express', user: req.session.username, name:'', books: books})
 }else{
  res.redirect('/login')
 }
}