var express = require('express');
var router = express.Router();

const lowdb = require('lowdb')('model/db.json', { storage: require('lowdb/file-sync') })


router.get('/', function(req, res, next) {
    var db = lowdb.read().object;
    var categories = new Map();
    for (var i = 0; i < db.category.length; i++) {
        categories.set(db.category[i].simpleName, db.category[i].displayName);
    }
    res.render('index', {
        title: 'Florian Gauger',
        articles: db.article,
        categories: categories
    });
});

module.exports = router;
