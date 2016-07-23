var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

var POI = require('./poi')

var userSchema = new Schema({
	username: String,
	password: String,
	pois: [{
		name: String,
		location: Array,
	}]
});

userSchema.statics.addPOI = function(userID, poiID, cb) {
	var user = this;

	POI.getInfo(poiID, function(err, poi) {
		if(err) {
			console.error(err);
		}

		var query = {_id: userID};

		var doc = {
			_id:		poi._id,
			name:		poi.name,
			location:	poi.location
		};

		var update = {$addToSet: {pois: doc}};

		user.update(query, update, function(err, result) {
			if(err) {
				cb(err);
			}
			else if(result.ok == 1 && result.nModified == 1) {
				POI.updateLikes(poiID, true, cb);
			}
			else {
				cb(new Error('User favorites not updated'), null);
			}
		});
	});
};

userSchema.statics.deletePOI = function(userID, poiID, cb) {
	var query = {_id: userID};
	var update = {$pull: {pois: {_id: poiID}}};
	
	this.update(query, update, function(err, result) {
		if(err) {
			cb(err);
		}
		else if(result.ok == 1 && result.nModified == 1) {
			POI.updateLikes(poiID, false, cb);
		}
		else {
			cb(new Error('User favorites not updated'), null);
		}
	});
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema, 'users');