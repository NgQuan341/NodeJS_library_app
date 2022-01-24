// import all the things we need  
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/user');

      passport.use(new GoogleStrategy({
        clientID: '972841784522-51ul1e8ckd3pgpre8lu2no6blgatccms.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/login/google/callback',
      },
      function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ googleID: profile.id}, function(err, user) {
                if(err)
                    return done(err);

                if(user) {
                    return done(null, user);
                } else {
                    var newUser         = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.ggoogle.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  });
