var mongoose = require('mongoose');

var env = process.env['NODE_ENV'] || 'development';

var config = require('./config')[env].db;

mongoose.connect(config.connection);
mongoose.set('debug', config.debug);

module.exports = mongoose;