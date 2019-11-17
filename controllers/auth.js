const User = require('../models/user');

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
		const user = await User.findById('5dd03792f525021bcec8298d');
		req.session.user = user;
		req.session.isLoggedIn = true;
		res.redirect('/');
	} catch(err) {
		console.error(err);
	}
};

exports.postLogout = (req, res, next) => {
//   req.session.destroy(err => {
//     console.log(err);
//     res.redirect('/');
//   });
};
