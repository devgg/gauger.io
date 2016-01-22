var express = require('express');
//var favicon = require('serve-favicon');
var stylus = require('stylus');
var axis = require('axis');

var config = require('./config.js');

var blog = require('./routes/blog');
var bibsbn = require('./routes/bibsbn');

var path = require('path');


const lowdb = require('lowdb');
const gradientsDb = lowdb(config.paths.bibsbn + '/model/gradients.json', { storage: require('lowdb/file-sync') })
const gradients = gradientsDb.read().object;

var app = express();

app.set('views', config.paths.views);
app.set('view engine', 'jade');


app.use('/blog', blog);
app.use('/bibsbn', bibsbn);


function concatPaths() {
    var p =  '';
    for (var i = 0; i < arguments.length; i++) {
        if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
            for (var j = 0; j < arguments[i].length; j++) {
                p = path.join(p, arguments[i][j]);
            }
        } else if (typeof arguments[i] === "string") {
            p = path.join(p, arguments[i]);
        }
    }
    return p;
}

app.use('/style', stylus.middleware({
    src: function(path) {
        var pathParts = path.replace(/\.css$/, '.styl').split('/');
        if (pathParts[0] === '') {
            pathParts.shift();
        }
        if (pathParts[0] === 'bibsbn') {
            return concatPaths(config.paths.bibsbn, 'views', 'style', pathParts.slice(1));
        } else {
            return concatPaths(config.paths.views, 'style', pathParts);
        }
    },
    dest: concatPaths(config.paths.public, 'style'),
    force: true,
    compile: compile
}));
//app.use(favicon(config.paths.favicon));



/*
app.use(stylus.middleware({
    src: config.paths.views,
    dest: config.paths.public,
    compile: compile
}));

app.use(stylus.middleware({
    src: config.paths.subpages + '/bibsbn/views',
    dest: config.paths.subpages + '/bibsbn/public',
    force: true,
    compile: compile
}));*/

app.use(express.static(config.paths.public));
app.use(express.static(config.paths.subpages + '/bibsbn/public'));

function compile(str, path){
    var gradient = gradients[Math.floor(Math.random() * gradients.length)];
    return stylus(str)
        .set('filename', path)
        .define('color_gradient_right', new stylus.nodes.Literal(gradient.right))
        .define('color_gradient_left', new stylus.nodes.Literal(gradient.left))
        .use(axis());
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


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
    error: app.get('env') === 'development' ? err : {}
  });
});


module.exports = app;
