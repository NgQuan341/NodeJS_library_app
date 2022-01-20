
const mailer = require('../config/mailer');
var User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.signup = [
body('email').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
.withMessage('Email has non-alphanumeric characters.'),
(req, res, next) => {
const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        res.render('email/getEmail.ejs', { title: 'Create Account', account: req.body, err: errors.array() });
        return;
    }
    else {
        User.findOne({
            $or:[{email: req.body.email},{username:req.body.username}]
        })
        .then(result =>{
                if(result)
                {
                res.render('email/getEmail.ejs', {title: 'Create Account'})
                        }
                 else{
                code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                console.log(code);
                mailer.sendMail(req.body.email, code);
                res.render('email/verifyemail.ejs', { title: 'Verify Account', account: req.body})
                }
                })
                .catch(err=>{
                console.log(err);
                })
                
                }
        }
 ]

 exports.createAccount = (req, res, next) => {
        if (req.body.code == code) {
                        res.redirect("/login");           
        }
        else {
            res.render('email/verifyemail.ejs', { title: 'Verify Account', account: req.body})
        }
        }
