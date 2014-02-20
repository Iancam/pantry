
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require("./routes");
var pantry = require("./routes/pantry")
var requests = require("./routes/requests")

var http = require('http');
var path = require('path');

var handlebars = require('express3-handlebars');
var mongoose = require("mongoose");

// Example route
// var user = require('./routes/user');


var app = express();

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
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function (req, res) {
	res.redirect("/");
})

// Add routes here
// app.get('/', index.view);

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
function define_schemas () {
	var Schema = mongoose.Schema;

	var pantry_schema = Schema({
		// url: {type: String, required: true, unique: true},
		pantry_items: [{type: Schema.Types.ObjectId, ref: "Item_Pantry"}],
	});

	var shopping_list_schema = Schema({
		requested_items: [{type: Schema.Types.ObjectId, ref: "Item_Requested"}]
	});

	var item_pantry_schema = Schema({
		name:{type: String, required: true, unique: true},
		category: String,
		percent_left: {type:Number, required: true},
		amount_left: Number,
		second_added: Number,
		
	});

	var item_requested_schema = Schema({
		name: {type: String, required: true, unique: true},
		wants: Number,
		second_added: Number,
		score: Number
	})
	
	var Item_Requested = mongoose.model("Item_Requested", item_requested_schema);
	var Item_Pantry = mongoose.model("Item_Requested", item_pantry_schema);
	var Pantry = mongoose.model("Pantry", pantry_schema);;
	var Shopping_List= mongoose.model("Shopping_List", shopping_list_schema);

	exports.Item_Requested_Model = Item_Requested;
	exports.Item_Pantry_Model = Item_Pantry;
	exports.Pantry_Model = Pantry;
	exports.Shopping_List_Model = Shopping_List;
};

define_routes = function () {
	app.get("/", routes.index);
	app.get("/:id", pantry.view);
	app.get("requests/:id", requests.view);
	app.post("/")
	// app.post("/create_need", feed.create);
	// app.post("/create_story", story.create);
	// app.get("/upvote/:id", story.upvote);
	// app.get("/unvote/:id", story.unvote);
	// app.get("/new_user", user.new_user);
	// app.post("/edit_story", story.edit)
	// app.get("/search/:query", story.search);
	// app.post("/login", user.login);
	// app.post("/create_user", user.create_user);
	// app.get("/logout", user.logout);
	// app.get("/following", user.following);
	// app.get("/follow/:id", user.follow);
	// app.get("/unfollow/:id", user.unfollow);
	// app.get("/feed/:id", feed.view);
	// app.get("/story/:id", story.view);
	// app.get("/login", login.view);
};



init_mongoose();
define_routes();



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
