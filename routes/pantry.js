
var models = require('../models.js');
var helpers = require('../helpers.js');
var app  = require("../app");
var mongoose = require("mongoose");

exports.home = function(req, res){
  res.render('home');
};

exports.create = function (req, res) {
  console.log("Creating pantry");
  var name = req.param('name');
  var user = req.user;
  var new_pantry = new models.Pantry({
    name: name,
  });

  user.pantries.push(new_pantry);
  user.save(helpers.error);
  
  new_pantry.save(function (err, new_pantry) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      req.session.pantry_order = 'Name';
      res.redirect('pantry/' + new_pantry._id + '/Name');
    }
  });
  
}

function share_with (req, res, emails_list) {
  if (emails_list) {
    var pid = req.session.pantry_id;
    models.Pantry.findById(pid, function (err, found_pantry) {
      if (err) {helpers.error(err)};
      found_pantry.invited_emails.push.apply(found_pantry.invited_emails, emails_list);      
      found_pantry.save(helpers.error);
    });

    var emails = emails_list.map(function(val){return '<'+val+'>'});
    var text = "This Pantry has been shared with you: "+req.protocol+"://"+req.host+"/pantry/"+req.session.pantry_id+'/name'
     console.log(emails);
     console.log(text);
    app.server.send({
      text: text, 
      from:    "Pantry Founder <pantry.mailer@gmail.com>", 
      to:      emails.join(', '),
      // cc:      "else <else@gmail.com>",
      subject: "A Pantry Has Been Shared With You"
    }, function(err, message) { 
      console.log(err || message); 
      res.json(err || message);
    });
  }
  else {

  }
}

exports.share = function(req, res){
  var emails_list = req.body['emails'];

  share_with(req, res, emails_list);
};

exports.view = function (req, res) {

  if (typeof req.user === "undefined") {
    console.log("hi");
    res.redirect("/");
    return;
  }

  var id = req.param('id');
  var order = req.param('order');

  var next_pantry_order = get_next_pantry_order (order)

  req.session.pantry_id = id;
  req.session.pantry_order = order;

  var pantry_object_id = mongoose.Types.ObjectId(id);

  var in_pantry = false;
  for (var i = 0; i < req.user.pantries.length; i++) {
    if (pantry_object_id.equals(req.user.pantries[i])) {
      in_pantry = true;
      break;
    }
  }

  if (!in_pantry) {
    req.user.pantries.push(pantry_object_id);
    req.user.save(helpers.error);
  }

  models.Pantry
  .findById(id)
  .populate('items')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    var items = found_pantry.items;

    items.sort(function (item1, item2) {
      if (order === 'Name') {
        return item1.name.localeCompare(item2.name);
      } else {
        return item1.category.localeCompare(item2.category);
      } 
    })



    models.User 
    .findById(req.user._id)
    .populate('pantries')
    .exec(function (err, found_user) {
      if (err) helpers.error(err);

      res.render('pantry', 
      { on_pantry: true, /* For control highlighting */
        modal: true,
        pantry_name: found_pantry.name,
        id:req.session.pantry_id,
        user: req.found_user,
        my_pantries: found_user.pantries,
        items: items, 
        shopping_list_order: req.session.shopping_list_order,
        next_pantry_order: next_pantry_order,
        pantry_order: req.session.pantry_order
      });
    })

  })
}

exports.view_alt = function (req, res) {
  var id = req.param('id');
  var order = req.param('order');
  var next_pantry_order = get_next_pantry_order (order)

  req.session.pantry_id = id;
  req.session.pantry_order = order;

  models.Pantry
  .findById(id)
  .populate('items')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    var items = found_pantry.items;

    items.sort(function (item1, item2) {
      if (order === 'Name') {
        return item1.name.localeCompare(item2.name);
      } else {
        return item1.category.localeCompare(item2.category);
      } 
    })

    res.render('pantry', 
    { page: 'pantry',
      modal: true,
      pantry_name: found_pantry.name,
      user: req.user,
      items: items, 
      id:req.session.pantry_id,
      shopping_list_order: req.session.shopping_list_order,
      next_pantry_order: next_pantry_order,
      pantry_order: req.session.pantry_order,
      alt: true
    });
  })
}

function get_next_pantry_order (order) {
  if (order === 'Name') {
    return 'Category';
  } else {
    return 'Name';
  }
}

exports.create_item = function (req, res) {
  var name = req.param('name');
  var category = req.param('category');
  var expiration_string = req.param('expiration');
  var expiration = new Date(expiration_string);

  var new_item = new models.Item({
    name: name,
    category: category,
    expiration: expiration,
    expiration_string: expiration_string,
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

exports.remove = function (req, res) {
  var id = req.param('id');

  console.log(id);

  models.Item
  .findById(id)
  .remove(helpers.error);

  res.send();
}
