var express = require('express');
var router = express.Router();
var passport = require('passport');
var local_controller = require('../controllers/loginLocalController');
var user_controller = require('../controllers/userController');
var google_controller = require('../controllers/loginGoogleController');

router.get('/', user_controller.checkAuthenticated, user_controller.homepage);

router.get('/login', user_controller.checkNotAuthenticated, local_controller.login);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

  // login with Google
  router.get('/login/google', passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.login'}));
  
  router.get('/login/google/callback',
   passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
   function (req, res) {
     res.redirect('/');
   }); 


router.get('/logout', user_controller.logout );

module.exports = router;
