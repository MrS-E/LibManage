var createError = require('http-errors');
var express = require('express');
let session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const schedule = require("node-schedule");
require('./src/db/datebase');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(session({
  secret: 'bibliothek',
  resave: true,
  saveUninitialized: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(express.static(path.join(__dirname, 'public')))

//view
app.use('/', require('./routes/view/index'));
app.use('/admin', require('./routes/view/admin'));
app.use('/lend', require('./routes/view/lend'));
app.use('/liste', require('./routes/view/liste'));
app.use('/ich', require('./routes/view/ich'));
//api
app.use('/api/admin', require('./routes/api/admin'))
app.use('/api/object', require('./routes/api/object'))
app.use('/api/user', require('./routes/api/user'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

schedule.scheduleJob('0 0 0 * * *', () => { //runs every 24h at 0:0
  console.log("SCHEDULE JOB STARTED");
  const user_model = require('./src/db/models/user')
  const object_model = require('./src/db/models/object')
  const return_model = require('./src/db/models/returns')

  console.log("SCANNING FOR OVERDUE BOOKS")
  user_model.find({"history.end": null, "history.start": {$lt:new Date(new Date().getDate() - 30).toISOString().split('T')[0]}})
      .then((doc)=>{
          for(let user of doc){
            for(let history of user.history){
              object_model.findOne({_id: history.book })
                  .then((book)=>{
                    if(book.typ !== ('E-Book' || 'E-Audio' || 'E-Video' || 'E-Paper')){
                      let _return = new return_model({
                        user_id: user._id,
                        book_id: history.book
                      })
                      _return.save().catch(err => console.log(err))
                    }else{
                      //console.log("e-medium")
                      user_model.updateOne({_id: user._id, "history.book": history.book}, {$set:{"history.$.end": new Date().toISOString().split('T')[0]}})
                          .catch(err => console.log(err))
                        object_model.updateOne({_id: history.book, "history.user":user._id}, {$set:{"history.$.end": new Date().toISOString().split('T')[0]}})
                    }
                  })
            }
          }
          })
  console.log("SCHEDULE JOB FINISHED")
});

module.exports = app;
