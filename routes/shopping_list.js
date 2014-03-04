var models = require('../models.js');
var helpers = require('../helpers.js');

exports.view = function (req, res) {

  if (typeof req.user === "undefined") {
    res.redirect("/");
    return;
  }

  var id = req.param('id');
  var order = req.param('order');
  var next_shopping_list_order = get_next_shopping_list_order (order)


  req.session.pantry_id = id;
  req.session.shopping_list_order = order;

  models.Pantry
  .findById(id) 
  .populate('requests')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    found_pantry.requests.sort(function (req1, req2) {
      if (order === 'Name') {
        return req1.name.localeCompare(req2.name);
      } else if (order === 'Category') {
        return req1.category.localeCompare(req2.category);
      } else {
        return req2.likes - req1.likes;
      }
    })

    models.User
    .findById(req.user._id)
    .populate("pantries")
    .exec(function (err, found_user) {
      res.render('shopping_list',
      { on_pantry: false,
        modal: true,
        pantry_name: found_pantry.name,
        user: req.user,
        my_pantries: found_user.pantries,
        requests: found_pantry.requests,
        id: req.session.pantry_id,
        shopping_list_order: req.session.shopping_list_order,
        next_shopping_list_order: next_shopping_list_order,
        pantry_order: req.session.pantry_order
     });
    })
  })
}

exports.view_alt = function (req, res) {
  var id = req.param('id');
  var order = req.param('order');
  var next_shopping_list_order = get_next_shopping_list_order (order)


  req.session.pantry_id = id;
  req.session.shopping_list_order = order;

  models.Pantry
  .findById(id) 
  .populate('requests')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    found_pantry.requests.sort(function (req1, req2) {
      if (order === 'Name') {
        return req1.name.localeCompare(req2.name);
      } else if (order === 'Category') {
        return req1.category.localeCompare(req2.category);
      } else {
        return req2.likes - req1.likes;
      }
    })

    res.render('shopping_list',
    { page: "shopping_list",
      modal: true,
      pantry_name: found_pantry.name,
      user: req.user,
      requests: found_pantry.requests,
      id: req.session.pantry_id,
      shopping_list_order: req.session.shopping_list_order,
      next_shopping_list_order: next_shopping_list_order,
      pantry_order: req.session.pantry_order,
      alt: true
   });
  })
}

function get_next_shopping_list_order (order) {
  if (order === 'Name') {
    return 'Category';
  } else if (order === 'Category') {
    return 'Likes';
  } else {
    return 'Name';
  }
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
    res.redirect('shopping_list/' 
                  + req.session.pantry_id + '/'
                  + req.session.shopping_list_order);
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

exports.remove = function (req, res) {
  var id = req.param('id');

  models.Request
  .findById(id)
  .remove(helpers.error);

  res.send();
}

exports.to_pantry = function (req, res) {
  var id = req.param('id');

  console.log ('id = ' + id);

  models.Request
  .findById(id, function (err, found_request){
    var name = found_request.name;
    var category = found_request.category;

    found_request.remove(helpers.error);

    var new_item = new models.Item({name: name, category: category});
    new_item.save(helpers.error);

    models.Pantry
    .findById(req.session.pantry_id, function (err, found_pantry) {
      found_pantry.items.push(new_item);
      found_pantry.save(helpers.error);
    })
  })

  res.send();
}
