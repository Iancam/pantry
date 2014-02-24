// user.js
var mongoose = require("mongoose");
var app = require("../app");
exports.new_user = function (req, res) {
	res.render("new_user");
};

exports.pantry = function (req, res) {
	var pid = req.user.pantry;
	res.redirect("/pantry/"+id+"/Name");
}

exports.logout = function (req, res) {
	req.session.user = null;
	
}