var User = require('../models/user');
var passport = require('passport');

var indexPage = function (req, res) {
	res.render('index', { user : req.user});
};

var registerPage = function(req, res) {
	res.render('register', { });
};

// TODO: move to User Ctrl
var registerAction = function(req, res) {
	var newUser = new User({ username : req.body.username });
	var pass = req.body.password;

	User.register(newUser, pass, function(err, user) {
		if (err) {
			console.error(err);
			return res.render('register', { user : user });
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
};

var loginPage = function(req, res) {
	res.render('login', { user : req.user });
};

// TODO: move to User Ctrl
var loginAction = function(req, res) {
	res.redirect('/');
};

// TODO: move ot User Ctrl
var logoutAction = function(req, res) {
	req.logout();
	res.redirect('/');
};

var pingPage = function(req, res){
	res.status(200).send('pong!');
};

module.exports = {
	index			: indexPage,
	registerGet		: registerPage,
	registerPost	: registerAction,
	loginGet		: loginPage,
	loginPost		: loginAction,
	logout			: logoutAction,
	ping			: pingPage
};