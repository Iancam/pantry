
/**
 * Module dependencies.
 */

var express = require("express"),
handlebars = require("express3-handlebars"),
http = require("http"),
path = require("path"),
handlebars = require("express3-handlebars"),
email = require("emailjs/email"),
mongoose = require("mongoose"),
models = require("./models"),
welcome = require("./routes/welcome.js"),
user = require("./routes/user"),
pantry = require("./routes/pantry"),
shopping_list = require("./routes/shopping_list"),
passport = require("passport"),
FacebookStrategy = require("passport-facebook").Strategy;

/* Connect to MongoDB */
local_database_name = "pantry",
local_database_uri  = "mongodb://localhost/" + local_database_name,
database_uri = process.env.MONGOLAB_URI || local_database_uri,
mongoose.connect(database_uri, function (database_uri, err) {
  if (err) {
    res.send(err);
  }
});

var app = express();

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("Intro HCI secret key"));
app.use(express.bodyParser());
/* Setup sessions */
app.use(express.cookieParser());
app.use(express.session({secret: "pantry"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, "/public")));
// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.use(function (req, res) {
	res.redirect("/");
})

//passport

passport.use(new FacebookStrategy({
		clientID: "220032974854303",
    clientSecret: "3f3ca3266c18ee0911a845526023b593",
		callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
		callbackURL: "http://safe-anchorage-2842.herokuapp.com/auth/facebook/callback"
	},

	function(accessToken, refreshToken, profile, callback) {

    models.User
    .find({fid: profile.id}, function (err, found_users) {
      if (err) helpers.error(err);

      console.log("length: " + found_users.length);
      if (found_users.length == 0) {
        console.log("Creating new user.");
        var newUser = new models.User({
          fid: profile.id,
          email: profile.emails[0].value,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName
        });

        newUser.save(function (err, new_user) {
          if (err) helpers.error(err);
          callback(null, new_user);
        })
      } else {
        callback(null, found_users[0]);
      }
    })
	}
));

passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  models.User.findById(id, function(err, user) {
    callback(err, user);
  });
});

/* Routes */
app.get("/", pantry.home);

app.get("/auth/facebook", passport.authenticate("facebook", { scope: [ "email" ] }));
app.get("/auth/facebook/callback", 
	passport.authenticate("facebook", {successRedirect: "/welcome",
									   failureRedirect: "/login"}));

app.get("/welcome", welcome.view);
app.post("/create_pantry", pantry.create);

app.get("/pantry", pantry.view);

app.get("/shopping_list", shopping_list.view);
// app.get("/shopping_list/alt", shopping_list.view_alt);

app.post("/create_request", shopping_list.create_request);
app.post("/create_item", pantry.create_item);

app.post("/like", shopping_list.like);
app.get("/logout", function(req, res) {req.logout(); res.redirect("/");});
app.post("/remove_item", pantry.remove);
app.post("/remove_request", shopping_list.remove);
app.post("/to_pantry", shopping_list.to_pantry);

http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
