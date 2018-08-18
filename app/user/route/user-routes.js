const express   = require('express');
const router    = express();

const userController = require('../controller/user-controller');
const userMiddleware = require('../middleware/user-middleware');

/* get login form */
router.route('/login').get(userController.getLogin);
router.route('/login').post(userController.postLogin);

router.route('/signup').get(userController.getSignupForm);
router.route('/signup').post(userController.signUp);
/* get profile */
router.route('/profile').get(userMiddleware.authorizeAccess, userController.getProfile);
router.route('/logout').get(userController.getLogout);

module.exports = router;
