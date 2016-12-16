'use strict';

var express = require('express');
var router = express.Router();
var models = require('./models');

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/courses', function(req, res, next) {
  models.Course.find()
    .exec(function(error, results) {
      res.json({
        data: results
      });
    });
});

// GET /api/courses/:id 200 - Returns all Course properties and related documents for the provided course ID
router.get('/courses/:id', function(req, res, next) {
  models.Course.findById(req.params.id)
    .populate('reviews')
    .populate('user')
    .exec(function(error, results) {
      res.json({
        data: [results]
      });
    });
});

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses', function(req, res, next) {

  var course = new models.Course(req.body);
  course.save(function(err) {
    if (err) {
      return formatValidationErrors(err, req, res, next);
    } else {
      res.status(201);
      res.location('/courses');
      res.end();
    }
  });
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', function(req, res, next) {
  if (err) {
    return formatValidationErrors(err, req, res, next);
  } else {
    res.status(204);
    res.send('This is the route for updating a course.');
  }
});

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', function(req, res, next) {
  res.send('This is the route for returning the currently authenticated user.');
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', function(req, res, next) {
  if (err) {
    return formatValidationErrors(err, req, res, next);
  } else {
    res.status(201);
    res.location('/');
    // Be sure to check that passwords match before saving the password to hashedPassword
    res.send('This is the route for creating a user.');
  }
});

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', function(req, res, next) {
  if (err) {
    return formatValidationErrors(err, req, res, next);
  } else {
    res.status(201);
    res.location('/courses/' + req.params.courseId);
    res.send('This is the route for creating a review for the specified course.');
  }
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', function(req, res, next) {
  res.status(204);
  res.send('This is the route for deleting the specified review.');
});

// function to handle formatting of validation errors for angular app
function formatValidationErrors(err, req, res, next) {
  if (err.name === 'ValidationError') {
    res.status(400);
    var formattedError = {
      message: "Validation Failed",
      errors: {}
    };
    for (var i in err.errors) {
      formattedError.errors[i] = [{
        code: 400,
        message: err.errors[i].message
      }];
    }
    return res.json(formattedError);
  } else {
    res.send('there was a different kind of error');
    return next(err);
  }
}

module.exports = router;
