var express = require('express');
var router = express.Router();

const lowdb = require('lowdb')('model/db.json', { storage: require('lowdb/file-sync') })



router.get(['/', '/:page(\\b\\B|\\d*)'] , function(req, res, next) {
    var articlesPerPage = 10;
    var db = lowdb.read().object;
    var page = req.params.page === undefined? 1 : parseInt(req.params.page);
    if (page == 0) {
        page = 1;
    } else if (page > db.article.length / articlesPerPage) {
        page = Math.floor(db.article.length / articlesPerPage) + 1;
    }

    var categories = new Map();
    for (var i = 0; i < db.category.length; i++) {
        categories.set(db.category[i].simpleName, db.category[i].displayName);
    }
    var articleIndexFirst = (page - 1) * articlesPerPage;
    var articleIndexLast = db.article.length < page * articlesPerPage ? db.article.length : page * articlesPerPage;
    var articles = db.article.slice(articleIndexFirst, articleIndexLast);
    res.render('index', {
        title: 'Florian Gauger',
        articles: articles,
        categories: categories,
        page: page,
        showButtonNext: articleIndexLast < db.article.length,
        showButtonPrevious: articleIndexFirst != 0
    });
});

module.exports = router;
