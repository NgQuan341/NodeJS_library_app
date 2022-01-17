var express = require('express');
var router = express.Router();
var passport = require('passport');
var local_controller = require('../controllers/loginLocalController');
var user_controller = require('../controllers/userController');

// Login
router.get('/', user_controller.checkAuthenticated, user_controller.homepage);

router.get('/login', user_controller.checkNotAuthenticated, local_controller.login);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

// Forgot Password
router.get('/sendmail_forgot', function (req, res, next) {
  res.render('login_views/forgotpassword.ejs', { title: "Forgot Password", err: undefined });
})

router.post('/sendmail_forgot', local_controller.sendmailFogot);

router.post('/new_password', local_controller.updatePassword);

// Logout
router.get('/logout', user_controller.logout);

module.exports = router;
