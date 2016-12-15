webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	
	angular.module('app', [
	  __webpack_require__(3),
	  __webpack_require__(5)
	]).run(function($rootScope, $location, sessionService) {
	  // wire up the route change start handler
	  // in order to determine if the requested route requires a user login
	  $rootScope.$on('$routeChangeStart', function(event, next, current) {
	    // if the "require login" property is set to "true"
	    // and we don't have an authenticated user...
	    // then send the user to the "Sign In" view.
	    if (next.requireLogin && !sessionService.currentUser.isAuthenticated) {
	      $location.path('/signin');
	      event.preventDefault();
	    }
	  });
	});
	
	__webpack_require__(7);
	__webpack_require__(15);
	__webpack_require__(19);
	__webpack_require__(24);
	__webpack_require__(26);
	__webpack_require__(28);
	__webpack_require__(32);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	var app = angular.module('app');
	
	app.controller('CoursesController', __webpack_require__(8));
	app.controller('CourseDetailController', __webpack_require__(9));
	app.controller('CourseEditController', __webpack_require__(10));
	app.controller('MockDataAlertController', __webpack_require__(11));
	app.controller('SignInController', __webpack_require__(12));
	app.controller('SignOutController', __webpack_require__(13));
	app.controller('SignUpController', __webpack_require__(14));


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	function CoursesController(dataService, errorHandlerService, sessionService, $log) {
	
	  var _this = this;
	
	  _this.courses = [];
	  _this.userIsAuthenticated = sessionService.currentUser.isAuthenticated;
	  
	  dataService.getCourses().then(
	    function(response) {
	      var courses = response.data.data;
	      _this.courses = courses;
	    },
	    function(response) {
	      errorHandlerService.handleError(response);
	    });
	}
	
	module.exports = CoursesController;


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	function CourseDetailController(dataService, errorHandlerService, sessionService,
	  $anchorScroll, $location, $log, $routeParams) {
	
	  var _this = this;
	
	  _this.courseId = $routeParams.id;
	  _this.course = {};
	  _this.userReview = {};
	  _this.numberOfReviewsDisplayText = 0;
	  _this.userReviewValidationErrors = {};
	  _this.hasUserReviewValidationErrors = false;
	  _this.userIsAuthenticated = sessionService.currentUser.isAuthenticated;
	  _this.currentUserId = sessionService.currentUser._id;
	  _this.userCanEdit = false;
	
	  init();
	
	  _this.postReview = function() {
	    dataService.createReview(_this.courseId, _this.userReview).then(
	      function() {
	        getCourse();
	        resetUserReview();
	        resetUserReviewValidationErrors();
	      },
	      function(response) {
	        errorHandlerService.handleError(response, displayUserReviewValidationErrors);
	      });
	  };
	
	  _this.canPostReview = function() {
	    // only allow the user to post a review if...
	    // 1) we have an authenticated user
	    // 2) they're not the course owner (you can't review your own course)
	    return (_this.userIsAuthenticated && this.course && this.course.user && 
	      _this.course.user._id !== _this.currentUserId);
	  };
	
	  _this.canDeleteReview = function(review) {
	    // only allow a review to be delete if...
	    // 1) we have an authenticated user
	    // 2) the review's user is the current user or the course owner is the current user
	    return (_this.userIsAuthenticated &&
	      (review.user._id === _this.currentUserId || _this.course.user._id === _this.currentUserId));
	  };
	
	  _this.deleteReview = function(reviewId) {
	    dataService.deleteReview(_this.courseId, reviewId).then(
	      function() {
	        getCourse();
	      },
	      function(response) {
	        errorHandlerService.handleError(response);        
	      });
	  };
	
	  _this.scrollTo = function(id) {
	    $location.hash(id);
	    $anchorScroll();
	  };
	
	  function init() {
	    getCourse();
	    resetUserReview();
	  }
	
	  function getCourse() {
	    dataService.getCourse(_this.courseId).then(
	      function(response) {
	        var course = response.data.data[0];
	        _this.course = course;
	
	        // only allow the current user to edit their own courses
	        var currentUser = sessionService.currentUser;
	        _this.userCanEdit = (currentUser.isAuthenticated && course.user._id === currentUser._id);
	
	        updateNumberOfReviewsDisplayText(course.reviews);
	      },
	      function(response) {
	        errorHandlerService.handleError(response);
	      });
	  }
	
	  function updateNumberOfReviewsDisplayText(reviews) {
	    _this.numberOfReviewsDisplayText = (reviews.length === 1) ?
	      '1 Review' : reviews.length + ' Reviews';
	  }
	
	  function resetUserReview() {
	    _this.userReview = {
	      rating: 0,
	      review: ''
	    };
	  }
	
	  function displayUserReviewValidationErrors(validationErrors) {
	    _this.userReviewValidationErrors = validationErrors.errors;
	    _this.hasUserReviewValidationErrors = true;
	  }
	
	  function resetUserReviewValidationErrors() {
	    _this.userReviewValidationErrors = {};
	    _this.hasUserReviewValidationErrors = false;
	  }
	
	}
	
	module.exports = CourseDetailController;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	
	function CourseEditController(dataService, errorHandlerService, sessionService, 
	  $location, $log, $routeParams) {
	
	  var _this = this;
	
	  _this.courseId = $routeParams.id;
	  _this.course = {};
	  _this.courseTitle = '';
	  _this.validationErrors = {};
	  _this.hasValidationErrors = false;
	
	  _this.saveCourse = function() {
	    var course = _this.course;
	
	    if (_this.courseId) {
	      dataService.updateCourse(course).then(
	        function() {
	          $location.path('/detail/' + _this.courseId);
	        },
	        function(response) {
	          errorHandlerService.handleError(response, displayValidationErrors);
	        });
	    } else {
	      dataService.createCourse(course).then(
	        function() {
	          $location.path('/');
	        },
	        function(response) {
	          errorHandlerService.handleError(response, displayValidationErrors);
	        });
	    }
	  };
	
	  _this.addStep = function(index) {
	    // the step numbers are "1" based
	    // so increment the index to determine the new step number
	    var newStepNumber = index + 1;
	
	    // increment the step number for any steps that come after the new step
	    var steps = _this.course.steps;
	    steps.forEach(function(step) {
	      if (step.stepNumber >= newStepNumber) {
	        step.stepNumber++;
	      }
	    });
	
	    // insert the new step
	    steps.splice(index, 0, {
	      stepNumber: newStepNumber,
	      title: '',
	      description: ''
	    });
	  };
	
	  _this.removeStep = function(indexToRemove) {
	    var steps = _this.course.steps;
	
	    // decrement the step numbers
	    // for all steps that come after the step that we are removing
	    steps.forEach(function(step, index) {
	      if (index > indexToRemove) {
	        step.stepNumber--;
	      }
	    });
	
	    // remove the step
	    steps.splice(indexToRemove, 1);
	  };
	
	  init();
	
	  function init() {
	    if (_this.courseId) {
	      getCourse();
	    } else {
	      resetCourse();
	    }
	  }
	
	  function getCourse() {
	    dataService.getCourse(_this.courseId).then(
	      function(response) {
	        var course = response.data.data[0];
	
	        // create a copy so that any changes made
	        // do not affect the underlying in-memory data
	        _this.course = angular.copy(course);
	
	        // set the course title to the original course title
	        // so that when editing the course title the breadcrumb text doesn't change
	        _this.courseTitle = course.title;
	      },
	      function(response) {
	        errorHandlerService.handleError(response);
	      });
	  }
	
	  function resetCourse() {
	    var currentUser = sessionService.currentUser;
	
	    _this.course = {
	      user: {
	        _id: currentUser._id,
	        fullName: currentUser.fullName
	      },
	      title: '',
	      description: '',
	      estimatedTime: '',
	      materialsNeeded: '',
	      steps: [
	        {
	          stepNumber: 1,
	          title: '',
	          description: ''
	        }
	      ],
	      overallRating: 0,
	      reviews: []
	    };
	  }
	
	  function displayValidationErrors(validationErrors) {
	    _this.validationErrors = validationErrors.errors;
	    _this.hasValidationErrors = true;
	  }
	
	  function resetValidationErrors() {
	    _this.validationErrors = {};
	    _this.hasValidationErrors = false;
	  }
	
	}
	
	module.exports = CourseEditController;


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	function MockDataAlertController(constants) {
	  var _this = this;
	  
	  _this.mockDataEnabled = constants.useMockData;  
	}
	
	module.exports = MockDataAlertController;


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	function SignInController(authService, errorHandlerService, $location, $log) {
	
	  var _this = this;
	
	  _this.emailAddress = '';
	  _this.password = '';
	  _this.validationErrors = {};
	  _this.hasValidationErrors = false;
	
	  _this.signIn = function() {
	    authService.signIn(_this.emailAddress, _this.password).then(
	      function() {
	        $location.path('/');
	      },
	      function(response) {
	        errorHandlerService.handleError(response, displayValidationErrors);
	      });
	  };
	
	  function displayValidationErrors(validationErrors) {
	    _this.validationErrors = validationErrors.errors;
	    _this.hasValidationErrors = true;
	  }
	
	  function resetValidationErrors() {
	    _this.validationErrors = {};
	    _this.hasValidationErrors = false;
	  }
	
	}
	
	module.exports = SignInController;


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	function SignOutController(authService, $location) {
	  authService.signOut();
	  $location.path('/');
	}
	
	module.exports = SignOutController;


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	function SignUpController(authService, dataService, errorHandlerService, $location, $log) {
	
	  var _this = this;
	
	  _this.fullName = '';
	  _this.emailAddress = '';
	  _this.password = '';
	  _this.confirmPassword = '';
	  _this.validationErrors = {};
	  _this.hasValidationErrors = false;
	
	  _this.signUp = function() {
	    var user = {
	      fullName: _this.fullName,
	      emailAddress: _this.emailAddress,
	      password: _this.password,
	      confirmPassword: _this.confirmPassword
	    };
	
	    dataService.createUser(user).then(
	      function() {
	        authService.signIn(user.emailAddress, user.password).then(
	          function() {
	            $location.path('/');
	          },
	          function(response) {
	            errorHandlerService.handleError(response, displayValidationErrors);
	          });
	      },
	      function(response) {
	        errorHandlerService.handleError(response, displayValidationErrors);
	      });
	  };
	
	  function displayValidationErrors(validationErrors) {
	    _this.validationErrors = validationErrors.errors;
	    _this.hasValidationErrors = true;
	  }
	
	  function resetValidationErrors() {
	    _this.validationErrors = {};
	    _this.hasValidationErrors = false;
	  }
	
	}
	
	module.exports = SignUpController;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	var app = angular.module('app');
	
	app.service('coursesData', __webpack_require__(16));
	app.service('usersData', __webpack_require__(18));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(17);
	
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


/***/ },
/* 17 */,
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(17);
	
	function UsersData(sessionService, validationService, $q) {
	
	  var usersData = {
	    data: [
	      {
	        _id: 1,
	        fullName: 'Joe Smith',
	        emailAddress: 'joe@smith.com',
	        password: 'password'
	      },
	      {
	        _id: 2,
	        fullName: 'Sam Jones',
	        emailAddress: 'sam@jones.com',
	        password: 'password'
	      },
	      {
	        _id: 3,
	        fullName: 'Sam Smith',
	        emailAddress: 'sam@smith.com',
	        password: 'password'
	      }
	    ]
	  };
	
	  // the actual api service can only retrieve the user data for the current user
	  // so we model that behavior here by only supporting getting the user that
	  // matches the current user's email address and password
	  this.getUser = function() {
	    var currentUser = sessionService.currentUser;
	    var user = findUser(currentUser.emailAddress, currentUser.password);
	    var returnValue = null;
	
	    if (user) {
	      returnValue = { data: [ user ] };
	      return prepareContent(returnValue);
	    } else {
	      return $q.reject({ data: null, status: 404 });
	    }
	  };
	
	  this.createUser = function(user) {
	    var validationErrors = validationService.getValidationErrorsObject();
	
	    // validate the user
	    if (!user.fullName) {
	      validationService.addRequiredValidationError(
	        validationErrors, 'fullName', 'Please provide a full name.');
	    }
	    if (!user.emailAddress) {
	      validationService.addRequiredValidationError(
	        validationErrors, 'emailAddress', 'Please provide an email address.');
	    }
	    if (!user.password) {
	      validationService.addRequiredValidationError(
	        validationErrors, 'password', 'Please provide a password.');
	    }
	    if (!user.confirmPassword) {
	      validationService.addRequiredValidationError(
	        validationErrors, 'confirmPassword', 'Please confirm your password.');
	    }
	    if (user.password !== user.confirmPassword) {
	      validationService.addValidationError(
	        validationErrors, 'password', validationService.validationCodes.passwordMismatch,
	        'Your password and password confirmation do not match.');
	    }
	
	    // check for existing user
	    var existingUser = findUserByEmailAddress(user.emailAddress);
	    if (existingUser) {
	      validationService.addValidationError(
	        validationErrors, 'emailAddress', validationService.validationCodes.existingUser,
	        'We found an existing user for the provided email address. Please sign in using that email address or provide a different email address.');
	    }
	
	    // if we have validation errors, then short circuit this process
	    if (validationService.hasValidationErrors(validationErrors)) {
	      return validationService.prepareErrorResponse(validationErrors);
	    }
	
	    // determine and set the user id
	    user._id = usersData.data.length + 1;
	
	    // add the user
	    usersData.data.push(user);
	    
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
	
	  function findUser(emailAddress, password) {
	    var user = _.find(usersData.data, function(user) {
	      // for now, let's allow for a case insensitive match on email address
	      // and a case sensitive match on password
	      return (
	        user.emailAddress.toLowerCase() === emailAddress.toLowerCase() &&
	        user.password === password);
	    });
	    return user;
	  }
	
	  function findUserByEmailAddress(emailAddress) {
	    var user = _.find(usersData.data, function(user) {
	      // for now, let's allow for a case insensitive match on email address
	      return user.emailAddress.toLowerCase() === emailAddress.toLowerCase();
	    });
	    return user;
	  }
	
	}
	
	module.exports = UsersData;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	var app = angular.module('app');
	
	app.directive('markdown', __webpack_require__(20));
	app.directive('rating', __webpack_require__(21));
	app.directive('userNav', __webpack_require__(22));
	app.directive('validationErrors', __webpack_require__(23));


/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	// this directive was inspired by this custom directive:
	// https://github.com/btford/angular-markdown-directive
	function Markdown($sanitize, showdownService) {
	  return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
	      if (attrs.markdown) {
	        var converter = showdownService.getConverter();
	        scope.$watch(attrs.markdown, function (newVal) {
	          var html = newVal ? $sanitize(converter.makeHtml(newVal)) : '';
	          element.html(html);
	        });
	      }
	    }
	  };
	}
	
	module.exports = Markdown;


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	function Rating() {
	  var controller = ['$scope', function($scope) {
	
	    $scope.$watch('value', function(newValue, oldValue) {
	      var valueAsNumber = 0;
	      if (newValue) {
	        valueAsNumber = parseInt(newValue);
	      }
	      $scope.valueAsNumber = valueAsNumber;
	    });
	
	    $scope.setRating = function(value) {
	      if ($scope.allowEdit) {
	        $scope.value = value;
	      }
	    };
	  }];
	
	  return {
	    restrict: 'E',
	    scope: {
	      value: '=',
	      isUserRating: '@',
	      allowEdit: '@'
	    },
	    controller: controller,
	    templateUrl: 'templates/rating.html'
	  }
	}
	
	module.exports = Rating;


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	function UserNav() {
	  var controller = ['$scope', '$location', 'sessionService',
	    function($scope, $location, sessionService, authService) {
	      var currentUser = sessionService.currentUser;
	      $scope.isAuthenticated = currentUser.isAuthenticated;
	      $scope.fullName = currentUser.fullName;
	    }];
	
	  return {
	    restrict: 'E',
	    scope: {
	    },
	    controller: controller,
	    templateUrl: 'templates/user-nav.html'
	  }
	}
	
	module.exports = UserNav;


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	function ValidationErrors() {
	  var controller = ['$scope', function($scope) {
	    $scope.$watch('errors', function(newValue, oldValue) {
	      var errorsToDisplay = [];
	
	      if (newValue) {
	        for (var key in newValue) {
	          if (newValue.hasOwnProperty(key)) {
	            errorsToDisplay = errorsToDisplay.concat(newValue[key]);
	          }
	        }
	      }
	
	      $scope.errorsToDisplay = errorsToDisplay;
	    });
	  }];
	
	  return {
	    restrict: 'E',
	    scope: {
	      errors: '='
	    },
	    controller: controller,
	    templateUrl: 'templates/validation-errors.html'
	  }
	}
	
	module.exports = ValidationErrors;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	
	angular.module('app').filter('lineReturnsToParagraphs', __webpack_require__(25));


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	function LineReturnsToParagraphs() {
	  return function (input) {
	    if (input) {
	      return '<p>' + input.replace(/\n\n/g, '</p><p>') +'</p>';
	    } else {
	      return input;
	    }
	  }
	}
	
	module.exports = LineReturnsToParagraphs;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	var app = angular.module('app');
	
	app.config(__webpack_require__(27));
	// NOTE `constants` is defined in the global namespace within the `index.html`
	// in order to make it as easy as possible for the student to change the values
	app.constant('constants', constants);


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	function config($httpProvider, $routeProvider) {
	  $httpProvider.interceptors.push('httpInterceptorService');
	
	  $routeProvider
	    .when('/', {
	      controller: 'CoursesController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/courses.html'
	    })
	    .when('/detail/:id', {
	      controller: 'CourseDetailController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/course-detail.html'
	    })
	    .when('/update/:id', {
	      controller: 'CourseEditController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/course-edit.html',
	      requireLogin: true
	    })
	    .when('/create', {
	      controller: 'CourseEditController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/course-edit.html',
	      requireLogin: true
	    })
	    .when('/signin', {
	      controller: 'SignInController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/sign-in.html'
	    })
	    .when('/signout', {
	      controller: 'SignOutController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/sign-out.html'
	    })
	    .when('/signup', {
	      controller: 'SignUpController',
	      controllerAs: 'vm',
	      templateUrl: 'templates/sign-up.html'
	    })
	    .otherwise({
	      redirectTo: '/'
	    });
	}
	
	module.exports = config;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	
	angular.module('app').provider('dataService', __webpack_require__(29));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dataService = __webpack_require__(30);
	var mockDataService = __webpack_require__(31);
	
	function DataServiceProvider() {
	  
	  
	  this.$get = ['constants', 'coursesData', 'usersData', '$http', 
	    function(constants, coursesData, usersData, $http) {
	      if (constants.useMockData) {
	        return new mockDataService(coursesData, usersData);
	      } else {
	        return new dataService($http);
	      }    
	  }];
	}
	
	module.exports = DataServiceProvider;


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	function DataService($http) {
	
	  this.getUser = function() {
	    return $http.get('api/users');
	  };
	
	  this.createUser = function(user) {
	    return $http.post('api/users', user);
	  };
	
	  this.getCourses = function() {
	    return $http.get('api/courses');
	  };
	
	  this.getCourse = function(id) {
	    return $http.get('api/courses/' + id);
	  };
	
	  this.createCourse = function(course) {
	    return $http.post('api/courses', course);
	  };
	
	  this.updateCourse = function(course) {
	    return $http.put('api/courses/' + course._id, course);
	  };
	
	  this.createReview = function(courseId, review) {
	    return $http.post('api/courses/' + courseId + '/reviews', review);
	  };
	
	  this.deleteReview = function(courseId, id) {
	    return $http.delete('api/courses/' + courseId + '/reviews/' + id);
	  };
	
	}
	
	module.exports = DataService;


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	function MockDataService(coursesData, usersData) {
	
	  this.getUser = function() {
	    return usersData.getUser();
	  };
	
	  this.createUser = function(user) {
	    return usersData.createUser(user);
	  };
	
	  this.getCourses = function() {
	    return coursesData.getCourses();
	  };
	
	  this.getCourse = function(id) {
	    return coursesData.getCourse(id);
	  };
	
	  this.createCourse = function(course) {
	    return coursesData.createCourse(course);
	  };
	
	  this.updateCourse = function(course) {
	    return coursesData.updateCourse(course);
	  };
	
	  this.createReview = function(courseId, review) {
	    return coursesData.createReview(courseId, review);
	  };
	
	  this.deleteReview = function(courseId, id) {
	    return coursesData.deleteReview(courseId, id);
	  };
	
	}
	
	module.exports = MockDataService;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	var app = angular.module('app');
	
	app.service('authService', __webpack_require__(33));
	app.service('errorHandlerService', __webpack_require__(34));
	app.service('httpInterceptorService', __webpack_require__(35));
	app.service('sessionService', __webpack_require__(36));
	app.service('showdownService', __webpack_require__(37));
	app.service('toastService', __webpack_require__(39));
	app.service('validationService', __webpack_require__(43));


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';
	
	function AuthService(sessionService, validationService, dataService, $q) {
	  var _this = this;
	
	  _this.signIn = function(emailAddress, password) {
	    var validationErrors = validationService.getValidationErrorsObject();
	
	    // validate that we have an email address and password
	    if (!emailAddress) {
	      validationService.addRequiredValidationError(
	        validationErrors, 'emailAddress', 'Please provide an email address.');
	    }
	    if (!password) {
	      validationService.addRequiredValidationError(
	        validationErrors, 'password', 'Please provide a password.');
	    }
	
	    // if we have validation errors, then short circuit this process
	    if (validationService.hasValidationErrors(validationErrors)) {
	      return validationService.prepareErrorResponse(validationErrors);
	    }
	
	    var currentUser = sessionService.currentUser;
	
	    // set the email address and password on the current user
	    // so that the data service has access to these values
	    currentUser.emailAddress = emailAddress;
	    currentUser.password = password;
	
	    // attempt to get the user from the data service
	    return dataService.getUser().then(
	      function(response) {
	        var user = response && response.data && response.data.data && response.data.data[0];
	
	        currentUser.isAuthenticated = true;
	        currentUser._id = user._id;
	        currentUser.fullName = user.fullName;
	
	        // return null to the caller indicating that there were no errors
	        return $q.resolve(null);
	      },
	      function(response) {
	        sessionService.resetSession();
	
	        // add a validation indicating that the login failed
	        validationService.addValidationError(
	          validationErrors, 'password',
	          validationService.validationCodes.loginFailure,
	          'The login failed for the provided email address and password.');
	
	        // return the validation errors to the caller
	        return validationService.prepareErrorResponse(validationErrors);
	      });
	  }
	
	  _this.signOut = function() {
	    sessionService.resetSession();
	  }
	}
	
	module.exports = AuthService;


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	function ErrorHandler(toastService, $log) {
	  var _this = this;
	  
	  _this.handleError = function(response, displayValidationErrorsCallback) {
	    if (response.status === 400 && displayValidationErrorsCallback) {
	      displayValidationErrorsCallback(response.data);
	    } else {
	      var message = response && response.data && response.data.message;
	      if (!message) {
	        message = 'Message not available. Please see the console for more details.';
	      }
	      toastService.error(message, 'Unexpected Error');
	
	      // log the entire response to the console
	      $log.error(response);
	    }
	  };
	}
	
	module.exports = ErrorHandler;


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	function HttpInterceptorService(sessionService, $log) {
	  this.request = function(config) {
	    var currentUser = sessionService.currentUser;
	    
	    if (currentUser && currentUser.emailAddress && currentUser.password) {
	      var authString = btoa(currentUser.emailAddress + ':' + currentUser.password);
	      var headers = config.headers;
	      headers['Authorization'] = 'Basic ' + authString;
	    }
	    
	    return config;
	  }
	}
	
	module.exports = HttpInterceptorService;


/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	function Session() {
	  var _this = this;
	
	  _this.currentUser = {};
	
	  _this.resetSession = function() {
	    _this.currentUser = {
	      isAuthenticated: false,
	      _id: 0,
	      fullName: '',
	      emailAddress: '',
	      password: ''
	    };
	  };
	
	  init();
	
	  function init() {
	    _this.resetSession();
	  }
	}
	
	module.exports = Session;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var showdown = __webpack_require__(38);
	
	function ShowdownService() {
	
	  var options = {};
	  var showdownConverter = new showdown.Converter(options);
	
	  this.getConverter = function() {
	    return showdownConverter;
	  };
	
	}
	
	module.exports = ShowdownService;


/***/ },
/* 38 */,
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toastr = __webpack_require__(40);
	
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": false,
	  "positionClass": "toast-bottom-right",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
	
	function ToastService() {
	  var _this = this;
	  
	  _this.success = function(message, title) {
	    toastr.success(message, title);
	  };
	
	  _this.info = function(message, title) {
	    toastr.info(message, title);
	  };
	
	  _this.warning = function(message, title) {
	    toastr.warning(message, title);
	  };
	
	  _this.error = function(message, title) {
	    toastr.error(message, title);
	  };
	}
	
	module.exports = ToastService;


/***/ },
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/***/ function(module, exports) {

	'use strict';
	
	function ValidationService($q) {
	  var _this = this;
	
	  _this.validationCodes = {
	    required: 'required',
	    loginFailure: 'login_failure',
	    passwordMismatch: 'password_mismatch',
	    existingUser: 'existing_user'
	  };
	
	  _this.addRequiredValidationError = function(validationErrors, key, message) {
	    _this.addValidationError(validationErrors, key,
	      _this.validationCodes.required, message);
	  };
	
	  _this.addValidationError = function(validationErrors, key, code, message) {
	    if (!validationErrors.errors.hasOwnProperty(key)) {
	      validationErrors.errors[key] = [];
	    }
	
	    var error = {
	      code: code,
	      message: message
	    };
	
	    validationErrors.errors[key].push(error);
	  };
	
	  _this.hasValidationErrors = function(validationErrors) {
	    var hasValidationErrors = false;
	
	    for (var key in validationErrors.errors) {
	      if (validationErrors.errors.hasOwnProperty(key)) {
	        hasValidationErrors = true;
	        break;
	      }
	    }
	
	    return hasValidationErrors;
	  };
	
	  _this.getValidationErrorsObject = function() {
	    return {
	      message: 'Validation Failed',
	      errors: {}
	    };
	  };
	  
	  _this.prepareErrorResponse = function(validationErrors) {
	    return $q.reject({ data: validationErrors, status: 400 });
	  };
	}
	
	module.exports = ValidationService;


/***/ }
]);
//# sourceMappingURL=app.bundle.js.map