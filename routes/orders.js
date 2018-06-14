var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/config');

router.post('/add', function(req, res) {

	msg = '';
	var new_order = new Order();
	new_order.email = req.body.email;
	new_order.name = req.body.name;
	new_order.total_price = req.body.total;

	new_order.address.street = req.body.address.street;
	new_order.address.locality = req.body.address.locality;
	new_order.address.city = req.body.address.city;
	new_order.address.pincode = req.body.address.pincode;
	new_order.address.state = req.body.address.state;
	new_order.address.country = req.body.address.country;

	new_order.products = req.body.products;

	new_order.modifiedOn = new Date();

	new_order.status = 'Active';

	new_order.save(function(err) {
		if(err) throw(err);

		if(!err) msg = 'Order Confirmed';

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

module.exports = router;