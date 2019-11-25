const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false
	});
};

exports.postSignup = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const userDoc = await User.findOne({ email: email });
	if(userDoc) {
		console.log(`Sorry, User with email ${email} exists !!!`);
		return res.redirect('/signup');
	}
	const hashedPassword = await bcrypt.hash(password, 11);
	const user = new User({ 
		email: email, 
		password: hashedPassword, 
		cart: { 
			items: [] 
		}
	});
	await user.save();
	console.log('User Created successfully !!!');
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
