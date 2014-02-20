
/**
 * Module dependencies.
 */

var express = require('express'),
routes = require("./routes"),
handlebars = require('express3-handlebars'),
mailer = require('express-mailer'),
mongoose = require("mongoose"),
http = require('http'),
path = require('path'),
handlebars = require('express3-handlebars')
mongoose = require('mongoose'),

share = require('./routes/share')
pantry = require('./routes/pantry'),
shopping_list = require('./routes/shopping_list'),

/* Connect to MongoDB */
local_database_name = 'pantry',
local_database_uri  = 'mongodb://localhost/' + local_database_name,
database_uri = process.env.MONGOLAB_URI || local_database_uri,
mongoose.connect(database_uri);

var app = express();

/* Setup sessions */
app.use(express.cookieParser());
app.use(express.session({secret: 'pantry'}));

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

// mailer
mailer.extend(app, {
  from: 'pantry.mailer@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'pantry.mailer@gmail.com',
    pass: 'pantrypass'
  }
});

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

// mailer.send('../views/share_email', {
// 	to: "kleptocrat@gmail.com", // REQUIRED. This can be a comma delimited string just like a normal email to field. 
// 	subject: 'A Pantry Has Been Shared With You!', // REQUIRED.
// 	otherProperty: {url:"200"} // All additional properties are also passed to the template as local variables.
// 	}, function (err) {
// 	if (err) {
// 	// handle error
// 		console.log(err);
// 		res.send('There was an error sending the email');
// 		return;
// 	}
// 	res.send('Email Sent');
// 	});

/* Routes */
app.get('/', pantry.home);
app.post('/create_pantry', pantry.create);
app.get('/pantry/:id', pantry.view);
app.get('/shopping_list/:id', shopping_list.view);
app.post('/create_request', shopping_list.create_request);
app.post('/create_item', pantry.create_item);
app.post('/like', shopping_list.like);
app.post('/share', share.share);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
