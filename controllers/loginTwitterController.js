var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var User=require('../models/user');


passport.use(new GitHubStrategy({
  clientID:'7c6c95a80119c7c6b9ea',
  clientSecret:'b2d50f893c998eef12c6b7f0ab7a2391d0f3940a',
  callbackURL:'http://localhost:3000/login/github/callback'
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ githubID: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

passport.serializeUser(function(user,callback){
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback){
  callback(null, id);
});