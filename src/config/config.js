module.exports = {
	production: {
		db: {
			connection: 'mongodb://admin:admin123@ds013931.mlab.com:13931/mongoplaces',
			debug: false
		}
	},
	development: {
		db: {
			connection: 'mongodb://admin:admin123@ds013931.mlab.com:13931/mongoplaces',
			debug: true
		}
	}
};