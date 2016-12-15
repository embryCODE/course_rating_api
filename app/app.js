'use strict';

var angular = require('angular');

angular.module('app', [
  require('angular-route'),
  require('angular-sanitize')
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

require('./controllers');
require('./data');
require('./directives');
require('./filters');
require('./init');
require('./providers');
require('./services');
