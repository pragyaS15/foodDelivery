var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/config');

router.post('/add', function(req, res) {

	msg = '';
	var new_cart = new Cart();
	new_cart.email = req.body.email;
	new_cart.quantity = req.body.quantity;
	new_cart.name = req.body.name;
	new_cart.category = req.body.category;
	new_cart.price = req.body.price;
	new_cart.ingredients = req.body.ingredients;
	new_cart.availability = req.body.availability;
	new_cart.image = req.body.image;
	//var d = new Date();
	new_cart.modifiedOn = new Date();

	new_cart.save(function(err) {
		if(err) throw(err);

		if(!err) msg = 'Added to cart';

		res.json({message: msg});
	});
});

router.get('/all', function(req, res) {
	let email = req.query.email;

	Cart.find({email: email}, function(err, items) {
		if(err) throw(err);

		res.json(items);
		console.log(items.length);
	});
});

router.delete('/:id', function(req, res) {
	Cart.remove({_id: req.params.id }, function(err, item) {
		if(err) throw(err);
		res.json({ message: 'Deleted from cart!' });
	});
});

router.delete('/all/:email', function(req, res) {
	Cart.deleteMany({email: req.params.email}, function(err) {
		if(err) throw(err);
		res.json({ message: 'Deleted all from cart! for ', req.params.email });
	});
});

router.post('/update', function(req, res) {

	Cart.findOne({_id: req.body._id }, function(err, item) {
		if(err) throw(err);

		item.name = req.body.name;
		item.email = req.body.email;
		item.quantity = req.body.quantity;
		item.category = req.body.category;
		item.price = req.body.price;
		item.ingredients = req.body.ingredients;
		item.availability = req.body.availability;
		item.image = req.body.image;
		//var d = new Date();
		item.modifiedOn = new Date();

		var msg = '';

		item.save(function(err) {
			if(err) throw(err);

			if(!err) msg = 'Added to cart';

			res.json({message: msg});
		});

	});
});


module.exports = router;