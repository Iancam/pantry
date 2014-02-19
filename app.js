
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');

var pantry = require('./routes/pantry');
var shopping_list = require('./routes/shopping_list');

/* Connect to MongoDB */
var local_database_name = 'pantry';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Routes */
app.get('/', pantry.home);
app.post('/create_pantry', pantry.create);
app.get('/pantry/:id', pantry.view);
app.get('/shopping_list/:id', shopping_list.view);
app.post('/create_request', shopping_list.create_request);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
