var models = require("../models.js");
var helpers = require("../helpers.js");
var app  = require("../app");
var mongoose = require("mongoose");

exports.home = function(req, res){
  res.render("home");
};

exports.create = function (req, res) {
  var name = req.param("name");
  var user = req.user;
  var new_pantry = new models.Pantry({
    name: name,
  });

  user.pantries.push(new_pantry);
  user.save(helpers.error);
  
  new_pantry.save(function (err, new_pantry) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      req.session.pantry_order = "Name";
      res.redirect("pantry?id=" + new_pantry._id + "&order=Name");
    }
  });
  
}

exports.view = function (req, res) {

  if (typeof req.user === "undefined") {
    console.log("hi");
    res.redirect("/");
    return;
  }

  var id = req.param("id");
  var order = req.param("order");

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
  .populate("items")
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    var items = found_pantry.items;

    console.log(order);

    items.sort(function (item1, item2) {
      if (order === "Name") {
        return item1.name.toLowerCase().localeCompare(item2.name.toLowerCase());
      } else if (order === "Category") {
        return item1.category.localeCompare(item2.category);
      } else {

        if (typeof item1.expiration === "undefined") {
          return 1;
        } else if (typeof item2.expiration === "undefined") {
          return -1;
        }

        var date1 = new Date(item1.expiration);
        var date2 = new Date(item2.expiration);
        return date1.valueOf() - date2.valueOf();
      }
    })

    models.User 
    .findById(req.user._id)
    .populate("pantries")
    .exec(function (err, found_user) {
      if (err) helpers.error(err);

      res.render("pantry", 
      { alt: false,
        on_pantry: true, /* For control highlighting */
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

exports.remove = function (req, res) {
  var id = req.param("id");

  console.log(id);

  models.Item
  .findById(id)
  .remove(helpers.error);

  res.send();
}
