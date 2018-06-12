var express = require('express');
var router = express.Router();
var Food = require('../models/food');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/config'); // get our config file

router.post('/register', function(req, res) {
	console.dir(req);
	
	msg = '';
	var new_food = new Food();
	new_food.name = req.body.name;
	new_food.category = req.body.category;
	new_food.price = req.body.price;
	new_food.ingredients = req.body.ingredients;
	new_food.availability = req.body.availability;

	new_food.save(function(err) {
		if(err) throw(err);

		if(!err) msg = 'Product created';

		res.json({message: msg});
	});

});

router.get('/products', function(req, res) {
	Food.find(function(err, foods) {
		if(err) throw(err);
		res.json(foods);
		console.log(foods.length);
	});
});


module.exports = router;