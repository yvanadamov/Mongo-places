var POI = require('../models/poi');

var filterPois = function(req, res) {
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
};

var getPoiInfo = function(req, res) {
	POI.getInfo(req.params.id, function(err, poi) {
		if(err) {
			return console.error(err);
		}
		
		res.json({
			size:        poi.specificInfo.size,
			ground:      poi.specificInfo.ground,
			price:       poi.specificInfo.pricePerHour,
			description: poi.additionalInfo.description,
			type:        poi.specificInfo.type
		});
	});
};

var getPoisStats = function(req, res) {
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
};

module.exports = {
	filter	: filterPois,
	info	: getPoiInfo,
	stats	: getPoisStats
};