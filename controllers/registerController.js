const {check, validationResult} = require('express-validator');
var passport = require('passport');
// Load User model
const User = require('../models/user');
const flash = require('connect-flash');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


exports.registerHandle = [
      check('userName', 'Username must not be empty.').notEmpty(),
      check('email', 'Email must not be empty.').notEmpty(),
      check('password').notEmpty().withMessage('Password must not be empty').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
      check('email')
      .isEmail()
      .withMessage('Invalid Email')
      .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
          User.findOne({email:req.body.email}, function(err, user){
            if(Boolean(user)) {
              reject(new Error('E-mail already in use'))
            }
            resolve(true)
          });
        });
      }),
      check('password2', 'Passwords do not match')
      .exists()
      .custom((value, { req }) => value === req.body.password),
    
     (req, res, next) => {
        const errors = validationResult(req);
        const {userName, email, password, password2} = req.body;
     
        if (!errors.isEmpty()) {
            res.render('register', { userName, email, password, password2,  errors: errors.array()})
        } else {
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
              
            const newUser = new User({
                username: userName,
                email: email,
                password: hashPass
            });
            newUser.save()
            .then(user => {
                req.flash('success_msg', 'You are now registered and can log in' );
                res.redirect("/register")
            })    
            .catch(err => next(err));
        }
        
    }

];













