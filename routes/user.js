// user.js
var mongoose = require("mongoose");
var app = require("../app");
var models = require("../models");
var helpers = require('../helpers');
exports.new_user = function (req, res) {
	res.render("new_user");
};

exports.pantry = function (req, res) {
	console.log(req.user);
	// var pid = req.user.pantry;
	// if (pid) {
		// res.redirect("/pantry/"+pid+"/Name");
	// }
	// else {
		res.redirect("/");
	// }
}

exports.myPantries = function (req, res) {
	console.log(req);
	models.Pantry.find({'users': req.user._id})
	.sort('name')
	.exec(function (err, found_pantries) {
		if (err) helpers.error(err);
		res.render('pantries', 
			{user: req.user,
			 pantries: found_pantries});
	});
}

exports.logout = function (req, res) {
	
}