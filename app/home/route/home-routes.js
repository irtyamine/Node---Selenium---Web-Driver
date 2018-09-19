const express   = require('express');
const router    = express();

const homeController = require('../controller/home-controller');

router.route('/').get(homeController.getHome);
router.route('/search-brand').post(homeController.searchBrand);
router.route('/brand/google/signin').get(homeController.googleSignin);

module.exports = router;
