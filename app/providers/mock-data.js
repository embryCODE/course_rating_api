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
