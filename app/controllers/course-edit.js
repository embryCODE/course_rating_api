'use strict';

var angular = require('angular');

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
