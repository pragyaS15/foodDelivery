var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var bcrypt = Promise.promisifyAll(require('bcrypt'));

var Schema = mongoose.Schema;

var Cart = new Schema({
	email: {
		type: String
	},
	modifiedOn: {
		type: Date
	},
	quantity: {
		type: String
	},
	name: {
		type: String
	},
	price: {
		type: String
	},
	category: {
		type: String
	},
	ingredients: {
		type: String
	},
	availability: {
		type: String
	},
	image: {
		type: String
	}
}, { versionKey: false });

module.exports = mongoose.model('Cart', Cart);