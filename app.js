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
  console.log("SCANNING FOR OVERDUE BOOKS")
  //todo scheduleJob
  console.log("SCHEDULE JOB FINISHED")
});

module.exports = app;
