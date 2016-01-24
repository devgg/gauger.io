
const router = require('express').Router();
const config = require('../config.js');
const fileSync = require('lowdb/file-sync');
const posts = require('lowdb')(config.paths.blog + '/model/db.json', { storage: fileSync }).read().object;

function calculateSiteConfiguration(page, articlesPerPage, filter) {
    page = page === undefined? 1 : parseInt(page, 10);
    var pageMax = Math.floor(posts.article.length / articlesPerPage) + 1;
    if (page === 0) {
        page = 1;
    } else if (page > posts.article.length / articlesPerPage) {
        page = pageMax;
    }
    var articleIndexFirst = (page - 1) * articlesPerPage;
    var articleIndexLast = posts.article.length < page * articlesPerPage ? posts.article.length : page * articlesPerPage;
    var articles = posts.article.slice(articleIndexFirst, articleIndexLast);

    var categories = new Map();
    for (var i = 0; i < posts.category.length; i++) {
        categories.set(posts.category[i].simpleName, posts.category[i].displayName);
    }
    return {
        articles: articles,
        categories: categories,
        page: page,
        pageMax: pageMax,
        showButtonNext: articleIndexLast < posts.article.length,
        showButtonPrevious: articleIndexFirst !== 0
    }
}

router.get(['/', '/:page(\\b\\B|\\d*)'] , function(req, res, next) {
    var siteConfiguration = calculateSiteConfiguration(req.params.page, 10);
    siteConfiguration.title = 'Florian Gauger';
    res.render(config.paths.blog + '/views/index', siteConfiguration);
});

module.exports = router;