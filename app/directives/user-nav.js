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
