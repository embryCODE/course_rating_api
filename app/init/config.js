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
