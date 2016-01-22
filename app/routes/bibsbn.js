var router = require('express').Router();
var config = require('../config.js');


router.get('/', function(req, res, next) {
    res.render(config.paths.bibsbn + '/views/index');
});

module.exports = router;
