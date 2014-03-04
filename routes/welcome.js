exports.view = function (req, res) {

  console.log("welcome");

  if (typeof req.user === "undefined") {
    res.redirect("/");
    return;
  }

  var user = req.user;

  if (typeof user.pantries !== 'undefined' && user.pantries.length > 0){
    res.redirect("/pantry/" + user.pantries[0] + "/Name");
  } else{
    res.render("welcome");
  }
}