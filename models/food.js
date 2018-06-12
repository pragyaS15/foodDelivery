var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var bcrypt = Promise.promisifyAll(require('bcrypt'));

var Schema = mongoose.Schema;

var Food = new Schema({
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
	}
}, { versionKey: false });

module.exports = mongoose.model('Food', Food);
