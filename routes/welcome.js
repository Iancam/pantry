exports.view = function (req, res) {
  var user = req.user;

  console.log(user.pantries.length);

  if (typeof user.pantries !== 'undefined' && user.pantries.length > 0){
    res.redirect("/pantry/" + user.pantries[0] + "/Name");
  } else{
    res.render("welcome");
  }
}