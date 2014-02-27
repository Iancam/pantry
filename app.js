
/**
 * Module dependencies.
 */

var express = require('express'),
// routes = require("./routes"),
handlebars = require('express3-handlebars'),
http = require('http'),
path = require('path'),
handlebars = require('express3-handlebars'),
email = require('emailjs/email'),
mongoose = require("mongoose"),
models = require("./models"),
user = require('./routes/user'),
// share = require('./routes/share'),
pantry = require('./routes/pantry'),
shopping_list = require('./routes/shopping_list'),
passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;

/* Connect to MongoDB */
local_database_name = 'pantry',
local_database_uri  = 'mongodb://localhost/' + local_database_name,
database_uri = process.env.MONGOLAB_URI || local_database_uri,
mongoose.connect(database_uri);

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.bodyParser());
/* Setup sessions */
app.use(express.cookieParser());
app.use(express.session({secret: 'pantry'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function (req, res) {
	res.redirect("/");
})

// email
var server = email.server.connect({ 
   user:    "pantry.mailer@gmail.com", 
   password:"pantrypass", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

//passport

passport.use(new FacebookStrategy({
		clientID: "220032974854303",
		clientSecret: "3f3ca3266c18ee0911a845526023b593",
		callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
		// callbackURL: "http://safe-anchorage-2842.herokuapp.com/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		var newUser = {fid: profile.id,
			email: profile.emails[0].value,
			lastname: profile.name.familyName,
			firstname: profile.name.givenName};

		models.User.findOrCreate(newUser, function(err, user){
			if (err) {return done(err); }
			done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

//database
function init_mongoose () {
	// Here we find an appropriate database to connect to, defaulting to
	// localhost if we don't find one.  
	var uristring = 
	  process.env.MONGOLAB_URI || 
	  process.env.MONGOHQ_URL  || 
	  'mongodb://localhost/test';
	
	// The http server will listen to an appropriate port, or default to
	// port 5000.
	var theport = process.env.PORT || 5000;
	
	// Makes connection asynchronously.  Mongoose will queue up database
	// operations and release them when the connection is complete.
	mongoose.connect(uristring, function (err, res) {
	  if (err) { 
	    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	  } else {
	    console.log ('Succeeded connected to: ' + uristring);
	  }
	});
};


/* Routes */
app.get('/', pantry.home);
app.post('/create_pantry', pantry.create);
app.get('/pantry/:id/:order', pantry.view);
app.get('/pantry/:id/', function (req, res) {
	// Make name the order if there isn't one.
	var id = req.param('id');
	res.redirect('/pantry/' + id + '/name');
})
app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));
app.get('/auth/facebook/callback', 
	passport.authenticate('facebook', {successRedirect: '/my_pantries',
									   failureRedirect: '/login'}));
app.get('/shopping_list/:id/:order', shopping_list.view);
app.get('/shopping_list/:id/', function (req, res) {
	// Make name the order if there isn't one.
	var id = req.param('id');
	res.redirect('/shopping_list/' + id + '/name');
});
app.post('/create_request', shopping_list.create_request);
app.post('/create_item', pantry.create_item);
app.post('/like', shopping_list.like);
app.post('/share', pantry.share);
app.post('/share/:pid', pantry.share);
app.get('/logout', function(req, res) {req.logout(); res.redirect('/');});
app.get("/my_pantries", user.myPantries)
app.post("/remove_item", pantry.remove);
app.post("/remove_request", shopping_list.remove);
app.post("/to_pantry", shopping_list.to_pantry);

exports.server = server;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
