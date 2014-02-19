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
  .findById(id, function (err, found_pantry) {

    if (err) helpers.error(err, found_pantry);

    res.render('pantry', {pantry: found_pantry});
  })
}