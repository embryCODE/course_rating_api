'use strict';

var express = require('express');
var router = express.Router();

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/courses', function(req, res, next) {
  res.json([
    {
      _id: "1234",
      title: "Title1"
    },
    {
      _id: "12345",
      title: "Title2"
    },
    {
      _id: "123456",
      title: "Title3"
    }
  ]);
  //res.send('This is the courses route.');
});

// GET /api/course/:id 200 - Returns all Course properties and related documents for the provided course ID
router.get('/courses/:id', function(req, res, next) {
  res.send('This is the route for a specific course by ID.');
});

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses', function(req, res, next) {
  res.status(201);
  res.location('/courses');
  res.send('This is the route for creating a course.');
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', function(req, res, next) {
  res.status(204);
  res.send('This is the route for updating a course.');
});

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', function(req, res, next) {
  res.send('This is the route for returning the currently authenticated user.');
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', function(req, res, next) {
  res.status(201);
  res.location('/');
  res.send('This is the route for creating a user.');
});

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', function(req, res, next) {
  res.status(201);
  res.location('/courses/' + req.params.courseId);
  res.send('This is the route for creating a review for the specified course.');
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', function(req, res, next) {
  res.status(204);
  res.send('This is the route for deleting the specified review.');
});

module.exports = router;
