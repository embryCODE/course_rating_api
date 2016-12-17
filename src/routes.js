'use strict';

var express = require('express');
var router = express.Router();
var models = require('./models');
var mid = require('./middleware');
var fve = require('./formatValidationErrors');

/* GET /api/courses 200
Returns the Course "_id" and "title" properties */
router.get('/courses', function(req, res, next) {
  models.Course.find({} /*,  '_id title' */ )
    .populate('user')
    .populate('reviews')
    .exec(function(error, results) {
      if (error) {
        return next(error);
      }
      res.json({
        data: results
      });
    });
});

/* GET /api/courses/:id 200
Returns all Course properties and related documents for the provided course ID */
router.get('/courses/:id', function(req, res, next) {
  models.Course.findById(req.params.id)

  // Populate the reviews and user field.
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

/* POST /api/courses 201
Creates a course, sets the Location header, and returns no content */
router.post('/courses', mid.checkAuthorization, function(req, res, next) {

  /* NOTE: Authorized user must be present in order to create a course. */

  var course = new models.Course(req.body);

  // Set the stepNumber field by counting the number of steps.
  for (var i = 0; i < course.steps.length; i++) {
    course.steps[i].stepNumber = i + 1;
  }

  course.save(function(err) {
    if (err) {

      /* fve checks if the error is a ValidationError and formats it correctly.
      If not, it passes the error through. */
      return fve(err, req, res, next);

      // If no error, send 201 and set location to /courses.
    } else {
      res.status(201);
      res.location('/courses');
      res.end();
    }
  });
});

/* PUT /api/courses/:id 204
Updates a course and returns no content */
router.put('/courses/:id', mid.checkAuthorization, function(req, res, next) {

  /* NOTE: Authorized user must be present in order to edit a course. */

  models.Course.findOneAndUpdate({
    _id: req.params.id
  }, req.body, function(err, results) {
    if (err) {
      return fve(err, req, res, next);
    } else {
      res.status(204);
      res.end();
    }
  });
});

/* GET /api/users 200
Returns the currently authenticated user */
router.get('/users', mid.checkAuthorization, function(req, res, next) {

  /* NOTE: The only thing this route can do is return the user object
           on the request object. Visiting it manually throws an error. */

  // get user from req and send as json object in correct format
  res.json({
    data: [req.user]
  });
});

/* POST /api/users 201
Creates a user, sets the Location header to "/", and returns no content */
router.post('/users', function(req, res, next) {
  var user = new models.User(req.body);
  user.save(function(err) {
    if (err) {
      return fve(err, req, res, next);
    }
    res.status(201);
    res.location('/');
    res.end();
  });
});

/* POST /api/courses/:courseId/reviews 201
Creates a review for the specified course ID,
sets the Location header to the related course,
and returns no content */
router.post('/courses/:courseId/reviews', mid.checkAuthorization, function(req, res, next) {

  // Get the course by ID and return the reviews only
  models.Course.findById(req.params.courseId, 'reviews')
    .exec(function(err, results) {

      // If db error, throw error.
      if (err) {
        return next(err);
      }

      // Create a new review to be appended to the reviews of this course
      var review = new models.Review(req.body);

      // Set postedOn to now
      review.postedOn = Date.now();

      // Assign the user id from the authenticated user's id
      if (req.user._id) {
        review.user = req.user._id;
      } else {
        var error = new Error('Sorry, you must be logged in to post a review.');
        error.status = 401;
        return next(error);
      }


      // Add the new review to the current course's reviews array.
      results.reviews.push(review);

      // Save the course we've just added to.
      results.save(function(error) {
        if (error) {
          return next(error);
        }
      });

      // Also save the new review we've just created.
      review.save(function(err, results) {
        if (err) {
          return fve(err, req, res, next);
        } else {
          res.status(201);
          res.location('/courses/' + req.params.courseId);
          res.end();
        }
      });
    });
});

/* DELETE /api/courses/:courseId/reviews/:id 204
Deletes the specified review and returns no content */
router.delete('/courses/:courseId/reviews/:id', mid.checkAuthorization, function(req, res, next) {

  models.Review.findById(req.params.id)
    .populate('user')
    .exec(function(err, review) {

      // Handle db error.
      if (err) {
        return next(err);
      }

      // Throw error if review not found.
      if (!review) {
        var error = new Error('Review not found!');
        error.status = 404;
        return next(error);
      }

      // Look up current course to get course owner.
      models.Course.findById(req.params.courseId)
        .populate('user')
        .exec(function(err, course) {

          // Handle db error.
          if (err) {
            return next(err);
          }

          // Throw error if course not found.
          if (!course) {
            var e = new Error('Course not found!');
            e.status = 404;
            return next(e);
          }

          // Get current user.
          var currentUser = req.user._id.toJSON();

          // Get course owner.
          var courseOwner = course.user._id.toJSON();

          // Get review owner.
          var reviewOwner = review.user._id.toJSON();

          // Only the review's user or course owner can delete a review.
          if (currentUser === courseOwner || currentUser === reviewOwner) {

            // Remove the review.
            models.Review.findById(req.params.id)
              .remove()
              .exec(function(err) {

                // Handle db error.
                if (err) return next(err);
              });

            res.status(204);
            res.end();
          } else {
            var error = new Error('Sorry, only the review owner or course owner can delete a review.');
            error.status = 401;
            return next(error);
          }
        });
    });
});

module.exports = router;
