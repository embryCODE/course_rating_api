'use strict';

var auth = require('basic-auth');
var models = require('../models');
var bcrypt = require('bcrypt');

function checkAuthorization(req, res, next) {

  // If authorization headers are found, continue.
  if (auth(req)) {
    // Store credentials from authorization header.
    var credentials = auth(req);

    // Match email from credentials with database.
    models.User.findOne({
      emailAddress: credentials.name
    }, function(err, user) {

      // Handle db error
      if (err) {
        return next(err);

        // If user not found, throw 401 error.
      } else if (!user) {
        var error = new Error('User not found.');
        error.status = 401;
        return next(error);

        // Use bcrypt to compare password from credentials with password from db.
      } else {
        // User is added to request object as req.user
        req.user = user;

        // Password check.
        bcrypt.compare(credentials.pass, user.password, function(error, result) {

          // If passwords match, continue.
          if (result === true) {
            return next();

            // If passwords don't match, throw 401 error.
          } else {
            return res.status(401).send();
          }
        });
      }
    });

    // Throw 401 error if no authorization headers are found.
  } else {
    var err = new Error('Sorry, you must be authorized to perform that action.');
    err.status = 401;
    return next(err);
  }
}

module.exports.checkAuthorization = checkAuthorization;
