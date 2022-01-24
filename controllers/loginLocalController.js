var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mailer = require('../config/mailer');
const { body, validationResult } = require('express-validator');

passport.use(new LocalStrategy(
    function (username, password, done) {

        User.findOne({
            username : username
        }).then(function (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return done(err);
                }
                if (!result) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }
                return done(null, user);
            })
        }).catch(function (err) {
            return done(err);
        })
    }
));

exports.login = function (req, res) {
    res.render('login_views/login.ejs', { title: 'Login to Account' });
};

exports.sendmailFogot = [
    body('email').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .withMessage('Email has non-alphanumeric characters.'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('register.ejs', { title: 'Create Account', account: req.body, errors: errors.array() });
            return;
        }
        else {
            
            User.findOne({
                email: req.body.email
            })
                .then(result => {
                    if(result){
                        code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                        console.log(code);
                        mailer.sendMail(req.body.email, code);
                        res.render('login_views/verifyforgot.ejs', { title: 'Verify Account', account: result })
                    }
                    else{
                        res.render('login_views/forgotpassword.ejs',{title: 'Forgot Password', err:'The email does not exist'})
                    }
                }
                )

        }
    }
];

exports.updatePassword = (req, res, next) => {
    console.log(req.body);
    if (req.body.code == code && req.body.confirm == req.body.password) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            User.findByIdAndUpdate(req.body.id, { $set: { password: hash } }, {}, function (err) {
                if (err) { return next(err); }
                res.redirect("/login");
            });

        })
    }
    else {
        res.render('login_views/verifyforgot.ejs', { title: 'Verify Account', account: req.body })
    }
};