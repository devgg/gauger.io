var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var stylus = require('stylus');

var config = require('./config.js');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', config.paths.views);
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(config.paths.favicon));
app.use(logger('dev'));
app.use(stylus.middleware({
    src: config.paths.views,
    dest: config.paths.public
}));
app.use(express.static(config.paths.public));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;