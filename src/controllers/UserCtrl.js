const User = require('../models/user');
const POI = require('../models/poi')
const passport = require('passport');

module.exports = {
	logout: function(req, res) {
		req.logout();
		res.json({success: true});
	},

	login: function(req, res, next) {
		let result = {success: false, error: null};

		passport.authenticate('local', function(err, user, info) {
			if (err) { 
				result.error = 'Internal error.';
				return res.json(result); 
			}

			if (!user) { 
				result.error = 'Invalid username or password.';
				return res.json(result); 
			}

			req.logIn(user, function(err) {
				if (err) { 
					result.error = 'Invalid username or password.';
					return res.json(result); 
				}
				
				result.success = true;
				req.login();
				res.json(result);
			});
		})(req, res, next);
	},

	register: function(req, res) {
		const newUser = new User({ username : req.body.username });
		const password = req.body.password;
		let result = {success: false, error: null};

		User.register(newUser, password, function(err, user) {
			if (err) {
				result.error = err.message;
				return res.json(result);
			}

			passport.authenticate('local')(req, res, function() {
				result.success = true;
				res.json(result);
			});
		});
	},

	addPlaceToFavs: function(req, res) {
		const poiID = req.body.id;
		let result = {success: false};
		
		User.addPOI(req.user._id, poiID, function(err, response) {
			if(err) {
				console.error(err);
			}
			else if(response.ok == 1 && response.nModified == 1) {
				result.success = true;
			}

			res.json(result);
		});
	},

	removePlaceFromFavs: function(req, res) {
		const poiID	= req.body.poiID;
		const userID = req.user._id;
		let result = {success: false};
		
		User.deletePOI(userID, poiID, function(err, response) {
			if(err) {
				console.error(err);
			}
			else if(response.ok == 1 && response.nModified == 1) {
				result.success = true;
			}

			res.json(result);
		});
	}
};