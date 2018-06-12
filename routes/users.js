var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = Promise.promisifyAll(require('bcrypt'));

var jwt = require('jsonwebtoken');  // used to create, sign, and verify tokens
var config = require('../config/config'); // get our config file

var superSecret = config.token.secret ;

// create a user
router.post('/register', function(req, res) {
	var new_user = new User();
	new_user.name = req.body.name;
	new_user.email = req.body.email;
	new_user.password = req.body.password;
	new_user.mobile = req.body.mobile;
	new_user.address.street = req.body.street;
	new_user.address.locality = req.body.locality;
	new_user.address.city = req.body.city;
	new_user.address.state = req.body.state;
	new_user.address.pincode = req.body.pincode;
	new_user.address.country = req.body.country;

	var msg = '';
	var emailflag = false;

	User.findOne({ email: req.body.email }, function(err, user) {

		if(err) throw err;
		if(!user) { flag = false; }  // email is unique
		else if(user) { flag = true; }
	});

	if (!emailflag) {
		new_user.save(function(err) {
			if(err) {
				if (err instanceof Error && err.name === "MongoError" && err.driver) {
					if (err.code == 11000) { //unique index conflict
						msg = 'Email already exists.';
						console.log({message: 'Email already exists.'});
					}
				}
			};
			if(!err) msg = 'User created';
			// we can't call res.json or res.send in
			// callback i.e. where console.log is
			res.json({message: msg});
		});
	}

	else { res.json({message: 'Email name already exists.'}); }
});


// route to authenticate a user (POST http://localhost:3000/api/authenticate)
router.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({ 
		email: req.body.email
	}, function(err, user) {
		if(err) throw err;

		if(!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.'});
		}
		else if (user) {
			// check if password matches
			var cb;
			var userPassword = user.password;
			var enteredPassword = req.body.password;

			// using mongoose model to compare hash password,
			// this is correct way to handle callback
			user.comparePassword(req.body.password, function(err, isMatch) {
				if (err) res.json({ success: false, message: 'Authentication failed. Wrong password.'});
				else {

					// if user is found & password is right
					// create a token
					var token = jwt.sign({data: user}, 'superSecret', {
						expiresIn: 60*60*24 // expires in 24 hours, based on seconds
					});

					user.password = undefined; //dont send password to user
					// return the information includig token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token,
						user: user
					});
				}
			});
		}
	});
});


// router middleware to verify a token
router.use(function(req, res, next) {

	// check header or url parameters or post parameters for token

	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, 'superSecret', function(err, decoded) {
			if(err) {
				return res.json({ success: false, message: 'Failed to authenticate token.'});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {

		// if there is no token 
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

// get all users
router.get('/users', function(req, res, next) {
	User.find(function(err, users) {
		if(err) throw(err);
		res.json(users);
		console.log(users.length);  // number of users
	});
});

// get one user
router.get('/:id', function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, user) {
		if(err) throw(err);
		res.json(user);
	});
});

// update one user
// this won't work if all the fields 
// are not given in the request body 
router.post('/:id', function(req,res) {
  
  User.findOne({_id: req.params.id }, function(err, user) {
    if(err) throw(err);

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    var msg = '';
    //console.log(user);

    user.save(function(err) {
      if(err) {
        // check for duplicate email
        if (err instanceof Error && err.name === "MongoError" && err.driver) {
          if (err.code == 11000) {
            msg = 'Email already exists.';  
            console.log({message: 'Email already exists.'});
          }
        }
      }; // end of if(err)
      if(!err) { msg = 'User updated!'; }

      res.json({ message: msg });
    });
  });  //end of first findOne
});


// delete one user
router.delete('/:id', function(req, res) {
	User.remove({_id: req.params.id }, function(err, user) {
		if(err) throw(err);
		res.json({ message: 'User deleted!'});
	});
});

module.exports = router;
