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
