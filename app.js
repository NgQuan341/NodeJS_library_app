const createError = require('http-errors');
const flash = require('connect-flash');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
var passport = require('passport');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'secret', resave: true, saveUninitialized: false }));

// Connect flash 
app.use(flash());

app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  var err = req.session.errors || [];
  res.locals.success_msg = req.flash('success_msg');
  res.locals.messages = msgs;
  res.locals.errors = err;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});

app.use(passport.authenticate('session'));

//DB Config
const connectDB = require('./config/db');
//Connect mongoDB
connectDB();

app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', require('./routes/index'));

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
