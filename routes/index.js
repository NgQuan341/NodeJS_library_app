var express = require('express');
var router = express.Router();
var passport = require('passport');
var local_controller = require('../controllers/loginLocalController');
var user_controller = require('../controllers/userController');
var github_controller= require('../controllers/loginGithubController');


router.get('/', user_controller.checkAuthenticated, user_controller.homepage);

router.get('/login', user_controller.checkNotAuthenticated, local_controller.login);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

  // login with Github
  router.get('/login/github', passport.authenticate('github'));
  
  router.get('/login/github/callback',
   passport.authenticate('github', { failureRedirect: '/login', failureMessage: true }),
   function (req, res) {
     res.redirect('/');
   }); 

router.get('/logout', user_controller.logout );

module.exports = router;
