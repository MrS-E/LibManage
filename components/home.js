exports.index = function (req, res, next){
 if(req.session.loggedin) {
  res.render('index', {title: 'Express', user: req.session.username})
 }else{
  res.redirect('/login')
 }
}