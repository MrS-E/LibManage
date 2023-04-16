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
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));
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
  const user = require('./src/db/models/user')
  const object = require("./src/db/models/object")
  const returns = require("./src/db/models/returns")
  console.log("SCANNING FOR OVERDUE BOOKS")
  const date = new Date()
  user.find({"history.end": null, "history.start": {$lt:new Date(date.getDate() - 30)}})
      .then(doc=>{
        for(let obj of doc){
          for(let history in obj.history){
            if(!history.end && new Date(history.start)<new Date(date.getDate()-30)){
              object.findOne({_id: history.book}).then((book)=>{
                if(book.typ.split('-')[0]==='E'){
                  object.updateOne({_id: book._id, "history.book": history.book, "history.end": null}, {$set:{"history.$.end": date.toISOString()}})
                }else{
                  const remove = new returns({
                    user_id: obj._id,
                    book_id: book._id,
                    returned: date
                  })
                  remove.save()
                }
              })
              user.updateOne({_id: obj._id, "history.book": history.book, "history.end": null}, {$set:{"history.$.end": date.toISOString()}})
            }
          }
        }
      })
  console.log("SCHEDULE JOB FINISHED")
});

module.exports = app;
