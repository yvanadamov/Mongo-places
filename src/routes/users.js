var express = require('express');
var router = express.Router();
var User = require('../models/user');
var POI = require('../models/poi')

/* GET users listing. */

// for getting user information, all objects and most liked types
router.get('/users/', function (req, res) {
	var user	= {isLogged: false, favs: null};
	var	result	= {user: null, pois: null};

	if(req.user) {
		user.isLogged = true;
		user.favs = req.user.pois;
	}

	result.user = user;

	// get all objects
	POI.getAll(function(err, pois) {
		if(err) {
			return console.error(err);
		}
		result.pois = pois;
		
		res.json(result);
	});
});

router.post('/users/favs/add/', function (req, res) {
	var poiID = req.body.id;
	var result = {success: false};
	
	User.addPOI(req.user._id, poiID, function(err, response) {
		if(err) {
			return console.error(err);
		}
		
		if(response.ok == 1 && response.nModified == 1) {
			result.success = true;
		}
		res.json(result);
	});
});

router.post('/users/favs/delete/', function (req, res) {
	var poiID	= req.body.poiID;
	var	userID	= req.user._id;
	var result	= {success: false};
	
	User.deletePOI(userID, poiID, function(err, response) {
		if(err) {
			return console.error(err);
		}

		if(true || response.ok == 1 && response.nModified == 1) {
			result.success = true;
		}
		res.json(result);
	});
});

module.exports = router;