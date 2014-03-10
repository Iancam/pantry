var models = require("../models");
var helpers = require("../helpers");

exports.welcome = function (req, res) {

  if (typeof req.user === "undefined") {
    res.redirect("/");
    return;
  }

  var id = req.param("id");

  models.User
  .findById (req.user._id)
  .populate ("pantries")
  .exec (function (err, found_user) {
    if (err) helpers.error (err);

    res.render ("recipe_welcome", 
    {
      on_recipe: true,
      id: id,
      my_pantries: found_user.pantries,
      shopping_list_order: req.session.shopping_list_order,
      pantry_order: req.session.pantry_order
    });
  })

}

exports.view_chefs_choice = function (req, res) {

  if (typeof req.user === "undefined") {
    res.redirect("/");
    return;
  }

  var id = req.session.pantry_id;

  models.User
  .findById (req.user._id)
  .populate ("pantries")
  .exec (function (err, found_user) {
    if (err) helpers.error (err);

    res.render ("chefs_choice", 
    {
      on_recipe: true,
      id: id,
      my_pantries: found_user.pantries,
      shopping_list_order: req.session.shopping_list_order,
      pantry_order: req.session.pantry_order
    });
  })
}

/* Returns a random Yummly query string formed from ingredients in the 
   pantry */
exports.random = function (req, res) {

  var id = req.session.pantry_id;

  models.Pantry
  .findById (id)
  .populate ("items")
  .exec (function (err, found_pantry) {
    var items = found_pantry.items;

    /* Shuffle the array */
    items.sort (function (item1, item2) {
      return (0.5 - Math.random());
    })

    /* Select at most 2 random items to include in the recipe. */
    var nItems = (items.length > 2) ? 2 : items.length;

    helpers.yummly_id_key (function (id, key) {
      var query = "http://api.yummly.com/v1/api/recipes?_app_id=" +
                  id + "&_app_key=" + key;
      for (var i = 0; i < nItems; i++) {
        query = query.concat ("&allowedIngredient[]="
                              + items[i].name.toLowerCase());
      }

      res.send (query);
    })

  })

}