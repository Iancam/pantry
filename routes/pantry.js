<<<<<<< HEAD

/*
 * GET pantry listing.
 */

var app = require("../app");

exports.create = function(req,res) {
	// body...
}

exports.view = function(req, res){
  
};
=======
var models = require('../models.js');
var helpers = require('../helpers.js');

exports.home = function(req, res){
  res.render('home');
};

exports.create = function (req, res) {
  var name = req.param('name');

  var new_pantry = new models.Pantry({name: name});

  new_pantry.save(helpers.error);

  res.redirect('shopping_list/' + new_pantry._id);
}

exports.view = function (req, res) {
  var id = req.param('id');

  req.session.pantry_id = id;

  models.Pantry
  .findById(id)
  .populate('items')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    res.render('pantry', 
    {pantry: found_pantry, id:req.session.pantry_id});
  })
}

exports.create_item = function (req, res) {
  var name = req.param('name');
  var category = req.param('category');
  //TODO: add date

  var new_item = new models.Item({
    name: name,
    category: category
  })

  new_item.save(helpers.error);

  models.Pantry
  .findById(req.session.pantry_id, function (err, found_pantry) {
    if (err) helpers.error(err);

    found_pantry.items.push(new_item);
    found_pantry.save(helpers.error);
    res.redirect('pantry/' + req.session.pantry_id);
  })
}
>>>>>>> e66848ea7bc42e3e80615d19c85a1223d219493a
