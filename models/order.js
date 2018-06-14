var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var bcrypt = Promise.promisifyAll(require('bcrypt'));

var Schema = mongoose.Schema;

var Order = new Schema({
	email: {
		type: String
	},
	modifiedOn: {
		type: Date
	},
	status: {
		type: String
	},
	name: {
		type: String
	},
	total_price: {
		type: String
	},
	products: [{
		name: String,
		quantity: String,
		price: String,
		category: String,
		image: String,
		ingredients: String,
		availability: String
	}],
	address: {
		street: String,
		locality: String,
		city: String,
		state: String,
		pincode: String,
		country: String
	}
}, { versionKey: false });

module.exports = mongoose.model('Order', Order);