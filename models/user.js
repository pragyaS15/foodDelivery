var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var bcrypt = Promise.promisifyAll(require('bcrypt'));

var Schema = mongoose.Schema;

var User = new Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	mobile: {
		type: String
	},
	address: {
		street: String,
		locality: String,
		city: String,
		state: String,
		pincode: String,
		country: String
	}
}, { versionKey: false });

User.pre("save", function(next) {
	var user = this;

	if(!this.isModified("password")) {
		return next();
	}

	return bcrypt.genSalt(10).then((salt) => {
		return bcrypt.hash(user.password, salt).then((hash) => {

			user.password = hash;
			return next();
		}).catch(next);
	}).catch(next);
});

User.methods.comparePassword  = function(password, callback) {

	return bcrypt.compare(password, this.password, function(err, isMatch) {
		if(err) return callback(err, false);
		//callback(isMatch);
		//console.log(this.password);
		return callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', User);

