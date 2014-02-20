
var models = require('../models.js');
var helpers = require('../helpers.js');

exports.home = function(req, res){
  res.render('home');
};

exports.create = function (req, res) {
  var name = req.param('name');

  var new_pantry = new models.Pantry({name: name});

  new_pantry.save(function (err, new_pantry) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      req.session.pantry_order = 'Name';

      res.redirect('shopping_list/' + new_pantry._id + '/Name');
    }
  })
}

exports.view = function (req, res) {
  var id = req.param('id');
  var order = req.param('order');
  req.session.pantry_id = id;
  req.session.pantry_order = order;

  models.Pantry
  .findById(id)
  .populate('items')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    found_pantry.items.sort(function (item1, item2) {
      if (order === 'Name') {
        console.log(item1.name);
        return item1.name.localeCompare(item2.name);
      } else if (order === 'Category') {
        return item1.category.localeCompare(item2.category);
      } else {
        return item2.date - item1.date;
      }
    })

    res.render('pantry', 
    {items:found_pantry.items, 
     id:req.session.pantry_id,
     shopping_list_order: req.session.shopping_list_order,
     pantry_order: req.session.pantry_order});
  })
}

exports.create_item = function (req, res) {
  var name = req.param('name');
  var category = req.param('category');
  var date = new Date(req.param('date'));
  console.log ("date = " + date);
  //TODO: add date

  var new_item = new models.Item({
    name: name,
    category: category,
    expiration: date
  })

  new_item.save(helpers.error);

  models.Pantry
  .findById(req.session.pantry_id, function (err, found_pantry) {
    if (err) helpers.error(err);

    found_pantry.items.push(new_item);
    found_pantry.save(helpers.error);
    res.redirect('pantry/'
                 + req.session.pantry_id + '/'
                 + req.session.pantry_order);
  })
}

exports.new_item = function (req, res) {
  res.render('new_item', 
  {id: req.session.pantry_id,
   shopping_list_order: req.session.shopping_list_order,
   pantry_order: req.session.pantry_order});
}

