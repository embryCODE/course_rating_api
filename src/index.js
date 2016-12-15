'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var routes = require('./routes');

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// use routes.js for all routes, mounted on /api
app.use('/api', routes);

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
