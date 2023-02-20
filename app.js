var createError = require('http-errors');
var express = require('express');
let session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const database = require('./src/datebase');

var indexRouter = require('./routes/index');
let usersRouter = require('./routes/user');
let lendRouter = require('./routes/lend');
let objectRouter = require('./routes/object');

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/lend', lendRouter);
app.use('/object', objectRouter);
//app.use('/admin', )

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
