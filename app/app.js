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

app.set('view engine', 'jade');


app.use('/blog', blog);
app.use('/bibsbn', bibsbn);


function concatPaths(/* arguments */) {
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


app.use('/style/bibsbn', stylus.middleware({
    src: function(path) {
        return concatPaths(config.paths.bibsbn, 'views', 'style', path.replace(/\.css$/, '.styl'));
    },
    dest: concatPaths(config.paths.public, 'style', 'bibsbn'),
    force: true,
    compile: function(str, path) {
        var gradient = gradients[Math.floor(Math.random() * gradients.length)];
        return stylus(str)
            .set('filename', path)
            .define('color_gradient_right', new stylus.nodes.Literal(gradient.right))
            .define('color_gradient_left', new stylus.nodes.Literal(gradient.left))
            .use(axis());
    }
}));

app.use('/style/blog', stylus.middleware({
    src: concatPaths(config.paths.blog, 'views', 'style'),
    dest: concatPaths(config.paths.public, 'style', 'blog'),
    force: true,
    compile: function(str, path) {
        return stylus(str)
            .set('filename', path)
            .use(axis());
    }
}));

app.use(express.static(config.paths.public));
app.use(express.static(config.paths.subpages + '/bibsbn/public'));

/*

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

*/
module.exports = app;
