var models = require("../models");
var helpers = require("../helpers");
var request = require("request");

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

/* Returns a random Yummly recipe based off the ingredients in the pantry. */
exports.chefs_choice = function (req, res) {

  if (typeof req.user === "undefined") {
    res.redirect("/");
    return;
  }

  var pantry_id = req.param("id");
  var n_items = req.param("n_items");

  console.log(n_items);


  models.Pantry
  .findById (pantry_id)
  .populate ("items")
  .exec (function (err, found_pantry) {
    var items = found_pantry.items;

    /* Shuffle the array */
    items.sort (function (item1, item2) {
      return (0.5 - Math.random());
    })

    /* Select at most 4 random items to include in the recipe. */
    if (items.length < n_items) {
      n_items = items.length;
      console.log (n_items);
    }

    helpers.yummly_id_key (function (id, key) {
      var search_query = "http://api.yummly.com/v1/api/recipes?_app_id=" +
                  id + "&_app_key=" + key;
      for (var i = 0; i < n_items; i++) {
        search_query = search_query.concat ("&allowedIngredient[]="
                              + items[i].name.toLowerCase());
      }

      console.log(search_query);

      request(search_query, function(error, response, body) {
        var yummly_search_res = JSON.parse(body);

        if (yummly_search_res.matches.length == 0) {
          res.redirect("/chefs_choice?id=" + pantry_id 
                       + "&n_items=" + n_items - 1);
          console.log ("Retry.");
          return;
        }
        
        var random_idx = Math.floor(Math.random() * yummly_search_res.matches.length);
        var recipe_id = yummly_search_res.matches[random_idx].id;
        var get_query = "http://api.yummly.com/v1/api/recipe/"
                        + recipe_id + "?_app_id=" + id + "&_app_key=" + key;

        request(get_query, function (err, response, body) {
          var yummly_get_res = JSON.parse(body);

          models.User
          .findById (req.user._id)
          .populate ("pantries")
          .exec (function (err, found_user) {

            if (err) helpers.error (err);
            res.render ("recipe_view", 
            {
              on_recipe: true,
              id: pantry_id,
              pantry_name: found_pantry.name,
              my_pantries: found_user.pantries,
              shopping_list_order: req.session.shopping_list_order,
              pantry_order: req.session.pantry_order,
              yummly_res: yummly_get_res
            });
          })
        })
      }); 
    })
  })
}