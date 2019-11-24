const User = require('../models/user');

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false
	});
};

exports.postSignup = (req, res, next) => {
	console.dir(req.body);
	res.redirect('/');
};

exports.getLogin = (req, res, next) => {
	console.log(req.get('Cookie'));
	console.log(req.session.isLoggedIn);
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn
	});
};

exports.postLogin = async (req, res, next) => {
	try {
		res.setHeader('Set-Cookie', 'name=habib; HttpOnly');
		const user = await User.findById('5dd03792f525021bcec8298d');
		req.session.user = user;
		req.session.isLoggedIn = true;
		req.session.save(err => { // req.session.save(callback) is called so that res.redirect('/') called after the session creates
			console.log(err);
			res.redirect('/');
		});
	} catch(err) {
		console.error(err);
	}
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};
