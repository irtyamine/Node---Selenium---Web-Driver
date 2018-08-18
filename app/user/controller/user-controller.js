const jwt      = require('jsonwebtoken');
const passport = require("passport");
const User     = require("../model/users");
const async    = require('async');

// Get Login Form
module.exports.getLogin = (req, res) => {
	res.status(200).json({ 
		success: true, 
		error  : req.flash('error'),
		message:'Successfully fetched form for login.'
	});
}

// Authenticate User
module.exports.postLogin = (req, res, next) => {
	passport.authenticate('passport-login', {session: false}, (err, user, info) => {
		if (err) { 
			req.flash('error', err);
			return next(err); 
		} 
		if (!user) {
			if(!!info){
				req.flash('error', info.message);     
			}
			return res.redirect('/api/user/login')
		} 

		req.login(user, {session: false}, (err) => {
			if (err) {
				res.send(err);
			}

			const token = jwt.sign(user.toJSON(), process.env.jwt_secret, { expiresIn: '5h' });

			return res.status(200).json({
				success : true,
				message : 'You successfully logged in your account',
				token   : token
			});
		});
	})(req, res, next);
}


/* Get signup form */
module.exports.getSignupForm = (req, res) =>{
	res.status(200).json({ 
		success: true, 
		error  : req.flash('error'),
		message:'Successfully fetched form for signup.'
	});
}

/* Create new user */
module.exports.signUp = (req, res) => {
	passport.authenticate('passport-signup', {session: false}, (err, user, info) => {
		if (err) { 
			req.flash('error', err);
			return next(err); 
		} 
		if (!user) {
			if(!!info){
				req.flash('error', info.message);     
			}
			return res.redirect('/api/user/signup')
		} 

		req.login(user, {session: false}, (err) => {
			if (err) res.send(err);

			const token = jwt.sign(user.toJSON(), process.env.jwt_secret, { expiresIn: '5h' });

			return res.status(200).json({
				success : true,
				message : 'You successfully logged in your account',
				token   : token
			});
		});
	})(req, res);
}

/* Get user profile */
module.exports.getProfile = (req, res) => {
	res.status(200).json({ 
		success: true, 
		error  : req.flash('error'),
		user   : req.user,
		message:'Successfully fetched profile'
	});
}

module.exports.getLogout = (req, res) => {
	req.logout();
	res.clearCookie('jwt');
	res.redirect('/api/user/login')
};