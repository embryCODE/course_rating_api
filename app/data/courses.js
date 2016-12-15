'use strict';

var _ = require('underscore');

function CoursesData(sessionService, validationService, $q) {

  var coursesData = {
    data: [
      {
        _id: 1,
        user: {
          _id: 1,
          fullName: 'Joe Smith'
        },
        title: 'Build a Basic Bookcase',
        description: 'High-end furniture projects are great to dream about. But unless you have a well-equipped shop and some serious woodworking experience to draw on, it can be difficult to turn the dream into a reality.\n\nNot every piece of furniture needs to be a museum showpiece, though. Often a simple design does the job just as well and the experience gained in completing it goes a long way toward making the next project even better.\n\nOur pine bookcase, for example, features simple construction and it\'s designed to be built with basic woodworking tools. Yet, the finished project is a worthy and useful addition to any room of the house. While it\'s meant to rest on the floor, you can convert the bookcase to a wall-mounted storage unit by leaving off the baseboard. You can secure the cabinet to the wall by screwing through the cabinet cleats into the wall studs.\n\nWe made the case out of materials available at most building-supply dealers and lumberyards, including 1/2 x 3/4-in. parting strip, 1 x 2, 1 x 4 and 1 x 10 common pine and 1/4-in.-thick lauan plywood. Assembly is quick and easy with glue and nails, and when you\'re done with construction you have the option of a painted or clear finish.\n\nAs for basic tools, you\'ll need a portable circular saw, hammer, block plane, combination square, tape measure, metal rule, two clamps, nail set and putty knife. Other supplies include glue, nails, sandpaper, wood filler and varnish or paint and shellac.\n\nThe specifications that follow will produce a bookcase with overall dimensions of 10 3/4 in. deep x 34 in. wide x 48 in. tall. While the depth of the case is directly tied to the 1 x 10 stock, you can vary the height, width and shelf spacing to suit your needs. Keep in mind, though, that extending the width of the cabinet may require the addition of central shelf supports.',
        estimatedTime: '12 hours',
        materialsNeeded: '* 1/2 x 3/4 inch parting strip\n* 1 x 2 common pine\n* 1 x 4 common pine\n* 1 x 10 common pine\n* 1/4 inch thick lauan plywood\n* Finishing Nails\n* Sandpaper\n* Wood Glue\n* Wood Filler\n* Minwax Oil Based Polyurethane\n',
        steps: [
          {
            stepNumber: 1,
            title: 'Cutting the Parts',
            description: 'For precise crosscuts, first make a simple, self-aligning T-guide for your circular saw. Cut a piece of 1/2-in. plywood to 2 1/2 x 24 in. and glue and screw it to a roughly 12-in.-long piece of 1 x 4 pine that will serve as the crossbar of the T. Center the plywood strip along the 1 x 4 and make sure the pieces are perfectly square to each other.\n\nButt the crossbar of the T-guide against the edge of a piece of scrap lumber, tack the guide in place and make a cut through the 1 x 4 with your saw base guided by the plywood strip. Then, trim the 1 x 4 on the opposite side in the same way. Now, the ends of the 1 x 4 can be aligned with layout lines on the stock for precise cut positioning.\n\nBegin construction by using a tape measure to mark the length of a side panel on 1 x 10 stock, and lay out the cut line with a square. The side panels on our bookcase are 48 in. long.'
          },
          {
            stepNumber: 2,
            title: 'Blah Blah Blah',
            description: 'And some other stuff...'
          }
        ],
        overallRating: 4,
        reviews: [
          {
            _id: 1,
            user: {
              _id: 3,
              fullName: 'Sam Smith'
            },
            postedOn: new Date('2016-02-01T21:54:00.000Z'),
            rating: 5,
            review: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            _id: 2,
            user: {
              _id: 2,
              fullName: 'Sam Jones'
            },
            postedOn: new Date('2016-02-04T21:22:00.000Z'),
            rating: 3,
            review: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          }
        ]
      },
      {
        _id: 2,
        user: {
          _id: 1,
          fullName: 'Joe Smith'
        },
        title: 'Learn How to Program',
        description: 'In this course, you\'ll learn how to write code like a pro!',
        estimatedTime: '6 hours',
        materialsNeeded: '* Notebook computer running Mac OS X or Windows\n* Text editor',
        steps: [
          {
            stepNumber: 1,
            title: 'Blah Blah Blah',
            description: 'And some stuff...'
          },
          {
            stepNumber: 2,
            title: 'Blah Blah Blah',
            description: 'And some other stuff...'
          }
        ],
        overallRating: 5,
        reviews: [
          {
            _id: 3,
            user: {
              _id: 3,
              fullName: 'Sam Smith'
            },
            postedOn: new Date('2016-02-04T21:22:00.000Z'),
            rating: 5,
            review: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          }
        ]
      }
    ]
  };

  this.getCourses = function() {
    return prepareContent(coursesData);
  };

  this.getCourse = function(id) {
    var course = findCourse(id);
    var returnValue = null;
    
    if (course) {
      returnValue = { data: [ course ] };
      return prepareContent(returnValue);
    } else {
      return $q.reject({ data: null, status: 404 });
    }
  };

  this.createCourse = function(course) {
    var validationErrors = validationService.getValidationErrorsObject();

    // validate the course
    validateCourse(course, validationErrors);

    // if we have validation errors, then short circuit this process
    if (validationService.hasValidationErrors(validationErrors)) {
      return validationService.prepareErrorResponse(validationErrors);
    }

    // determine and set the course id
    course._id = coursesData.data.length + 1;

    // add the course
    coursesData.data.push(course);
    
    // return an empty promise
    return prepareContent();
  };

  this.updateCourse = function(course) {
    var validationErrors = validationService.getValidationErrorsObject();

    // validate the course
    validateCourse(course, validationErrors);

    // if we have validation errors, then short circuit this process
    if (validationService.hasValidationErrors(validationErrors)) {
      return validationService.prepareErrorResponse(validationErrors);
    }

    // update the course
    var courseIndex = _.findIndex(coursesData.data, function(c) {
      return c._id == course._id;
    });
    coursesData.data[courseIndex] = course;
    
    // return an empty promise
    return prepareContent();
  };

  this.createReview = function(courseId, review) {
    var validationErrors = validationService.getValidationErrorsObject();

    // validate the review
    if (!review.rating) {
      validationService.addRequiredValidationError(
        validationErrors, 'rating', 'Please provide a rating.');
    }

    // if we have validation errors, then short circuit this process
    if (validationService.hasValidationErrors(validationErrors)) {
      return validationService.prepareErrorResponse(validationErrors);
    }

    // set the posted on value to "now"
    review.postedOn = new Date();

    // set the user to the current user
    var currentUser = sessionService.currentUser;
    review.user = {
      _id: currentUser._id,
      fullName: currentUser.fullName
    };

    // determine and set the course id
    var allReviews = getAllReviews();
    review._id = allReviews.length + 1;

    // find the course to add the review to
    var course = findCourse(courseId);
    if (!course) {
      throw new Error('Unable to find course ID: ' + courseId);
    }

    // add the review
    course.reviews.push(review);

    // update the overall rating
    course.overallRating = getOverallRating(course);
    
    // return an empty promise
    return prepareContent();
  };

  this.deleteReview = function(courseId, id) {
    // find the course
    var course = findCourse(courseId);
    if (!course) {
      throw new Error('Unable to find course ID: ' + courseId);
    }

    // find the review to delete
    var review = findCourseReview(course, id);
    if (!review) {
      throw new Error('Unable to find review ID: ' + id);
    }

    // delete the review
    var indexToRemove = course.reviews.indexOf(review);
    course.reviews.splice(indexToRemove, 1);

    // update the overall rating
    course.overallRating = getOverallRating(course);
    
    // return an empty promise
    return prepareContent();
  };
  
  function prepareContent(data) {
    var content = null;
    if (data) {
      content = { data: data };
    }
    
    return $q.resolve(content);
  }

  function validateCourse(course, validationErrors) {
    if (!course.title) {
      validationService.addRequiredValidationError(
        validationErrors, 'title', 'Please provide a course title.');
    }
    if (!course.description) {
      validationService.addRequiredValidationError(
        validationErrors, 'description', 'Please provide a course description.');
    }
    if (course.steps.length === 0) {
      validationService.addRequiredValidationError(
        validationErrors, 'steps', 'Please provide at least one step.');
    } else {
      course.steps.forEach(function(step, index) {
        if (!step.title) {
          validationService.addRequiredValidationError(
            validationErrors, 'steps.' + index + '.title',
            'Please provide a title for step #' + step.stepNumber + '.');
        }
        if (!step.description) {
          validationService.addRequiredValidationError(
            validationErrors, 'steps.' + index + '.description',
            'Please provide a description for step #' + step.stepNumber + '.');
        }
      });
    }
  }

  function getOverallRating(course) {
    // if we don't have any reviews... then return '0'
    if (!course.reviews.length) {
      return 0;
    }

    // get an array of the rating values
    var ratings = course.reviews.map(function(review) {
      return review.rating;
    });

    // sum the rating values
    var ratingSum = ratings.reduce(function(previous, current) {
      return previous + current;
    });

    // determine the average (rounded to the nearest integer)
    var ratingAverage = Math.round(ratingSum / course.reviews.length);

    return ratingAverage;
  }

  function findCourse(id) {
    var course = _.find(coursesData.data, function(course) {
      return course._id == id;
    });
    return course;
  }

  function findCourseReview(course, id) {
    var review = _.find(course.reviews, function(review) {
      return review._id == id;
    });
    return review;
  }

  function getAllReviews() {
    var reviews = [];
    coursesData.data.forEach(function(course) {
      reviews = reviews.concat(course.reviews);
    });
    return reviews;
  }
}

module.exports = CoursesData;
