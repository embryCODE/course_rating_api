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
