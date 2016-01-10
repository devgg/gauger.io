var express = require('express');
var router = express.Router();

const lowdb = require('lowdb')('model/db.json', { storage: require('lowdb/file-sync') })


function calculateSiteConfiguration(page, articlesPerPage, filter) {
    var db = lowdb.read().object;
    page = page === undefined? 1 : parseInt(page);
    var pageMax = Math.floor(db.article.length / articlesPerPage) + 1;
    if (page == 0) {
        page = 1;
    } else if (page > db.article.length / articlesPerPage) {
        page = pageMax;
    }
    var articleIndexFirst = (page - 1) * articlesPerPage;
    var articleIndexLast = db.article.length < page * articlesPerPage ? db.article.length : page * articlesPerPage;
    var articles = db.article.slice(articleIndexFirst, articleIndexLast);

    var categories = new Map();
    for (var i = 0; i < db.category.length; i++) {
        categories.set(db.category[i].simpleName, db.category[i].displayName);
    }
    return {
        articles: articles,
        categories: categories,
        page: page,
        pageMax: pageMax,
        showButtonNext: articleIndexLast < db.article.length,
        showButtonPrevious: articleIndexFirst != 0
    }
}

router.get(['/', '/:page(\\b\\B|\\d*)'] , function(req, res, next) {
    var siteConfiguration = calculateSiteConfiguration(req.params.page, 10);
    siteConfiguration.title = 'Florian Gauger';
    res.render('index', siteConfiguration);
});

module.exports = router;
