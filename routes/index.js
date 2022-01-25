var express = require('express');
var router = express.Router();
var passport = require('passport');
var local_controller = require('../controllers/loginLocalController');
var user_controller = require('../controllers/userController');
var register_controller = require('../controllers/registerController');
const User = require('../models/user')

router.get('/', user_controller.checkAuthenticated, user_controller.homepage);

// Register Page
router.get('/register', (req, res, next) => { res.render('register') });
// Register Handle
router.post('/register', register_controller.registerHandle)

router.get('/login', user_controller.checkNotAuthenticated, local_controller.login);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', user_controller.logout );

module.exports = router;
