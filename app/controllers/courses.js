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
