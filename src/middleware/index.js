'use strict';

var auth = require('basic-auth');
var models = require('../models');
var bcrypt = require('bcrypt');

function checkAuthorization(req, res, next) {
  if (auth(req)) {
    var credentials = auth(req);
    models.User.findOne({
      emailAddress: credentials.name
    }, function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        var error = new Error('User not found.');
        error.status = 401;
        return next(error);
      } else {
        bcrypt.compare(credentials.pass, user.password, function(error, result) {
          if (result === true) {

            // user is authenticated and added to request object as req.user
            req.user = user;
            return next();
          } else {
            return res.status(401).send();
          }
        });
      }
    });
  } else {
    var err = new Error('Sorry, you must be authorized to perform that action.');
    err.status = 401;
    return next(err);
  }
}

module.exports.checkAuthorization = checkAuthorization;
