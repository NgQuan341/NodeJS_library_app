const FacebookStrategy  = require('passport-facebook').Strategy;
const passport = require("passport");
var config = require("../config");
  
  // Sử dụng FacebookStrategy cùng Passport.
  passport.use(new FacebookStrategy({
      clientID: config.facebook_key,
      clientSecret: config.facebook_secret ,
      callbackURL: config.callback_url
    },
    function (accessToken, refreshToken, profile, cb) {
        process.nextTick(function() {
            User.findOne({ facebookID: profile.id })
            .then(result => {
                if (result == null) {
                    var user = new User(
                        {
                            username: profile.displayName,
                            facebookID: profile.id
                        });
                    user.save();
                    return cb(null, user)
                }
                else {
                    return cb(null, result)
                }
            })
            .catch(err => {
                console.log(err);
            })
        })
    }
  ));