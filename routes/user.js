// user.js
var mongoose = require("mongoose");
var app = require("../app");
var models = require("../models");
var helpers = require('../helpers');
var _ = require('underscore');
exports.new_user = function (req, res) {
  res.redirect("/my_pantries");
};

function update_users (req, res) {
  models.Pantry.find({'invited_emails': req.user.email}, function(err, found_pantries) {
    _.each(found_pantries, function(pantry, index, list) {
      var add_user = true;
      _.all(pantry.users, function(user, index, list) {
        if (user.equals(req.user._id)) {
          add_user = false;
          return false;
        }
      });
      if (add_user) {
        pantry.users.push(req.user._id);
      };
      var ei = pantry.invited_emails.indexOf(req.user.email);
      pantry.invited_emails.splice(ei, 1);
      pantry.save(helpers.error);
    });
  });
}

exports.myPantries = function (req, res) {
	update_users(req, res);


  models.Pantry.find({'users': req.user._id})
  .sort('name')
  .populate('users')
  .exec(function (err, found_pantries) {
    if (err) helpers.error(err);
    res.render('pantries', 
    { page: 'pantries',
      user: req.user,
      pantries: found_pantries});
  });
}


