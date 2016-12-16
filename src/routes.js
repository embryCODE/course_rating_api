'use strict';

var express = require('express');
var router = express.Router();
var models = require('./models');

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/courses', function(req, res, next) {
  models.Course.find()
    .populate('reviews')
    .populate('user')
    .exec(function(error, results) {
      if (error) {
        return next(error);
      }
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
      if (error) {
        return next(error);
      }
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
  models.Course.findOneAndUpdate({
    _id: req.params.id
  }, req.body, function(err, results) {
    if (err) {
      return formatValidationErrors(err, req, res, next);
    } else {
      res.status(204);
      res.end();
    }
  });
});

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', function(req, res, next) {
  models.User.find()
    .exec(function(error, results) {
      if (error) {
        return next(error);
      }
      res.json({
        data: results
      });
    });
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', function(req, res, next) {
  var user = new models.User(req.body);
  user.save(function(err) {
    if (err) {
      return formatValidationErrors(err, req, res, next);
    } else {
      res.status(201);
      res.location('/');
      // Be sure to check that passwords match before saving the password to hashedPassword
      res.end();
    }
  });
});

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', function(req, res, next) {

  // get the course by ID and return the reviews only
  models.Course.findById(req.params.courseId, 'reviews')
    .exec(function(error, results) {
      if (error) {
        return next(error);
      }

      // create a new review to be appended to the reviews of this course
      var review = new models.Review(req.body);

      // assign the user id from the authenticated user's id
      review.user = req.user._id;

      // add the new review to the course's reviews array, then save the course
      results.reviews.push(review);
      results.save(function(error) {
        if (error) {
          return next(error);
        }
      });

      // also save the new review
      review.save(function(err, results) {
        if (err) {
          return formatValidationErrors(err, req, res, next);
        } else {
          res.status(201);
          res.location('/courses/' + req.params.courseId);
          res.end();
        }
      });
    });
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', function(req, res, next) {
  models.Review.findByIdAndRemove(req.params.id, function(err, response) {
    if (err) {
      return next(err);
    }
    res.status(204);
    res.end();
  });
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
    return next(err);
  }
}

module.exports = router;
