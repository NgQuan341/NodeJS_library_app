const { Router } = require('express');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var local_controller = require('../controllers/loginLocalController');
var user_controller = require('../controllers/userController');
var email_controller = require('../controllers/registerController');

router.get('/', user_controller.checkAuthenticated, user_controller.homepage);

router.get('/login', user_controller.checkNotAuthenticated, local_controller.login);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', user_controller.logout );
router.get('/sendEmail', function (req, res, next) {
  res.render('email/getEmail.ejs', { title: "Create Account" });
  });

router.post('/sendEmail', email_controller.signup);

router.post('/verify', email_controller.createAccount);

module.exports = router;
