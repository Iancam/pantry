exports.view = function (req, res) {

  console.log("welcome");

  if (typeof req.user === "undefined") {
    res.redirect("/");
    return;
  }

  var user = req.user;
  req.session.pantry_order = "Name";
  req.session.shopping_list_order = "Name";

  if (typeof user.pantries !== 'undefined' && user.pantries.length > 0){
    res.redirect("/pantry?id=" + user.pantries[0] + "&order=Name");
  } else{
    res.render("welcome");
  }
}