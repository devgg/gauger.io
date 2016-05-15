var router = require('express').Router();
var config = require('../config.js');


router.get('/', function(req, res, next) {
    res.render(config.paths.flex + '/views/index');
});

module.exports = router;
