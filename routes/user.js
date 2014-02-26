// user.js
var mongoose = require("mongoose");
var app = require("../app");
var models = require("../models");
var helpers = require('../helpers');

exports.new_user = function (req, res) {
  res.redirect("/my_pantries");
};

exports.myPantries = function (req, res) {
  
  models.Pantry.find({'users': req.user._id})
  .sort('name')
  .exec(function (err, found_pantries) {
    if (err) helpers.error(err);
    models.Pantry.find({'invited_emails': req.user.email}, function (err, shared_pantries){

      res.render('pantries', 
      {user: req.user,
       pantries: found_pantries,
       invited_to: shared_pantries
      });
    });
  });
}


