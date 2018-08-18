const User          = require('../model/users');
const passport      = require('passport');
const passportJWT   = require("passport-jwt");

//jwt authentication
const ExtractJWT    = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

//local
const LocalStrategy = require('passport-local').Strategy;

//passport local - for login
passport.use('passport-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, callback) => {
        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Invalid email format').isEmail();
        req.checkBody('password', 'Password is required.').notEmpty();
        let errors = req.validationErrors();

        if (errors) {
            let messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });

            return callback(null, false, req.flash('error', messages));
        }

        User.findOne({ 'email': email.toLowerCase() }, (err, user) => {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(null, false, { message: 'User does not exist in the database.'});
            }
            if (!user.validPassword(password)) {
                return callback(null, false, { message: 'Invalid password.'});
            }
            return callback(null, user);
        });
    }
));

//passport local for signup
passport.use('passport-signup', new LocalStrategy({
    // Get the username field and password field on req.body
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, callback) => {
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Incorrect email format.').isEmail();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password is invalid.').isLength({min:6});
    req.checkBody('confirm-password', 'Password does not matched.').equals(req.body.password);
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('address', 'Address is required.').notEmpty();
    req.checkBody('phone', 'Phone is required.').notEmpty();


    let errors = req.validationErrors();

    if (errors) {
        let messages = [];
        errors.forEach((error) => {
           messages.push(error.msg);
        });

        return callback(null, false, req.flash('error', messages));
    }

    User.findOne({ 'email': email.toLowerCase() }, (err, user)  => {
        if (err) {
            return callback(err);
        }
        if (user) {
            return callback(null, false, {message: 'User already exist in the database.'});
        }

        let newUser = new User();

        newUser.email    = req.body.email.toLowerCase();
        newUser.password = newUser.generateHash(password);
        newUser.name     = req.body.name;
        newUser.address  = req.body.address;
        newUser.phone    = req.body.phone;

        newUser.save(err => {
          if(err){
            return callback(err);
          }

           return callback(null, newUser);
        })
    });
}));

//passport jwt for extracting token
const opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey    =  process.env.jwt_secret;

passport.use(new JWTStrategy(opts, (jwt_payload, callback) => {
    let query = User.findOne({_id: jwt_payload._id}).select({'__v':0, 'password': 0});

    query.exec((err, user) => {
        if (err) {
            return callback(err, false);
        }
        if (user) {
            return callback(null, user);
        } else {
            return callback(null, false);
        }
    });
}));