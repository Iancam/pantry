var models = require('../models.js');
var helpers = require('../helpers.js');

exports.view = function (req, res) {
  var id = req.param('id');

  req.session.pantry_id = id;

  models.Pantry
  .findById(id) 
  .populate('requests')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    res.render('shopping_list', 
    {pantry: found_pantry, id:req.session.pantry_id});
  })
}

exports.create_request = function (req, res) {
  var name = req.param('name');
  var category = req.param('category');

  var new_request = new models.Request({
    name: name,
    category: category,
    likes: 0
  });


  new_request.save(helpers.error);

  models.Pantry
  .findById(req.session.pantry_id, function (err, found_pantry) {
    if (err) helpers.error(err);

    console.log(found_pantry);

    found_pantry.requests.push(new_request);
    found_pantry.save(helpers.error);
    res.redirect('shopping_list/' + req.session.pantry_id);
  })

}

exports.like = function (req, res) {
  var id = req.param('id');
  
  models.Request
  .findById(id, function (err, found_request) {
    if (err) helpers.error(err);

    found_request.likes++;
    found_request.save(helpers.error);
    res.send({'likes': found_request.likes});
  })
}