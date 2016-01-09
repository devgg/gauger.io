var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        articles: [
            {
                head: 'Lorem ipsum dolor sit amet, velit ridens',
                text: 'Lorem ipsum dolor sit amet, velit ridens labore has ea. Tibique repudiare te mel, eu omittam omnesque posidonium quo. An dolor principes accommodare nam, in nec veniam vocent temporibus. Fabulas patrioque vituperata at sea, nisl sanctus appareat ei cum, vero option recusabo ei mea. No pri utinam delenit, his atqui aliquam no, no his mediocrem expetenda. Alienum temporibus in duo, malorum partiendo per cu.'
            },
            {
                head: 'Lorem ipsum dolor sit amet, velit ridens labore has ea. Tibique repudiare',
                text: 'Lorem ipsum dolor sit amet, velit ridens labore has ea. Tibique repudiare te mel, eu omittam omnesque posidonium quo. An dolor principes accommodare nam, in nec veniam vocent temporibus. Fabulas patrioque vituperata at sea, nisl sanctus appareat ei cum, vero option recusabo ei mea. No pri utinam delenit, his atqui aliquam no, no his mediocrem expetenda. Alienum temporibus in duo, malorum partiendo per cu.'
            }
        ]
    });
});

module.exports = router;
