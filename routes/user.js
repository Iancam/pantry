// user.js
var mongoose = require("mongoose");
var app = require("../app");
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

exports.logout = function (req, res) {
	req.session.user = null;
	
}