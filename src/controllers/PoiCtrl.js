const POI = require('../models/poi');

module.exports = {
	filterPois: function(req, res) {
		var getPois = function(err, pois) {
			if(err) {
				return console.error(err);
			}
			res.json(pois);
		};

		if(!req.query.method || !/^[1-3]$/.test(req.query.method)) {
			POI.findAll(getPois);
			return;
		}

		POI.getInfo({_id: req.query.id}, function(err, poi) {
			switch(req.query.method) {
				case '1': poi.findSimilarTypes(getPois); break;
				case '2': poi.findNearest(getPois); break;
				case '3': poi.findSimilar(getPois); break;
			}
		});
	},

	getPoiInfo: function(req, res) {
		let result = {success: false, poi: null};
		POI.getInfo(req.params.id, function(err, poi) {
			if(err) {
				console.error(err);
				return res.json(result);
			}
			
			result.success = true;
			result.poi = {
				size:        poi.specificInfo.size,
				ground:      poi.specificInfo.ground,
				price:       poi.specificInfo.pricePerHour,
				description: poi.additionalInfo.description,
				type:        poi.specificInfo.type
			}; 
			res.json(result);
		});
	},

	getPoiStats: function(req, res) {
		POI.getMostLiked(function(err, result) {
			if(err) {
				return console.error(err);
			}

			var unserialisedData = result.map(function(type) {
				var typeData = {};
				typeData[type._id] = JSON.parse(type.value);
				return typeData;
			});
			res.json(unserialisedData);
		});
	},

	getAllPois: function(req, res) {
		let	result	= {success: true, user: null, all: null};

		// Get all objects
		POI.getAll(function(err, pois) {
			if(err) {
				console.error(err);
				result.success = false;
				return res.json(result); 
			}
			result.all = pois;
		
			if(req.user) {
				result.user = {
					isLogged: true,
					favs: req.user.pois
				};
			}
			res.json(result);
		});
	}
};