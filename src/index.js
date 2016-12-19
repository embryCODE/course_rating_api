'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes');
var mongoose = require('mongoose');
var seeder = require('mongoose-seeder');
var seedData = require('./data/data.json');

mongoose.connect('mongodb://localhost:27017/courseRatingDatabase');
var db = mongoose.connection;

// write db connection error to console
db.on('error', function(err) {
  console.error('connection error: ', err);
});

// seed db and log success message. if error, write it to console
// NOTE: Uncomment this code to seed the database.
db.on('open', function() {
  seeder.seed(seedData, { dropDatabase: true})
    .then(function() {
      console.log('connection to database successful');
    })
    .catch(function(err) {
      console.error('database seed error: ', err);
    });
});

// morgan gives us http request logging
app.use(morgan('dev'));

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// mount a router on /api and use routes.js for all routes
app.use('/api', routes);

// if a request makes it this far without a response, create a 404 error
// and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler sends error as json
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
