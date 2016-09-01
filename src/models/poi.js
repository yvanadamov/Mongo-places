var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fields = 'name location';
var modelName = 'POI';

// schema
var poiSchema = new Schema({
	name: String,
	location: Array,
	likes: Number,
	specificInfo: {
		type: {type: String},
		placesCount: Number,
		pricePerHour: Number,
		size: Array,
		ground: String
	},
	additionalInfo: {
		description: String,
		worktime: String,
		rate: Number,
		neighbourhood: String
	}
});


//////////////////////////// instance methods ///////////////////////////////////////////////////

// 1. find this type objects 
poiSchema.methods.findSimilarTypes = function(cb) {
	var type = this.specificInfo.type;

	return this.model(modelName)
			.find({'specificInfo.type': type}, fields, cb);
};

// 2. find nearest objects
poiSchema.methods.findNearest = function(cb) {
	var objectsLimit = 5,
		maxDistance = 10000000, 

		findObject = {
			'location': {
				$near : {
					$geometry: {
						'type': 'Point', 
						'coordinates': this.location
					},
					$maxDistance: maxDistance
				}
			}
		};

	return this.model(modelName)
			.find(findObject, fields, cb)
			.limit(objectsLimit);
};

// 3. find similar objects
poiSchema.methods.findSimilar = function(cb) {
	var findObject = {};
	findObject['specificInfo.pricePerHour'] = this.specificInfo.pricePerHour;

	return this.model(modelName).find(findObject, fields, cb);
};

///////////////////////////// statics ///////////////////////////////////

// get all objects
poiSchema.statics.getAll = function(cb) {
	return this.find({}, fields, cb);
}

// get info for single object
poiSchema.statics.getInfo = function(id, cb) {
	return this.findOne({_id: id}, cb);
};

// update likes object likes
poiSchema.statics.updateLikes = function(id, increment, cb) {
	var query = {'_id':id},
		incVal = (increment) ? 1 : -1,		
		update = {$inc: {likes: incVal}};

	return this.update(query, update, cb);
};

// get most liked object by type
poiSchema.statics.getMostLiked = function(cb) {
	var o = {};
	
	o.map = function () { 
		emit(this.specificInfo.type, {name: this.name, likes: this.likes})
	};

	o.reduce = function (k, vals) {
		// to get objects sorted in decending order by likes
		var sortedVals = vals.sort(function (a, b) {
			if (a.likes < b.likes) return 1;
			if (a.likes > b.likes) return -1;
			return 0;
		});

		// to get only the most liked objects
		var slicedVars = sortedVals.slice(0, 2);

		return JSON.stringify(slicedVars);
	};

	this.mapReduce(o, cb);
};


module.exports = mongoose.model(modelName, poiSchema, 'pois');